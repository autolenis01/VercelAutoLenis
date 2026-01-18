import { NextResponse } from "next/server"
import { cookies, headers } from "next/headers"

/**
 * Diagnostic endpoint for debugging authentication issues
 * Safe for production - does not leak secrets, only shows metadata
 */
export async function GET() {
  try {
    const headersList = await headers()
    const cookieStore = await cookies()
    
    // Get environment information
    const nodeEnv = process.env.NODE_ENV || "unknown"
    const vercelEnv = process.env["VERCEL_ENV"] || "unknown"
    
    // Get request information
    const host = headersList.get("host") || "unknown"
    const protocol = headersList.get("x-forwarded-proto") || "http"
    const userAgent = headersList.get("user-agent") || "unknown"
    
    // Check for JWT_SECRET presence (boolean only, never the value)
    const hasJwtSecret = !!process.env["JWT_SECRET"]
    const jwtSecretLength = process.env["JWT_SECRET"]?.length || 0
    
    // Get cookie names (not values)
    const cookieNames = cookieStore.getAll().map(cookie => cookie.name)
    const hasSessionCookie = cookieNames.includes("session")
    
    // Build diagnostic response
    const diagnostics = {
      timestamp: new Date().toISOString(),
      environment: {
        nodeEnv,
        vercelEnv,
        isProduction: vercelEnv === "production",
        isPreview: vercelEnv === "preview",
        isDevelopment: vercelEnv === "development" || nodeEnv === "development",
      },
      request: {
        host,
        protocol,
        fullUrl: `${protocol}://${host}`,
        userAgent: userAgent.substring(0, 100), // Truncate for safety
      },
      authentication: {
        hasJwtSecret,
        jwtSecretConfigured: hasJwtSecret && jwtSecretLength >= 32,
        jwtSecretLength: hasJwtSecret ? jwtSecretLength : 0,
      },
      cookies: {
        hasSessionCookie,
        cookieNames,
        cookieCount: cookieNames.length,
      },
      recommendations: [] as string[],
    }
    
    // Add recommendations based on detected issues
    if (!hasJwtSecret) {
      diagnostics.recommendations.push("JWT_SECRET is not configured. Set this in your environment variables.")
    } else if (jwtSecretLength < 32) {
      diagnostics.recommendations.push("JWT_SECRET is too short. It should be at least 32 characters for security.")
    }
    
    if (!hasSessionCookie) {
      diagnostics.recommendations.push("No session cookie found. User may need to sign in.")
    }
    
    if (vercelEnv === "production" && !hasJwtSecret) {
      diagnostics.recommendations.push("CRITICAL: Production deployment without JWT_SECRET!")
    }
    
    if (protocol === "http" && nodeEnv === "production") {
      diagnostics.recommendations.push("Insecure connection detected in production. HTTPS should be enforced.")
    }
    
    return NextResponse.json({
      success: true,
      diagnostics,
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: "Diagnostic check failed",
        message: error.message,
      },
      { status: 500 }
    )
  }
}
