import type { Metadata } from "next"
import { seoService } from "@/lib/services/seo.service"

interface ResolveMetadataOptions {
  pageKey: string
  fallbackTitle?: string
  fallbackDescription?: string
}

/**
 * Runtime metadata resolver that fetches SEO data from database
 * and returns Next.js Metadata object
 */
export async function resolveMetadata(options: ResolveMetadataOptions): Promise<Metadata> {
  const { pageKey, fallbackTitle, fallbackDescription } = options

  try {
    // Fetch SEO data from database
    const seoData = await seoService.getPageSEO(pageKey)
    const globalSettings = await seoService.getGlobalSettings()

    const baseUrl = (globalSettings.canonicalBase as string) || process.env.NEXT_PUBLIC_APP_URL || "https://autolenis.com"
    const siteName = (globalSettings.siteName as string) || "AutoLenis"
    const defaultOgImage = (globalSettings.defaultOgImage as string) || "/og-image.png"

    // Use database values or fallbacks
    const title = seoData?.title || fallbackTitle || siteName
    const description = seoData?.description || fallbackDescription || (globalSettings.defaultDescription as string) || ""
    const canonicalUrl = seoData?.canonicalUrl || `${baseUrl}/${pageKey === "home" ? "" : pageKey}`

    // Determine robots behavior
    let robots: Metadata["robots"]
    if (seoData?.robotsRule) {
      const [index, follow] = seoData.robotsRule.split(",")
      robots = {
        index: index === "index",
        follow: follow === "follow",
      }
    } else {
      // Default for production
      robots = {
        index: seoData?.indexable !== false,
        follow: true,
      }
    }

    // Build metadata object
    const metadata: Metadata = {
      title,
      description,
      robots,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        type: "website",
        locale: "en_US",
        url: canonicalUrl,
        siteName,
        title: seoData?.ogTitle || title,
        description: seoData?.ogDescription || description,
        images: seoData?.ogImageUrl
          ? [
              {
                url: seoData.ogImageUrl,
                width: 1200,
                height: 630,
                alt: seoData.ogTitle || title,
              },
            ]
          : [
              {
                url: defaultOgImage,
                width: 1200,
                height: 630,
                alt: title,
              },
            ],
      },
      twitter: {
        card: "summary_large_image",
        title: seoData?.ogTitle || title,
        description: seoData?.ogDescription || description,
        images: seoData?.ogImageUrl ? [seoData.ogImageUrl] : [defaultOgImage],
      },
    }

    // Add keywords if available
    if (seoData?.keywords) {
      metadata.keywords = seoData.keywords.split(",").map((k) => k.trim())
    }

    return metadata
  } catch (error) {
    console.error("[SEO] Error resolving metadata for", pageKey, error)

    // Return safe fallback metadata
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://autolenis.com"
    return {
      title: fallbackTitle || "AutoLenis",
      description: fallbackDescription || "Transparent car buying platform",
      robots: {
        index: true,
        follow: true,
      },
      alternates: {
        canonical: `${baseUrl}/${pageKey === "home" ? "" : pageKey}`,
      },
    }
  }
}

/**
 * Generate JSON-LD structured data for a page
 */
export async function resolveStructuredData(pageKey: string): Promise<Record<string, unknown>[]> {
  try {
    const schemas = await seoService.getPageSchema(pageKey)

    if (!schemas || schemas.length === 0) {
      return []
    }

    return schemas.map((schema) => ({
      "@context": "https://schema.org",
      "@type": schema.schemaType,
      ...schema.schemaJson,
    }))
  } catch (error) {
    console.error("[SEO] Error resolving structured data for", pageKey, error)
    return []
  }
}
