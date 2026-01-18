import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-server"
import { seoService } from "@/lib/services/seo.service"
import { seoSettingsSchema } from "@/lib/validators/seo.validators"

/**
 * GET /api/admin/seo/settings
 * Fetch all SEO global settings
 */
export async function GET() {
  try {
    const user = await requireAuth(["ADMIN"])
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const settings = await seoService.getGlobalSettings()
    return NextResponse.json({ settings })
  } catch (error) {
    console.error("[API] Error fetching SEO settings:", error)
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
  }
}

/**
 * POST /api/admin/seo/settings
 * Update a global SEO setting
 */
export async function POST(request: Request) {
  try {
    const user = await requireAuth(["ADMIN"])
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    // Validate input
    const validation = seoSettingsSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.errors },
        { status: 400 }
      )
    }

    const { key, value } = validation.data

    const result = await seoService.updateGlobalSettings(key, value, user.email)

    if (!result) {
      return NextResponse.json({ error: "Failed to update setting" }, { status: 500 })
    }

    return NextResponse.json({ success: true, setting: result })
  } catch (error) {
    console.error("[API] Error updating SEO setting:", error)
    return NextResponse.json({ error: "Failed to update setting" }, { status: 500 })
  }
}
