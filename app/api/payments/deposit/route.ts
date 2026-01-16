import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-server"
import { createClient } from "@/lib/supabase/server"
import { PaymentService } from "@/lib/services/payment.service"

export async function POST(request: Request) {
  try {
    const session = await requireAuth(["BUYER"])
    const body = await request.json()

    const supabase = await createClient()
    const { data: buyer, error } = await supabase
      .from("BuyerProfile")
      .select("*")
      .eq("userId", session.userId)
      .maybeSingle()

    if (error) {
      console.error("[Payment Deposit] Error fetching buyer:", error)
      return NextResponse.json({ success: false, error: "Failed to fetch buyer profile" }, { status: 500 })
    }

    if (!buyer) {
      return NextResponse.json(
        { success: false, error: "Buyer profile not found. Please complete your profile setup." },
        { status: 404 },
      )
    }

    const result = await PaymentService.createDepositPayment(buyer.id, body.auctionId)

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error: any) {
    console.error("[Payment Deposit] Error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 400 })
  }
}
