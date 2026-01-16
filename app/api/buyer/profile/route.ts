import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-server"
import { PreQualService } from "@/lib/services/prequal.service"
import { buyerProfileSchema } from "@/lib/validators/prequal"

export async function GET() {
  try {
    const session = await requireAuth(["BUYER"])

    const profile = await PreQualService.getBuyerProfile(session.userId)

    return NextResponse.json({
      success: true,
      data: { profile },
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json({ success: false, error: message }, { status: message === "Unauthorized" ? 401 : 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const session = await requireAuth(["BUYER"])
    const body = await request.json()
    const validated = buyerProfileSchema.parse(body)

    const profile = await PreQualService.updateBuyerProfile(session.userId, validated)

    return NextResponse.json({
      success: true,
      data: { profile },
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Validation error"
    return NextResponse.json({ success: false, error: message }, { status: 400 })
  }
}
