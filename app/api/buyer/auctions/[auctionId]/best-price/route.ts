import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-server"
import { createClient } from "@/lib/supabase/server"
import { BestPriceService } from "@/lib/services/best-price.service"

export async function GET(request: Request, { params }: { params: Promise<{ auctionId: string }> }) {
  try {
    const { auctionId } = await params
    const session = await requireAuth(["BUYER"])

    const supabase = await createClient()

    // Verify auction ownership
    const { data: auction, error: auctionError } = await supabase
      .from("Auction")
      .select("id, buyerId, status")
      .eq("id", auctionId)
      .single()

    if (auctionError || !auction) {
      console.error("[v0] Auction fetch error:", auctionError)
      return NextResponse.json({ success: false, error: "Auction not found" }, { status: 404 })
    }

    if (auction.buyerId !== session.userId) {
      // Check if user is buyer via buyerProfile
      const { data: buyerProfile } = await supabase
        .from("BuyerProfile")
        .select("id")
        .eq("userId", session.userId)
        .single()

      if (!buyerProfile || auction.buyerId !== buyerProfile.id) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 })
      }
    }

    // Verify auction status
    if (auction.status !== "CLOSED" && auction.status !== "COMPLETED" && auction.status !== "NO_OFFERS") {
      return NextResponse.json(
        { success: false, error: "Best price report not available until auction is closed" },
        { status: 400 },
      )
    }

    // Check if best price options exist, compute if not
    const { count } = await supabase
      .from("BestPriceOption")
      .select("*", { count: "exact", head: true })
      .eq("auctionId", auctionId)

    if ((count || 0) === 0 && auction.status === "CLOSED") {
      await BestPriceService.computeBestPriceOptions(auctionId, "INITIAL")
    }

    // Get grouped options
    const options = await BestPriceService.getBestPriceOptions(auctionId)

    // Get offer count
    const { count: offerCount } = await supabase
      .from("AuctionOffer")
      .select("*", { count: "exact", head: true })
      .eq("auctionId", auctionId)

    return NextResponse.json({
      success: true,
      data: {
        auction: {
          id: auctionId,
          status: auction.status,
          offer_count: offerCount || 0,
        },
        ...options,
      },
    })
  } catch (error: any) {
    console.error("[v0] Best price fetch error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
