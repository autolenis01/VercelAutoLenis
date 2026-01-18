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

// SendGrid is deprecated - use Resend instead via lib/services/email.service.tsx
// This file kept for backward compatibility only
export function initSendGrid() {
  throw new Error("SendGrid is no longer supported. Please use Resend via EmailService.")
}
