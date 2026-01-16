import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-server"
import { DealService } from "@/lib/services/deal.service"

export async function POST(request: Request, { params }: { params: Promise<{ dealId: string }> }) {
  try {
    const session = await requireAuth(["BUYER"])
    const { dealId } = await params
    const body = await request.json()

    const { payment_type, primary_financing_offer_id, external_preapproval } = body

    if (!payment_type) {
      return NextResponse.json({ success: false, error: "payment_type is required" }, { status: 400 })
    }

    const result = await DealService.updateFinancingChoice(session.userId, dealId, {
      paymentType: payment_type,
      primaryFinancingOfferId: primary_financing_offer_id,
      externalPreApproval: external_preapproval
        ? {
            lenderName: external_preapproval.lender_name,
            approvedAmountCents: external_preapproval.approved_amount_cents,
            apr: external_preapproval.apr,
            termMonths: external_preapproval.term_months,
            documentUrl: external_preapproval.document_url,
          }
        : undefined,
    })

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error: any) {
    console.error("Error updating financing:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 400 })
  }
}
