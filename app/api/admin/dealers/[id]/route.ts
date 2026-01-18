import { type NextRequest, NextResponse } from "next/server"
import { getSessionUser } from "@/lib/auth-server"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getSessionUser()
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const supabase = createClient()

    const [dealerResult, inventoryResult, offersResult, dealsResult] = await Promise.all([
      supabase.from("Dealer").select("*").eq("id", id).single(),
      supabase
        .from("InventoryItem")
        .select("*, vehicle:Vehicle(*)")
        .eq("dealerId", id)
        .order("createdAt", { ascending: false })
        .limit(50),
      supabase.from("Offer").select("*").eq("dealerId", id).order("createdAt", { ascending: false }).limit(50),
      supabase
        .from("SelectedDeal")
        .select(`
          *,
          inventoryItem:InventoryItem(*, vehicle:Vehicle(*)),
          buyer:BuyerProfile(*, user:User(*))
        `)
        .eq("dealerId", id)
        .order("createdAt", { ascending: false }),
    ])

    if (dealerResult.error || !dealerResult.data) {
      console.error("[Admin Dealer Detail Error]", dealerResult.error)
      return NextResponse.json({ error: "Dealer not found" }, { status: 404 })
    }

    const dealer = {
      ...dealerResult.data,
      _count: {
        inventoryItems: inventoryResult.data?.length || 0,
        offers: offersResult.data?.length || 0,
        selectedDeals: dealsResult.data?.length || 0,
      },
      inventoryItems: inventoryResult.data || [],
      offers: offersResult.data || [],
      selectedDeals: dealsResult.data || [],
    }

    return NextResponse.json({ dealer })
  } catch (error) {
    console.error("[Admin Dealer Detail Error]", error)
    return NextResponse.json({ error: "Failed to load dealer" }, { status: 500 })
  }
}
