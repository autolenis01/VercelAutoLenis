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
      return NextResponse.json({
        commissions: [],
        pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
        summary: { totalEarned: 0, pendingAmount: 0, paidAmount: 0 },
      })
    }

    const { data: affiliate, error: affiliateError } = await supabase
      .from("Affiliate")
      .select("id")
      .eq("userId", user.userId)
      .maybeSingle()

    if (affiliateError) {
      console.error("[Affiliate Commissions] Error fetching affiliate:", affiliateError)
      return NextResponse.json({ error: "Failed to fetch affiliate" }, { status: 500 })
    }

    if (!affiliate) {
      return NextResponse.json({ error: "Affiliate not found" }, { status: 404 })
    }

    const { searchParams } = new URL(req.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const status = searchParams.get("status") || undefined
    const offset = (page - 1) * limit

    let query = supabase
      .from("Commission")
      .select("*", { count: "exact" })
      .eq("affiliateId", affiliate.id)
      .order("createdAt", { ascending: false })
      .range(offset, offset + limit - 1)

    if (status) {
      query = query.eq("status", status)
    }

    const { data: commissions, error: commissionsError, count } = await query

    if (commissionsError) {
      console.error("[Affiliate Commissions] Error fetching commissions:", commissionsError)
      return NextResponse.json({ error: "Failed to fetch commissions" }, { status: 500 })
    }

    const { data: allCommissions } = await supabase
      .from("Commission")
      .select("amount_cents,amountCents,status")
      .eq("affiliateId", affiliate.id)

    const summary = {
      totalEarned: 0,
      pendingAmount: 0,
      paidAmount: 0,
    }

    if (allCommissions) {
      for (const commission of allCommissions) {
        const amountCents = commission.amount_cents || commission.amountCents || 0
        const amountDollars = amountCents / 100
        summary.totalEarned += amountDollars
        if (commission.status === "PENDING") {
          summary.pendingAmount += amountDollars
        } else if (commission.status === "PAID") {
          summary.paidAmount += amountDollars
        }
      }
    }

    const total = count || 0

    return NextResponse.json({
      commissions: commissions || [],
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      summary,
    })
  } catch (error: any) {
    console.error("[Affiliate Commissions] Error:", error)
    return NextResponse.json({ error: error.message || "Failed to get commissions" }, { status: 400 })
  }
}
