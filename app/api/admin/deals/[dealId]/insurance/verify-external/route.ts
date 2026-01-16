import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-server"
import { InsuranceService } from "@/lib/services/insurance.service"

export async function POST(request: Request, { params }: { params: Promise<{ dealId: string }> }) {
  try {
    const session = await requireAuth(["ADMIN"])
    const { dealId } = await params
    const body = await request.json()

    const { policy_id, verified } = body

    if (!policy_id || typeof verified !== "boolean") {
      return NextResponse.json(
        { success: false, error: "policy_id and verified (boolean) are required" },
        { status: 400 },
      )
    }

    const result = await InsuranceService.verifyExternalPolicy(session.userId, dealId, policy_id, verified)

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error: any) {
    console.error("Error verifying external policy:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 400 })
  }
}
