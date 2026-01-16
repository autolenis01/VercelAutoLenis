import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-server"
import { dealerApprovalService } from "@/lib/services/dealer-approval.service"

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth(["ADMIN"])
    const { id } = await params

    await dealerApprovalService.approveApplication(id, user.id)

    return NextResponse.json({ success: true, message: "Dealer approved successfully" })
  } catch (error: any) {
    console.error("[ApproveDealerApplication] Error:", error)
    return NextResponse.json({ error: error.message }, { status: error.message === "Unauthorized" ? 401 : 500 })
  }
}
