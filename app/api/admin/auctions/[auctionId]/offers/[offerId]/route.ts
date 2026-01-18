import { type NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-server"
import { offerService } from "@/lib/services/offer.service"

export const dynamic = "force-dynamic"

export async function GET(__req: NextRequest, { params }: { params: Promise<{ auctionId: string; offerId: string }> }) {
  try {
    const { auctionId, offerId } = await params
    await requireAuth(["ADMIN"])

    const offer = await offerService.getOfferDetail(offerId)

    if (!offer) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 })
    }

    // Verify offer belongs to this auction
    if (offer.auctionId !== auctionId) {
      return NextResponse.json({ error: "Offer does not belong to this auction" }, { status: 400 })
    }

    return NextResponse.json(offer)
  } catch (error: any) {
    console.error("[API] Admin get offer detail error:", error)
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
