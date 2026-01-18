import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-server"
import { ContractShieldService } from "@/lib/services/contract-shield.service"

export async function POST(request: Request) {
  try {
    const session = await requireAuth(["DEALER"])
    const body = await request.json()

    const contract = await ContractShieldService.uploadContract(
      body.dealId,
      body.dealerId,
      body.documentUrl,
      body.documentType,
    )

    return NextResponse.json({
      success: true,
      data: { contract },
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 })
  }
}
