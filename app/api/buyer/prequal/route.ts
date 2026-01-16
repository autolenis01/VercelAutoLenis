import { NextResponse } from "next/server"
import { getSessionUser } from "@/lib/auth-server"
import { supabase, isDatabaseConfigured } from "@/lib/db"
import { softPullConsentSchema, buyerProfileSchema } from "@/lib/validators/prequal"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const user = await getSessionUser()
    if (!user || user.role !== "BUYER") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    if (!isDatabaseConfigured()) {
      return NextResponse.json({ success: true, data: { active: false, preQualification: null } })
    }

    // Get buyer profile
    const { data: buyer } = await supabase.from("BuyerProfile").select("id").eq("userId", user.userId).maybeSingle()

    if (!buyer) {
      return NextResponse.json({ success: true, data: { active: false, preQualification: null } })
    }

    // Get active prequalification
    const { data: prequal } = await supabase
      .from("PreQualification")
      .select("*")
      .eq("buyerId", buyer.id)
      .eq("prequal_status", "ACTIVE")
      .gt("expiresAt", new Date().toISOString())
      .order("createdAt", { ascending: false })
      .limit(1)
      .maybeSingle()

    if (!prequal) {
      return NextResponse.json({ success: true, data: { active: false, preQualification: null } })
    }

    return NextResponse.json({
      success: true,
      data: {
        active: true,
        preQualification: {
          id: prequal.id,
          status: prequal.prequal_status,
          creditTier: prequal.creditTier,
          maxOtdAmountCents: prequal.max_otd_amount_cents || (prequal.maxOtd ? Math.floor(prequal.maxOtd * 100) : null),
          minMonthlyPaymentCents:
            prequal.min_monthly_payment_cents ||
            (prequal.estimatedMonthlyMin ? Math.floor(prequal.estimatedMonthlyMin * 100) : null),
          maxMonthlyPaymentCents:
            prequal.max_monthly_payment_cents ||
            (prequal.estimatedMonthlyMax ? Math.floor(prequal.estimatedMonthlyMax * 100) : null),
          dtiRatio: prequal.dti_ratio || prequal.dti,
          expiresAt: prequal.expiresAt,
          providerName: prequal.provider_name,
          createdAt: prequal.createdAt,
        },
      },
    })
  } catch (error: any) {
    console.error("[PreQual API] GET error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getSessionUser()
    if (!user || user.role !== "BUYER") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    // Validate inputs
    const profileData = buyerProfileSchema.parse(body.profile)
    const consentData = softPullConsentSchema.parse(body.consent)

    if (!isDatabaseConfigured()) {
      return NextResponse.json({ success: false, error: "Database not configured" }, { status: 500 })
    }

    // Update buyer profile
    const { data: buyer, error: updateError } = await supabase
      .from("BuyerProfile")
      .update({
        ...profileData,
        updatedAt: new Date().toISOString(),
      })
      .eq("userId", user.userId)
      .select(
        "id, firstName, lastName, city, state, date_of_birth, address_line1, postal_code, monthly_income_cents, monthly_housing_cents",
      )
      .single()

    if (updateError || !buyer) {
      console.error("[PreQual API] Profile update error:", updateError)
      return NextResponse.json({ success: false, error: "Failed to update profile" }, { status: 500 })
    }

    // Mock prequalification logic
    const monthlyIncome = (buyer.monthly_income_cents || 0) / 100
    const monthlyHousing = (buyer.monthly_housing_cents || 0) / 100
    const dtiRatio = monthlyIncome > 0 ? (monthlyHousing / monthlyIncome) * 100 : 100

    if (dtiRatio > 50) {
      return NextResponse.json({
        success: false,
        error: "Debt-to-income ratio exceeds acceptable threshold",
      })
    }

    // Calculate approval
    const mockScore = Math.floor(Math.random() * 200) + 600
    let creditTier: string
    let rateMultiplier: number

    if (mockScore >= 750) {
      creditTier = "EXCELLENT"
      rateMultiplier = 1.0
    } else if (mockScore >= 700) {
      creditTier = "PRIME"
      rateMultiplier = 0.9
    } else if (mockScore >= 650) {
      creditTier = "NEAR_PRIME"
      rateMultiplier = 0.75
    } else {
      creditTier = "SUBPRIME"
      rateMultiplier = 0.5
    }

    const availableMonthly = monthlyIncome * 0.43 - monthlyHousing
    const maxMonthlyPayment = Math.max(0, Math.floor(availableMonthly * rateMultiplier))
    const avgApr =
      creditTier === "EXCELLENT" ? 0.045 : creditTier === "PRIME" ? 0.065 : creditTier === "NEAR_PRIME" ? 0.085 : 0.12
    const termMonths = 60
    const monthlyRate = avgApr / 12
    const approvedAmount =
      monthlyRate > 0
        ? maxMonthlyPayment * ((1 - Math.pow(1 + monthlyRate, -termMonths)) / monthlyRate)
        : maxMonthlyPayment * termMonths

    // Expire existing prequals
    await supabase
      .from("PreQualification")
      .update({ prequal_status: "EXPIRED", updatedAt: new Date().toISOString() })
      .eq("buyerId", buyer.id)
      .eq("prequal_status", "ACTIVE")

    // Create new prequalification
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 30)

    const { data: prequal, error: prequalError } = await supabase
      .from("PreQualification")
      .insert({
        buyerId: buyer.id,
        prequal_status: "ACTIVE",
        creditTier,
        maxOtd: Math.floor(approvedAmount),
        max_otd_amount_cents: Math.floor(approvedAmount) * 100,
        estimatedMonthlyMin: Math.floor(maxMonthlyPayment * 0.5),
        min_monthly_payment_cents: Math.floor(maxMonthlyPayment * 0.5) * 100,
        estimatedMonthlyMax: maxMonthlyPayment,
        max_monthly_payment_cents: maxMonthlyPayment * 100,
        dti: Math.round(dtiRatio * 100) / 100,
        dti_ratio: Math.round(dtiRatio * 100) / 100,
        provider_name: "MockPrequalProvider",
        provider_reference_id: `MOCK-${Date.now()}`,
        softPullCompleted: true,
        softPullDate: new Date().toISOString(),
        consentGiven: consentData.consentGiven,
        consentDate: new Date().toISOString(),
        expiresAt: expiresAt.toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .select("*")
      .single()

    if (prequalError) {
      console.error("[PreQual API] Create prequal error:", prequalError)
      return NextResponse.json({ success: false, error: "Failed to create prequalification" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: {
        preQualification: {
          id: prequal.id,
          status: "ACTIVE",
          creditTier,
          maxOtdAmountCents: Math.floor(approvedAmount) * 100,
          minMonthlyPaymentCents: Math.floor(maxMonthlyPayment * 0.5) * 100,
          maxMonthlyPaymentCents: maxMonthlyPayment * 100,
          dtiRatio: Math.round(dtiRatio * 100) / 100,
          expiresAt,
          providerName: "MockPrequalProvider",
        },
      },
    })
  } catch (error: any) {
    console.error("[PreQual API] POST error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 400 })
  }
}
