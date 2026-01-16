import { NextResponse } from "next/server"
import { AuthService } from "@/lib/services/auth.service"
import { signUpSchema } from "@/lib/validators/auth"
import { setSessionCookie } from "@/lib/auth-server"
import { getRoleBasedRedirect } from "@/lib/auth"
import { rateLimit, rateLimits } from "@/lib/middleware/rate-limit"
import { handleError, ConflictError } from "@/lib/middleware/error-handler"
import { logger } from "@/lib/logger"

export async function POST(request: Request) {
  logger.info("SignUp request received")

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    logger.error("Missing required environment variables for signup")
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
      logger.error("Failed to parse signup request body", { error: parseError })
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request format",
        },
        { status: 400 },
      )
    }

    logger.debug("Parsing signup request", { email: body.email })

    const validated = signUpSchema.parse(body)
    logger.debug("Signup input validated, calling AuthService")

    const result = await AuthService.signUp(validated)
    logger.info("Sign up successful", { userId: result.user.userId, email: result.user.email })

    const { user, token } = result

    await setSessionCookie(token)
    logger.debug("Session cookie set for signup")

    const redirect = getRoleBasedRedirect(user.role, true)
    logger.debug("Redirecting after signup", { redirect, role: user.role })

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.userId,
          email: user.email,
          role: user.role,
        },
        redirect,
      },
    })
  } catch (error: any) {
    if (error.message?.includes("already exists")) {
      return handleError(new ConflictError("An account with this email already exists"))
    }
    return handleError(error)
  }
}
