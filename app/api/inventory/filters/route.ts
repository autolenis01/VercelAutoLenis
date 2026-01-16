import { NextResponse } from "next/server"
import { InventoryService } from "@/lib/services/inventory.service"

export async function GET() {
  try {
    const [makes, bodyStyles] = await Promise.all([
      InventoryService.getAvailableMakes(),
      InventoryService.getAvailableBodyStyles(),
    ])

    return NextResponse.json({
      success: true,
      data: { makes, bodyStyles },
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
