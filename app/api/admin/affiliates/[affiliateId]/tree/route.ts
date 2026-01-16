import { type NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-server"
import { affiliateService } from "@/lib/services/affiliate.service"

export async function GET(_request: NextRequest, { params }: { params: Promise<{ affiliateId: string }> }) {
  try {
    const session = await requireAuth()
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { affiliateId } = await params

    const tree = await affiliateService.getAffiliateTree(affiliateId)

    return NextResponse.json(tree)
  } catch (error) {
    console.error("[Admin Affiliate Tree API] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
