import { type NextRequest, NextResponse } from "next/server"
import { getSessionUser } from "@/lib/auth-server"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const user = await getSessionUser()
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get("search") || undefined
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const status = searchParams.get("status") || undefined

    const skip = (page - 1) * limit
    const supabase = await createClient()

    // Fetch affiliates with related data
    let query = supabase.from("Affiliate").select(
      `
      *,
      user:User!Affiliate_userId_fkey(email, firstName, lastName, createdAt),
      referrals:Referral(count),
      commissions:Commission(count),
      clicks:AffiliateClick(count)
    `,
      { count: "exact" },
    )

    if (search) {
      query = query.or(
        `referralCode.ilike.%${search}%,refCode.ilike.%${search}%`,
      )
    }

    if (status && status !== "all") {
      query = query.eq("status", status)
    }

    const {
      data: affiliates,
      error,
      count,
    } = await query.order("createdAt", { ascending: false }).range(skip, skip + limit - 1)

    if (error) {
      console.error("[Admin Affiliates Error]", error)
      return NextResponse.json({ error: "Failed to load affiliates" }, { status: 500 })
    }

    // Calculate stats
    const { data: allAffiliates } = await supabase.from("Affiliate").select("status, totalEarnings, pendingEarnings, paidEarnings")
    
    const stats = {
      totalAffiliates: allAffiliates?.length || 0,
      activeAffiliates: allAffiliates?.filter((a: any) => a.status === "ACTIVE").length || 0,
      totalReferrals: (affiliates || []).reduce((sum: number, a: any) => sum + (a.referrals?.[0]?.count || 0), 0),
      totalEarnings: allAffiliates?.reduce((sum: number, a: any) => sum + (a.totalEarnings || 0), 0) || 0,
      pendingPayouts: allAffiliates?.reduce((sum: number, a: any) => sum + (a.pendingEarnings || 0), 0) || 0,
      paidPayouts: allAffiliates?.reduce((sum: number, a: any) => sum + (a.paidEarnings || 0), 0) || 0,
    }

    return NextResponse.json({
      affiliates: (affiliates || []).map((a: any) => ({
        id: a.id,
        userId: a.userId,
        status: a.status || "ACTIVE",
        referralCode: a.referralCode || a.refCode || a.ref_code,
        totalReferrals: a.referrals?.[0]?.count || 0,
        totalEarnings: a.totalEarnings || 0,
        pendingEarnings: a.pendingEarnings || 0,
        paidEarnings: a.paidEarnings || 0,
        createdAt: a.createdAt,
        user: a.user ? {
          email: a.user.email,
          firstName: a.user.firstName,
          lastName: a.user.lastName,
        } : null,
        bankDetails: a.bankDetails || null,
      })),
      stats,
      pagination: { page, limit, total: count || 0, totalPages: Math.ceil((count || 0) / limit) },
    })
  } catch (error) {
    console.error("[Admin Affiliates Error]", error)
    return NextResponse.json({ error: "Failed to load affiliates" }, { status: 500 })
  }
}
