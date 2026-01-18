import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { requireAuth } from "@/lib/auth-server"
import { affiliateService } from "@/lib/services/affiliate.service"

// GET - View reconciliation logs
export async function GET(_request: NextRequest) {
  try {
    const session = await requireAuth()
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createClient()

    const { data: logs, error: logsError } = await supabase
      .from("commission_reconciliation_logs")
      .select("*")
      .order("run_at", { ascending: false })
      .limit(50)

    if (logsError) {
      console.error("[v0] Admin Reconciliation Logs API Error:", logsError)
      return NextResponse.json({ error: "Failed to fetch logs" }, { status: 500 })
    }

    return NextResponse.json({ logs: logs || [] })
  } catch (error) {
    console.error("[v0] Admin Reconciliation Logs API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST - Trigger manual reconciliation
export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth()
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const results = await affiliateService.runReconciliation()

    return NextResponse.json({
      success: true,
      results,
    })
  } catch (error) {
    console.error("[v0] Admin Manual Reconciliation API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
