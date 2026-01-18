import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifySessionEdge } from "@/lib/auth-edge"

export async function proxy(request: NextRequest) {
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

  const { pathname } = request.nextUrl
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
