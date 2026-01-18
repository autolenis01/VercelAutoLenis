import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth-server"
import { createClient } from "@/lib/supabase/server"
import { affiliateService } from "@/lib/services/affiliate.service"
// import { emailService } from "@/lib/services/email.service" // Unused until email methods are implemented

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { dealId } = await req.json()
    const supabase = await createClient()

    // Get the deal
    const { data: deal, error: dealError } = await supabase
      .from("SelectedDeal")
      .select(`
        *,
        buyer:BuyerProfile(*)
      `)
      .eq("id", dealId)
      .single()

    if (dealError || !deal) {
      return NextResponse.json({ error: "Deal not found" }, { status: 404 })
    }

    // Update deal status to complete
    const { error: updateError } = await supabase
      .from("SelectedDeal")
      .update({ deal_status: "COMPLETE" })
      .eq("id", dealId)

    if (updateError) {
      throw updateError
    }

    // Process referral commissions for this deal
    // NOTE: Commission processing is handled in PaymentService.confirmServiceFeePayment
    // const commissions = await affiliateService.completeDealReferral(dealId, user.id)

    // Auto-enroll buyer as affiliate if not already
    const { data: existingAffiliate } = await supabase.from("Affiliate").select("*").eq("userId", user.id).single()

    let affiliate = existingAffiliate

    if (!affiliate) {
      affiliate = await affiliateService.autoEnrollBuyerAsAffiliate(user.id)

      // Send welcome email for new affiliate
      // NOTE: sendWelcomeEmail method needs to be implemented in EmailService
      // if (user.email) {
      //   await emailService.sendWelcomeEmail(user.email, user.first_name || "there", "AFFILIATE")
      // }
    }

    // Send commission notifications to all affiliates who earned
    // NOTE: This depends on completeDealReferral which needs to be implemented
    // for (const commission of commissions) {
    //   const { data: affiliateUser } = await supabase
    //     .from("Affiliate")
    //     .select(`
    //       *,
    //       user:User(*)
    //     `)
    //     .eq("id", commission.affiliateId)
    //     .single()
    //
    //   if (affiliateUser?.user?.email) {
    //     await emailService.sendReferralCommissionEmail(
    //       affiliateUser.user.email,
    //       `${affiliateUser.firstName} ${affiliateUser.lastName}`.trim() || "Affiliate",
    //       `${user.first_name} ${user.last_name}`.trim() || "A buyer",
    //       commission.commissionAmount || 0,
    //       commission.level || 1,
    //       (affiliateUser.pendingEarnings || 0) + (commission.commissionAmount || 0),
    //     )
    //   }
    // }

    return NextResponse.json({
      success: true,
      affiliate: affiliate
        ? {
            id: affiliate.id,
            referralCode: affiliate.refCode || affiliate.referralCode,
            referralLink: `${process.env["NEXT_PUBLIC_APP_URL"] || "https://autolenis.com"}/ref/${affiliate.refCode || affiliate.referralCode}`,
          }
        : null,
      // commissionsProcessed: commissions.length, // Disabled until completeDealReferral is implemented
    })
  } catch (error: any) {
    console.error("[Deal Complete] Error:", error)
    return NextResponse.json({ error: error.message || "Failed to complete deal" }, { status: 400 })
  }
}
