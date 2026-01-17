import { type NextRequest, NextResponse } from "next/server"
import { getSessionUser } from "@/lib/auth-server"
import { ContractShieldService } from "@/lib/services/contract-shield.service"

export const dynamic = "force-dynamic"

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getSessionUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const scan = await ContractShieldService.getScanWithDetails(id)

    if (!scan) {
      return NextResponse.json({ error: "Scan not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: { scan },
    })
  } catch (error: any) {
    console.error("[v0] Get scan error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// Trigger re-scan
export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getSessionUser()
    if (!user || !["DEALER", "DEALER_USER", "ADMIN"].includes(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    // Get the scan to find the deal ID
    const existingScan = await ContractShieldService.getScanWithDetails(id)
    if (!existingScan || !existingScan.selectedDealId) {
      return NextResponse.json({ error: "Scan not found" }, { status: 404 })
    }

    // Trigger re-scan
    const scan = await ContractShieldService.scanContract(existingScan.selectedDealId)

    return NextResponse.json({
      success: true,
      data: { scan },
    })
  } catch (error: any) {
    console.error("[v0] Re-scan error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
