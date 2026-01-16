import { NextResponse } from "next/server"
import { getAdminUser, logAdminAction } from "@/lib/admin-auth"
import { verifyPassword, setSessionCookie } from "@/lib/auth-server"
import { createSession } from "@/lib/auth"
import { rateLimit, rateLimits } from "@/lib/middleware/rate-limit"
import { handleError, AuthenticationError, ValidationError } from "@/lib/middleware/error-handler"

export async function POST(request: Request) {
  try {
    const rateLimitResponse = await rateLimit(request as any, rateLimits.strict)
    if (rateLimitResponse) {
      return rateLimitResponse
    }

    const { email, password } = await request.json()

    if (!email || !password) {
      throw new ValidationError("Email and password are required")
    }

    const identifier = email.toLowerCase()

    const user = await getAdminUser(identifier)
    if (!user) {
      await logAdminAction("LOGIN_FAILED", { email: identifier, reason: "user_not_found" })
      throw new AuthenticationError("Invalid credentials")
    }

    const passwordValid = await verifyPassword(password, user.passwordHash)
    if (!passwordValid) {
      await logAdminAction("LOGIN_FAILED", { email: identifier, reason: "invalid_password" })
      throw new AuthenticationError("Invalid credentials")
    }

    const token = await createSession({
      userId: user.id,
      email: user.email,
      role: user.role,
    })
    await setSessionCookie(token)

    await logAdminAction("LOGIN_SUCCESS", { email: identifier, userId: user.id })

    return NextResponse.json({
      success: true,
      redirect: "/admin/dashboard",
    })
  } catch (error) {
    return handleError(error)
  }
}
