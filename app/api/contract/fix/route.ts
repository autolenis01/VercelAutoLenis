import { type NextRequest, NextResponse } from "next/server"
import { getSessionUser } from "@/lib/auth-server"
import { ContractShieldService } from "@/lib/services/contract-shield.service"

export const dynamic = "force-dynamic"

// Resolve a fix list item
export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser()
    if (!user || !["DEALER", "DEALER_USER"].includes(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { fixItemId, resolved, explanation, newDocumentId } = await req.json()

    if (!fixItemId) {
      return NextResponse.json({ error: "fixItemId required" }, { status: 400 })
    }

    const result = await ContractShieldService.resolveFixItem(fixItemId, {
      resolved: resolved ?? true,
      explanation,
      newDocumentId,
    })

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error: any) {
    console.error("[v0] Fix resolution error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
