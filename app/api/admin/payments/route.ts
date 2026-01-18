import { type NextRequest, NextResponse } from "next/server"
import { getSessionUser } from "@/lib/auth-server"
import { adminService } from "@/lib/services/admin.service"
import { PaymentService } from "@/lib/services/payment.service"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const user = await getSessionUser()
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const type = (searchParams.get("type") as any) || "all"
    const status = searchParams.get("status") || "all"
    const page = Number.parseInt(searchParams.get("page") || "1")

    const result = await adminService.getAllPayments({ type, status, page })
    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error("[Admin Payments Error]", error)
    return NextResponse.json({ error: "Failed to load payments" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser()
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { action, paymentId, depositId, type, reason } = await request.json()

    if (action === "refund_deposit" || action === "refund") {
      const id = paymentId || depositId
      const paymentType = type || "deposit"

      if (!id || !reason) {
        return NextResponse.json({ error: "Missing paymentId and reason" }, { status: 400 })
      }

      const result = await PaymentService.processRefund(id, paymentType, reason, user.id)
      return NextResponse.json({ success: true, data: result })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error: any) {
    console.error("[Admin Payments Action Error]", error)
    return NextResponse.json({ error: error.message || "Failed to process action" }, { status: 500 })
  }
}
