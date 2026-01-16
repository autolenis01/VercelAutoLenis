import { prisma } from "@/lib/db"
import { emailService } from "@/lib/services/email.service"
import crypto from "crypto"

export class EmailVerificationService {
  // Generate a secure verification token
  private generateToken(): string {
    return crypto.randomBytes(32).toString("hex")
  }

  // Create verification token for a user
  async createVerificationToken(userId: string, email: string): Promise<string> {
    const token = this.generateToken()
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // Delete any existing tokens for this user
    await prisma.$executeRaw`
      DELETE FROM email_verification_tokens WHERE user_id = ${userId}
    `

    // Create new token
    await prisma.$executeRaw`
      INSERT INTO email_verification_tokens (user_id, token, expires_at)
      VALUES (${userId}, ${token}, ${expiresAt})
    `

    // Send verification email
    await emailService.sendEmailVerification(email, token)

    return token
  }

  // Verify token and mark email as verified
  async verifyEmail(token: string): Promise<{ success: boolean; message: string; userId?: string }> {
    // Find the token
    const result = await prisma.$queryRaw<
      Array<{ id: string; user_id: string; expires_at: Date; used_at: Date | null }>
    >`
      SELECT id, user_id, expires_at, used_at
      FROM email_verification_tokens
      WHERE token = ${token}
      LIMIT 1
    `

    if (!result || result.length === 0) {
      return { success: false, message: "Invalid verification token" }
    }

    const tokenRecord = result[0]

    // Check if already used
    if (tokenRecord.used_at) {
      return { success: false, message: "This verification link has already been used" }
    }

    // Check if expired
    if (new Date() > new Date(tokenRecord.expires_at)) {
      return { success: false, message: "This verification link has expired. Please request a new one." }
    }

    // Mark token as used
    await prisma.$executeRaw`
      UPDATE email_verification_tokens
      SET used_at = NOW()
      WHERE id = ${tokenRecord.id}
    `

    // Mark user's email as verified
    await prisma.user.update({
      where: { id: tokenRecord.user_id },
      data: { emailVerified: true },
    })

    return { success: true, message: "Email verified successfully!", userId: tokenRecord.user_id }
  }

  // Resend verification email
  async resendVerification(userId: string): Promise<{ success: boolean; message: string }> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, emailVerified: true },
    })

    if (!user) {
      return { success: false, message: "User not found" }
    }

    if (user.emailVerified) {
      return { success: false, message: "Email is already verified" }
    }

    await this.createVerificationToken(user.id, user.email)

    return { success: true, message: "Verification email sent! Please check your inbox." }
  }

  // Check if user's email is verified
  async isEmailVerified(userId: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { emailVerified: true },
    })

    return user?.emailVerified === true
  }
}

export const emailVerificationService = new EmailVerificationService()
