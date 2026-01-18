import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifySessionEdge } from "@/lib/auth-edge"

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
async function getRedirects(request: NextRequest) {
  const now = Date.now()

  // Return cached redirects if still valid
  if (redirectCache && now - redirectCache.timestamp < CACHE_TTL) {
    return redirectCache.redirects
  }

  try {
    // Fetch from API
    const apiUrl = `${request.nextUrl.origin}/api/seo/redirects`

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // Use short timeout to avoid blocking middleware
      signal: AbortSignal.timeout(2000),
    })

    if (!response.ok) {
      console.error("[Proxy] Failed to fetch redirects:", response.status)
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
    console.error("[Proxy] Error fetching redirects:", error)
    // Return cached redirects even if expired, better than nothing
    return redirectCache?.redirects || []
  }
}

/**
 * Match a path against a wildcard pattern
 * Supports: /path/* and /path/:param
 */
function matchWildcard(pattern: string, path: string): { match: boolean } {
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

    let matches = true

    for (let i = 0; i < patternParts.length; i++) {
      const patternPart = patternParts[i]
      const pathPart = pathParts[i]

      if (patternPart.startsWith(":")) {
        // Capture parameter - continue
        continue
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
 * Detect redirect loops with per-request tracking
 */
function hasRedirectLoop(path: string, requestId: string): boolean {
  const key = `${requestId}:${path}`
  const count = redirectHistory.get(key) || 0
  
  if (count >= MAX_REDIRECT_CHAIN) {
    // Clean up this request's history
    for (const [k] of redirectHistory) {
      if (k.startsWith(`${requestId}:`)) {
        redirectHistory.delete(k)
      }
    }
    return true
  }
  
  redirectHistory.set(key, count + 1)
  
  // Clean up this request's history after 1 minute to prevent memory leaks
  setTimeout(() => {
    redirectHistory.delete(key)
  }, 60000)

  return false
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Generate unique request ID for loop tracking
  const requestId = crypto.randomUUID()

  // Check for SEO redirects first (before any other logic)
  // Skip for static files, API routes, and special Next.js paths
  if (
    !pathname.startsWith("/_next/") &&
    !pathname.startsWith("/api/") &&
    !pathname.startsWith("/static/") &&
    !pathname.includes(".") // Files with extensions
  ) {
    try {
      // Check for redirect loops with per-request tracking
      if (!hasRedirectLoop(pathname, requestId)) {
        // Get redirects from cache or database
        const redirects = await getRedirects(request)

        // Find matching redirect
        const redirect = findRedirect(pathname, redirects)

        if (redirect) {
          const { toPath, statusCode } = redirect

          // Build the redirect URL
          // Check if toPath is a full URL or relative path
          if (toPath.startsWith("http")) {
            return NextResponse.redirect(toPath, statusCode)
          } else {
            const url = request.nextUrl.clone()
            url.pathname = toPath
            return NextResponse.redirect(url, statusCode)
          }
        }
      }
    } catch (error) {
      console.error("[Proxy] Error processing redirects:", error)
      // Continue to the rest of the proxy logic on error
    }
  }

  // Original affiliate ref logic
  const ref = request.nextUrl.searchParams.get("ref")
  if (ref && request.nextUrl.pathname === "/") {
    const response = NextResponse.next()
    response.cookies.set("affiliate_ref", ref, {
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    })

    // Track click asynchronously with proper error handling
    fetch(`${request.nextUrl.origin}/api/affiliate/click`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: ref }),
    }).catch((err) => {
      console.error("[v0] Failed to track affiliate click:", err)
    })

    return response
  }

  const hostname = request.headers.get("host") || ""

  if (hostname.startsWith("admin.") && !pathname.startsWith("/admin")) {
    const adminUrl = new URL(`/admin${pathname === "/" ? "/dashboard" : pathname}`, request.url)
    return NextResponse.rewrite(adminUrl)
  }

  if (
    process.env.NODE_ENV === "production" &&
    !hostname.startsWith("admin.") &&
    pathname.startsWith("/admin") &&
    !pathname.startsWith("/admin/sign-in") &&
    !pathname.startsWith("/admin/signup") &&
    !pathname.startsWith("/admin/mfa")
  ) {
    const adminSubdomain = hostname.replace(/^(www\.)?/, "admin.")
    const redirectUrl = new URL(pathname.replace("/admin", ""), `https://${adminSubdomain}`)
    redirectUrl.search = request.nextUrl.search
    return NextResponse.redirect(redirectUrl)
  }

  const adminPublicRoutes = [
    "/admin/sign-in",
    "/admin/signup",
    "/admin/mfa/enroll",
    "/admin/mfa/challenge",
    "/admin/login",
  ]
  const isAdminPublicRoute = adminPublicRoutes.some((route) => pathname === route || pathname.startsWith(route + "/"))

  const publicRoutes = [
    "/",
    "/how-it-works",
    "/pricing",
    "/contact",
    "/dealer-application",
    "/affiliate",
    "/refinance",
    "/auth",
    "/legal",
    "/about",
    "/privacy",
    "/terms",
    "/faq",
    "/contract-shield",
    "/insurance",
    "/for-dealers",
    "/ref",
  ]
  const isPublicRoute =
    publicRoutes.some((route) => pathname === route || pathname.startsWith(route + "/")) || isAdminPublicRoute

  if (isPublicRoute || pathname.startsWith("/api/") || pathname.startsWith("/_next/")) {
    const response = NextResponse.next()
    response.headers.set("x-pathname", pathname)
    return response
  }

  const token = request.cookies.get("session")?.value

  if (!token) {
    if (pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/admin/sign-in", request.url))
    }
    const signinUrl = new URL("/auth/signin", request.url)
    signinUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(signinUrl)
  }

  try {
    const session = await verifySessionEdge(token)

    const response = NextResponse.next()
    response.headers.set("x-pathname", pathname)

    // Role-based access control
    if (pathname.startsWith("/buyer") && session.role !== "BUYER") {
      return NextResponse.redirect(new URL(getRoleRedirect(session.role), request.url))
    }

    if (pathname.startsWith("/dealer") && !["DEALER", "DEALER_USER"].includes(session.role)) {
      return NextResponse.redirect(new URL(getRoleRedirect(session.role), request.url))
    }

    if (pathname.startsWith("/admin")) {
      if (!["ADMIN", "SUPER_ADMIN"].includes(session.role)) {
        // Non-admin trying to access admin routes - redirect to access denied
        return NextResponse.redirect(new URL("/auth/access-denied", request.url))
      }
    }

    if (pathname.startsWith("/affiliate/portal")) {
      const isAffiliate =
        session.role === "AFFILIATE" ||
        session.role === "AFFILIATE_ONLY" ||
        (session.role === "BUYER" && session.is_affiliate === true)

      if (!isAffiliate) {
        return NextResponse.redirect(new URL("/affiliate?signin=required", request.url))
      }
    }

    return response
  } catch (error) {
    // Invalid or expired token - redirect to signin
    if (pathname.startsWith("/admin")) {
      const response = NextResponse.redirect(new URL("/admin/sign-in", request.url))
      response.cookies.delete("session")
      response.cookies.delete("admin_session")
      return response
    }

    const signinUrl = new URL("/auth/signin", request.url)
    signinUrl.searchParams.set("redirect", pathname)
    const response = NextResponse.redirect(signinUrl)
    response.cookies.delete("session")
    return response
  }
}

function getRoleRedirect(role: string): string {
  switch (role) {
    case "BUYER":
      return "/buyer/dashboard"
    case "DEALER":
    case "DEALER_USER":
      return "/dealer/dashboard"
    case "ADMIN":
    case "SUPER_ADMIN":
      return "/admin/dashboard"
    case "AFFILIATE":
    case "AFFILIATE_ONLY":
      return "/affiliate/portal/dashboard"
    default:
      return "/"
  }
}

export const middleware = proxy

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images|.*\\..*).*)"],
}
