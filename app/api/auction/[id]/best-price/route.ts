import { NextResponse } from "next/server"
import { BestPriceService } from "@/lib/services/best-price.service"

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const options = await BestPriceService.computeBestPriceOptions(id)

    return NextResponse.json({
      success: true,
      data: { options },
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 })
  }
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const options = await BestPriceService.getBestPriceOptions(id)

    return NextResponse.json({
      success: true,
      data: { options },
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
