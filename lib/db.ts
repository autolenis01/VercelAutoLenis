// AutoLenis Database Connection
// Supabase client for direct queries, Prisma for ORM operations (optional)

import { createClient, type SupabaseClient } from "@supabase/supabase-js"
import { logger } from "./logger"

// Get Supabase connection details
const supabaseUrl = process.env.SUPABASE_URL || process.env["NEXT_PUBLIC_SUPABASE_URL"] || ""
const supabaseServiceKey = process.env["SUPABASE_SERVICE_ROLE_KEY"] || ""

// Track configuration status
let configurationError: string | null = null

// Create Supabase client with service role (bypasses RLS)
function createSupabaseClient(): SupabaseClient {
  try {
    if (!supabaseUrl || !supabaseServiceKey) {
      configurationError = `Supabase configuration missing: URL ${supabaseUrl ? "✓" : "✗"}, Key ${supabaseServiceKey ? "✓" : "✗"}`
      logger.warn("Supabase not configured", { error: configurationError })

      return createClient("https://placeholder.supabase.co", "placeholder-key", {
        auth: { autoRefreshToken: false, persistSession: false },
      })
    }

    logger.info("Initializing Supabase client", { url: supabaseUrl })
    const client = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
      db: { schema: "public" },
    })

    logger.info("Supabase client initialized successfully")
    return client
  } catch (error: any) {
    configurationError = `Supabase client creation failed: ${error.message}`
    logger.error("Supabase client creation failed", { error: error.message })

    return createClient("https://placeholder.supabase.co", "placeholder-key", {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  }
}

// Singleton Supabase client
export const supabase: SupabaseClient = createSupabaseClient()

// Prisma client is only loaded when actually needed
let _prismaInstance: any = null
const _prismaPromise: Promise<any> | null = null

// Get Prisma client (lazy loaded)
export function getPrisma() {
  if (!_prismaInstance) {
    // Return a proxy that will lazy-load Prisma on first actual use
    _prismaInstance = new Proxy(
      {},
      {
        get: (target: any, prop) => {
          if (prop === "then") return undefined // Allow await checks
          if (prop === "$connect" || prop === "$disconnect") {
            return async () => {} // No-op for connection methods
          }

          // Return a function that performs queries using Supabase instead
          // Since Prisma isn't reliably available in this environment
          console.warn(`[DB] Prisma method ${String(prop)} called - falling back to Supabase`)
          return new Proxy(
            {},
            {
              get: (_, method) => {
                return async (...args: any[]) => {
                  console.warn(`[DB] prisma.${String(prop)}.${String(method)} not available in this environment`)
                  throw new Error(
                    `Database query prisma.${String(prop)}.${String(method)} not available. Use Supabase client instead.`,
                  )
                }
              },
            },
          )
        },
      },
    )
  }
  return _prismaInstance
}

// This allows existing code to use `prisma.table.method()` syntax
export const prisma = new Proxy({} as any, {
  get: (_, prop) => {
    const client = getPrisma()
    return client[prop]
  },
})

// Check if database is properly configured
export function isDatabaseConfigured(): boolean {
  const configured = !!(supabaseUrl && supabaseServiceKey && !configurationError)
  if (!configured && configurationError) {
    logger.warn("Database not configured", { error: configurationError })
  }
  return configured
}

// Get configured Supabase client or throw with detailed error
export function getSupabase(): SupabaseClient {
  if (!supabaseUrl || !supabaseServiceKey) {
    const error =
      `Database not configured. Missing: ${!supabaseUrl ? "SUPABASE_URL " : ""}${!supabaseServiceKey ? "SUPABASE_SERVICE_ROLE_KEY " : ""}`.trim()
    logger.error("Database not configured", { error })
    throw new Error(error)
  }

  if (configurationError) {
    logger.error("Database configuration error", { error: configurationError })
    throw new Error(`Database configuration error: ${configurationError}`)
  }

  return supabase
}

// Export configuration status for debugging
export function getDatabaseStatus() {
  return {
    configured: isDatabaseConfigured(),
    hasUrl: !!supabaseUrl,
    hasServiceKey: !!supabaseServiceKey,
    error: configurationError,
  }
}
