import { type NextRequest, NextResponse } from "next/server"
import { esignService } from "@/lib/services/esign.service"

const WEBHOOK_SECRET = process.env["ESIGN_WEBHOOK_SECRET"] || "dev-secret"

export async function POST(req: NextRequest) {
  try {
    // Get raw body for signature verification
    const rawBody = await req.text()
    const signature = req.headers.get("x-esign-signature") || ""

    // Verify signature (skip in dev if no secret configured)
    if (WEBHOOK_SECRET !== "dev-secret") {
      const isValid = esignService.verifyWebhookSignature(rawBody, signature, WEBHOOK_SECRET)
      if (!isValid) {
        console.error("[E-Sign Webhook] Invalid signature")
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
      }
    }

    const payload = JSON.parse(rawBody)

    // Normalize payload format (different providers may have different structures)
    const normalizedPayload = {
      provider: payload.provider || "unknown",
      envelope_id: payload.envelope_id || payload.envelopeId || payload.data?.envelopeId,
      status: normalizeStatus(payload.status || payload.event || payload.data?.status),
      completed_at: payload.completed_at || payload.completedAt || payload.data?.completedAt,
      raw: payload,
    }

    const result = await esignService.handleWebhook(normalizedPayload)

    return NextResponse.json(result)
  } catch (error: any) {
    console.error("[E-Sign Webhook] Error:", error)
    // Return 200 to prevent provider retries for known errors
    return NextResponse.json({ success: false, error: error.message }, { status: 200 })
  }
}

function normalizeStatus(status: string): "COMPLETED" | "DECLINED" | "VOIDED" {
  const upper = (status || "").toUpperCase()
  if (upper.includes("COMPLETE") || upper.includes("SIGNED")) return "COMPLETED"
  if (upper.includes("DECLINE") || upper.includes("REJECT")) return "DECLINED"
  if (upper.includes("VOID") || upper.includes("CANCEL")) return "VOIDED"
  return "COMPLETED" // Default
}
