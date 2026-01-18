import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-server"
import { seoService } from "@/lib/services/seo.service"
import { seoPageSchema } from "@/lib/validators/seo.validators"

export async function GET() {
  try {
    const user = await requireAuth(["ADMIN"])
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const pages = await seoService.getAllPages()
    return NextResponse.json({ pages })
  } catch (error) {
    console.error("[v0] Error fetching SEO pages:", error)
    return NextResponse.json({ error: "Failed to fetch pages" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth(["ADMIN"])
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    // Validate input
    const validation = seoPageSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.errors },
        { status: 400 }
      )
    }

    const { pageKey, ...data } = validation.data
    const page = await seoService.updatePageSEO(pageKey, data)

    return NextResponse.json({ success: true, page })
  } catch (error) {
    console.error("[v0] Error creating SEO page:", error)
    return NextResponse.json({ error: "Failed to create page" }, { status: 500 })
  }
}
