import { NextResponse } from "next/server"
import { getSessionUser, clearSession } from "@/lib/auth-server"
import { buildClearCookieHeader } from "@/lib/utils/cookies"

export async function POST(request: Request) {
  const hostname = request.headers.get("host") || undefined

  try {
    const user = await getSessionUser()
    const userRole = user?.role || "BUYER"

    // Clear the session with proper domain handling
    await clearSession(hostname)

    // Build proper Set-Cookie header for cross-domain logout
    const clearCookieHeader = buildClearCookieHeader("session", hostname)

    return NextResponse.json(
      {
        success: true,
        message: "Signed out successfully",
        role: userRole,
        redirect: getRoleRedirectUrl(userRole),
      },
      {
        headers: {
          "Set-Cookie": clearCookieHeader,
        },
      },
    )
  } catch (error) {
    console.error("[SignOut API] Error:", error)
    
    // Build proper Set-Cookie header even on error
    const clearCookieHeader = buildClearCookieHeader("session", hostname)

    // Even on error, return success so user can be redirected
    return NextResponse.json(
      {
        success: true,
        message: "Signed out",
        role: "BUYER",
        redirect: "/",
      },
      {
        headers: {
          "Set-Cookie": clearCookieHeader,
        },
      },
    )
  }
}

export async function GET(request: Request) {
  const hostname = request.headers.get("host") || undefined

  try {
    const user = await getSessionUser()
    const userRole = user?.role || "BUYER"

    await clearSession(hostname)

    const redirectUrl = getRoleRedirectUrl(userRole)
    
    // Build proper Set-Cookie header for cross-domain logout
    const clearCookieHeader = buildClearCookieHeader("session", hostname)
    
    const response = NextResponse.redirect(new URL(redirectUrl, request.url))
    response.headers.set("Set-Cookie", clearCookieHeader)
    return response
  } catch (error) {
    console.error("[SignOut API] Error:", error)
    
    const clearCookieHeader = buildClearCookieHeader("session", hostname)
    const response = NextResponse.redirect(new URL("/", request.url))
    response.headers.set("Set-Cookie", clearCookieHeader)
    return response
  }
}

function getRoleRedirectUrl(role: string): string {
  switch (role) {
    case "AFFILIATE":
    case "AFFILIATE_ONLY":
      return "/affiliate"
    case "DEALER":
    case "DEALER_USER":
      return "/for-dealers"
    case "ADMIN":
    case "SUPER_ADMIN":
      return "/admin/sign-in"
    case "BUYER":
    default:
      return "/"
  }
}
