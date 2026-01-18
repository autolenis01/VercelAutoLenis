import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-server"
import { seoService } from "@/lib/services/seo.service"

/**
 * POST /api/admin/seo/audit
 * Run a complete SEO audit
 */
export async function POST() {
  try {
    const user = await requireAuth(["ADMIN"])
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const result = await seoService.runAudit()

    return NextResponse.json({ success: true, audit: result })
  } catch (error) {
    console.error("[API] Error running SEO audit:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to run audit" },
      { status: 500 }
    )
  }
}

/**
 * GET /api/admin/seo/audit
 * Get the latest audit results
 */
export async function GET() {
  try {
    const user = await requireAuth(["ADMIN"])
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const audit = await seoService.getLatestAudit()

    return NextResponse.json({ audit })
  } catch (error) {
    console.error("[API] Error fetching audit:", error)
    return NextResponse.json({ error: "Failed to fetch audit" }, { status: 500 })
  }
}
