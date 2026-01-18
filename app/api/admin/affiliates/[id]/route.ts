import { type NextRequest, NextResponse } from "next/server"
import { getSessionUser } from "@/lib/auth-server"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getSessionUser()
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const supabase = await createClient()

    const { data: affiliate, error } = await supabase
      .from("Affiliate")
      .select(`
        *,
        user:User!Affiliate_userId_fkey(
          id,
          email,
          createdAt,
          first_name,
          last_name,
          phone
        ),
        referrals:Referral(*),
        commissions:Commission(*),
        clicks:AffiliateClick(*)
      `)
      .eq("id", id)
      .single()

    if (error || !affiliate) {
      console.error("[Admin Affiliate Detail Error]", error)
      return NextResponse.json({ error: "Affiliate not found" }, { status: 404 })
    }

    // Calculate metrics
    const totalClicks = affiliate.clicks?.length || 0
    const totalReferrals = affiliate.referrals?.length || 0
    const totalCommissions = affiliate.commissions?.length || 0
    const paidCommissions = affiliate.commissions?.filter((c: any) => c.status === "PAID").length || 0

    return NextResponse.json({
      affiliate: {
        ...affiliate,
        metrics: {
          totalClicks,
          totalReferrals,
          totalCommissions,
          paidCommissions,
          conversionRate: totalClicks > 0 ? ((totalReferrals / totalClicks) * 100).toFixed(2) : "0.00",
        },
      },
    })
  } catch (error) {
    console.error("[Admin Affiliate Detail Error]", error)
    return NextResponse.json({ error: "Failed to load affiliate" }, { status: 500 })
  }
}
