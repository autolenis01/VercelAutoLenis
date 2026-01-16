import { type NextRequest, NextResponse } from "next/server"
import { supabase, isDatabaseConfigured } from "@/lib/db"
import { logger } from "@/lib/logger"

export async function POST(request: NextRequest) {
  try {
    const { leadId } = await request.json()

    if (!leadId) {
      return NextResponse.json({ error: "Lead ID is required" }, { status: 400 })
    }

    if (!isDatabaseConfigured() || !supabase) {
      logger.warn("Database not configured, skipping refinance redirect update", {
        context: "record-redirect-api",
      })
      return NextResponse.json({ success: true, warning: "Database not configured" })
    }

    const { error } = await supabase
      .from("refinance_leads")
      .update({ redirected_to_partner_at: new Date().toISOString() })
      .eq("id", leadId)

    if (error) {
      logger.error("Failed to update refinance lead redirect timestamp", {
        context: "record-redirect-api",
        leadId,
        error: error.message,
      })
      // Don't fail the request, just log the error
      return NextResponse.json({ success: true, warning: "Could not update lead" })
    }

    logger.info("Recorded refinance redirect", {
      context: "record-redirect-api",
      leadId,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error("Error recording refinance redirect", {
      context: "record-redirect-api",
      error: error instanceof Error ? error.message : String(error),
    })
    return NextResponse.json({ success: true, warning: "Could not record redirect" })
  }
}
