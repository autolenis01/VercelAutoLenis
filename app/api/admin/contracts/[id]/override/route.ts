import { type NextRequest, NextResponse } from "next/server"
import { ContractShieldService } from "@/lib/services/contract-shield.service"
import { getServerSession } from "@/lib/auth-server"

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const session = await getServerSession()

    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { action, reason } = body

    if (!action || !reason) {
      return NextResponse.json({ error: "Action and reason are required" }, { status: 400 })
    }

    const result = await ContractShieldService.adminOverrideWithConsent(id, action, session.userId, reason)

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create override" },
      { status: 500 },
    )
  }
}
