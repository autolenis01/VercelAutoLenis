import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { constructWebhookEvent } from "@/lib/stripe"
import { createClient } from "@/lib/supabase/server"
import { affiliateService } from "@/lib/services/affiliate.service"
import { logger } from "@/lib/logger"
import type Stripe from "stripe"

export async function POST(request: Request) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get("stripe-signature")

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = constructWebhookEvent(body, signature)
  } catch (err: any) {
    logger.error("Stripe webhook signature verification failed", { error: err.message })
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutCompleted(session)
        break
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        await handlePaymentIntentSucceeded(paymentIntent)
        break
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        await handlePaymentIntentFailed(paymentIntent)
        break
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge
        await handleChargeRefunded(charge)
        break
      }

      default:
        logger.debug("Unhandled Stripe webhook event type", { type: event.type })
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    logger.error("Stripe webhook handler error", { error: error.message })
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const supabase = await createClient()
  const metadata = session.metadata || {}
  const type = metadata.type

  if (type === "deposit") {
    await supabase
      .from("DepositPayment")
      .update({
        status: "SUCCEEDED",
        stripePaymentIntentId: session.payment_intent as string,
      })
      .eq("buyerId", metadata.buyerId)
      .eq("auctionId", metadata.auctionId)
      .eq("status", "PENDING")

    // Log compliance event
    await supabase.from("ComplianceEvent").insert({
      eventType: "DEPOSIT_PAYMENT",
      buyerId: metadata.buyerId,
      action: "DEPOSIT_PAID",
      details: {
        amount: session.amount_total ? session.amount_total / 100 : 0,
        sessionId: session.id,
        paymentIntentId: session.payment_intent,
      },
    })
  } else if (type === "service_fee") {
    // Update service fee payment record
    const { data: payment } = await supabase
      .from("ServiceFeePayment")
      .select("id, finalAmount, deal:SelectedDeal(id, buyerId)")
      .eq("dealId", metadata.dealId)
      .eq("status", "PENDING")
      .single()

    if (payment) {
      await supabase
        .from("ServiceFeePayment")
        .update({
          status: "SUCCEEDED",
          stripePaymentIntentId: session.payment_intent as string,
        })
        .eq("id", payment.id)

      // Update deal status
      await supabase.from("SelectedDeal").update({ status: "FEE_PAID" }).eq("id", metadata.dealId)

      // Process affiliate commission if applicable
      if (payment.deal?.buyerId) {
        const { data: buyer } = await supabase
          .from("BuyerProfile")
          .select("userId, user:User(referredBy)")
          .eq("id", payment.deal.buyerId)
          .single()

        if (buyer?.user?.referredBy) {
          // Award commission to referrer
          await affiliateService.processCommission(buyer.user.referredBy, buyer.userId, payment.finalAmount, "PURCHASE")
        }
      }

      // Log compliance event
      await supabase.from("ComplianceEvent").insert({
        eventType: "SERVICE_FEE_PAYMENT",
        buyerId: payment.deal?.buyerId,
        dealId: metadata.dealId,
        action: "FEE_PAID_CARD",
        details: {
          amount: payment.finalAmount,
          sessionId: session.id,
          paymentIntentId: session.payment_intent,
        },
      })
    }
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  const supabase = await createClient()
  const metadata = paymentIntent.metadata || {}

  if (metadata.type === "deposit") {
    await supabase.from("DepositPayment").update({ status: "SUCCEEDED" }).eq("stripePaymentIntentId", paymentIntent.id)
  }

  if (metadata.type === "service_fee") {
    await supabase
      .from("ServiceFeePayment")
      .update({ status: "SUCCEEDED" })
      .eq("stripePaymentIntentId", paymentIntent.id)
  }
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  const supabase = await createClient()
  const metadata = paymentIntent.metadata || {}

  if (metadata.type === "deposit") {
    await supabase.from("DepositPayment").update({ status: "FAILED" }).eq("stripePaymentIntentId", paymentIntent.id)
  }

  if (metadata.type === "service_fee") {
    await supabase.from("ServiceFeePayment").update({ status: "FAILED" }).eq("stripePaymentIntentId", paymentIntent.id)
  }
}

async function handleChargeRefunded(charge: Stripe.Charge) {
  const supabase = await createClient()
  const paymentIntentId = charge.payment_intent as string

  const { data: depositPayment } = await supabase
    .from("DepositPayment")
    .select("id, amount, buyerId")
    .eq("stripePaymentIntentId", paymentIntentId)
    .single()

  if (depositPayment) {
    await supabase.from("DepositPayment").update({ refunded: true }).eq("id", depositPayment.id)

    // Log compliance event
    await supabase.from("ComplianceEvent").insert({
      eventType: "DEPOSIT_REFUND",
      buyerId: depositPayment.buyerId,
      action: "DEPOSIT_REFUNDED",
      details: {
        amount: depositPayment.amount,
        chargeId: charge.id,
      },
    })
  }
}
