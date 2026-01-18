import { type NextRequest, NextResponse } from "next/server"
import { getSessionUser } from "@/lib/auth-server"
import { esignService } from "@/lib/services/esign.service"

export async function GET(req: NextRequest, { params }: { params: Promise<{ dealId: string }> }) {
  try {
    const user = await getSessionUser()
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { dealId } = await params
    const result = await esignService.getEnvelopeForAdmin(dealId)

    return NextResponse.json({ success: true, ...result })
  } catch (error: any) {
    console.error("[Admin E-Sign] Get error:", error)
    return NextResponse.json({ error: error.message || "Failed to get e-sign details" }, { status: 400 })
  }
}
