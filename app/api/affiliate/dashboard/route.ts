import { type NextRequest, NextResponse } from "next/server"
import { getSessionUser } from "@/lib/auth-server"
import { supabase, isDatabaseConfigured } from "@/lib/db"

export async function GET(_req: NextRequest) {
  try {
    const user = await getSessionUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!isDatabaseConfigured()) {
      // Return default data when database is not configured
      return NextResponse.json(getDefaultDashboardData())
    }

    // Find affiliate by userId
    const { data: affiliate, error: affiliateError } = await supabase
      .from("Affiliate")
      .select("*")
      .eq("userId", user.userId)
      .maybeSingle()

    if (affiliateError) {
      console.error("[Affiliate Dashboard] Error finding affiliate:", affiliateError)
      return NextResponse.json(getDefaultDashboardData())
    }

    // If no affiliate exists, create one
    let currentAffiliate = affiliate
    if (!currentAffiliate) {
      const refCode = generateReferralCode()
      const landingSlug = generateLandingSlug("user", user.userId.substring(0, 4))

      const { data: newAffiliate, error: createError } = await supabase
        .from("Affiliate")
        .insert({
          userId: user.userId,
          firstName: "",
          lastName: "",
          refCode,
          referralCode: refCode,
          ref_code: refCode,
          landing_slug: landingSlug,
          landingSlug: landingSlug,
          totalEarnings: 0,
          pendingEarnings: 0,
          status: "ACTIVE",
          available_balance_cents: 0,
          lifetime_earnings_cents: 0,
          lifetime_paid_cents: 0,
        })
        .select()
        .single()

      if (createError) {
        console.error("[Affiliate Dashboard] Error creating affiliate:", createError)
        return NextResponse.json(getDefaultDashboardData())
      }
      currentAffiliate = newAffiliate
    }

    // Fetch dashboard stats in parallel
    const [
      clicksResult,
      referralsResult,
      completedDealsResult,
      pendingCommissionsResult,
      earnedCommissionsResult,
      paidCommissionsResult,
      recentCommissionsResult,
    ] = await Promise.all([
      supabase.from("Click").select("id", { count: "exact", head: true }).eq("affiliateId", currentAffiliate.id),
      supabase
        .from("Referral")
        .select("id", { count: "exact", head: true })
        .eq("affiliateId", currentAffiliate.id)
        .eq("level", 1),
      supabase
        .from("Referral")
        .select("id", { count: "exact", head: true })
        .eq("affiliateId", currentAffiliate.id)
        .eq("dealCompleted", true),
      supabase
        .from("Commission")
        .select("amount_cents,amountCents")
        .eq("affiliateId", currentAffiliate.id)
        .eq("status", "PENDING"),
      supabase
        .from("Commission")
        .select("amount_cents,amountCents")
        .eq("affiliateId", currentAffiliate.id)
        .eq("status", "EARNED"),
      supabase
        .from("Commission")
        .select("amount_cents,amountCents")
        .eq("affiliateId", currentAffiliate.id)
        .eq("status", "PAID"),
      supabase
        .from("Commission")
        .select("*")
        .eq("affiliateId", currentAffiliate.id)
        .order("createdAt", { ascending: false })
        .limit(10),
    ])

    const totalClicks = clicksResult.count || 0
    const totalReferrals = referralsResult.count || 0
    const completedDeals = completedDealsResult.count || 0

    // Calculate commission sums
    const sumCommissions = (data: any[] | null) => {
      if (!data) return { sum: 0, count: 0 }
      const sum = data.reduce((acc, c) => acc + (c.amount_cents || c.amountCents || 0), 0)
      return { sum, count: data.length }
    }

    const pending = sumCommissions(pendingCommissionsResult.data)
    const earned = sumCommissions(earnedCommissionsResult.data)
    const paid = sumCommissions(paidCommissionsResult.data)

    // Get referrals by level
    const { data: referralsByLevelData } = await supabase
      .from("Referral")
      .select("level")
      .eq("affiliateId", currentAffiliate.id)

    const referralsByLevel = {
      level1: referralsByLevelData?.filter((r) => r.level === 1).length || 0,
      level2: referralsByLevelData?.filter((r) => r.level === 2).length || 0,
      level3: referralsByLevelData?.filter((r) => r.level === 3).length || 0,
      level4: referralsByLevelData?.filter((r) => r.level === 4).length || 0,
      level5: referralsByLevelData?.filter((r) => r.level === 5).length || 0,
    }

    const baseUrl = process.env["NEXT_PUBLIC_APP_URL"] || "https://autolenis.com"
    const links = {
      referralLink: `${baseUrl}/?ref=${currentAffiliate.refCode || currentAffiliate.referralCode}`,
      landingPage: `${baseUrl}/r/${currentAffiliate.landingSlug || currentAffiliate.landing_slug}`,
      refCode: currentAffiliate.refCode || currentAffiliate.referralCode,
    }

    return NextResponse.json({
      affiliate: {
        id: currentAffiliate.id,
        firstName: currentAffiliate.firstName,
        lastName: currentAffiliate.lastName,
        status: currentAffiliate.status,
        ...links,
      },
      stats: {
        totalClicks,
        totalReferrals,
        completedDeals,
        conversionRate: totalClicks > 0 ? ((totalReferrals / totalClicks) * 100).toFixed(2) : "0.00",
        dealConversionRate: totalReferrals > 0 ? ((completedDeals / totalReferrals) * 100).toFixed(2) : "0.00",
      },
      earnings: {
        pendingCents: pending.sum,
        pendingCount: pending.count,
        earnedCents: earned.sum,
        earnedCount: earned.count,
        paidCents: paid.sum,
        paidCount: paid.count,
        availableBalanceCents: currentAffiliate.available_balance_cents || 0,
        lifetimeEarningsCents: currentAffiliate.lifetime_earnings_cents || 0,
        lifetimePaidCents: currentAffiliate.lifetime_paid_cents || 0,
      },
      referralsByLevel,
      recentCommissions: (recentCommissionsResult.data || []).map((c: any) => ({
        id: c.id,
        amountCents: c.amount_cents || c.amountCents,
        level: c.level,
        status: c.status,
        createdAt: c.createdAt,
      })),
    })
  } catch (error: any) {
    console.error("[Affiliate Dashboard] Error:", error)
    return NextResponse.json({ error: error.message || "Failed to get dashboard" }, { status: 400 })
  }
}

function getDefaultDashboardData() {
  return {
    affiliate: {
      id: "",
      firstName: "",
      lastName: "",
      status: "PENDING",
      referralLink: "",
      landingPage: "",
      refCode: "",
    },
    stats: {
      totalClicks: 0,
      totalReferrals: 0,
      completedDeals: 0,
      conversionRate: "0.00",
      dealConversionRate: "0.00",
    },
    earnings: {
      pendingCents: 0,
      pendingCount: 0,
      earnedCents: 0,
      earnedCount: 0,
      paidCents: 0,
      paidCount: 0,
      availableBalanceCents: 0,
      lifetimeEarningsCents: 0,
      lifetimePaidCents: 0,
    },
    referralsByLevel: {
      level1: 0,
      level2: 0,
      level3: 0,
      level4: 0,
      level5: 0,
    },
    recentCommissions: [],
  }
}

function generateReferralCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  let code = ""
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

function generateLandingSlug(firstName: string, lastName: string): string {
  const base = `${firstName}-${lastName}`.toLowerCase().replace(/[^a-z0-9-]/g, "")
  const suffix = Math.random().toString(36).substring(2, 6)
  return `${base}-${suffix}`
}
