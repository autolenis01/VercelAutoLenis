import "server-only"

import Stripe from "stripe"

let _stripeInstance: Stripe | null = null

export function getStripe(): Stripe {
  if (!_stripeInstance) {
    const key = process.env.STRIPE_SECRET_KEY
    if (!key) {
      throw new Error("STRIPE_SECRET_KEY is not configured")
    }
    _stripeInstance = new Stripe(key, {
      apiVersion: "2025-11-17.clover",
    })
  }
  return _stripeInstance
}

// Backwards compatibility: export stripe as getter
export const stripe = new Proxy({} as Stripe, {
  get(_, prop) {
    return getStripe()[prop as keyof Stripe]
  },
})

// Helper to get Stripe publishable key for client
export const getStripePublishableKey = () => {
  return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
}

export async function createDepositCheckoutSession(params: {
  buyerId: string
  auctionId: string
  amount: number
}) {
  const stripeClient = getStripe()
  const session = await stripeClient.checkout.sessions.create({
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
  const stripeClient = getStripe()
  const session = await stripeClient.checkout.sessions.create({
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
  const stripeClient = getStripe()
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) {
    throw new Error("STRIPE_WEBHOOK_SECRET is not configured")
  }

  return stripeClient.webhooks.constructEvent(payload, signature, webhookSecret)
}
