import { createAdminClient } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"
import { hashPassword as hashPasswordUtil, verifyPassword as verifyPasswordUtil } from "@/lib/auth-server"
import { createSession } from "@/lib/auth"
import type { SignUpInput, SignInInput } from "@/lib/validators/auth"

export class AuthService {
  static async signUp(input: SignUpInput) {
    const supabase = createAdminClient()
    const userId = crypto.randomUUID()
    const now = new Date().toISOString()

    try {
      const { data: existingUsers, error: checkError } = await supabase
        .from("User")
        .select("id")
        .eq("email", input.email)
        .limit(1)

      if (checkError) {
        console.error("[AuthService.signUp] Database query failed")
        throw new Error(`Database connection error. Please try again.`)
      }

      if (existingUsers && existingUsers.length > 0) {
        throw new Error("User with this email already exists")
      }

      const passwordHash = await hashPasswordUtil(input.password)
      const referralCode = AuthService.generateReferralCode()

      const { data: newUsers, error: createError } = await supabase
        .from("User")
        .insert({
          id: userId,
          email: input.email,
          passwordHash: passwordHash,
          first_name: input.firstName,
          last_name: input.lastName,
          phone: input.phone || null,
          role: input.role,
          is_email_verified: false,
          createdAt: now,
          updatedAt: now,
        })
        .select("id, email, role, first_name, last_name")

      if (createError) {
        console.error("[AuthService.signUp] Failed to create user")
        throw new Error(`Failed to create user account. Please try again.`)
      }

      if (!newUsers || newUsers.length === 0) {
        throw new Error("Failed to create user account")
      }

      const user = newUsers[0]

      if (input.role === "BUYER") {
        await supabase.from("BuyerProfile").insert({
          id: crypto.randomUUID(),
          userId: user.id,
          firstName: input.firstName,
          lastName: input.lastName,
          phone: input.phone || null,
          address: "",
          createdAt: now,
          updatedAt: now,
        })
      } else if (input.role === "DEALER") {
        await supabase.from("Dealer").insert({
          id: crypto.randomUUID(),
          userId: user.id,
          businessName: input.businessName || "",
          name: input.businessName || "",
          verified: false,
          active: true,
          createdAt: now,
          updatedAt: now,
        })
      } else if (input.role === "AFFILIATE") {
        await supabase.from("Affiliate").insert({
          id: crypto.randomUUID(),
          userId: user.id,
          firstName: input.firstName,
          lastName: input.lastName,
          refCode: referralCode,
          ref_code: referralCode,
          status: "active",
          totalEarnings: 0,
          pendingEarnings: 0,
          lifetime_earnings_cents: 0,
          available_balance_cents: 0,
          createdAt: now,
          updatedAt: now,
        })
      }

      const refCodeValue = input.refCode || input.referralCode
      if (refCodeValue) {
        const { data: affiliate } = await supabase
          .from("Affiliate")
          .select("id")
          .or(`refCode.eq.${refCodeValue},ref_code.eq.${refCodeValue}`)
          .limit(1)

        if (affiliate && affiliate.length > 0) {
          await supabase.from("Referral").insert({
            id: crypto.randomUUID(),
            referredUserId: user.id,
            referred_user_id_v2: user.id,
            affiliateId: affiliate[0].id,
            createdAt: now,
          })
        }
      }

      const token = await createSession({
        userId: user.id,
        email: user.email,
        role: user.role,
      })

      return {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          firstName: input.firstName,
          lastName: input.lastName,
        },
        token,
      }
    } catch (error: any) {
      console.error("[AuthService.signUp] Signup failed")
      throw error
    }
  }

  static async signIn(input: SignInInput) {
    const supabase = createAdminClient()

    try {
      const { data: users, error } = await supabase
        .from("User")
        .select("id, email, passwordHash, role, first_name, last_name, is_affiliate")
        .eq("email", input.email)
        .limit(1)

      if (error) {
        console.error("[AuthService.signIn] Database query failed")
        throw new Error("Unable to connect to database. Please try again.")
      }

      if (!users || users.length === 0) {
        throw new Error("Invalid email or password")
      }

      const user = users[0]
      const firstName = user.first_name || ""
      const lastName = user.last_name || ""

       const isValid = await verifyPasswordUtil(input.password, user.passwordHash)
      if (!isValid) {
        throw new Error("Invalid email or password")
      }

      let dealer = null
      let buyer = null
      let affiliate = null

      if (user.role === "DEALER" || user.role === "DEALER_USER") {
        const { data: dealerData } = await supabase
          .from("Dealer")
          .select("id, businessName, name, verified, active")
          .eq("userId", user.id)
          .limit(1)
        dealer = dealerData?.[0] || null
      } else if (user.role === "BUYER") {
        const { data: buyerData } = await supabase.from("BuyerProfile").select("id").eq("userId", user.id).limit(1)
        buyer = buyerData?.[0] || null

        if (user.is_affiliate) {
          const { data: affiliateData } = await supabase
            .from("Affiliate")
            .select("id, refCode, ref_code")
            .eq("userId", user.id)
            .limit(1)
          if (affiliateData && affiliateData.length > 0) {
            affiliate = affiliateData[0]
          }
        }
      } else if (user.role === "AFFILIATE" || user.role === "AFFILIATE_ONLY") {
        const { data: affiliateData } = await supabase
          .from("Affiliate")
          .select("id, refCode, ref_code, status, totalEarnings, pendingEarnings")
          .eq("userId", user.id)
          .limit(1)
        affiliate = affiliateData?.[0] || null
      }

      const token = await createSession({
        userId: user.id,
        email: user.email,
        role: user.role,
        is_affiliate: user.is_affiliate || false,
      })

      return {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          firstName,
          lastName,
          is_affiliate: user.is_affiliate || false,
          dealer,
          buyer,
          affiliate,
        },
        token,
      }
    } catch (error: any) {
      console.error("[AuthService.signIn] Signin failed")
      throw error
    }
  }

  static async getUserById(userId: string) {
    const supabase = await createClient()

    const { data: users, error } = await supabase
      .from("User")
      .select("id, email, role, first_name, last_name, phone, createdAt")
      .eq("id", userId)
      .limit(1)

    if (error || !users || users.length === 0) {
      return null
    }

    const user = users[0]
    return {
      ...user,
      firstName: user.first_name,
      lastName: user.last_name,
    }
  }

  static async getUserByEmail(email: string) {
    const supabase = await createClient()

    const { data: users, error } = await supabase
      .from("User")
      .select("id, email, role, first_name, last_name, phone, createdAt")
      .eq("email", email)
      .limit(1)

    if (error || !users || users.length === 0) {
      return null
    }

    const user = users[0]
    return {
      ...user,
      firstName: user.first_name,
      lastName: user.last_name,
    }
  }

  static generateReferralCode(): string {
    return "AL" + Math.random().toString(36).substring(2, 10).toUpperCase()
  }

  async hashPassword(password: string) {
    if (!password) {
      throw new Error("Password is required for hashing")
    }
    return hashPasswordUtil(password)
  }

  async verifyPassword(password: string, hashedPassword: string) {
    if (!password || !hashedPassword) {
      throw new Error("Password and hash are required for verification")
    }
    return verifyPasswordUtil(password, hashedPassword)
  }

  async generateToken(input: { userId: string; email: string; role: string; is_affiliate?: boolean }) {
    if (!input?.userId || !input.email || !input.role) {
      throw new Error("userId, email, and role are required to generate a token")
    }
    return createSession({
      userId: input.userId,
      email: input.email,
      role: input.role,
      is_affiliate: input.is_affiliate,
    })
  }
}

export const authService = new AuthService()
export default authService
