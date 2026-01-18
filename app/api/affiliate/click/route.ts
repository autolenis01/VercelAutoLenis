import { type NextRequest, NextResponse } from "next/server"
import { affiliateService } from "@/lib/services/affiliate.service"
import { nanoid } from "nanoid"
import { z } from "zod"

const schema = z.object({
  code: z.string().optional(),
  refCode: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = schema.parse(body)
    const code = parsed.code || parsed.refCode

    if (!code) {
      return NextResponse.json({ error: "Missing code" }, { status: 400 })
    }

    const affiliate = await affiliateService.getAffiliateByCode(code)

    if (!affiliate) {
      return NextResponse.json({ error: "Invalid code" }, { status: 404 })
    }

    // Get existing cookie or create new one
    const existingCookie = req.cookies.get("autolenis_ref")?.value
    const cookieId = existingCookie || nanoid(16)

    const result = await affiliateService.trackClick(affiliate.id, {
      userAgent: req.headers.get("user-agent"),
      referer: req.headers.get("referer"),
      ip: req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || "",
      cookieId,
    })

    if (!result) {
      return NextResponse.json({ error: "Failed to track click" }, { status: 500 })
    }

    // Create response with cookies
    const response = NextResponse.json({
      success: true,
      click: result.click,
      affiliateName: result.affiliateName,
      cookieId: result.cookieId,
    })

    // Set attribution cookie (30 days)
    response.cookies.set("autolenis_ref", result.cookieId!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    })

    // Also set ref code cookie for easier access
    response.cookies.set("autolenis_ref_code", code, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    })

    return response
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to track click" }, { status: 400 })
  }
}

export async function GET(_req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const refCode = searchParams.get("ref") || searchParams.get("code")

    if (!refCode) {
      return NextResponse.json({ error: "Missing ref code" }, { status: 400 })
    }

    const affiliate = await affiliateService.getAffiliateByCode(refCode)
    if (!affiliate) {
      return NextResponse.json({ error: "Invalid referral code" }, { status: 404 })
    }

    return NextResponse.json({
      valid: true,
      affiliateName: `${affiliate.firstName} ${affiliate.lastName}`.trim() || "A friend",
      refCode: affiliate.refCode || affiliate.ref_code,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to resolve code" }, { status: 400 })
  }
}
