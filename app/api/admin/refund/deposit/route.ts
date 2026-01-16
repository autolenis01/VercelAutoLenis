import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth-server"
import { adminService } from "@/lib/services/admin.service"
import { z } from "zod"

const schema = z.object({
  depositId: z.string(),
  reason: z.string(),
})

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { depositId, reason } = schema.parse(body)

    const result = await adminService.refundDeposit(depositId, reason, user.userId)

    return NextResponse.json(result)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to refund deposit" }, { status: 400 })
  }
}
