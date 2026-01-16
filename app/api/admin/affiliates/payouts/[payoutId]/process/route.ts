import { type NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-server"
import { affiliateService } from "@/lib/services/affiliate.service"

// POST - Mark a payout as processed/paid
export async function POST(_request: NextRequest, { params }: { params: Promise<{ payoutId: string }> }) {
  try {
    const session = await requireAuth()
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { payoutId } = await params
    const body = await request.json()
    const { providerRef } = body

    if (!providerRef) {
      return NextResponse.json({ error: "Missing providerRef" }, { status: 400 })
    }

    const payout = await affiliateService.processPayout(payoutId, providerRef)

    return NextResponse.json({
      success: true,
      payout: {
        id: payout.id,
        status: "COMPLETED",
        providerRef,
      },
    })
  } catch (error: any) {
    console.error("[Admin Process Payout API] Error:", error)
    return NextResponse.json(
      {
        error: error.message || "Internal server error",
      },
      { status: 400 },
    )
  }
}
