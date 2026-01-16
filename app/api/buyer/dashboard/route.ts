import { NextResponse } from "next/server"
import { getSessionUser } from "@/lib/auth-server"
import { buyerService } from "@/lib/services/buyer.service"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const user = await getSessionUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const dashboardData = await buyerService.getDashboardData(user.userId)

    return NextResponse.json(dashboardData)
  } catch (error) {
    console.error("Dashboard API error:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 })
  }
}
