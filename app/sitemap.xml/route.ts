import { NextResponse } from "next/server"
import { seoService } from "@/lib/services/seo.service"

export const dynamic = "force-dynamic" // CRITICAL: prevent static generation

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
    console.error("[Sitemap] Error generating sitemap:", error)

    // Safe fallback: return minimal sitemap
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://autolenis.com"
    const minimalSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`

    return new NextResponse(minimalSitemap, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=300, s-maxage=300", // Shorter cache for fallback
      },
    })
  }
}
