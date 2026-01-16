import { NextResponse } from "next/server"
import { getSessionUser } from "@/lib/auth-server"
import { adminService } from "@/lib/services/admin.service"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const user = await getSessionUser()
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const [stats, funnel, topDealers, topAffiliates] = await Promise.all([
      adminService.getDashboardStats(),
      adminService.getFunnelData(),
      adminService.getTopDealers(5),
      adminService.getTopAffiliates(5),
    ])

    return NextResponse.json({ stats, funnel, topDealers, topAffiliates })
  } catch (error) {
    console.error("[Admin Dashboard Error]", error)
    return NextResponse.json({ error: "Failed to load dashboard" }, { status: 500 })
  }
}
