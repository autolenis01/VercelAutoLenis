"use server"

import { requireAuth } from "@/lib/auth-server"
import { createClient } from "@/lib/supabase/server"
import { createDepositCheckoutSession, createServiceFeeCheckoutSession } from "@/lib/stripe"
import { DEPOSIT_AMOUNT, FEE_STRUCTURE } from "@/lib/constants"

export async function startDepositCheckout(auctionId: string) {
  const session = await requireAuth(["BUYER"])
  const supabase = await createClient()

  const { data: buyer, error: buyerError } = await supabase
    .from("BuyerProfile")
    .select("id")
    .eq("userId", session.userId)
    .single()

  if (buyerError || !buyer) {
    console.error("[Stripe] Buyer profile not found:", buyerError)
    throw new Error("Buyer profile not found")
  }

  // Check if deposit already paid
  const { data: existingDeposit } = await supabase
    .from("DepositPayment")
    .select("id")
    .eq("buyerId", buyer.id)
    .eq("auctionId", auctionId)
    .eq("status", "SUCCEEDED")
    .eq("refunded", false)
    .single()

  if (existingDeposit) {
    throw new Error("Deposit already paid")
  }

  // Create pending deposit record
  const { error: createError } = await supabase.from("DepositPayment").insert({
    buyerId: buyer.id,
    auctionId,
    amount: DEPOSIT_AMOUNT,
    status: "PENDING",
  })

  if (createError) {
    console.error("[Stripe] Failed to create deposit record:", createError)
    throw new Error("Failed to create deposit record")
  }

  const clientSecret = await createDepositCheckoutSession({
    buyerId: buyer.id,
    auctionId,
    amount: DEPOSIT_AMOUNT,
  })

  return clientSecret
}

export async function startServiceFeeCheckout(dealId: string) {
  const session = await requireAuth(["BUYER"])
  const supabase = await createClient()

  const { data: buyer, error: buyerError } = await supabase
    .from("BuyerProfile")
    .select("id")
    .eq("userId", session.userId)
    .single()

  if (buyerError || !buyer) {
    console.error("[Stripe] Buyer profile not found:", buyerError)
    throw new Error("Buyer profile not found")
  }

  const { data: deal, error: dealError } = await supabase
    .from("SelectedDeal")
    .select("id, cashOtd, buyerId")
    .eq("id", dealId)
    .single()

  if (dealError || !deal) {
    console.error("[Stripe] Deal not found:", dealError)
    throw new Error("Deal not found")
  }

  // Calculate fee
  const baseFee =
    deal.cashOtd <= FEE_STRUCTURE.LOW_TIER.threshold ? FEE_STRUCTURE.LOW_TIER.fee : FEE_STRUCTURE.HIGH_TIER.fee

  // Check for deposit credit
  const { data: depositPayment } = await supabase
    .from("DepositPayment")
    .select("id, amount")
    .eq("buyerId", buyer.id)
    .eq("status", "SUCCEEDED")
    .eq("refunded", false)
    .order("createdAt", { ascending: false })
    .limit(1)
    .single()

  const depositCredit = depositPayment ? DEPOSIT_AMOUNT : 0
  const finalAmount = baseFee - depositCredit

  // Create or update service fee payment record
  const { data: existingFee } = await supabase.from("ServiceFeePayment").select("id").eq("dealId", dealId).single()

  if (existingFee) {
    await supabase.from("ServiceFeePayment").update({ status: "PENDING" }).eq("id", existingFee.id)
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

  const clientSecret = await createServiceFeeCheckoutSession({
    dealId,
    buyerId: buyer.id,
    amount: finalAmount,
  })

  return clientSecret
}
