import { type NextRequest, NextResponse } from "next/server"
import { affiliateService } from "@/lib/services/affiliate.service"
import { validateCronRequest } from "@/lib/middleware/cron-security"

export async function GET(_request: NextRequest) {
  try {
    const securityCheck = await validateCronRequest(request)
    if (securityCheck) {
      return securityCheck
    }

    const results = await affiliateService.runReconciliation()

    return NextResponse.json({
      success: true,
      results,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[Affiliate Reconciliation Cron] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(_request: NextRequest) {
  return GET(request)
}
