import { type NextRequest, NextResponse } from "next/server"
import { ContractShieldService } from "@/lib/services/contract-shield.service"
import { getSessionUser } from "@/lib/auth-server"

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser(req)

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const rules = await ContractShieldService.getActiveRules()

    return NextResponse.json({
      success: true,
      data: rules,
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch rules" },
      { status: 500 },
    )
  }
}
