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
    const { data: affiliate, error } = await supabase.from("Affiliate").select("*").eq("userId", user.userId).maybeSingle()

    if (error) {
      console.error("[Affiliate Payouts] DB error:", error)
      return NextResponse.json({ error: "Database error" }, { status: 500 })
    }

    if (!affiliate) {
      // Return empty payouts for non-affiliate users
      return NextResponse.json({
        payouts: [],
        total: 0,
        page: 1,
        pageSize: 20,
        totalPages: 0,
        availableBalance: 0,
        minimumPayout: 50,
      })
    }

    const { searchParams } = new URL(req.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const offset = (page - 1) * limit

    const { data: payouts, error: payoutsError } = await supabase
      .from("Payout")
      .select("*", { count: "exact" })
      .eq("affiliateId", affiliate.id)
      .order("createdAt", { ascending: false })
      .range(offset, offset + limit - 1)

    if (payoutsError) {
      console.error("[Affiliate Payouts] Payouts query error:", payoutsError)
      return NextResponse.json({ error: "Failed to fetch payouts" }, { status: 500 })
    }

    const { count } = await supabase
      .from("Payout")
      .select("*", { count: "exact", head: true })
      .eq("affiliateId", affiliate.id)

    return NextResponse.json({
      payouts: payouts || [],
      total: count || 0,
      page,
      pageSize: limit,
      totalPages: Math.ceil((count || 0) / limit),
      availableBalance: (affiliate.available_balance_cents || affiliate.pendingEarnings * 100 || 0) / 100,
      minimumPayout: 50,
    })
  } catch (error: any) {
    console.error("[Affiliate Payouts] Error:", error)
    return NextResponse.json({ error: error.message || "Failed to get payouts" }, { status: 400 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = createAdminClient()
    const { data: affiliate, error } = await supabase.from("Affiliate").select("*").eq("userId", user.userId).maybeSingle()

    if (error) {
      console.error("[Affiliate Payouts] DB error:", error)
      return NextResponse.json({ error: "Database error" }, { status: 500 })
    }

    if (!affiliate) {
      return NextResponse.json({ error: "Affiliate not found" }, { status: 404 })
    }

    const body = await req.json()
    const { method, details } = body

    // Check minimum balance
    const availableBalance = affiliate.available_balance_cents || (affiliate.pendingEarnings || 0) * 100
    if (availableBalance < 5000) {
      // $50 minimum
      return NextResponse.json({ error: "Minimum payout is $50" }, { status: 400 })
    }

    // Create payout request
    const { data: payout, error: payoutError } = await supabase
      .from("Payout")
      .insert({
        affiliateId: affiliate.id,
        amount: availableBalance / 100,
        totalAmountCents: availableBalance,
        total_amount_cents: availableBalance,
        status: "PENDING",
        provider: method || "STRIPE",
        paymentDetails: details,
      })
      .select()
      .single()

    if (payoutError) {
      console.error("[Affiliate Payouts] Create payout error:", payoutError)
      return NextResponse.json({ error: "Failed to create payout request" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      payout,
    })
  } catch (error: any) {
    console.error("[Affiliate Payouts] Error:", error)
    return NextResponse.json({ error: error.message || "Failed to request payout" }, { status: 400 })
  }
}
