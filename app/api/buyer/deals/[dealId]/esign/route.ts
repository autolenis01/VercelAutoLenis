import { type NextRequest, NextResponse } from "next/server"
import { getSessionUser } from "@/lib/auth-server"
import { esignService } from "@/lib/services/esign.service"

export async function GET(_req: NextRequest, { params }: { params: Promise<{ dealId: string }> }) {
  try {
    const user = await getSessionUser()
    if (!user || user.role !== "BUYER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { dealId } = await params
    const result = await esignService.getEnvelopeForBuyer(dealId, user.userId)

    return NextResponse.json({ success: true, ...result })
  } catch (error: any) {
    console.error("[E-Sign] Get status error:", error)
    return NextResponse.json({ error: error.message || "Failed to get e-sign status" }, { status: 400 })
  }
}
