import { NextResponse } from "next/server"
import { seoService } from "@/lib/services/seo.service"

export const dynamic = "force-dynamic" // CRITICAL: prevent static generation

export async function GET() {
  try {
    const robotsTxt = await seoService.generateRobotsTxt()

    return new NextResponse(robotsTxt, {
      headers: {
        "Content-Type": "text/plain",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    })
  } catch (error) {
    console.error("[v0] Error generating robots.txt:", error)
    return new NextResponse("Error generating robots.txt", { status: 500 })
  }
}
