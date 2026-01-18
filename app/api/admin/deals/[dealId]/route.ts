import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-server"
import { DealService } from "@/lib/services/deal.service"

export async function GET(request: Request, { params }: { params: Promise<{ dealId: string }> }) {
  try {
    await requireAuth(["ADMIN"])
    const { dealId } = await params

    const dealData = await DealService.getDealForAdmin(dealId)

    return NextResponse.json({
      success: true,
      data: dealData,
    })
  } catch (error: any) {
    console.error("Error fetching deal for admin:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 400 })
  }
}
