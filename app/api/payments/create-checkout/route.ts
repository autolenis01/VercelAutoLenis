import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-server"
import { createClient } from "@/lib/supabase/server"
import { createDepositCheckoutSession, createServiceFeeCheckoutSession } from "@/lib/stripe"
import { DEPOSIT_AMOUNT, FEE_STRUCTURE } from "@/lib/constants"

export async function POST(request: Request) {
  try {
    const session = await requireAuth(["BUYER"])
    const body = await request.json()
    const { type, auctionId, dealId } = body

    const supabase = await createClient()
    const { data: buyer, error: buyerError } = await supabase
      .from("BuyerProfile")
      .select("*")
      .eq("userId", session.userId)
      .single()

    if (buyerError || !buyer) {
      console.error("[Payment Checkout] Buyer not found:", buyerError)
      return NextResponse.json({ success: false, error: "Buyer profile not found" }, { status: 400 })
    }

    if (type === "deposit") {
      if (!auctionId) {
        return NextResponse.json({ success: false, error: "Auction ID required" }, { status: 400 })
      }

      const { data: existingDeposit } = await supabase
        .from("DepositPayment")
        .select("*")
        .eq("buyerId", buyer.id)
        .eq("auctionId", auctionId)
        .eq("status", "SUCCEEDED")
        .eq("refunded", false)
        .maybeSingle()

      if (existingDeposit) {
        return NextResponse.json({ success: false, error: "Deposit already paid" }, { status: 400 })
      }

      await supabase.from("DepositPayment").insert({
        buyerId: buyer.id,
        auctionId,
        amount: DEPOSIT_AMOUNT,
        status: "PENDING",
      })

      const checkoutSession = await createDepositCheckoutSession({
        buyerId: buyer.id,
        auctionId,
        amount: DEPOSIT_AMOUNT,
      })

      return NextResponse.json({
        success: true,
        data: { clientSecret: checkoutSession },
      })
    }

    if (type === "service_fee") {
      if (!dealId) {
        return NextResponse.json({ success: false, error: "Deal ID required" }, { status: 400 })
      }

      const { data: deal, error: dealError } = await supabase.from("SelectedDeal").select("*").eq("id", dealId).single()

      if (dealError || !deal) {
        console.error("[Payment Checkout] Deal not found:", dealError)
        return NextResponse.json({ success: false, error: "Deal not found" }, { status: 400 })
      }

      // Calculate fee
      const baseFee =
        deal.cashOtd <= FEE_STRUCTURE.LOW_TIER.threshold ? FEE_STRUCTURE.LOW_TIER.fee : FEE_STRUCTURE.HIGH_TIER.fee

      const { data: depositPayment } = await supabase
        .from("DepositPayment")
        .select("*")
        .eq("buyerId", buyer.id)
        .eq("status", "SUCCEEDED")
        .eq("refunded", false)
        .order("createdAt", { ascending: false })
        .limit(1)
        .maybeSingle()

      const depositCredit = depositPayment ? DEPOSIT_AMOUNT : 0
      const finalAmount = baseFee - depositCredit

      const { data: existingFee } = await supabase.from("ServiceFeePayment").select("*").eq("dealId", dealId).single()

      if (existingFee) {
        await supabase.from("ServiceFeePayment").update({ status: "PENDING" }).eq("dealId", dealId)
      } else {
        await supabase.from("ServiceFeePayment").insert({
          dealId,
          baseFee,
          depositCredit,
          finalAmount,
          paymentMethod: "CARD",
          status: "PENDING",
        })
      }

      const checkoutSession = await createServiceFeeCheckoutSession({
        dealId,
        buyerId: buyer.id,
        amount: finalAmount,
      })

      return NextResponse.json({
        success: true,
        data: { clientSecret: checkoutSession },
      })
    }

    return NextResponse.json({ success: false, error: "Invalid payment type" }, { status: 400 })
  } catch (error: any) {
    console.error("[Payment Checkout] Error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
