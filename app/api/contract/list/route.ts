import { type NextRequest, NextResponse } from "next/server"
import { getSessionUser } from "@/lib/auth-server"
import { ContractShieldService } from "@/lib/services/contract-shield.service"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const dealId = searchParams.get("dealId")

    if (!dealId) {
      return NextResponse.json({ error: "dealId required" }, { status: 400 })
    }

    const documents = await ContractShieldService.getDocumentsByDealId(dealId)

    return NextResponse.json({
      success: true,
      data: { contracts: documents },
    })
  } catch (error: any) {
    console.error("[v0] Contract list error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
