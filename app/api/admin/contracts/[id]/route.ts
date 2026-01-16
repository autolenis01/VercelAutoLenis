import { type NextRequest, NextResponse } from "next/server"
import { getSessionUser } from "@/lib/auth-server"
import { ContractShieldService } from "@/lib/services/contract-shield.service"

export const dynamic = "force-dynamic"

// Get contract scan details for admin
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getSessionUser()
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const scan = await ContractShieldService.getScanWithDetails(id)

    if (!scan) {
      return NextResponse.json({ error: "Scan not found" }, { status: 404 })
    }

    // Get all documents for this deal
    const documents = scan.selectedDealId ? await ContractShieldService.getDocumentsByDealId(scan.selectedDealId) : []

    return NextResponse.json({
      success: true,
      data: { scan, documents },
    })
  } catch (error: any) {
    console.error("[v0] Admin contract detail error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// Admin override
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getSessionUser()
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const { action, reason } = await req.json()

    if (!action || !["FORCE_PASS", "FORCE_FAIL"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    if (!reason) {
      return NextResponse.json({ error: "Reason required for override" }, { status: 400 })
    }

    const scan = await ContractShieldService.adminOverride(id, action, user.userId, reason)

    return NextResponse.json({
      success: true,
      data: { scan },
    })
  } catch (error: any) {
    console.error("[v0] Admin override error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
