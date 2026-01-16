import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-server"
import { InsuranceService } from "@/lib/services/insurance.service"

export async function GET(request: Request, { params }: { params: Promise<{ dealId: string }> }) {
  try {
    await requireAuth(["ADMIN"])
    const { dealId } = await params

    const data = await InsuranceService.getAdminFullDetail(dealId)

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error: any) {
    console.error("Error fetching admin insurance detail:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 400 })
  }
}
