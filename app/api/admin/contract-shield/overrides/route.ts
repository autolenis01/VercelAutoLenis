import { type NextRequest, NextResponse } from "next/server"
import { ContractShieldService } from "@/lib/services/contract-shield.service"
import { getSessionUser } from "@/lib/auth-server"

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser()

    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const scanId = searchParams.get("scanId") || undefined
    const adminId = searchParams.get("adminId") || undefined
    const buyerAcknowledged = searchParams.get("buyerAcknowledged")
      ? searchParams.get("buyerAcknowledged") === "true"
      : undefined
    const startDate = searchParams.get("startDate") ? new Date(searchParams.get("startDate")!) : undefined
    const endDate = searchParams.get("endDate") ? new Date(searchParams.get("endDate")!) : undefined

    const overrides = await ContractShieldService.getOverridesLedger({
      scanId,
      adminId,
      buyerAcknowledged,
      startDate,
      endDate,
    })

    return NextResponse.json({
      success: true,
      data: overrides,
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch overrides" },
      { status: 500 },
    )
  }
}
