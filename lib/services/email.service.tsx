// Email Service - Handles all outbound email communication
// Using Resend or SendGrid for transactional emails

import { logger } from "@/lib/logger"

const RESEND_API_KEY = process.env.RESEND_API_KEY
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY
const FROM_EMAIL = process.env.FROM_EMAIL || "noreply@autolenis.com"
const FROM_NAME = process.env.FROM_NAME || "AutoLenis"
const APP_URL = process.env["NEXT_PUBLIC_APP_URL"] || "https://autolenis.com"

interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
  from?: string
  replyTo?: string
}

export class EmailService {
  private provider: "resend" | "sendgrid" | "mock"

  constructor() {
    if (RESEND_API_KEY) {
      this.provider = "resend"
    } else if (SENDGRID_API_KEY) {
      this.provider = "sendgrid"
    } else {
      this.provider = "mock"
      logger.warn("EmailService: No provider configured, using mock mode")
    }
  }

  // Core send method
  async send(options: EmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const from = options.from || `${FROM_NAME} <${FROM_EMAIL}>`

    try {
      if (this.provider === "resend") {
        return await this.sendViaResend({ ...options, from })
      } else if (this.provider === "sendgrid") {
        return await this.sendViaSendGrid({ ...options, from })
      } else {
        logger.debug("Mock email sent", {
          to: options.to,
          subject: options.subject,
        })
        return { success: true, messageId: `mock-${Date.now()}` }
      }
    } catch (error: any) {
      logger.error("Email send failed", { error: error.message, to: options.to })
      return { success: false, error: error.message }
    }
  }

  private async sendViaResend(options: EmailOptions & { from: string }) {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: options.from,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
        reply_to: options.replyTo,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Resend API error: ${error}`)
    }

    const data = await response.json()
    return { success: true, messageId: data.id }
  }

  private async sendViaSendGrid(options: EmailOptions & { from: string }) {
    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SENDGRID_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: options.to }] }],
        from: { email: FROM_EMAIL, name: FROM_NAME },
        subject: options.subject,
        content: [
          { type: "text/plain", value: options.text || options.html.replace(/<[^>]*>/g, "") },
          { type: "text/html", value: options.html },
        ],
        reply_to: options.replyTo ? { email: options.replyTo } : undefined,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`SendGrid API error: ${error}`)
    }

    return { success: true, messageId: response.headers.get("x-message-id") || undefined }
  }

  // ============================================
  // Email Templates
  // ============================================

  // Email verification
  async sendEmailVerification(email: string, token: string) {
    const verifyUrl = `${APP_URL}/auth/verify-email?token=${token}`

    return this.send({
      to: email,
      subject: "Verify your email - AutoLenis",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1a1a1a;">Verify your email</h1>
          <p>Thanks for signing up for AutoLenis! Please verify your email address by clicking the button below:</p>
          <a href="${verifyUrl}" style="display: inline-block; background-color: #0066cc; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
            Verify Email
          </a>
          <p style="color: #666; font-size: 14px;">Or copy and paste this link: ${verifyUrl}</p>
          <p style="color: #666; font-size: 14px;">This link expires in 24 hours.</p>
        </div>
      `,
    })
  }

  // Password reset
  async sendPasswordResetEmail(email: string, firstName: string, token: string) {
    const resetUrl = `${APP_URL}/auth/reset-password?token=${token}`

    return this.send({
      to: email,
      subject: "Reset your password - AutoLenis",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1a1a1a;">Reset your password</h1>
          <p>Hi ${firstName},</p>
          <p>We received a request to reset your password. Click the button below to create a new password:</p>
          <a href="${resetUrl}" style="display: inline-block; background-color: #0066cc; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
            Reset Password
          </a>
          <p style="color: #666; font-size: 14px;">Or copy and paste this link: ${resetUrl}</p>
          <p style="color: #666; font-size: 14px;">This link expires in 1 hour. If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    })
  }

  // Dealer approval
  async sendDealerApprovalEmail(email: string, businessName: string) {
    const dashboardUrl = `${APP_URL}/dealer/dashboard`

    return this.send({
      to: email,
      subject: "Your dealer account has been approved - AutoLenis",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1a1a1a;">Congratulations! Your account is approved</h1>
          <p>Great news! Your dealer application for <strong>${businessName}</strong> has been approved.</p>
          <p>You can now access your dealer dashboard to:</p>
          <ul>
            <li>Manage your inventory</li>
            <li>Respond to buyer auctions</li>
            <li>Submit competitive offers</li>
            <li>Complete deals and pickups</li>
          </ul>
          <a href="${dashboardUrl}" style="display: inline-block; background-color: #0066cc; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
            Go to Dashboard
          </a>
        </div>
      `,
    })
  }

  // Dealer rejection
  async sendDealerRejectionEmail(email: string, businessName: string, reason: string) {
    return this.send({
      to: email,
      subject: "Update on your dealer application - AutoLenis",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1a1a1a;">Application Update</h1>
          <p>Thank you for your interest in joining AutoLenis as a dealer partner.</p>
          <p>After reviewing your application for <strong>${businessName}</strong>, we're unable to approve it at this time.</p>
          <p><strong>Reason:</strong> ${reason}</p>
          <p>If you believe this is an error or have additional information to provide, please contact our support team.</p>
        </div>
      `,
    })
  }

  // New offer notification
  async sendNewOfferNotification(email: string, buyerName: string, vehicleInfo: string, offerAmount: number) {
    const dashboardUrl = `${APP_URL}/buyer/dashboard`

    return this.send({
      to: email,
      subject: "New offer on your auction - AutoLenis",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1a1a1a;">You have a new offer!</h1>
          <p>Hi ${buyerName},</p>
          <p>A dealer has submitted an offer on your ${vehicleInfo}:</p>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="font-size: 24px; font-weight: bold; color: #0066cc; margin: 0;">$${offerAmount.toLocaleString()}</p>
            <p style="color: #666; margin: 5px 0 0 0;">Out-the-door price</p>
          </div>
          <a href="${dashboardUrl}" style="display: inline-block; background-color: #0066cc; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
            View Offers
          </a>
        </div>
      `,
    })
  }

  // Auction closed notification
  async sendAuctionClosedNotification(email: string, buyerName: string, offerCount: number) {
    const dashboardUrl = `${APP_URL}/buyer/dashboard`

    return this.send({
      to: email,
      subject: "Your auction has closed - AutoLenis",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1a1a1a;">Your auction has closed</h1>
          <p>Hi ${buyerName},</p>
          <p>Your auction has ended with ${offerCount} offer${offerCount !== 1 ? "s" : ""}.</p>
          ${
            offerCount > 0
              ? `
            <p>Review your offers and select the best deal for you:</p>
            <a href="${dashboardUrl}" style="display: inline-block; background-color: #0066cc; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
              View Results
            </a>
          `
              : `
            <p>Unfortunately, no dealers submitted offers this time. You can start a new auction or adjust your vehicle preferences.</p>
          `
          }
        </div>
      `,
    })
  }

  // Deal completed notification
  async sendDealCompletedNotification(email: string, buyerName: string, vehicleInfo: string) {
    return this.send({
      to: email,
      subject: "Congratulations on your new car! - AutoLenis",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1a1a1a;">🎉 Congratulations!</h1>
          <p>Hi ${buyerName},</p>
          <p>Your purchase of the <strong>${vehicleInfo}</strong> is complete!</p>
          <p>Thank you for using AutoLenis. We hope you enjoy your new vehicle!</p>
          <p>If you have any questions or need assistance, our support team is here to help.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
          <p style="color: #666; font-size: 14px;">Love AutoLenis? Refer a friend and earn rewards! Check your dashboard for your referral link.</p>
        </div>
      `,
    })
  }

  // Pickup reminder
  async sendPickupReminderNotification(
    email: string,
    buyerName: string,
    scheduledDate: Date,
    dealerName: string,
    dealerAddress: string,
  ) {
    return this.send({
      to: email,
      subject: "Pickup reminder - AutoLenis",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1a1a1a;">Pickup Reminder</h1>
          <p>Hi ${buyerName},</p>
          <p>This is a reminder that your vehicle pickup is scheduled for:</p>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="font-weight: bold; margin: 0;">${scheduledDate.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
            <p style="margin: 10px 0 0 0;">${dealerName}</p>
            <p style="color: #666; margin: 5px 0 0 0;">${dealerAddress}</p>
          </div>
          <p>Don't forget to bring:</p>
          <ul>
            <li>Valid driver's license</li>
            <li>Proof of insurance</li>
            <li>Any required documentation</li>
          </ul>
        </div>
      `,
    })
  }

  async sendWelcomeEmail(email: string, firstName: string, role: string) {
    return this.send({
      to: email,
      subject: "Welcome to AutoLenis",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1a1a1a;">Welcome, ${firstName}!</h1>
          <p>We're excited to have you onboard as an ${role}.</p>
        </div>
      `,
    })
  }

  async sendAuctionStartedEmail(
    to: string,
    buyerName: string,
    vehicleName: string,
    auctionId: string,
    endsAt: Date,
    dealerCount: number,
  ) {
    return this.send({
      to,
      subject: "Your auction has started - AutoLenis",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1a1a1a;">Auction Started</h1>
          <p>Hi ${buyerName}, your auction for ${vehicleName} is live.</p>
          <p>Auction ID: ${auctionId}. Ending: ${endsAt.toISOString()}</p>
          <p>Dealers invited: ${dealerCount}</p>
        </div>
      `,
    })
  }

  async sendNewOfferEmail(
    to: string,
    buyerName: string,
    vehicleName: string,
    auctionId: string,
    offerCount: number,
    lowestPriceCents: number,
  ) {
    return this.send({
      to,
      subject: "New offer received - AutoLenis",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1a1a1a;">You have a new offer</h1>
          <p>Hi ${buyerName}, you have ${offerCount} offer(s) for ${vehicleName}.</p>
          <p>Lowest price: $${(lowestPriceCents / 100).toFixed(2)}</p>
          <p>Auction ID: ${auctionId}</p>
        </div>
      `,
    })
  }

  async sendAuctionWonEmail(
    to: string,
    dealerName: string,
    vehicleName: string,
    buyerName: string,
    winningPriceCents: number,
    auctionId: string,
  ) {
    return this.send({
      to,
      subject: "Auction won - AutoLenis",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1a1a1a;">Auction Result</h1>
          <p>Congrats ${dealerName}, you won the auction for ${vehicleName}.</p>
          <p>Buyer: ${buyerName}</p>
          <p>Winning price: $${(winningPriceCents / 100).toFixed(2)}</p>
          <p>Auction ID: ${auctionId}</p>
        </div>
      `,
    })
  }

  async sendContractShieldEmail(
    toOrOptions:
      | string
      | {
          to: string
          recipientName?: string
          status?: string
          vehicleName?: string
          dealId?: string
          issueCount?: number
          isDealer?: boolean
        },
    recipientName?: string,
    status?: string,
    vehicleName?: string,
    dealId?: string,
    issueCount?: number,
    isDealer?: boolean,
  ) {
    const options =
      typeof toOrOptions === "string"
        ? { to: toOrOptions, recipientName, status, vehicleName, dealId, issueCount, isDealer }
        : toOrOptions

    return this.send({
      to: options.to,
      subject: "Contract Shield update - AutoLenis",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1a1a1a;">Contract Shield Update</h1>
          <p>Hi ${options.recipientName || "there"},</p>
          <p>Status: ${options.status || "Update"}${options.vehicleName ? ` for ${options.vehicleName}` : ""}.</p>
          ${options.issueCount !== undefined ? `<p>Issue count: ${options.issueCount}</p>` : ""}
          ${options.dealId ? `<p>Deal ID: ${options.dealId}</p>` : ""}
        </div>
      `,
    })
  }

  async sendPaymentConfirmationEmail(
    to: string,
    buyerName: string,
    paymentType: string,
    amountCents: number,
    transactionId: string,
    vehicleName: string,
  ) {
    return this.send({
      to,
      subject: "Payment confirmation - AutoLenis",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1a1a1a;">Payment Received</h1>
          <p>Hi ${buyerName}, we received your ${paymentType} payment for ${vehicleName}.</p>
          <p>Amount: $${(amountCents / 100).toFixed(2)}</p>
          <p>Transaction ID: ${transactionId}</p>
        </div>
      `,
    })
  }

  async sendDealCompleteEmail(
    to: string,
    buyerName: string,
    vehicleName: string,
    dealerName: string,
    totalPriceCents: number,
    savingsCents: number,
    pickupDate: Date,
    pickupLocation: string,
  ) {
    return this.send({
      to,
      subject: "Deal completed - AutoLenis",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1a1a1a;">Your deal is complete</h1>
          <p>Hi ${buyerName}, congratulations on your ${vehicleName} with ${dealerName}!</p>
          <p>Total price: $${(totalPriceCents / 100).toFixed(2)}. Estimated savings: $${(savingsCents / 100).toFixed(2)}.</p>
          <p>Pickup: ${pickupDate.toISOString()} at ${pickupLocation}</p>
        </div>
      `,
    })
  }

  async sendReferralCommissionEmail(
    to: string,
    affiliateName: string,
    referredBuyerName: string,
    commissionCents: number,
    tier: number,
    totalEarningsCents: number,
  ) {
    return this.send({
      to,
      subject: "Referral commission earned - AutoLenis",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1a1a1a;">You earned a commission!</h1>
          <p>Hi ${affiliateName},</p>
          <p>You earned $${(commissionCents / 100).toFixed(2)} from ${referredBuyerName} (Tier ${tier}).</p>
          <p>Total earnings: $${(totalEarningsCents / 100).toFixed(2)}</p>
        </div>
      `,
    })
  }

  async sendAffiliateCommissionEmail(to: string, firstName: string, amount: number, level?: number) {
    return this.send({
      to,
      subject: "Affiliate commission earned - AutoLenis",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1a1a1a;">Commission Earned</h1>
          <p>Hi ${firstName}, you earned $${amount.toFixed(2)}${level ? ` on level ${level}` : ""}.</p>
        </div>
      `,
    })
  }

  async sendNotificationEmail(to: string, subject: string, html: string) {
    return this.send({ to, subject, html })
  }

  async sendRefinanceQualifiedEmail(to: string, firstName: string, redirectUrl: string, leadId: string) {
    return this.send({
      to,
      subject: "You're qualified! - AutoLenis Refinance",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1a1a1a;">Great news, ${firstName}!</h1>
          <p>You pre-qualified for refinancing. Reference ID: ${leadId}</p>
          <a href="${redirectUrl}" style="display: inline-block; background-color: #0066cc; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
            Continue Application
          </a>
        </div>
      `,
    })
  }

  async sendRefinanceDeclinedEmail(to: string, firstName: string, reasons: string[], leadId: string) {
    return this.send({
      to,
      subject: "Refinance update - AutoLenis",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1a1a1a;">Hi ${firstName},</h1>
          <p>We couldn't pre-qualify you at this time. Reference ID: ${leadId}</p>
          ${
            reasons.length > 0
              ? `<ul>${reasons.map((r) => `<li>${r.replace(/_/g, " ")}</li>`).join("")}</ul>`
              : "<p>No specific reasons provided.</p>"
          }
        </div>
      `,
    })
  }

  // Affiliate payout notification
  async sendAffiliatePayoutNotification(email: string, firstName: string, amount: number, method: string) {
    return this.send({
      to: email,
      subject: "Your payout has been processed - AutoLenis",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1a1a1a;">Payout Processed</h1>
          <p>Hi ${firstName},</p>
          <p>Great news! Your affiliate payout has been processed:</p>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="font-size: 24px; font-weight: bold; color: #0066cc; margin: 0;">$${amount.toFixed(2)}</p>
            <p style="color: #666; margin: 5px 0 0 0;">via ${method}</p>
          </div>
          <p>Funds should arrive within 1-3 business days depending on your payment method.</p>
        </div>
      `,
    })
  }

  // Generic notification
  async sendNotification(email: string, subject: string, message: string, ctaText?: string, ctaUrl?: string) {
    return this.send({
      to: email,
      subject: `${subject} - AutoLenis`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1a1a1a;">${subject}</h1>
          <p>${message}</p>
          ${
            ctaText && ctaUrl
              ? `
            <a href="${ctaUrl}" style="display: inline-block; background-color: #0066cc; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
              ${ctaText}
            </a>
          `
              : ""
          }
        </div>
      `,
    })
  }
}

// Export singleton instance
export const emailService = new EmailService()
export default emailService
