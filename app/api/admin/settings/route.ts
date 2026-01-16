import { type NextRequest, NextResponse } from "next/server"
import { getSessionUser } from "@/lib/auth-server"
import { adminService } from "@/lib/services/admin.service"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const user = await getSessionUser()
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const settings = await adminService.getSystemSettings()
    return NextResponse.json(settings)
  } catch (error) {
    console.error("[Admin Settings Error]", error)
    return NextResponse.json({ error: "Failed to load settings" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser()
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { key, value } = await request.json()
    const result = await adminService.updateSystemSettings(key, value, user.userId)
    return NextResponse.json(result)
  } catch (error) {
    console.error("[Admin Settings Update Error]", error)
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
  }
}
