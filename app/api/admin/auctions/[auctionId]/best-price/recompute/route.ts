import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-server"
import { createClient } from "@/lib/supabase/server"
import { BestPriceService } from "@/lib/services/best-price.service"

export async function POST(_request: Request, { params }: { params: Promise<{ auctionId: string }> }) {
  try {
    const { auctionId } = await params
    const session = await requireAuth(["ADMIN"])

    const supabase = await createClient()

    const { data: auction, error: auctionError } = await supabase
      .from("Auction")
      .select("id, status")
      .eq("id", auctionId)
      .single()

    if (auctionError || !auction) {
      console.error("[v0] Admin recompute auction not found:", auctionError)
      return NextResponse.json({ success: false, error: "Auction not found" }, { status: 404 })
    }

    // Allow recompute for CLOSED auctions only
    if (auction.status !== "CLOSED") {
      return NextResponse.json(
        { success: false, error: `Cannot recompute for auction with status ${auction.status}` },
        { status: 400 },
      )
    }

    // Recompute
    const options = await BestPriceService.computeBestPriceOptions(auctionId, "RECOMPUTE")

    await supabase.from("ComplianceEvent").insert({
      eventType: "ADMIN_BEST_PRICE_RECOMPUTE",
      userId: session.userId,
      relatedId: auctionId,
      details: {
        options_created: options.length,
        recomputed_at: new Date().toISOString(),
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        message: "Best price options recomputed successfully",
        options_created: options.length,
        auction_id: auctionId,
      },
    })
  } catch (error: any) {
    console.error("[v0] Admin recompute error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
