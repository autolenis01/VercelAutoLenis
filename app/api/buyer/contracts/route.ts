import { type NextRequest, NextResponse } from "next/server"
import { getSessionUser } from "@/lib/auth-server"
import { createAdminClient } from "@/lib/supabase/admin"

export const dynamic = "force-dynamic"

// Get buyer's contract shield status and documents
export async function GET(_req: NextRequest) {
  try {
    const user = await getSessionUser()
    if (!user || user.role !== "BUYER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = createAdminClient()

    const { data: deal, error: dealError } = await supabase
      .from("SelectedDeal")
      .select("*")
      .eq("buyerId", user.id)
      .order("createdAt", { ascending: false })
      .limit(1)
      .maybeSingle()

    if (dealError) {
      console.error("[v0] Error fetching deal:", dealError)
      return NextResponse.json({ error: "Failed to fetch deal" }, { status: 500 })
    }

    if (!deal) {
      return NextResponse.json({
        success: true,
        data: {
          deal: null,
          scan: null,
          documents: [],
        },
      })
    }

    let dealer = null
    let auctionOffer = null
    let inventoryItem = null
    let vehicle = null
    let financingOffer = null
    let insurancePolicy = null

    if (deal.offerId) {
      const { data: offer } = await supabase.from("AuctionOffer").select("*").eq("id", deal.offerId).maybeSingle()
      auctionOffer = offer

      if (offer?.dealer_id) {
        const { data: dealerData } = await supabase.from("Dealer").select("*").eq("id", offer.dealer_id).maybeSingle()
        dealer = dealerData
      }
    }

    if (!dealer && deal.dealerId) {
      const { data: dealerData } = await supabase.from("Dealer").select("*").eq("id", deal.dealerId).maybeSingle()
      dealer = dealerData
    }

    if (deal.inventoryItemId) {
      const { data: item } = await supabase
        .from("InventoryItem")
        .select("*")
        .eq("id", deal.inventoryItemId)
        .maybeSingle()
      inventoryItem = item

      if (item?.vehicleId) {
        const { data: vehicleData } = await supabase.from("Vehicle").select("*").eq("id", item.vehicleId).maybeSingle()
        vehicle = vehicleData
      }
    }

    if (deal.financingOfferId) {
      const { data: financing } = await supabase
        .from("FinancingOffer")
        .select("*")
        .eq("id", deal.financingOfferId)
        .maybeSingle()
      financingOffer = financing
    }

    const { data: insurance } = await supabase
      .from("InsurancePolicy")
      .select("*")
      .eq("selectedDealId", deal.id)
      .order("createdAt", { ascending: false })
      .limit(1)
      .maybeSingle()
    insurancePolicy = insurance

    const { data: scan, error: scanError } = await supabase
      .from("ContractShieldScan")
      .select(`
        *,
        fixList:FixListItem(*)
      `)
      .eq("selectedDealId", deal.id)
      .order("createdAt", { ascending: false })
      .limit(1)
      .maybeSingle()

    if (scanError) {
      console.error("[v0] Error fetching scan:", scanError)
    }

    const { data: documents, error: docsError } = await supabase
      .from("ContractDocument")
      .select("*")
      .eq("dealId", deal.id)
      .order("createdAt", { ascending: false })

    if (docsError) {
      console.error("[v0] Error fetching documents:", docsError)
    }

    return NextResponse.json({
      success: true,
      data: {
        deal: {
          ...deal,
          dealer,
          auctionOffer,
          inventoryItem: inventoryItem
            ? {
                ...inventoryItem,
                vehicle,
              }
            : null,
          financingOffer,
          insurancePolicy,
        },
        scan: scan || null,
        documents: documents || [],
      },
    })
  } catch (error: any) {
    console.error("[v0] Buyer contracts error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
