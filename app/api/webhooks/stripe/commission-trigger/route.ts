import { type NextRequest, NextResponse } from "next/server"
import { affiliateService } from "@/lib/services/affiliate.service"

// This can be called from Stripe webhook or internal payment completion
export async function POST(request: NextRequest) {
  try {
    // Verify internal API key or Stripe signature
    const authHeader = request.headers.get("x-api-key")
    const expectedKey = process.env["CRON_SECRET"] || process.env.INTERNAL_API_KEY

    if (authHeader !== expectedKey) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { serviceFeePaymentId, action } = body

    if (!serviceFeePaymentId) {
      return NextResponse.json({ error: "Missing serviceFeePaymentId" }, { status: 400 })
    }

    if (action === "REFUND") {
      // Cancel commissions on refund
      const cancelledCount = await affiliateService.cancelCommissionsForPayment(serviceFeePaymentId, "Payment refunded")
      return NextResponse.json({
        success: true,
        action: "CANCELLED",
        cancelledCount,
      })
    }

    // Create commissions for paid service fee
    const result = await affiliateService.createCommissionsForPayment(serviceFeePaymentId)

    return NextResponse.json({
      success: result.created,
      reason: result.reason,
      commissionsCreated: result.commissions?.length || 0,
    })
  } catch (error) {
    console.error("[Commission Trigger API] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
