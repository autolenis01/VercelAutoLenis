import { type NextRequest, NextResponse } from "next/server"
import { ContractShieldService } from "@/lib/services/contract-shield.service"
import { logger } from "@/lib/logger"

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization")
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    logger.info("Starting Contract Shield reconciliation cron job")

    // Run all reconciliation jobs
    await Promise.all([
      ContractShieldService.runReconciliationJob("SYNC_STATUSES"),
      ContractShieldService.runReconciliationJob("CHECK_STALE_SCANS"),
      ContractShieldService.runReconciliationJob("NOTIFY_PENDING"),
    ])

    logger.info("Contract Shield reconciliation cron job completed")

    return NextResponse.json({
      success: true,
      message: "Reconciliation jobs completed",
    })
  } catch (error) {
    logger.error("Contract Shield reconciliation cron job failed", {
      error: error instanceof Error ? error.message : "Unknown error",
    })

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Reconciliation failed" },
      { status: 500 },
    )
  }
}
