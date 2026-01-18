import { Resend } from "resend"

// Email configuration - ALL emails use info@autolenis.com exclusively
export const EMAIL_CONFIG = {
  // All outgoing emails come from this address
  from: "info@autolenis.com",
  // Reply-to for customer support
  replyTo: "info@autolenis.com",
  // All form submissions and contact inquiries go to this address
  notificationRecipient: "info@autolenis.com",
} as const

let resendInstance: Resend | null = null

export function initResend(): Resend {
  if (!resendInstance) {
    const apiKey = process.env["RESEND_API_KEY"]
    if (!apiKey) {
      console.error("[Resend] RESEND_API_KEY is not configured")
      throw new Error("Resend API key is not configured")
    }
    resendInstance = new Resend(apiKey)
  }
  return resendInstance
}

export function getResend(): Resend {
  return initResend()
}
