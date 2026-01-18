import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { requireAuth } from "@/lib/auth-server"
import { affiliateService } from "@/lib/services/affiliate.service"

export const dynamic = "force-dynamic"

// GET - List payouts for an affiliate
export async function GET(_request: NextRequest, { params }: { params: Promise<{ affiliateId: string }> }) {
  try {
    const session = await requireAuth()
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { affiliateId } = await params
    const supabase = await createClient()

    const { data: payouts, error } = await supabase
      .from("Payout")
      .select(`*, commissions:Commission(count)`)
      .eq("affiliateId", affiliateId)
      .order("createdAt", { ascending: false })

    if (error) {
      console.error("[Admin Affiliate Payouts API] Error:", error)
      return NextResponse.json({ error: "Failed to fetch payouts" }, { status: 500 })
    }

    return NextResponse.json({
      payouts: (payouts || []).map((p: any) => ({
        id: p.id,
        amountCents: p.total_amount_cents || p.totalAmountCents,
        status: p.status,
        provider: p.provider,
        providerRef: p.provider_ref || p.providerRef,
        commissionCount: p.commissions?.[0]?.count || 0,
        createdAt: p.createdAt,
        paidAt: p.paidAt || p.paid_timestamp,
      })),
    })
  } catch (error) {
    console.error("[Admin Affiliate Payouts API] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST - Create a new payout for an affiliate
export async function POST(_request: NextRequest, { params }: { params: Promise<{ affiliateId: string }> }) {
  try {
    const session = await requireAuth()
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { affiliateId } = await params

    const payout = await affiliateService.createPayout(affiliateId)

    return NextResponse.json({
      success: true,
      payout: {
        id: payout.id,
        amountCents: payout.total_amount_cents || payout.totalAmountCents,
        status: payout.status,
      },
    })
  } catch (error: any) {
    console.error("[Admin Create Payout API] Error:", error)
    return NextResponse.json(
      {
        error: error.message || "Internal server error",
      },
      { status: 400 },
    )
  }
}
