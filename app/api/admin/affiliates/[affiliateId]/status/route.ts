import { type NextRequest, NextResponse } from "next/server"
import { getSessionUser } from "@/lib/auth-server"
import { createClient } from "@/lib/supabase/server"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ affiliateId: string }> }
) {
  try {
    const user = await getSessionUser()
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { affiliateId } = await params
    const body = await request.json()
    const { status, reason } = body

    if (!status || !["ACTIVE", "PENDING", "SUSPENDED", "INACTIVE"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const supabase = await createClient()

    // Update affiliate status
    const { data: affiliate, error } = await supabase
      .from("Affiliate")
      .update({
        status,
        updatedAt: new Date().toISOString(),
      })
      .eq("id", affiliateId)
      .select()
      .single()

    if (error) {
      console.error("[Affiliate Status Update Error]", error)
      return NextResponse.json({ error: "Failed to update affiliate status" }, { status: 500 })
    }

    // Log compliance event
    await supabase.from("ComplianceEvent").insert({
      id: crypto.randomUUID(),
      eventType: `AFFILIATE_STATUS_${status}`,
      entityType: "AFFILIATE",
      entityId: affiliateId,
      userId: user.userId,
      details: {
        previousStatus: affiliate.status,
        newStatus: status,
        reason: reason || null,
        updatedBy: user.email,
      },
      createdAt: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      affiliate: {
        id: affiliate.id,
        status: affiliate.status,
      },
    })
  } catch (error) {
    console.error("[Affiliate Status Update Error]", error)
    return NextResponse.json({ error: "Failed to update affiliate status" }, { status: 500 })
  }
}
