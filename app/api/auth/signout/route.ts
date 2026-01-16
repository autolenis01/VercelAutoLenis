import { NextResponse } from "next/server"
import { getSessionUser, clearSession } from "@/lib/auth-server"

export async function POST(request: Request) {
  try {
    const user = await getSessionUser()
    const userRole = user?.role || "BUYER"

    // Clear the session
    await clearSession()

    return NextResponse.json(
      {
        success: true,
        message: "Signed out successfully",
        role: userRole,
      },
      {
        // Clear the session cookie in the response
        headers: {
          "Set-Cookie": "session=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax",
        },
      },
    )
  } catch (error) {
    console.error("[SignOut API] Error:", error)
    // Even on error, return success so user can be redirected
    return NextResponse.json(
      {
        success: true,
        message: "Signed out",
        role: "BUYER",
      },
      {
        headers: {
          "Set-Cookie": "session=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax",
        },
      },
    )
  }
}

export async function GET(request: Request) {
  try {
    const user = await getSessionUser()
    const userRole = user?.role || "BUYER"

    await clearSession()

    const redirectUrl = getRoleRedirectUrl(userRole)
    return NextResponse.redirect(new URL(redirectUrl, request.url))
  } catch (error) {
    console.error("[SignOut API] Error:", error)
    return NextResponse.redirect(new URL("/", request.url))
  }
}

function getRoleRedirectUrl(role: string): string {
  switch (role) {
    case "AFFILIATE":
      return "/affiliate"
    case "DEALER":
    case "DEALER_USER":
      return "/for-dealers"
    case "ADMIN":
      return "/"
    case "BUYER":
    default:
      return "/"
  }
}
