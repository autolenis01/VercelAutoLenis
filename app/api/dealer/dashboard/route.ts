import { type NextRequest, NextResponse } from "next/server"
import { getSessionUser } from "@/lib/auth-server"
import { supabase, isDatabaseConfigured } from "@/lib/db"

export const dynamic = "force-dynamic"

function getDefaultDashboardData() {
  return {
    success: true,
    activeAuctions: 0,
    pendingOffers: 0,
    completedDeals: 0,
    inventory: 0,
    pendingContracts: 0,
    upcomingPickups: 0,
    recentActivity: [],
    monthlyStats: {
      thisMonthDeals: 0,
      lastMonthDeals: 0,
      dealsChange: 0,
      revenue: 0,
    },
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser()
    if (!user || !["DEALER", "DEALER_USER"].includes(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!isDatabaseConfigured()) {
      return NextResponse.json(getDefaultDashboardData())
    }

    const userId = user.userId
    if (!userId) {
      return NextResponse.json({ error: "Invalid user session" }, { status: 401 })
    }

    // Get dealer from user via DealerUser table
    const { data: dealerUser, error: dealerUserError } = await supabase
      .from("DealerUser")
      .select("dealerId, Dealer:dealerId(*)")
      .eq("userId", userId)
      .maybeSingle()

    if (dealerUserError) {
      console.error("[Dealer Dashboard] DealerUser error:", dealerUserError)
      return NextResponse.json(getDefaultDashboardData())
    }

    if (!dealerUser || !dealerUser.dealerId) {
      // Try to find dealer directly by userId (for legacy data)
      const { data: directDealer } = await supabase.from("Dealer").select("*").eq("userId", userId).maybeSingle()

      if (!directDealer) {
        return NextResponse.json({ error: "Dealer not found" }, { status: 404 })
      }

      // Use direct dealer
      const stats = await getDealerDashboardStats(directDealer.id)
      return NextResponse.json({ success: true, ...stats })
    }

    const dealerId = dealerUser.dealerId
    const stats = await getDealerDashboardStats(dealerId)

    return NextResponse.json({ success: true, ...stats })
  } catch (error: any) {
    console.error("[Dealer Dashboard] Error:", error)
    return NextResponse.json({ error: error.message || "Failed to get dashboard" }, { status: 500 })
  }
}

async function getDealerDashboardStats(dealerId: string) {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

  try {
    const [
      activeAuctionsResult,
      pendingOffersResult,
      completedDealsResult,
      inventoryResult,
      pendingContractsResult,
      upcomingPickupsResult,
      recentDealsResult,
      thisMonthDealsResult,
      lastMonthDealsResult,
      thisMonthRevenueResult,
    ] = await Promise.all([
      // Active auctions where dealer is invited
      supabase
        .from("AuctionParticipant")
        .select("id, auctionId")
        .eq("dealerId", dealerId),

      // Pending offers
      supabase
        .from("AuctionOffer")
        .select("id", { count: "exact", head: true })
        .eq("participantId", dealerId),

      // Completed deals
      supabase
        .from("SelectedDeal")
        .select("id", { count: "exact", head: true })
        .eq("dealerId", dealerId)
        .eq("status", "COMPLETED"),

      // Inventory items
      supabase
        .from("InventoryItem")
        .select("id", { count: "exact", head: true })
        .eq("dealerId", dealerId),

      // Pending contract revisions
      supabase
        .from("ContractDocument")
        .select("id", { count: "exact", head: true })
        .eq("dealerId", dealerId),

      // Upcoming pickups
      supabase
        .from("PickupAppointment")
        .select("id", { count: "exact", head: true })
        .eq("dealerId", dealerId)
        .eq("status", "SCHEDULED")
        .gte("scheduledDate", now.toISOString()),

      supabase
        .from("SelectedDeal")
        .select("id, status, cashOtd, createdAt, buyerId, inventoryItemId")
        .eq("dealerId", dealerId)
        .order("createdAt", { ascending: false })
        .limit(10),

      // This month's deals
      supabase
        .from("SelectedDeal")
        .select("id", { count: "exact", head: true })
        .eq("dealerId", dealerId)
        .eq("status", "COMPLETED")
        .gte("createdAt", startOfMonth.toISOString()),

      // Last month's deals
      supabase
        .from("SelectedDeal")
        .select("id", { count: "exact", head: true })
        .eq("dealerId", dealerId)
        .eq("status", "COMPLETED")
        .gte("createdAt", lastMonth.toISOString())
        .lte("createdAt", endOfLastMonth.toISOString()),

      // This month's revenue
      supabase
        .from("SelectedDeal")
        .select("cashOtd")
        .eq("dealerId", dealerId)
        .eq("status", "COMPLETED")
        .gte("createdAt", startOfMonth.toISOString()),
    ])

    let activeAuctions = 0
    if (activeAuctionsResult.data && activeAuctionsResult.data.length > 0) {
      const auctionIds = activeAuctionsResult.data.map((ap) => ap.auctionId)
      const { data: openAuctions } = await supabase
        .from("Auction")
        .select("id", { count: "exact", head: true })
        .in("id", auctionIds)
        .eq("status", "OPEN")
      activeAuctions = openAuctions?.length || 0
    }

    let recentActivity: any[] = []
    if (recentDealsResult.data && recentDealsResult.data.length > 0) {
      const deals = recentDealsResult.data
      const buyerIds = [...new Set(deals.map((d) => d.buyerId).filter(Boolean))]
      const inventoryIds = [...new Set(deals.map((d) => d.inventoryItemId).filter(Boolean))]

      // Fetch buyers and inventory in parallel
      const [buyersResult, inventoryResult] = await Promise.all([
        buyerIds.length > 0
          ? supabase.from("BuyerProfile").select("id, firstName, lastName").in("id", buyerIds)
          : { data: [] },
        inventoryIds.length > 0
          ? supabase.from("InventoryItem").select("id, price, vehicleId").in("id", inventoryIds)
          : { data: [] },
      ])

      // Fetch vehicles if we have inventory
      let vehiclesMap: Record<string, any> = {}
      if (inventoryResult.data && inventoryResult.data.length > 0) {
        const vehicleIds = [...new Set(inventoryResult.data.map((i) => i.vehicleId).filter(Boolean))]
        if (vehicleIds.length > 0) {
          const { data: vehicles } = await supabase
            .from("Vehicle")
            .select("id, make, model, year, vin")
            .in("id", vehicleIds)
          vehiclesMap = (vehicles || []).reduce((acc, v) => ({ ...acc, [v.id]: v }), {})
        }
      }

      // Create lookup maps
      const buyersMap = (buyersResult.data || []).reduce(
        (acc, b) => ({ ...acc, [b.id]: { firstName: b.firstName, lastName: b.lastName } }),
        {} as Record<string, any>,
      )
      const inventoryMap = (inventoryResult.data || []).reduce(
        (acc, i) => ({
          ...acc,
          [i.id]: { id: i.id, price: i.price, vehicle: vehiclesMap[i.vehicleId] || null },
        }),
        {} as Record<string, any>,
      )

      // Combine data
      recentActivity = deals.map((deal) => ({
        id: deal.id,
        status: deal.status,
        cashOtd: deal.cashOtd,
        createdAt: deal.createdAt,
        buyer: buyersMap[deal.buyerId] || null,
        inventoryItem: inventoryMap[deal.inventoryItemId] || null,
      }))
    }

    // Calculate stats from results
    const pendingOffers = pendingOffersResult.count || 0
    const completedDeals = completedDealsResult.count || 0
    const inventory = inventoryResult.count || 0
    const pendingContracts = pendingContractsResult.count || 0
    const upcomingPickups = upcomingPickupsResult.count || 0

    const thisMonthDeals = thisMonthDealsResult.count || 0
    const lastMonthDeals = lastMonthDealsResult.count || 0
    const revenue = (thisMonthRevenueResult.data || []).reduce((sum, deal) => sum + (deal.cashOtd || 0), 0)

    const dealsChange = lastMonthDeals > 0 ? ((thisMonthDeals - lastMonthDeals) / lastMonthDeals) * 100 : 0

    return {
      activeAuctions,
      pendingOffers,
      completedDeals,
      inventory,
      pendingContracts,
      upcomingPickups,
      recentActivity,
      monthlyStats: {
        thisMonthDeals,
        lastMonthDeals,
        dealsChange,
        revenue,
      },
    }
  } catch (error) {
    console.error("[Dealer Dashboard] Stats error:", error)
    return {
      activeAuctions: 0,
      pendingOffers: 0,
      completedDeals: 0,
      inventory: 0,
      pendingContracts: 0,
      upcomingPickups: 0,
      recentActivity: [],
      monthlyStats: {
        thisMonthDeals: 0,
        lastMonthDeals: 0,
        dealsChange: 0,
        revenue: 0,
      },
    }
  }
}
