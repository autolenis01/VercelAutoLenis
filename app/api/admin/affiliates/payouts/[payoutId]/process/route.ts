import { type NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-server"
import { affiliateService } from "@/lib/services/affiliate.service"
import { emailService } from "@/lib/services/email.service"
import { createClient } from "@/lib/supabase/server"

// POST - Mark a payout as processed/paid
export async function POST(request: NextRequest, { params }: { params: Promise<{ payoutId: string }> }) {
  try {
    const session = await requireAuth()
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { payoutId } = await params
    const body = await request.json()
    const { providerRef, method = "Bank Transfer" } = body

    if (!providerRef) {
      return NextResponse.json({ error: "Missing providerRef" }, { status: 400 })
    }

    const payout = await affiliateService.processPayout(payoutId, providerRef)

    // Send email notification to affiliate
    try {
      const supabase = await createClient()
      
      // Get affiliate and user details for email
      const { data: affiliate } = await supabase
        .from("Affiliate")
        .select(`
          id,
          user:User!Affiliate_userId_fkey(email, firstName)
        `)
        .eq("id", payout.affiliateId)
        .single()

      if (affiliate?.user?.email) {
        await emailService.sendAffiliatePayoutNotification(
          affiliate.user.email,
          affiliate.user.firstName || "Affiliate",
          payout.amount / 100, // Convert cents to dollars
          method
        )
      }
    } catch (emailError) {
      // Log but don't fail the request if email fails
      console.error("[Admin Process Payout API] Email notification failed:", emailError)
    }

    return NextResponse.json({
      success: true,
      payout: {
        id: payout.id,
        status: "COMPLETED",
        providerRef,
      },
    })
  } catch (error: any) {
    console.error("[Admin Process Payout API] Error:", error)
    return NextResponse.json(
      {
        error: error.message || "Internal server error",
      },
      { status: 400 },
    )
  }
}
