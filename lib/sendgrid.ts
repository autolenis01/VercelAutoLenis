import sgMail from "@sendgrid/mail"

// Email configuration - ALL emails use info@autolenis.com exclusively
export const EMAIL_CONFIG = {
  // All outgoing emails come from this address
  from: {
    email: "info@autolenis.com",
    name: "AutoLenis",
  },
  // Reply-to for customer support
  replyTo: "info@autolenis.com",
  // All form submissions and contact inquiries go to this address
  notificationRecipient: "info@autolenis.com",
} as const

let isInitialized = false

export function initSendGrid() {
  if (!isInitialized) {
    const apiKey = process.env["SENDGRID_API_KEY"]
    if (!apiKey) {
      console.error("[SendGrid] SENDGRID_API_KEY is not configured")
      throw new Error("SendGrid API key is not configured")
    }
    sgMail.setApiKey(apiKey)
    isInitialized = true
  }
  return sgMail
}

// Export SendGrid client getter
export { sgMail }
