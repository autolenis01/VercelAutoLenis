import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-server"
import { seoService } from "@/lib/services/seo.service"
import { seoRedirectSchema, validateNoRedirectLoop } from "@/lib/validators/seo.validators"

/**
 * GET /api/admin/seo/redirects
 * Fetch all redirects (admin view)
 */
export async function GET() {
  try {
    const user = await requireAuth(["ADMIN"])
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const redirects = await seoService.getRedirects()
    return NextResponse.json({ redirects })
  } catch (error) {
    console.error("[API] Error fetching redirects:", error)
    return NextResponse.json({ error: "Failed to fetch redirects" }, { status: 500 })
  }
}

/**
 * POST /api/admin/seo/redirects
 * Create or update a redirect
 */
export async function POST(request: Request) {
  try {
    const user = await requireAuth(["ADMIN"])
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    // Validate input
    const validation = seoRedirectSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.errors },
        { status: 400 }
      )
    }

    const data = validation.data

    // Check for redirect loops
    if (!validateNoRedirectLoop(data.fromPath, data.toPath)) {
      return NextResponse.json({ error: "Redirect loop detected" }, { status: 400 })
    }

    const result = await seoService.upsertRedirect(data, user.email)

    return NextResponse.json({ success: true, redirect: result })
  } catch (error) {
    console.error("[API] Error creating/updating redirect:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to save redirect" },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/seo/redirects
 * Delete a redirect
 */
export async function DELETE(request: Request) {
  try {
    const user = await requireAuth(["ADMIN"])
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Redirect ID is required" }, { status: 400 })
    }

    await seoService.deleteRedirect(id, user.email)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[API] Error deleting redirect:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete redirect" },
      { status: 500 }
    )
  }
}
