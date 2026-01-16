import { type NextRequest, NextResponse } from "next/server"
import { getSessionUser } from "@/lib/auth-server"
import { supabase, isDatabaseConfigured } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!isDatabaseConfigured()) {
      console.warn("[Affiliate Analytics] Database not configured, returning mock data")
      return NextResponse.json({
        dailyData: [],
        summary: {
          totalClicks: 0,
          uniqueVisitors: 0,
          totalSignups: 0,
          avgClicksPerDay: 0,
          conversionRate: "0.0",
          totalEarnings: 0,
        },
        topReferrals: [],
      })
    }

    const { data: affiliate, error: affiliateError } = await supabase
      .from("Affiliate")
      .select("id, totalEarnings, pendingEarnings")
      .eq("userId", user.userId)
      .maybeSingle()

    if (affiliateError) {
      console.error("[Affiliate Analytics] Error fetching affiliate:", affiliateError)
      return NextResponse.json({ error: "Failed to fetch affiliate" }, { status: 500 })
    }

    if (!affiliate) {
      return NextResponse.json({ error: "Affiliate not found" }, { status: 404 })
    }

    const { searchParams } = new URL(req.url)
    const days = Number.parseInt(searchParams.get("days") || "30")

    // Calculate date range
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const [
      { data: clicks, error: clicksError },
      { data: referrals, error: referralsError },
      { data: commissions, error: commissionsError },
    ] = await Promise.all([
      supabase
        .from("Click")
        .select("id, clickedAt")
        .eq("affiliateId", affiliate.id)
        .gte("clickedAt", startDate.toISOString()),

      supabase
        .from("Referral")
        .select("id, createdAt, dealCompleted, commissionPaid")
        .eq("affiliateId", affiliate.id)
        .gte("createdAt", startDate.toISOString()),

      supabase
        .from("Commission")
        .select("id, commissionAmount, status, createdAt")
        .eq("affiliateId", affiliate.id)
        .gte("createdAt", startDate.toISOString()),
    ])

    const totalClicks = clicks?.length || 0
    const totalReferrals = referrals?.length || 0

    // Group clicks by day
    const clicksByDay = groupByDay(clicks || [], "clickedAt", days)

    // Group referrals by day
    const referralsByDay = groupByDay(referrals || [], "createdAt", days)

    // Group earnings by day
    const earningsByDay = groupCommissionsByDay(commissions || [], days)

    // Merge daily data for the chart
    const dailyData = clicksByDay.map((clickDay, index) => ({
      date: clickDay.date,
      clicks: clickDay.count,
      signups: referralsByDay[index]?.count || 0,
      earnings: earningsByDay[index]?.amount || 0,
    }))

    // Calculate summary stats
    const totalSignups = totalReferrals
    const uniqueVisitors = Math.floor(totalClicks * 0.7) // Estimate unique visitors as 70% of clicks
    const avgClicksPerDay = Math.round(totalClicks / days)
    const conversionRate = totalClicks > 0 ? ((totalSignups / totalClicks) * 100).toFixed(1) : "0.0"
    const totalEarningsValue = commissions?.reduce((sum, c) => sum + (c.commissionAmount || 0), 0) || 0

    // Get top referrals (most recent ones that generated commissions)
    const topReferrals = (referrals || [])
      .filter((r) => r.dealCompleted)
      .slice(0, 10)
      .map((r) => ({
        id: r.id,
        date: r.createdAt,
        status: r.commissionPaid ? "Paid" : "Pending",
      }))

    return NextResponse.json({
      dailyData,
      summary: {
        totalClicks,
        uniqueVisitors,
        totalSignups,
        avgClicksPerDay,
        conversionRate,
        totalEarnings: totalEarningsValue,
      },
      topReferrals,
    })
  } catch (error: any) {
    console.error("[Affiliate Analytics] Error:", error)
    return NextResponse.json({ error: error.message || "Failed to get analytics" }, { status: 400 })
  }
}

// Helper function to group data by day
function groupByDay(data: any[], dateField: string, days: number) {
  const result: { date: string; count: number }[] = []

  for (let i = 0; i < days; i++) {
    const date = new Date()
    date.setDate(date.getDate() - (days - i - 1))
    const dateStr = date.toISOString().split("T")[0]

    const count = data.filter((item) => {
      const itemDate = new Date(item[dateField]).toISOString().split("T")[0]
      return itemDate === dateStr
    }).length

    result.push({ date: dateStr, count })
  }

  return result
}

// Helper function to group commissions by day
function groupCommissionsByDay(commissions: any[], days: number) {
  const result: { date: string; amount: number }[] = []

  for (let i = 0; i < days; i++) {
    const date = new Date()
    date.setDate(date.getDate() - (days - i - 1))
    const dateStr = date.toISOString().split("T")[0]

    const amount = commissions
      .filter((item) => {
        const itemDate = new Date(item.createdAt).toISOString().split("T")[0]
        return itemDate === dateStr
      })
      .reduce((sum, item) => sum + (item.commissionAmount || 0), 0)

    result.push({ date: dateStr, amount })
  }

  return result
}
