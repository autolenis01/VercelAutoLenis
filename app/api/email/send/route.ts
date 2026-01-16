import { type NextRequest, NextResponse } from "next/server"
import { emailService } from "@/lib/services/email.service"
import { getCurrentUser } from "@/lib/auth-server"

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    // Only admins can send arbitrary emails via API
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { type, to, data } = body

    let result

    switch (type) {
      case "welcome":
        result = await emailService.sendWelcomeEmail(to, data.firstName, data.role)
        break

      case "auction_started":
        result = await emailService.sendAuctionStartedEmail(
          to,
          data.buyerName,
          data.vehicleName,
          data.auctionId,
          new Date(data.endsAt),
          data.dealerCount,
        )
        break

      case "new_offer":
        result = await emailService.sendNewOfferEmail(
          to,
          data.buyerName,
          data.vehicleName,
          data.auctionId,
          data.offerCount,
          data.lowestPriceCents,
        )
        break

      case "auction_won":
        result = await emailService.sendAuctionWonEmail(
          to,
          data.dealerName,
          data.vehicleName,
          data.buyerName,
          data.winningPriceCents,
          data.auctionId,
        )
        break

      case "contract_shield":
        result = await emailService.sendContractShieldEmail(
          to,
          data.recipientName,
          data.status,
          data.vehicleName,
          data.dealId,
          data.issueCount,
          data.isDealer,
        )
        break

      case "payment_confirmation":
        result = await emailService.sendPaymentConfirmationEmail(
          to,
          data.buyerName,
          data.paymentType,
          data.amountCents,
          data.transactionId,
          data.vehicleName,
        )
        break

      case "deal_complete":
        result = await emailService.sendDealCompleteEmail(
          to,
          data.buyerName,
          data.vehicleName,
          data.dealerName,
          data.totalPriceCents,
          data.savingsCents,
          new Date(data.pickupDate),
          data.pickupLocation,
        )
        break

      case "referral_commission":
        result = await emailService.sendReferralCommissionEmail(
          to,
          data.affiliateName,
          data.referredBuyerName,
          data.commissionCents,
          data.tier,
          data.totalEarningsCents,
        )
        break

      default:
        return NextResponse.json({ error: "Invalid email type" }, { status: 400 })
    }

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({ success: true, messageId: result.messageId })
  } catch (error) {
    console.error("[API] Email send error:", error)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}
