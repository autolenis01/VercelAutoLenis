import { NextResponse } from "next/server"
import { AuctionService } from "@/lib/services/auction.service"

// This endpoint can be called by a cron job to close expired auctions
export async function POST(request: Request) {
  try {
    // Verify cron secret for security
    const authHeader = request.headers.get("authorization")
    const cronSecret = process.env.CRON_SECRET

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const closedCount = await AuctionService.closeExpiredAuctions()

    return NextResponse.json({
      success: true,
      data: { closedCount },
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
