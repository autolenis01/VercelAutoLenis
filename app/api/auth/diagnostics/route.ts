import { NextResponse, type NextRequest } from "next/server"
import { cookies } from "next/headers"
import { getCookieDomain, shouldUseSecureCookies } from "@/lib/utils/cookies"

/**
 * Auth Diagnostics Endpoint
 * Protected by internal API key header - does not expose secrets
 * Returns diagnostic information about cookie and session configuration
 */
export async function GET(request: NextRequest) {
  // Protect with internal API key or admin session
  const authHeader = request.headers.get("x-internal-key")
  const internalKey = process.env.INTERNAL_API_KEY

  // Only allow access with valid internal key (or no key set for development)
  if (internalKey && authHeader !== internalKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const hostname = request.headers.get("host") || ""
  const cookieStore = await cookies()
  const allCookies = cookieStore.getAll()

  // Get cookie names only (never expose values)
  const cookieNames = allCookies.map((c) => c.name)

  // Determine expected configuration
  const expectedDomain = getCookieDomain(hostname)
  const expectSecure = shouldUseSecureCookies()

  // Check environment
  const envCheck = {
    NODE_ENV: process.env.NODE_ENV,
    hasJwtSecret: !!process.env.JWT_SECRET,
    jwtSecretLength: process.env.JWT_SECRET?.length || 0,
    hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasSupabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    hasSupabaseServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    appUrl: process.env.NEXT_PUBLIC_APP_URL || "(not set)",
    devRedirectUrl: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || "(not set)",
  }

  // Session status
  const hasSessionCookie = cookieNames.includes("session")
  const hasAdminSessionCookie = cookieNames.includes("admin_session")
  const hasAffiliateRef = cookieNames.includes("affiliate_ref")

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    request: {
      hostname,
      protocol: request.url.startsWith("https") ? "https" : "http",
      userAgent: request.headers.get("user-agent")?.substring(0, 100) || "(none)",
    },
    cookies: {
      present: cookieNames,
      hasSession: hasSessionCookie,
      hasAdminSession: hasAdminSessionCookie,
      hasAffiliateRef,
      totalCount: allCookies.length,
    },
    configuration: {
      expectedCookieDomain: expectedDomain || "(none - localhost/preview mode)",
      expectSecureCookies: expectSecure,
      environment: process.env.NODE_ENV,
    },
    environment: envCheck,
    domainAnalysis: {
      isLocalhost: hostname.includes("localhost") || hostname.includes("127.0.0.1"),
      isVercelPreview: hostname.includes(".vercel.app"),
      isV0Preview: hostname.includes(".v0.dev") || hostname.includes("vusercontent.net"),
      isProduction: hostname.includes("autolenis.com"),
      subdomainDetected: hostname.startsWith("admin.") ? "admin" : hostname.startsWith("www.") ? "www" : "none",
    },
    recommendations: generateRecommendations(hostname, cookieNames, envCheck),
  })
}

function generateRecommendations(
  hostname: string,
  cookieNames: string[],
  envCheck: Record<string, any>
): string[] {
  const recommendations: string[] = []

  // JWT Secret check
  if (!envCheck.hasJwtSecret) {
    recommendations.push("CRITICAL: JWT_SECRET is not set. Sessions cannot be created or verified.")
  } else if (envCheck.jwtSecretLength < 32) {
    recommendations.push("WARNING: JWT_SECRET is less than 32 characters. Consider using a longer secret.")
  }

  // Supabase checks
  if (!envCheck.hasSupabaseUrl) {
    recommendations.push("CRITICAL: NEXT_PUBLIC_SUPABASE_URL is not set. Database operations will fail.")
  }
  if (!envCheck.hasSupabaseServiceKey) {
    recommendations.push("WARNING: SUPABASE_SERVICE_ROLE_KEY is not set. Admin operations may fail.")
  }

  // Cookie presence checks
  if (!cookieNames.includes("session")) {
    recommendations.push("INFO: No session cookie present. User is not logged in.")
  }

  // Domain-specific recommendations
  if (hostname.includes("autolenis.com") && !hostname.startsWith("admin.")) {
    if (cookieNames.includes("admin_session")) {
      recommendations.push("INFO: Admin session cookie found on main domain. Consider using admin subdomain.")
    }
  }

  // App URL check
  if (envCheck.appUrl === "(not set)" && envCheck.NODE_ENV === "production") {
    recommendations.push("WARNING: NEXT_PUBLIC_APP_URL not set in production. CORS may not work correctly.")
  }

  if (recommendations.length === 0) {
    recommendations.push("OK: All checks passed. Auth configuration looks healthy.")
  }

  return recommendations
}
