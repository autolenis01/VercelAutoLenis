import { getCurrentUser } from "@/lib/auth-server"
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createClient()

    const { data: deal, error } = await supabase
      .from("SelectedDeal")
      .select(`
        *,
        auctionOffer:AuctionOffer(
          *,
          auction:Auction(
            *,
            shortlist:Shortlist(
              *,
              items:ShortlistItem(
                *,
                inventoryItem:InventoryItem(
                  *,
                  vehicle:Vehicle(*)
                )
              )
            )
          ),
          dealer:Dealer(*)
        ),
        insurancePolicy:InsurancePolicy(*)
      `)
      .eq("buyerId", user.id)
      .in("status", [
        "SELECTED",
        "FINANCING_APPROVED",
        "FEE_PENDING",
        "FEE_PAID",
        "INSURANCE_PENDING",
        "INSURANCE_COMPLETE",
        "CONTRACT_PENDING",
        "CONTRACT_REVIEW",
        "SIGNING_PENDING",
      ])
      .order("createdAt", { ascending: false })
      .limit(1)
      .single()

    if (error && error.code !== "PGRST116") {
      throw error
    }

    return NextResponse.json({
      success: true,
      data: { deal: deal || null },
    })
  } catch (error: any) {
    console.error("[Buyer Deal] Error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
