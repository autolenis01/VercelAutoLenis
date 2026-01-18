import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-server"
import { ShortlistService } from "@/lib/services/shortlist.service"

// GET - Admin: Get single shortlist detail
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth(["ADMIN"])
    const { id } = await params

    const shortlist = await ShortlistService.getShortlistDetailAdmin(id)

    return NextResponse.json({
      success: true,
      data: { shortlist },
    })
  } catch (error: any) {
    const status = error.message === "Shortlist not found" ? 404 : error.message === "Unauthorized" ? 401 : 500
    return NextResponse.json({ success: false, error: error.message }, { status })
  }
}
