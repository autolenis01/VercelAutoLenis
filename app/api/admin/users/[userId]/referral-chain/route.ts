import { type NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-server"
import { affiliateService } from "@/lib/services/affiliate.service"

export async function GET(request: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const session = await requireAuth()
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { userId } = await params

    const chain = await affiliateService.getUserReferralChain(userId)

    return NextResponse.json(chain)
  } catch (error) {
    console.error("[Admin User Referral Chain API] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
