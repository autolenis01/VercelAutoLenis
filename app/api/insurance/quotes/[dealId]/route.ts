import { NextResponse } from "next/server"
import { InsuranceService } from "@/lib/services/insurance.service"

export async function GET(_request: Request, { params }: { params: Promise<{ dealId: string }> }) {
  try {
    const { dealId } = await params
    const quotes = await InsuranceService.getQuotes(dealId)

    return NextResponse.json({
      success: true,
      data: { quotes },
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 })
  }
}
