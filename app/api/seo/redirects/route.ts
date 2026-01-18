import { NextResponse } from "next/server"
import { seoService } from "@/lib/services/seo.service"

/**
 * Public endpoint for middleware to fetch redirects
 * No auth required for performance (middleware needs fast access)
 */
export async function GET() {
  try {
    const redirects = await seoService.getRedirects()

    return NextResponse.json(
      { redirects },
      {
        headers: {
          // Cache for 5 minutes
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    )
  } catch (error) {
    console.error("[API] Error fetching redirects:", error)
    return NextResponse.json({ error: "Failed to fetch redirects", redirects: [] }, { status: 500 })
  }
}
