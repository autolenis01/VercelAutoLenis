import { NextResponse } from "next/server"
import { AuctionService } from "@/lib/services/auction.service"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const auction = await AuctionService.getAuction(id)

    if (!auction) {
      return NextResponse.json({ success: false, error: "Auction not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: { auction },
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
