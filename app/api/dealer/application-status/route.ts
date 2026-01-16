import { NextResponse } from "next/server"
import { getSessionUser } from "@/lib/auth-server"
import { dealerApprovalService } from "@/lib/services/dealer-approval.service"

export async function GET() {
  try {
    const user = await getSessionUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const status = await dealerApprovalService.getApplicationStatus(user.userId)

    return NextResponse.json({ success: true, data: status })
  } catch (error: any) {
    console.error("[ApplicationStatus] Error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
