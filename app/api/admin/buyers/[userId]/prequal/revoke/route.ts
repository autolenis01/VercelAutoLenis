import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-server"
import prequalService from "@/lib/services/prequal.service"

// POST /api/admin/buyers/:userId/prequal/revoke - Admin revoke prequal
export async function POST(request: Request, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const session = await requireAuth(["ADMIN"])
    const { userId } = await params
    const body = await request.json().catch((err) => {
      console.error("[v0] Failed to parse request body:", err)
      return {}
    })

    await prequalService.revokePreQual(userId, session.userId, body.reason)

    return NextResponse.json({
      success: true,
      message: "Pre-qualification revoked successfully",
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error"
    console.error("[v0] Error revoking prequal:", message)
    return NextResponse.json({ success: false, error: message }, { status: message === "Unauthorized" ? 401 : 400 })
  }
}
