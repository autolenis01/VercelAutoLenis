import "server-only"

import Stripe from "stripe"

// Lazy initialization to avoid build-time requirement
let stripeInstance: Stripe | null = null

function getStripe(): Stripe {
  if (!stripeInstance) {
    const apiKey = process.env["STRIPE_SECRET_KEY"]
    if (!apiKey) {
      throw new Error("STRIPE_SECRET_KEY is not configured. Please add it to your environment variables.")
    }
    stripeInstance = new Stripe(apiKey)
  }
  return stripeInstance
}

// Export stripe getter for backward compatibility
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return getStripe()[prop as keyof Stripe]
  },
})

// Helper to get Stripe publishable key for client
export const getStripePublishableKey = () => {
  return process.env["NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"]!
}

export async function createDepositCheckoutSession(params: {
  buyerId: string
  auctionId: string
  amount: number
}) {
  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    redirect_on_completion: "never",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "AutoLenis Deposit",
            description: "Refundable deposit for vehicle auction",
          },
          unit_amount: params.amount * 100, // Convert to cents
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    metadata: {
      type: "deposit",
      buyerId: params.buyerId,
      auctionId: params.auctionId,
    },
  })

  return session.client_secret
}

export async function createServiceFeeCheckoutSession(params: {
  dealId: string
  buyerId: string
  amount: number
}) {
  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    redirect_on_completion: "never",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "AutoLenis Concierge Fee",
            description: "One-time service fee for vehicle purchase assistance",
          },
          unit_amount: params.amount * 100,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    metadata: {
      type: "service_fee",
      dealId: params.dealId,
      buyerId: params.buyerId,
    },
  })

  return session.client_secret
}

// Verify webhook signature
export function constructWebhookEvent(payload: string | Buffer, signature: string) {
  const webhookSecret = process.env["STRIPE_WEBHOOK_SECRET"]

  if (!webhookSecret) {
    throw new Error("STRIPE_WEBHOOK_SECRET is not configured")
  }

  return stripe.webhooks.constructEvent(payload, signature, webhookSecret)
}
