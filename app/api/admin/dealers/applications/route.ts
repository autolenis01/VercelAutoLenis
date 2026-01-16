import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-server"
import { dealerApprovalService } from "@/lib/services/dealer-approval.service"

export async function GET() {
  try {
    await requireAuth(["ADMIN"])

    const applications = await dealerApprovalService.getPendingApplications()

    return NextResponse.json({ success: true, data: applications })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: error.message === "Unauthorized" ? 401 : 500 })
  }
}
