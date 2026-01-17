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

    const { data: buyer, error } = await supabase
      .from("User")
      .select(`
        *,
        buyerProfile:BuyerProfile(*),
        buyerPreQualification:PreQualification(*),
        buyerPreferences:BuyerPreferences(*),
        shortlists:Shortlist(
          *,
          items:ShortlistItem(
            *,
            inventoryItem:InventoryItem(
              *,
              vehicle:Vehicle(*)
            )
          )
        ),
        auctions:Auction(
          *,
          offers:Offer(
            *,
            dealer:Dealer(*)
          )
        ),
        selectedDeals:SelectedDeal(
          *,
          dealer:Dealer(*),
          inventoryItem:InventoryItem(
            *,
            vehicle:Vehicle(*)
          ),
          serviceFee:ServiceFee(*),
          deposit:Deposit(*)
        ),
        affiliate:Affiliate(
          *,
          referrals:Referral(*),
          commissions:Commission(*)
        )
      `)
      .eq("id", id)
      .order("createdAt", { referencedTable: "auctions", ascending: false })
      .order("createdAt", { referencedTable: "selectedDeals", ascending: false })
      .single()

    if (error || !buyer) {
      console.error("[Admin Buyer Detail Error]", error)
      return NextResponse.json({ error: "Buyer not found" }, { status: 404 })
    }

    return NextResponse.json({ buyer })
  } catch (error) {
    console.error("[Admin Buyer Detail Error]", error)
    return NextResponse.json({ error: "Failed to load buyer" }, { status: 500 })
  }
}
