import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-server"
import { InsuranceService } from "@/lib/services/insurance.service"

export async function POST(request: Request, { params }: { params: Promise<{ dealId: string }> }) {
  try {
    const session = await requireAuth(["BUYER"])
    const { dealId } = await params
    const body = await request.json().catch((err) => {
      console.error("[v0] Failed to parse request body:", err)
      return {}
    })

    const { coverage_preferences } = body

    const quotes = await InsuranceService.requestQuotes(
      session.userId,
      dealId,
      coverage_preferences
        ? {
            liabilityLimits: coverage_preferences.liability_limits,
            collisionDeductibleCents: coverage_preferences.collision_deductible_cents,
            comprehensiveDeductibleCents: coverage_preferences.comprehensive_deductible_cents,
          }
        : undefined,
    )

    return NextResponse.json({
      success: true,
      data: { quotes },
    })
  } catch (error: any) {
    console.error("[v0] Error requesting insurance quotes:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 400 })
  }
}
