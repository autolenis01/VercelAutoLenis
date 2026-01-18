// Server-side auth utilities - Only use in Server Components, Route Handlers, and Server Actions
import { cookies, headers } from "next/headers"
import { verifySession, type SessionUser } from "./auth"
import bcrypt from "bcryptjs"
import { logger } from "./logger"
import { getSessionCookieOptions, getClearCookieOptions } from "./utils/cookies"

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

export async function setSessionCookie(token: string, hostname?: string) {
  const cookieStore = await cookies()
  
  // Get hostname from headers if not provided
  let host = hostname
  if (!host) {
    const headerStore = await headers()
    host = headerStore.get("host") || undefined
  }

  logger.debug("Setting session cookie", { host })

  const options = getSessionCookieOptions(host)
  cookieStore.set("session", token, options)

  logger.debug("Session cookie set successfully", { domain: options.domain })
}

export async function clearSession(hostname?: string) {
  const cookieStore = await cookies()
  
  // Get hostname from headers if not provided
  let host = hostname
  if (!host) {
    const headerStore = await headers()
    host = headerStore.get("host") || undefined
  }

  const options = getClearCookieOptions(host)
  
  // Delete session cookie with proper domain
  cookieStore.set("session", "", options)
  
  // Also try deleting without domain for backwards compatibility
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
