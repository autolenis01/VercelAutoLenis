import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// In-memory cache for redirects with TTL
interface RedirectCacheEntry {
  redirects: Array<{
    id: string
    fromPath: string
    toPath: string
    statusCode: number
    isWildcard: boolean
  }>
  timestamp: number
}

let redirectCache: RedirectCacheEntry | null = null
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

/**
 * Fetch redirects from database with caching
 */
async function getRedirects() {
  const now = Date.now()

  // Return cached redirects if still valid
  if (redirectCache && now - redirectCache.timestamp < CACHE_TTL) {
    return redirectCache.redirects
  }

  try {
    // Fetch from API
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL || "http://localhost:3000"
    const apiUrl = `${baseUrl.startsWith("http") ? baseUrl : `https://${baseUrl}`}/api/seo/redirects`

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // Use short timeout to avoid blocking middleware
      signal: AbortSignal.timeout(2000),
    })

    if (!response.ok) {
      console.error("[Middleware] Failed to fetch redirects:", response.status)
      return []
    }

    const data = await response.json()
    const redirects = data.redirects || []

    // Update cache
    redirectCache = {
      redirects,
      timestamp: now,
    }

    return redirects
  } catch (error) {
    console.error("[Middleware] Error fetching redirects:", error)
    // Return cached redirects even if expired, better than nothing
    return redirectCache?.redirects || []
  }
}

/**
 * Match a path against a wildcard pattern
 * Supports: /path/* and /path/:param
 */
function matchWildcard(pattern: string, path: string): { match: boolean; toPath?: string } {
  // Exact match
  if (pattern === path) {
    return { match: true }
  }

  // Wildcard match: /path/*
  if (pattern.endsWith("/*")) {
    const basePattern = pattern.slice(0, -2)
    if (path.startsWith(basePattern)) {
      return { match: true }
    }
  }

  // Parameter match: /path/:param
  if (pattern.includes(":")) {
    const patternParts = pattern.split("/")
    const pathParts = path.split("/")

    if (patternParts.length !== pathParts.length) {
      return { match: false }
    }

    const params: Record<string, string> = {}
    let matches = true

    for (let i = 0; i < patternParts.length; i++) {
      const patternPart = patternParts[i]
      const pathPart = pathParts[i]

      if (patternPart.startsWith(":")) {
        // Capture parameter
        const paramName = patternPart.slice(1)
        params[paramName] = pathPart
      } else if (patternPart !== pathPart) {
        matches = false
        break
      }
    }

    return { match: matches }
  }

  return { match: false }
}

/**
 * Find matching redirect for a given path
 */
function findRedirect(
  path: string,
  redirects: Array<{
    id: string
    fromPath: string
    toPath: string
    statusCode: number
    isWildcard: boolean
  }>
): { toPath: string; statusCode: number } | null {
  for (const redirect of redirects) {
    if (redirect.isWildcard) {
      const { match } = matchWildcard(redirect.fromPath, path)
      if (match) {
        // For wildcard redirects, preserve the suffix
        let toPath = redirect.toPath
        if (redirect.fromPath.endsWith("/*") && redirect.toPath.endsWith("/*")) {
          const suffix = path.slice(redirect.fromPath.length - 2)
          toPath = redirect.toPath.slice(0, -2) + suffix
        }
        return { toPath, statusCode: redirect.statusCode }
      }
    } else {
      // Exact match
      if (redirect.fromPath === path) {
        return { toPath: redirect.toPath, statusCode: redirect.statusCode }
      }
    }
  }

  return null
}

/**
 * Detect redirect loops
 */
const redirectHistory = new Map<string, number>()
const MAX_REDIRECT_CHAIN = 5
const HISTORY_CLEANUP_INTERVAL = 60000 // 1 minute

// Cleanup old entries periodically
setInterval(() => {
  redirectHistory.clear()
}, HISTORY_CLEANUP_INTERVAL)

function hasRedirectLoop(path: string): boolean {
  const count = redirectHistory.get(path) || 0
  if (count >= MAX_REDIRECT_CHAIN) {
    return true
  }
  redirectHistory.set(path, count + 1)
  return false
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for static files, API routes, and special Next.js paths
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/static/") ||
    pathname.includes(".") // Files with extensions
  ) {
    return NextResponse.next()
  }

  try {
    // Check for redirect loops
    if (hasRedirectLoop(pathname)) {
      console.error("[Middleware] Redirect loop detected for:", pathname)
      return NextResponse.next()
    }

    // Get redirects from cache or database
    const redirects = await getRedirects()

    // Find matching redirect
    const redirect = findRedirect(pathname, redirects)

    if (redirect) {
      const { toPath, statusCode } = redirect

      // Build the redirect URL
      const url = request.nextUrl.clone()

      // Check if toPath is a full URL or relative path
      if (toPath.startsWith("http")) {
        return NextResponse.redirect(toPath, statusCode)
      } else {
        url.pathname = toPath
        return NextResponse.redirect(url, statusCode)
      }
    }
  } catch (error) {
    console.error("[Middleware] Error processing redirects:", error)
    // Continue to the page on error
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (e.g., images, fonts)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|robots.txt|sitemap.xml).*)",
  ],
}
