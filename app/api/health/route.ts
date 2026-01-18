// Health check endpoint for monitoring
// Returns service status and database connectivity

import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  const startTime = Date.now()

  try {
    // Check database connectivity
    const supabase = await createClient()
    const { error } = await supabase.from("User").select("id").limit(1)

    const responseTime = Date.now() - startTime

    if (error) {
      return NextResponse.json(
        {
          status: "unhealthy",
          database: "down",
          error: "Database connection failed",
          responseTime,
          timestamp: new Date().toISOString(),
        },
        { status: 503 },
      )
    }

    return NextResponse.json({
      status: "healthy",
      database: "up",
      responseTime,
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || "unknown",
    })
  } catch (error) {
    const responseTime = Date.now() - startTime

    return NextResponse.json(
      {
        status: "unhealthy",
        error: "Service error",
        responseTime,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
