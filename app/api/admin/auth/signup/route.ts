import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { hashPassword } from "@/lib/auth-server"
import { rateLimit, rateLimits } from "@/lib/middleware/rate-limit"
import { handleError, ValidationError, ConflictError } from "@/lib/middleware/error-handler"

export async function POST(request: Request) {
  try {
    const rateLimitResponse = await rateLimit(request as any, rateLimits.strict)
    if (rateLimitResponse) {
      return rateLimitResponse
    }

    const body = await request.json()
    const { email, password, firstName, lastName } = body

    if (!email || !password || !firstName || !lastName) {
      throw new ValidationError("All fields are required")
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw new ValidationError("Invalid email format")
    }

    if (password.length < 6) {
      throw new ValidationError("Password must be at least 6 characters")
    }

    const supabase = createAdminClient()

    const { data: existingUsers } = await supabase.from("User").select("id").eq("email", email.toLowerCase()).limit(1)

    if (existingUsers && existingUsers.length > 0) {
      throw new ConflictError("An account with this email already exists")
    }

    const passwordHash = await hashPassword(password)

    const userId = crypto.randomUUID()
    const now = new Date().toISOString()

    const { data: newUsers, error: userError } = await supabase
      .from("User")
      .insert({
        id: userId,
        email: email.toLowerCase(),
        passwordHash: passwordHash,
        first_name: firstName,
        last_name: lastName,
        role: "ADMIN",
        is_email_verified: true,
        createdAt: now,
        updatedAt: now,
      })
      .select("id, email, role")

    if (userError) {
      console.error("[Admin Signup] User creation error:", userError.message)
      throw new Error("Failed to create account")
    }

    if (!newUsers || newUsers.length === 0) {
      throw new Error("Failed to create account")
    }

    return NextResponse.json({
      success: true,
      message: "Admin account created successfully",
    })
  } catch (error) {
    return handleError(error)
  }
}
