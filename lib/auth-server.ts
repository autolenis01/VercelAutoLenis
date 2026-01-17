// Server-side auth utilities - Only use in Server Components, Route Handlers, and Server Actions
import { cookies } from "next/headers"
import { verifySession, type SessionUser } from "./auth"
import bcrypt from "bcryptjs"
import { logger } from "./logger"

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("session")?.value

  if (!token) {
    logger.debug("No session token found in cookies")
    return null
  }

  try {
    const session = await verifySession(token)
    logger.debug("Session verified", { userId: session.userId })
    return session
  } catch (error: any) {
    logger.error("Session verification failed", { error: error.message })
    return null
  }
}

export async function getSessionUser(): Promise<SessionUser | null> {
  try {
    const session = await getSession()
    return session
  } catch (error) {
    return null
  }
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies()

  logger.debug("Setting session cookie")

  cookieStore.set("session", token, {
    httpOnly: true,
    secure: process.env["NODE_ENV"] === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  })

  logger.debug("Session cookie set successfully")
}

export async function clearSession() {
  const cookieStore = await cookies()
  cookieStore.delete("session")
}

export async function requireAuth(allowedRoles?: string[]): Promise<SessionUser> {
  const session = await getSession()

  if (!session) {
    // Return a more structured error that APIs can catch
    const error = new Error("Unauthorized") as Error & { statusCode: number }
    error.statusCode = 401
    throw error
  }

  if (allowedRoles && !allowedRoles.includes(session.role)) {
    // Return a more structured error for forbidden access
    const error = new Error("Forbidden") as Error & { statusCode: number }
    error.statusCode = 403
    throw error
  }

  return session
}

export async function getCurrentUser() {
  try {
    const session = await getSession()

    if (!session) {
      return null
    }

    return {
      id: session.userId,
      email: session.email,
      role: session.role,
    }
  } catch (error) {
    return null
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}
