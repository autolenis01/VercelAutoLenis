import { type NextRequest, NextResponse } from "next/server"
import { getSessionUser } from "@/lib/auth-server"
import { dealerService } from "@/lib/services/dealer.service"

export const dynamic = "force-dynamic"

// Get pickups
export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser()
    if (!user || !["DEALER", "DEALER_USER"].includes(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const dealer = await dealerService.getDealerByUserId(user.id)
    if (!dealer) {
      return NextResponse.json({ error: "Dealer not found" }, { status: 404 })
    }

    const pickups = await dealerService.getPickups(dealer.id)

    return NextResponse.json({ success: true, pickups })
  } catch (error: any) {
    console.error("[v0] Pickups error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// Validate QR code
export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser()
    if (!user || !["DEALER", "DEALER_USER"].includes(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const dealer = await dealerService.getDealerByUserId(user.id)
    if (!dealer) {
      return NextResponse.json({ error: "Dealer not found" }, { status: 404 })
    }

    const { qrCode } = await req.json()
    const pickup = await dealerService.validatePickupQR(dealer.id, qrCode)

    return NextResponse.json({ success: true, pickup })
  } catch (error: any) {
    console.error("[v0] QR validation error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
