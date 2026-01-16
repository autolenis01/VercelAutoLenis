import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth-server"
import { affiliateService } from "@/lib/services/affiliate.service"
import { z } from "zod"

const schema = z.object({
  refCode: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { refCode } = schema.parse(body)

    // Also check for cookie-based attribution
    const cookieRefCode = req.cookies.get("autolenis_ref_code")?.value
    const cookieId = req.cookies.get("autolenis_ref")?.value

    const codeToUse = refCode || cookieRefCode

    if (!codeToUse && !cookieId) {
      return NextResponse.json({
        success: false,
        message: "No referral code or cookie found",
      })
    }

    // Process the referral with 5-level chain building
    const referrals = await affiliateService.processSignupReferral(user.userId, codeToUse, cookieId)

    if (!referrals || referrals.length === 0) {
      return NextResponse.json({
        success: false,
        message: "Could not create referral (may be self-referral or already exists)",
      })
    }

    // Clear the referral cookies after successful attribution
    const response = NextResponse.json({
      success: true,
      message: "Referral tracked successfully",
      levels: referrals.length,
    })

    response.cookies.delete("autolenis_ref")
    response.cookies.delete("autolenis_ref_code")

    return response
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to process referral" }, { status: 400 })
  }
}
