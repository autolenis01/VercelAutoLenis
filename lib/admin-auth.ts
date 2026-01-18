import "server-only"
import { cookies } from "next/headers"
import { supabase, isDatabaseConfigured } from "@/lib/db"
import { logger } from "./logger"

// Rate limiting store (in production, use Redis)
const loginAttempts = new Map<string, { count: number; firstAttempt: number; lockedUntil?: number }>()
const mfaAttempts = new Map<string, { count: number; firstAttempt: number }>()

const MAX_LOGIN_ATTEMPTS = 5
const MAX_MFA_ATTEMPTS = 3
const LOCKOUT_DURATION = 15 * 60 * 1000 // 15 minutes
const ATTEMPT_WINDOW = 15 * 60 * 1000 // 15 minutes

// Admin session stored in memory (in production, use Redis or database)
const adminSessions = new Map<
  string,
  {
    userId: string
    email: string
    role: string
    mfaVerified: boolean
    mfaEnrolled: boolean
    requiresPasswordReset: boolean
    factorId?: string
  }
>()

export interface AdminUser {
  id: string
  email: string
  role: string
  passwordHash: string
}

export function checkRateLimit(identifier: string): {
  allowed: boolean
  attemptsRemaining?: number
  lockedUntil?: number
} {
  const now = Date.now()
  const record = loginAttempts.get(identifier)

  if (!record) {
    return { allowed: true, attemptsRemaining: MAX_LOGIN_ATTEMPTS }
  }

  // Check if locked
  if (record.lockedUntil && now < record.lockedUntil) {
    return { allowed: false, lockedUntil: record.lockedUntil }
  }

  // Reset if window has passed
  if (now - record.firstAttempt > ATTEMPT_WINDOW) {
    loginAttempts.delete(identifier)
    return { allowed: true, attemptsRemaining: MAX_LOGIN_ATTEMPTS }
  }

  // Check if max attempts reached
  if (record.count >= MAX_LOGIN_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_DURATION
    return { allowed: false, lockedUntil: record.lockedUntil }
  }

  return { allowed: true, attemptsRemaining: MAX_LOGIN_ATTEMPTS - record.count }
}

export function recordLoginAttempt(identifier: string, success: boolean): void {
  if (success) {
    loginAttempts.delete(identifier)
    return
  }

  const now = Date.now()
  const record = loginAttempts.get(identifier)

  if (!record || now - record.firstAttempt > ATTEMPT_WINDOW) {
    loginAttempts.set(identifier, { count: 1, firstAttempt: now })
  } else {
    record.count++
    if (record.count >= MAX_LOGIN_ATTEMPTS) {
      record.lockedUntil = now + LOCKOUT_DURATION
    }
  }
}

export function checkMfaRateLimit(identifier: string): { allowed: boolean; attemptsRemaining?: number } {
  const now = Date.now()
  const record = mfaAttempts.get(identifier)

  if (!record) {
    return { allowed: true, attemptsRemaining: MAX_MFA_ATTEMPTS }
  }

  if (now - record.firstAttempt > ATTEMPT_WINDOW) {
    mfaAttempts.delete(identifier)
    return { allowed: true, attemptsRemaining: MAX_MFA_ATTEMPTS }
  }

  if (record.count >= MAX_MFA_ATTEMPTS) {
    return { allowed: false, attemptsRemaining: 0 }
  }

  return { allowed: true, attemptsRemaining: MAX_MFA_ATTEMPTS - record.count }
}

export function recordMfaAttempt(identifier: string, success: boolean): void {
  if (success) {
    mfaAttempts.delete(identifier)
    return
  }

  const now = Date.now()
  const record = mfaAttempts.get(identifier)

  if (!record || now - record.firstAttempt > ATTEMPT_WINDOW) {
    mfaAttempts.set(identifier, { count: 1, firstAttempt: now })
  } else {
    record.count++
  }
}

export async function getAdminUser(email: string): Promise<AdminUser | null> {
  if (!isDatabaseConfigured()) {
    return null
  }

  try {
    const { data, error } = await supabase
      .from("User")
      .select("id, email, passwordHash, role")
      .eq("email", email.toLowerCase())
      .in("role", ["ADMIN", "SUPER_ADMIN"])
      .maybeSingle()

    if (error || !data) {
      return null
    }

    return data as AdminUser
  } catch (error) {
    logger.error("Error fetching admin user", { error })
    return null
  }
}

export async function setAdminSession(
  sessionId: string,
  data: {
    userId: string
    email: string
    role: string
    mfaVerified: boolean
    mfaEnrolled: boolean
    requiresPasswordReset: boolean
    factorId?: string
  },
): Promise<void> {
  adminSessions.set(sessionId, data)

  const cookieStore = await cookies()
  cookieStore.set("admin_session", sessionId, {
    httpOnly: true,
    secure: process.env["NODE_ENV"] === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
  })
}

export async function getAdminSession(): Promise<{
  userId: string
  email: string
  role: string
  mfaVerified: boolean
  mfaEnrolled: boolean
  requiresPasswordReset: boolean
  factorId?: string
} | null> {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get("admin_session")?.value

  if (!sessionId) {
    return null
  }

  return adminSessions.get(sessionId) || null
}

export async function updateAdminSession(
  updates: Partial<{
    mfaVerified: boolean
    mfaEnrolled: boolean
    requiresPasswordReset: boolean
    factorId: string
  }>,
): Promise<void> {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get("admin_session")?.value

  if (!sessionId) {
    return
  }

  const session = adminSessions.get(sessionId)
  if (session) {
    adminSessions.set(sessionId, { ...session, ...updates })
  }
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get("admin_session")?.value

  if (sessionId) {
    adminSessions.delete(sessionId)
  }

  cookieStore.delete("admin_session")
  cookieStore.delete("session")
}

export function generateSessionId(): string {
  return crypto.randomUUID()
}

// TOTP implementation
export function generateTotpSecret(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"
  let secret = ""
  for (let i = 0; i < 32; i++) {
    secret += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return secret
}

export function generateTotpUri(secret: string, email: string): string {
  const issuer = "AutoLenis Admin"
  return `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(email)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}&algorithm=SHA1&digits=6&period=30`
}

export function verifyTotp(secret: string, code: string): boolean {
  // Simple TOTP implementation
  const time = Math.floor(Date.now() / 30000)

  // Check current and adjacent time windows (to account for clock drift)
  for (let i = -1; i <= 1; i++) {
    const expectedCode = generateTotpCode(secret, time + i)
    if (expectedCode === code) {
      return true
    }
  }

  return false
}

function generateTotpCode(secret: string, time: number): string {
  // Base32 decode the secret
  const base32Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"
  let bits = ""
  for (const char of secret.toUpperCase()) {
    const val = base32Chars.indexOf(char)
    if (val === -1) continue
    bits += val.toString(2).padStart(5, "0")
  }

  const keyBytes = new Uint8Array(Math.floor(bits.length / 8))
  for (let i = 0; i < keyBytes.length; i++) {
    keyBytes[i] = Number.parseInt(bits.substr(i * 8, 8), 2)
  }

  // Time counter (big-endian 8 bytes)
  const timeBytes = new Uint8Array(8)
  let t = time
  for (let i = 7; i >= 0; i--) {
    timeBytes[i] = t & 0xff
    t = Math.floor(t / 256)
  }

  // HMAC-SHA1 (simplified - in production use Web Crypto API)
  // For now, use a deterministic code based on secret and time
  const combined = new Uint8Array(keyBytes.length + timeBytes.length)
  combined.set(keyBytes)
  combined.set(timeBytes, keyBytes.length)

  let hash = 0
  for (let i = 0; i < combined.length; i++) {
    const byte = combined[i] ?? 0
    hash = ((hash << 5) - hash + byte) | 0
  }

  // Generate 6-digit code
  const code = Math.abs(hash % 1000000)
  return code.toString().padStart(6, "0")
}

export async function generateQrCodeDataUrl(uri: string): Promise<string> {
  // Use local QR code generation to avoid external API calls that may be blocked by firewalls
  const QRCode = await import('qrcode')
  return QRCode.toDataURL(uri, { width: 200, margin: 1 })
}

export async function logAdminAction(action: string, details: Record<string, any>): Promise<void> {
  logger.info("Admin audit action", { action, details })

  // In production, save to audit log table
  // await supabase.from("AdminAuditLog").insert({ action, details, timestamp: new Date().toISOString() })
}

export async function saveMfaSecret(userId: string, secret: string, factorId: string): Promise<void> {
  if (!isDatabaseConfigured()) {
    throw new Error("Database not configured")
  }

  try {
    const { error } = await supabase
      .from("User")
      .update({
        mfaSecret: secret,
        mfaFactorId: factorId,
        mfaEnrolled: true,
      })
      .eq("id", userId)

    if (error) {
      logger.error("Error saving MFA secret", { error, userId })
      throw new Error("Failed to save MFA secret")
    }

    logger.info("MFA secret saved", { userId })
  } catch (error) {
    logger.error("Error in saveMfaSecret", { error, userId })
    throw error
  }
}
