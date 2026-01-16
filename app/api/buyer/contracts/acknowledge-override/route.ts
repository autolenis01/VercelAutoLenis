import { type NextRequest, NextResponse } from "next/server"
import { ContractShieldService } from "@/lib/services/contract-shield.service"
import { getSessionUser } from "@/lib/auth-server"

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser(req)

    if (!session?.user || session.user.role !== "BUYER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { overrideId, comment } = body

    if (!overrideId) {
      return NextResponse.json({ error: "Override ID is required" }, { status: 400 })
    }

    const override = await ContractShieldService.buyerAcknowledgeOverride(overrideId, session.user.id, comment)

    return NextResponse.json({
      success: true,
      data: override,
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to acknowledge override" },
      { status: 500 },
    )
  }
}
