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
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const status = searchParams.get("status") || undefined

    const skip = (page - 1) * limit
    const supabase = await createClient()

    let query = supabase.from("Affiliate").select(
      `
      *,
      user:User!Affiliate_userId_fkey(email, createdAt),
      referrals:Referral(count),
      commissions:Commission(count),
      clicks:AffiliateClick(count)
    `,
      { count: "exact" },
    )

    if (search) {
      query = query.or(
        `firstName.ilike.%${search}%,lastName.ilike.%${search}%,refCode.ilike.%${search}%,ref_code.ilike.%${search}%`,
      )
    }

    if (status) {
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

    return NextResponse.json({
      affiliates: (affiliates || []).map((a: any) => ({
        id: a.id,
        userId: a.userId,
        email: a.user?.email,
        name: `${a.firstName} ${a.lastName}`.trim(),
        refCode: a.refCode || a.ref_code,
        landingSlug: a.landing_slug || a.landingSlug,
        status: a.status || "ACTIVE",
        totalEarnings: a.totalEarnings || 0,
        pendingEarnings: a.pendingEarnings || 0,
        availableBalanceCents: a.available_balance_cents || 0,
        clicks: a.clicks?.[0]?.count || 0,
        referrals: a.referrals?.[0]?.count || 0,
        commissions: a.commissions?.[0]?.count || 0,
        createdAt: a.createdAt,
      })),
      pagination: { page, limit, total: count || 0, totalPages: Math.ceil((count || 0) / limit) },
    })
  } catch (error) {
    console.error("[Admin Affiliates Error]", error)
    return NextResponse.json({ error: "Failed to load affiliates" }, { status: 500 })
  }
}
