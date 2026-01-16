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
    const page = Number.parseInt(searchParams.get("page") || "1")

    const result = await adminService.getAllBuyers({ search, page })
    return NextResponse.json(result)
  } catch (error) {
    console.error("[Admin Buyers Error]", error)
    return NextResponse.json({ error: "Failed to load buyers" }, { status: 500 })
  }
}
