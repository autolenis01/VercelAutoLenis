import { NextResponse } from "next/server"
import { getSession, clearSession } from "@/lib/auth-server"
import { createAdminClient } from "@/lib/supabase/admin"
import { logger } from "@/lib/logger"

export async function GET() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 })
    }

    const supabase = createAdminClient()

    const { data: user, error } = await supabase
      .from("User")
      .select("id, email, role, is_email_verified, is_affiliate, createdAt, first_name, last_name, phone")
      .eq("id", session.userId)
      .maybeSingle()

    if (error) {
      logger.error("Database error fetching user", { error, userId: session.userId })
      return NextResponse.json({ success: false, error: "Database error" }, { status: 500 })
    }

    if (!user) {
      logger.warn("User not found for session", { userId: session.userId })
      await clearSession()
      return NextResponse.json({ success: false, error: "Session expired. Please sign in again." }, { status: 401 })
    }

    let buyerProfile = null
    let dealerProfile = null
    let affiliateProfile = null

    if (user.role === "BUYER") {
      const { data } = await supabase.from("BuyerProfile").select("*").eq("userId", user.userId).maybeSingle()
      buyerProfile = data

      if (user.is_affiliate) {
        const { data: affData } = await supabase.from("Affiliate").select("*").eq("userId", user.userId).maybeSingle()
        affiliateProfile = affData
      }
    } else if (user.role === "DEALER" || user.role === "DEALER_USER") {
      const { data } = await supabase.from("Dealer").select("*").eq("userId", user.userId).maybeSingle()
      dealerProfile = data
    } else if (user.role === "AFFILIATE" || user.role === "AFFILIATE_ONLY") {
      const { data } = await supabase.from("Affiliate").select("*").eq("userId", user.userId).maybeSingle()
      affiliateProfile = data
    }

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.userId,
          email: user.email,
          role: user.role,
          is_affiliate: user.is_affiliate || false,
          emailVerified: user.is_email_verified,
          createdAt: user.createdAt,
          firstName: user.first_name,
          lastName: user.last_name,
          phone: user.phone,
          buyerProfile,
          dealerProfile,
          affiliateProfile,
        },
      },
    })
  } catch (error: any) {
    logger.error("Error in /api/auth/me", { error: error.message })
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
