import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-server"
import { InsuranceService } from "@/lib/services/insurance.service"

export async function GET(_request: Request, { params }: { params: Promise<{ dealId: string }> }) {
  try {
    const session = await requireAuth(["BUYER"])
    const { dealId } = await params

    const data = await InsuranceService.getInsuranceOverview(session.userId, dealId)

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error: any) {
    console.error("Error fetching insurance:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 400 })
  }
}
