import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-server"
import { PaymentService } from "@/lib/services/payment.service"

export async function POST(request: Request) {
  try {
    await requireAuth(["BUYER"])
    const body = await request.json()

    const result = await PaymentService.createServiceFeePayment(body.dealId)

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 })
  }
}
