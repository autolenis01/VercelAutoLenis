import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-server"
import { PreQualService } from "@/lib/services/prequal.service"
import { headers } from "next/headers"

// POST /api/buyer/prequal/refresh - Refresh/re-run pre-qualification
export async function POST() {
  try {
    const session = await requireAuth(["BUYER"])

    // Get request context
    const headersList = await headers()
    const requestContext = {
      ipAddress: headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || undefined,
      userAgent: headersList.get("user-agent") || undefined,
    }

    // Refresh pre-qualification
    const result = await PreQualService.refreshPreQual(session.userId, requestContext)

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      data: { preQualification: result.preQualification },
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json({ success: false, error: message }, { status: message === "Unauthorized" ? 401 : 500 })
  }
}
