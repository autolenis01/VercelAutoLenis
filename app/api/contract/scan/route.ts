import { NextResponse } from "next/server"
import { ContractShieldService } from "@/lib/services/contract-shield.service"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const scan = await ContractShieldService.scanContract(body.contractId)

    return NextResponse.json({
      success: true,
      data: { scan },
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 })
  }
}
