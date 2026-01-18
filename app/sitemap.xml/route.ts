import { NextResponse } from "next/server"
import { seoService } from "@/lib/services/seo.service"

export async function GET() {
  try {
    const urls = await seoService.generateSitemap()

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`

    return new NextResponse(sitemap, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    })
  } catch (error) {
    console.error("[v0] Error generating sitemap:", error)
    return new NextResponse("Error generating sitemap", { status: 500 })
  }
}
