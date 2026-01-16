import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth-server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = createAdminClient()

    const { data: affiliate, error: affiliateError } = await supabase
      .from("Affiliate")
      .select("id")
      .eq("userId", user.userId)
      .maybeSingle()

    if (affiliateError) {
      console.error("[Affiliate Referrals] DB error:", affiliateError)
      return NextResponse.json({ error: "Failed to fetch affiliate" }, { status: 500 })
    }

    if (!affiliate) {
      // Return empty referrals list for users who aren't affiliates yet
      return NextResponse.json({
        referrals: [],
        total: 0,
        page: 1,
        limit: 20,
        totalPages: 0,
      })
    }

    const { searchParams } = new URL(req.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const offset = (page - 1) * limit

    const { data: referrals, error: referralsError } = await supabase
      .from("Referral")
      .select(`
        id,
        level,
        dealCompleted,
        commissionPaid,
        createdAt,
        attribution_source,
        referredUserId
      `)
      .eq("affiliateId", affiliate.id)
      .order("createdAt", { ascending: false })
      .range(offset, offset + limit - 1)

    if (referralsError) {
      console.error("[Affiliate Referrals] Referrals query error:", referralsError)
      return NextResponse.json({ error: "Failed to fetch referrals" }, { status: 500 })
    }

    // Get total count
    const { count } = await supabase
      .from("Referral")
      .select("*", { count: "exact", head: true })
      .eq("affiliateId", affiliate.id)

    // Get user details for each referral
    const referralsWithUsers = await Promise.all(
      (referrals || []).map(async (referral) => {
        const { data: referredUser } = await supabase
          .from("User")
          .select("id, first_name, last_name, email, createdAt")
          .eq("id", referral.referredUserId)
          .maybeSingle()

        return {
          ...referral,
          referredUser: referredUser
            ? {
                id: referredUser.id,
                name: `${referredUser.first_name || ""} ${referredUser.last_name || ""}`.trim() || "Unknown",
                email: referredUser.email,
                signupDate: referredUser.createdAt,
              }
            : null,
        }
      }),
    )

    return NextResponse.json({
      referrals: referralsWithUsers,
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    })
  } catch (error: any) {
    console.error("[Affiliate Referrals] Error:", error)
    return NextResponse.json({ error: error.message || "Failed to get referrals" }, { status: 400 })
  }
}
