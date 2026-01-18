import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-server"
import { seoService } from "@/lib/services/seo.service"

/**
 * GET /api/admin/seo/changelog
 * Fetch SEO change log
 */
export async function GET(request: Request) {
  try {
    const user = await requireAuth(["ADMIN"])
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "50", 10)

    const logs = await seoService.getChangeLogs(limit)

    return NextResponse.json({ logs })
  } catch (error) {
    console.error("[API] Error fetching change logs:", error)
    return NextResponse.json({ error: "Failed to fetch change logs" }, { status: 500 })
  }
}
