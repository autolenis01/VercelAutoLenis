import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-server"
import prequalService from "@/lib/services/prequal.service"

// GET /api/admin/buyers/:userId/prequal - Admin view of buyer prequal history
export async function GET(request: Request, { params }: { params: Promise<{ userId: string }> }) {
  try {
    await requireAuth(["ADMIN"])
    const { userId } = await params

    const data = await prequalService.getPreQualHistoryForUser(userId)

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json({ success: false, error: message }, { status: message === "Unauthorized" ? 401 : 403 })
  }
}
