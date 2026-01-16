import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-server"
import { PaymentService } from "@/lib/services/payment.service"

export async function POST(request: Request) {
  try {
    const session = await requireAuth(["ADMIN"])
    const body = await request.json()

    const { paymentId, type, reason } = body

    if (!paymentId || !type || !reason) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: paymentId, type, reason" },
        { status: 400 },
      )
    }

    const result = await PaymentService.processRefund(paymentId, type, reason, session.userId)

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 })
  }
}
