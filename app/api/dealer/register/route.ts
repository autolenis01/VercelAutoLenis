import { type NextRequest, NextResponse } from "next/server"
import { getSessionUser } from "@/lib/auth-server"
import { dealerService } from "@/lib/services/dealer.service"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()

    // Create dealer using service
    const dealer = await dealerService.createDealerApplication(body)

    const supabase = await createClient()

    // Link user to dealer
    const { error: dealerUserError } = await supabase.from("DealerUser").insert({
      userId: user.userId,
      dealerId: dealer.id,
      roleLabel: body.contactTitle || "Owner",
    })

    if (dealerUserError) {
      console.error("[v0] Register dealer - DealerUser creation error:", dealerUserError)
      throw new Error(dealerUserError.message)
    }

    // Update user role
    const { error: userError } = await supabase.from("User").update({ role: "DEALER" }).eq("id", user.userId)

    if (userError) {
      console.error("[v0] Register dealer - User update error:", userError)
      throw new Error(userError.message)
    }

    return NextResponse.json({ success: true, dealer })
  } catch (error: any) {
    console.error("[v0] Register dealer error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
