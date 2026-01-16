import { type NextRequest, NextResponse } from "next/server"
import { getSessionUser } from "@/lib/auth-server"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getSessionUser()
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const supabase = createClient()

    const { data: dealer, error: dealerError } = await supabase
      .from("Dealer")
      .update({
        verified: true,
        active: true,
      })
      .eq("id", id)
      .select()
      .single()

    if (dealerError) {
      console.error("[Admin Approve Dealer Error]", dealerError)
      return NextResponse.json({ error: "Failed to approve dealer" }, { status: 500 })
    }

    await supabase.from("ComplianceEvent").insert({
      type: "ADMIN_ACTION",
      eventType: "DEALER_APPROVED",
      severity: "INFO",
      userId: user.userId,
      relatedId: dealer.id,
      details: { dealerId: dealer.id, dealerName: dealer.name || dealer.businessName },
    })

    return NextResponse.json({ success: true, dealer })
  } catch (error) {
    console.error("[Admin Approve Dealer Error]", error)
    return NextResponse.json({ error: "Failed to approve dealer" }, { status: 500 })
  }
}
