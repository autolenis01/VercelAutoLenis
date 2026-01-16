import { type NextRequest, NextResponse } from "next/server"
import { getSessionUser } from "@/lib/auth-server"
import { adminService } from "@/lib/services/admin.service"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const user = await getSessionUser()
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get("search") || undefined
    const status = (searchParams.get("status") as any) || "all"
    const page = Number.parseInt(searchParams.get("page") || "1")

    const result = await adminService.getAllDealers({ search, status, page })
    return NextResponse.json(result)
  } catch (error) {
    console.error("[Admin Dealers Error]", error)
    return NextResponse.json({ error: "Failed to load dealers" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser()
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

  const { action, dealerId, reason } = await request.json()

  if (action === "approve") {
    const result = await adminService.approveDealer(dealerId, user.userId)
    return NextResponse.json(result)
  } else if (action === "suspend") {
    const result = await adminService.suspendDealer(dealerId, reason, user.userId)
    return NextResponse.json(result)
  }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("[Admin Dealers Action Error]", error)
    return NextResponse.json({ error: "Failed to process action" }, { status: 500 })
  }
}
