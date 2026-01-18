import { SignJWT, jwtVerify } from "jose"
import type { UserRole } from "./types"
import { logger } from "./logger"

const jwtSecretString = process.env.JWT_SECRET
// Only error in true production (not preview)
if (!jwtSecretString && process.env.VERCEL_ENV === "production") {
  logger.error("JWT_SECRET is not configured in production!")
}

const JWT_SECRET = new TextEncoder().encode(jwtSecretString || "your-secret-key-change-in-production")

export interface SessionUser {
  userId: string
  email: string
  role: UserRole
  is_affiliate?: boolean
}

export async function createSession(user: {
  userId?: string
  id?: string
  email: string
  role: string
  is_affiliate?: boolean
}): Promise<string> {
  const userId = user.userId || user.id
  if (!userId) {
    throw new Error("User ID is required for session creation")
  }

  logger.info("Creating session", { userId, role: user.role })

  const token = await new SignJWT({
    userId,
    email: user.email,
    role: user.role,
    is_affiliate: user.is_affiliate || false,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET)

  logger.debug("Session token created successfully")
  return token
}

export async function verifySession(token: string): Promise<SessionUser> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as SessionUser
  } catch (error: any) {
    logger.error("Session verification failed", { error: error.message })
    throw error
  }
}

export function getRoleBasedRedirect(role: string, isNewUser = false): string {
  if (isNewUser) {
    switch (role) {
      case "BUYER":
        return "/buyer/onboarding"
      case "DEALER":
      case "DEALER_USER":
        return "/dealer/onboarding"
      case "AFFILIATE":
      case "AFFILIATE_ONLY":
        return "/affiliate/portal/onboarding"
      case "ADMIN":
      case "SUPER_ADMIN":
        return "/admin/dashboard"
      default:
        return "/"
    }
  }

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

export function getRoleSignInPage(role?: string): string {
  switch (role) {
    case "ADMIN":
    case "SUPER_ADMIN":
      return "/admin/sign-in"
    default:
      return "/auth/signin"
  }
}
