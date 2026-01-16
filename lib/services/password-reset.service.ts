import { prisma } from "@/lib/db"
import { emailService } from "@/lib/services/email.service"
import { hashPassword } from "@/lib/auth-server"
import crypto from "crypto"

export class PasswordResetService {
  // Generate a secure reset token
  private generateToken(): string {
    return crypto.randomBytes(32).toString("hex")
  }

  // Request password reset - sends email with reset link
  async requestPasswordReset(email: string): Promise<{ success: boolean; message: string }> {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: { id: true, email: true, first_name: true, emailVerified: true },
    })

    // Always return same message to prevent email enumeration
    const genericMessage = "If an account exists with this email, you will receive a password reset link."

    if (!user) {
      return { success: true, message: genericMessage }
    }

    if (!user.emailVerified) {
      return { success: false, message: "Your email address must be verified before requesting a password reset." }
    }

    const token = this.generateToken()
    const expiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000) // 1 hour

    // Delete any existing tokens for this user
    await prisma.$executeRaw`
      DELETE FROM password_reset_tokens WHERE user_id = ${user.id}
    `

    // Create new token
    await prisma.$executeRaw`
      INSERT INTO password_reset_tokens (id, user_id, token, expires_at, created_at)
      VALUES (${crypto.randomUUID()}, ${user.id}, ${token}, ${expiresAt}, NOW())
    `

    // Send password reset email
    try {
      await emailService.sendPasswordResetEmail(user.email, user.first_name || "there", token)
    } catch (error) {
      console.error("[PasswordResetService] Failed to send reset email:", error)
    }

    return { success: true, message: genericMessage }
  }

  // Validate reset token
  async validateToken(token: string): Promise<{ valid: boolean; userId?: string; message?: string }> {
    const result = await prisma.$queryRaw<
      Array<{ id: string; user_id: string; expires_at: Date; used_at: Date | null }>
    >`
      SELECT id, user_id, expires_at, used_at
      FROM password_reset_tokens
      WHERE token = ${token}
      LIMIT 1
    `

    if (!result || result.length === 0) {
      return { valid: false, message: "Invalid or expired reset link" }
    }

    const tokenRecord = result[0]

    if (tokenRecord.used_at) {
      return { valid: false, message: "This reset link has already been used" }
    }

    if (new Date() > new Date(tokenRecord.expires_at)) {
      return { valid: false, message: "This reset link has expired. Please request a new one." }
    }

    return { valid: true, userId: tokenRecord.user_id }
  }

  // Reset password with token
  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    // Validate token first
    const validation = await this.validateToken(token)

    if (!validation.valid || !validation.userId) {
      return { success: false, message: validation.message || "Invalid token" }
    }

    // Hash new password
    const passwordHash = await hashPassword(newPassword)

    // Update user's password
    await prisma.user.update({
      where: { id: validation.userId },
      data: { passwordHash },
    })

    // Mark token as used
    await prisma.$executeRaw`
      UPDATE password_reset_tokens
      SET used_at = NOW()
      WHERE token = ${token}
    `

    // Optionally revoke all active sessions for this user
    await prisma.$executeRaw`
      UPDATE sessions
      SET revoked_at = NOW()
      WHERE user_id = ${validation.userId} AND revoked_at IS NULL
    `

    return { success: true, message: "Password reset successfully! You can now sign in with your new password." }
  }
}

export const passwordResetService = new PasswordResetService()
