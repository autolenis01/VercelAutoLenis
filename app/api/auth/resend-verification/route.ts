import { NextResponse } from "next/server"
import { getSessionUser } from "@/lib/auth-server"
import { emailVerificationService } from "@/lib/services/email-verification.service"

export async function POST() {
  try {
    const user = await getSessionUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const result = await emailVerificationService.resendVerification(user.id)

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, message: result.message })
  } catch (error: any) {
    console.error("[ResendVerification] Error:", error)
    return NextResponse.json({ error: "Failed to resend verification email" }, { status: 500 })
  }
}
