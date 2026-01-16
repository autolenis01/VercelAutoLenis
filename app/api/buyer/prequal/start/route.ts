import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-server"
import { PreQualService } from "@/lib/services/prequal.service"
import { preQualStartSchema } from "@/lib/validators/prequal"
import { headers } from "next/headers"

// POST /api/buyer/prequal/start - Start pre-qualification with consent
export async function POST(request: Request) {
  try {
    const session = await requireAuth(["BUYER"])
    const body = await request.json()

    // Validate input
    const validated = preQualStartSchema.parse(body)

    // Get request context
    const headersList = await headers()
    const requestContext = {
      ipAddress: headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || undefined,
      userAgent: headersList.get("user-agent") || undefined,
    }

    // Start pre-qualification
    const result = await PreQualService.startPreQual(session.userId, validated, requestContext)

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      data: { preQualification: result.preQualification },
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error"

    // Check for profile incomplete error
    if (message.includes("Profile incomplete")) {
      return NextResponse.json(
        {
          success: false,
          error: message,
          code: "PROFILE_INCOMPLETE",
        },
        { status: 400 },
      )
    }

    // Check for consent error
    if (message.includes("Consent is required")) {
      return NextResponse.json(
        {
          success: false,
          error: message,
          code: "CONSENT_REQUIRED",
        },
        { status: 400 },
      )
    }

    return NextResponse.json({ success: false, error: message }, { status: message === "Unauthorized" ? 401 : 500 })
  }
}
