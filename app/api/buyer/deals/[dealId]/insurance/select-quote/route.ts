import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-server"
import { InsuranceService } from "@/lib/services/insurance.service"

export async function POST(request: Request, { params }: { params: Promise<{ dealId: string }> }) {
  try {
    const session = await requireAuth(["BUYER"])
    const { dealId } = await params
    const body = await request.json()

    const { insurance_quote_id } = body

    if (!insurance_quote_id) {
      return NextResponse.json({ success: false, error: "insurance_quote_id is required" }, { status: 400 })
    }

    const result = await InsuranceService.selectQuote(session.userId, dealId, insurance_quote_id)

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error: any) {
    console.error("Error selecting insurance quote:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 400 })
  }
}
