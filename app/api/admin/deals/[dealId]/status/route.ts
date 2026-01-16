import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-server"
import { DealService, type DealStatus } from "@/lib/services/deal.service"

export async function POST(request: Request, { params }: { params: Promise<{ dealId: string }> }) {
  try {
    const session = await requireAuth(["ADMIN"])
    const { dealId } = await params
    const body = await request.json()

    const { deal_status, cancel_reason } = body

    if (!deal_status) {
      return NextResponse.json({ success: false, error: "deal_status is required" }, { status: 400 })
    }

    const validStatuses: DealStatus[] = [
      "PENDING_FINANCING",
      "FINANCING_CHOSEN",
      "INSURANCE_READY",
      "CONTRACT_PENDING",
      "CONTRACT_PASSED",
      "SIGNED",
      "PICKUP_SCHEDULED",
      "COMPLETED",
      "CANCELLED",
    ]

    if (!validStatuses.includes(deal_status)) {
      return NextResponse.json({ success: false, error: "Invalid deal status" }, { status: 400 })
    }

    const result = await DealService.adminOverrideStatus(
      dealId,
      deal_status,
      cancel_reason || `Admin override to ${deal_status}`,
      session.userId,
    )

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error: any) {
    console.error("Error updating deal status:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 400 })
  }
}
