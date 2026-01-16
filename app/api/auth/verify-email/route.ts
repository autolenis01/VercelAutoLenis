import { NextResponse } from "next/server"
import { emailVerificationService } from "@/lib/services/email-verification.service"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")

    if (!token) {
      return NextResponse.redirect(new URL("/auth/verify-email?error=missing_token", request.url))
    }

    const result = await emailVerificationService.verifyEmail(token)

    if (!result.success) {
      return NextResponse.redirect(
        new URL(`/auth/verify-email?error=${encodeURIComponent(result.message)}`, request.url),
      )
    }

    return NextResponse.redirect(new URL("/auth/verify-email?success=true", request.url))
  } catch (error: any) {
    console.error("[VerifyEmail] Error:", error)
    return NextResponse.redirect(new URL("/auth/verify-email?error=verification_failed", request.url))
  }
}
