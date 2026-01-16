import { NextResponse } from "next/server"
import { AuthService } from "@/lib/services/auth.service"
import { signInSchema } from "@/lib/validators/auth"
import { setSessionCookie } from "@/lib/auth-server"
import { getRoleBasedRedirect } from "@/lib/auth"
import { rateLimit, rateLimits } from "@/lib/middleware/rate-limit"
import { handleError, AuthenticationError } from "@/lib/middleware/error-handler"
import { logger } from "@/lib/logger"

export async function POST(request: Request) {
  logger.info("SignIn request received")

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    logger.error("Missing required environment variables for signin")
    return NextResponse.json(
      {
        success: false,
        error: "Server configuration error. Please contact support.",
      },
      { status: 503 },
    )
  }

  try {
    const rateLimitResponse = await rateLimit(request as any, rateLimits.auth)
    if (rateLimitResponse) {
      return rateLimitResponse
    }

    let body
    try {
      body = await request.json()
    } catch (parseError) {
      logger.error("Failed to parse signin request body", { error: parseError })
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request format",
        },
        { status: 400 },
      )
    }

    logger.debug("Parsing signin request", { email: body.email })

    const validated = signInSchema.parse(body)
    logger.debug("Signin input validated, calling AuthService")

    const result = await AuthService.signIn(validated)
    logger.info("Sign in successful", { userId: result.user.id, email: result.user.email })

    const { user, token } = result

    await setSessionCookie(token)
    logger.debug("Session cookie set for signin")

    const redirect = getRoleBasedRedirect(user.role)
    logger.debug("Redirecting after signin", { redirect, role: user.role })

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        redirect,
      },
    })
  } catch (error: any) {
    if (error.message?.includes("Invalid") || error.message?.includes("not found")) {
      return handleError(new AuthenticationError("Invalid email or password"))
    }
    return handleError(error)
  }
}
