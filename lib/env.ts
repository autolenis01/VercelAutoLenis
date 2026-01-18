import { z } from "zod"

const envSchema = z.object({
  // Supabase (Required)
  NEXT_PUBLIC_SUPABASE_URL: z.string().url("NEXT_PUBLIC_SUPABASE_URL must be a valid URL"),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, "SUPABASE_SERVICE_ROLE_KEY is required"),
  SUPABASE_ANON_KEY: z.string().min(1, "SUPABASE_ANON_KEY is required"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, "NEXT_PUBLIC_SUPABASE_ANON_KEY is required"),

  // Authentication (Required)
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),

  // Stripe (Required)
  STRIPE_SECRET_KEY: z.string().startsWith("sk_", "STRIPE_SECRET_KEY must start with sk_"),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z
    .string()
    .startsWith("pk_", "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY must start with pk_"),

  // Cron (Required if cron jobs exist)
  CRON_SECRET: z.string().min(1, "CRON_SECRET is required for cron job security"),

  // Database URLs (Required)
  DATABASE_URL: z.string().url("DATABASE_URL must be a valid URL"),
  POSTGRES_PRISMA_URL: z.string().url("POSTGRES_PRISMA_URL must be a valid URL"),

  // Optional but recommended
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  RESEND_API_KEY: z.string().optional(),
  INTERNAL_API_KEY: z.string().optional(),
})

// Validate environment variables
const parseEnv = () => {
  try {
    return envSchema.parse(process.env)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map((e) => `  - ${e.path.join(".")}: ${e.message}`).join("\n")
      throw new Error(
        `\n\n❌ Invalid environment variables:\n\n${missingVars}\n\nPlease check your .env file and ensure all required variables are set.\n`,
      )
    }
    throw error
  }
}

// Export validated env
export const env = parseEnv()

// Export type for TypeScript autocomplete
export type Env = z.infer<typeof envSchema>
