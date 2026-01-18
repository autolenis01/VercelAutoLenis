import { type NextRequest, NextResponse } from "next/server"
import { getSessionUser } from "@/lib/auth-server"
import { supabase, isDatabaseConfigured } from "@/lib/db"

export const dynamic = "force-dynamic"

// Get contracts
export async function GET(_req: NextRequest) {
  try {
    const user = await getSessionUser()
    if (!user || !["DEALER", "DEALER_USER"].includes(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!isDatabaseConfigured()) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 })
    }

    const { data: dealer, error: dealerError } = await supabase
      .from("Dealer")
      .select("id")
      .eq("userId", user.userId)
      .single()

    if (dealerError || !dealer) {
      console.error("[v0] Dealer not found:", dealerError)
      return NextResponse.json({ error: "Dealer not found" }, { status: 404 })
    }

    const { data: contracts, error: contractsError } = await supabase
      .from("ContractDocument")
      .select(`
        *,
        scan:ContractShieldScan(
          *,
          fixList:FixListItem(*)
        ),
        deal:SelectedDeal(
          *,
          buyer:BuyerProfile(
            id,
            firstName,
            lastName,
            phone,
            user:User(
              email
            )
          )
        )
      `)
      .eq("dealerId", dealer.id)
      .order("uploadedAt", { ascending: false })

    if (contractsError) {
      console.error("[v0] Error fetching contracts:", contractsError)
      return NextResponse.json({ error: "Failed to fetch contracts" }, { status: 500 })
    }

    return NextResponse.json({ success: true, contracts: contracts || [] })
  } catch (error: any) {
    console.error("[v0] Contracts error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// Upload contract
export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser()
    if (!user || !["DEALER", "DEALER_USER"].includes(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!isDatabaseConfigured()) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 })
    }

    const { data: dealer, error: dealerError } = await supabase
      .from("Dealer")
      .select("id")
      .eq("userId", user.userId)
      .single()

    if (dealerError || !dealer) {
      console.error("[v0] Dealer not found:", dealerError)
      return NextResponse.json({ error: "Dealer not found" }, { status: 404 })
    }

    const { dealId, documentType, fileUrl } = await req.json()

    const { data: contract, error: contractError } = await supabase
      .from("ContractDocument")
      .insert({
        dealerId: dealer.id,
        dealId,
        documentType,
        documentUrl: fileUrl,
        version: 1,
      })
      .select()
      .single()

    if (contractError || !contract) {
      console.error("[v0] Error uploading contract:", contractError)
      return NextResponse.json({ error: "Failed to upload contract" }, { status: 500 })
    }

    return NextResponse.json({ success: true, contract })
  } catch (error: any) {
    console.error("[v0] Upload contract error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
