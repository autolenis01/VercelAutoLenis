import { NextResponse } from "next/server"
import { getSessionUser } from "@/lib/auth-server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const user = await getSessionUser()

    if (!user || user.role !== "BUYER") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createClient()

    const { data: buyerProfile, error: buyerError } = await supabase
      .from("BuyerProfile")
      .select("id")
      .eq("userId", user.userId)
      .maybeSingle()

    if (buyerError) {
      console.error("[v0] Buyer profile fetch error:", buyerError)
      return NextResponse.json({ success: false, error: "Failed to fetch buyer profile" }, { status: 500 })
    }

    if (!buyerProfile) {
      return NextResponse.json(
        {
          success: false,
          error: "Buyer profile not found. Please complete your profile setup.",
        },
        { status: 404 },
      )
    }

    const { data: auctions, error: auctionsError } = await supabase
      .from("Auction")
      .select(
        `
        *,
        shortlist:Shortlist!inner(
          *,
          items:ShortlistItem(
            *,
            inventoryItem:InventoryItem(
              *,
              vehicle:Vehicle(*),
              dealer:Dealer(*)
            )
          )
        ),
        offers:AuctionOffer(
          *,
          dealer:Dealer(*)
        )
      `,
      )
      .eq("shortlist.buyerId", buyerProfile.id)
      .order("createdAt", { ascending: false })
      .order("otdPrice", { foreignTable: "offers", ascending: true })

    if (auctionsError) {
      console.error("[v0] Auctions fetch error:", auctionsError)
      return NextResponse.json({ success: false, error: auctionsError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: { auctions: auctions || [] },
    })
  } catch (error: any) {
    console.error("[v0] Error fetching auctions:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
