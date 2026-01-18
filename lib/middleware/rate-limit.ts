// Rate limiting middleware for API routes
// Protects against brute force attacks and abuse

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

interface RateLimitEntry {
  count: number
  resetTime: number
}

// In-memory rate limit store (use Redis in production)
const rateLimitStore = new Map<string, RateLimitEntry>()

// Clean up expired entries every 5 minutes
setInterval(
  () => {
    const now = Date.now()
    for (const [key, entry] of rateLimitStore.entries()) {
      if (entry.resetTime < now) {
        rateLimitStore.delete(key)
      }
    }
  },
  5 * 60 * 1000,
)

export interface RateLimitConfig {
  maxRequests: number
  windowMs: number
  keyGenerator?: (request: NextRequest) => string
}

export async function rateLimit(request: NextRequest, config: RateLimitConfig): Promise<NextResponse | null> {
  const { maxRequests, windowMs, keyGenerator } = config

  // Generate rate limit key (default: IP address)
  const key = keyGenerator
    ? keyGenerator(request)
    : (request as any).ip || request.headers.get("x-forwarded-for") || "unknown"

  const now = Date.now()
  const entry = rateLimitStore.get(key)

  if (!entry || entry.resetTime < now) {
    // Create new entry or reset expired entry
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + windowMs,
    })
    return null
  }

  if (entry.count >= maxRequests) {
    // Rate limit exceeded
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000)
    return NextResponse.json(
      {
        success: false,
        error: "Too many requests. Please try again later.",
        retryAfter,
      },
      {
        status: 429,
        headers: {
          "Retry-After": retryAfter.toString(),
          "X-RateLimit-Limit": maxRequests.toString(),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": entry.resetTime.toString(),
        },
      },
    )
  }

  // Increment count
  entry.count++
  rateLimitStore.set(key, entry)

  return null
}

// Preset rate limit configurations
export const rateLimits = {
  auth: {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
  api: {
    maxRequests: 100,
    windowMs: 60 * 1000, // 1 minute
  },
  strict: {
    maxRequests: 10,
    windowMs: 60 * 1000, // 1 minute
  },
}
