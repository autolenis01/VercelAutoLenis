import { type NextRequest, NextResponse } from "next/server"
import { esignService } from "@/lib/services/esign.service"

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json()

    await esignService.handleWebhook(payload)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Webhook processing failed" }, { status: 400 })
  }
}
