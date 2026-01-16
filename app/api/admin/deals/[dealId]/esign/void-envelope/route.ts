import { type NextRequest, NextResponse } from "next/server"
import { getSessionUser } from "@/lib/auth-server"
import { esignService } from "@/lib/services/esign.service"
import { z } from "zod"

const schema = z.object({
  reason: z.string().min(1, "Reason is required"),
})

export async function POST(req: NextRequest, { params }: { params: Promise<{ dealId: string }> }) {
  try {
    const user = await getSessionUser()
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { dealId } = await params
    const body = await req.json()
    const { reason } = schema.parse(body)

    const result = await esignService.voidEnvelope(dealId, user.userId, reason)

    return NextResponse.json({ success: true, ...result })
  } catch (error: any) {
    console.error("[Admin E-Sign] Void error:", error)
    return NextResponse.json({ error: error.message || "Failed to void envelope" }, { status: 400 })
  }
}
