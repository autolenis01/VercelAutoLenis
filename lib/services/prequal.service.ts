import { prisma } from "@/lib/db"
import { PREQUAL_EXPIRY_DAYS } from "@/lib/constants"

// Types
export type PreQualStatus = "ACTIVE" | "EXPIRED" | "REVOKED" | "FAILED"

export interface BuyerProfileInput {
  dateOfBirth?: string
  addressLine1?: string
  addressLine2?: string
  city?: string
  state?: string
  postalCode?: string
  country?: string
  employmentStatus?: string
  employerName?: string
  monthlyIncomeCents?: number
  monthlyHousingCents?: number
  firstName?: string
  lastName?: string
  phone?: string
}

export interface PreQualStartInput {
  consentGiven: boolean
  consentText?: string
  ssnLast4?: string
}

export interface PreQualProviderResponse {
  success: boolean
  creditTier?: string
  approvedAmountCents?: number
  maxMonthlyPaymentCents?: number
  minMonthlyPaymentCents?: number
  dtiRatio?: number
  providerReferenceId?: string
  errorMessage?: string
}

// Default consent text
const DEFAULT_CONSENT_TEXT = `I authorize AutoLenis and its partners to obtain my credit report for the purpose of pre-qualifying me for vehicle financing. I understand this is a soft inquiry that will not affect my credit score. I acknowledge that I have read and agree to the Privacy Policy and Terms of Service.`

// Mock Pre-Qualification Provider
class MockPreQualProvider {
  static readonly PROVIDER_NAME = "MockPrequalProvider"

  static async prequalify(data: {
    firstName: string
    lastName: string
    dateOfBirth: string
    addressLine1: string
    city: string
    state: string
    postalCode: string
    monthlyIncomeCents: number
    monthlyHousingCents: number
    ssnLast4?: string
  }): Promise<PreQualProviderResponse> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Mock logic based on income and housing
    const monthlyIncome = data.monthlyIncomeCents / 100
    const monthlyHousing = data.monthlyHousingCents / 100

    // Calculate DTI
    const dtiRatio = monthlyIncome > 0 ? (monthlyHousing / monthlyIncome) * 100 : 100

    // Reject if DTI too high
    if (dtiRatio > 50) {
      return {
        success: false,
        errorMessage: "Debt-to-income ratio exceeds acceptable threshold",
      }
    }

    // Determine credit tier based on mock scoring
    const mockScore = Math.floor(Math.random() * 200) + 600 // 600-800
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

    // Calculate max monthly payment (43% DTI rule minus housing)
    const availableMonthly = monthlyIncome * 0.43 - monthlyHousing
    const maxMonthlyPayment = Math.max(0, Math.floor(availableMonthly * rateMultiplier))

    // Calculate max OTD (assuming 60-month term, avg APR based on tier)
    const avgApr =
      creditTier === "EXCELLENT" ? 0.045 : creditTier === "PRIME" ? 0.065 : creditTier === "NEAR_PRIME" ? 0.085 : 0.12
    const termMonths = 60
    const monthlyRate = avgApr / 12

    // PV formula: P = PMT * [(1 - (1 + r)^-n) / r]
    const approvedAmount =
      monthlyRate > 0
        ? maxMonthlyPayment * ((1 - Math.pow(1 + monthlyRate, -termMonths)) / monthlyRate)
        : maxMonthlyPayment * termMonths

    return {
      success: true,
      creditTier,
      approvedAmountCents: Math.floor(approvedAmount) * 100,
      maxMonthlyPaymentCents: maxMonthlyPayment * 100,
      minMonthlyPaymentCents: Math.floor(maxMonthlyPayment * 0.5) * 100,
      dtiRatio: Math.round(dtiRatio * 100) / 100,
      providerReferenceId: `MOCK-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    }
  }
}

export class PreQualService {
  // Get buyer profile
  async getBuyerProfile(userId: string) {
    return prisma.buyerProfile.findUnique({
      where: { userId },
    })
  }

  // Update buyer profile (upsert)
  async updateBuyerProfile(userId: string, data: BuyerProfileInput) {
    // Convert cents fields if provided
    const updateData: Record<string, unknown> = {}

    if (data.dateOfBirth) updateData.date_of_birth = new Date(data.dateOfBirth)
    if (data.addressLine1) updateData.address_line1 = data.addressLine1
    if (data.addressLine2 !== undefined) updateData.address_line2 = data.addressLine2
    if (data.city) updateData.city = data.city
    if (data.state) updateData.state = data.state
    if (data.postalCode) updateData.postal_code = data.postalCode
    if (data.country) updateData.country = data.country
    if (data.employmentStatus) updateData.employmentStatus = data.employmentStatus
    if (data.employerName) updateData.employerName = data.employerName
    if (data.monthlyIncomeCents !== undefined) updateData.monthly_income_cents = data.monthlyIncomeCents
    if (data.monthlyHousingCents !== undefined) updateData.monthly_housing_cents = data.monthlyHousingCents
    if (data.firstName) updateData.firstName = data.firstName
    if (data.lastName) updateData.lastName = data.lastName
    if (data.phone) updateData.phone = data.phone

    updateData.updatedAt = new Date()

    return prisma.buyerProfile.upsert({
      where: { userId },
      create: {
        userId,
        ...updateData,
        createdAt: new Date(),
      },
      update: updateData,
    })
  }

  // Get active pre-qualification for user
  async getActivePrequalification(userId: string) {
    // First check by buyerId (legacy field)
    const prequal = await prisma.preQualification.findFirst({
      where: {
        buyerId: userId,
        prequal_status: "ACTIVE",
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    })

    return prequal
  }

  // Get current pre-qualification status
  async getCurrentPreQual(userId: string) {
    const prequal = await this.getActivePrequalification(userId)

    if (!prequal) {
      return {
        active: false,
        preQualification: null,
      }
    }

    return {
      active: true,
      preQualification: {
        id: prequal.id,
        status: prequal.prequal_status,
        creditTier: prequal.creditTier,
        maxOtdAmountCents: prequal.max_otd_amount_cents || Math.floor((prequal.maxOtd || 0) * 100),
        minMonthlyPaymentCents:
          prequal.min_monthly_payment_cents || Math.floor((prequal.estimatedMonthlyMin || 0) * 100),
        maxMonthlyPaymentCents:
          prequal.max_monthly_payment_cents || Math.floor((prequal.estimatedMonthlyMax || 0) * 100),
        dtiRatio: prequal.dti_ratio || prequal.dti,
        expiresAt: prequal.expiresAt,
        providerName: prequal.provider_name,
        createdAt: prequal.createdAt,
      },
    }
  }

  // Validate profile completeness
  validateProfileForPreQual(profile: Record<string, unknown> | null): {
    valid: boolean
    missingFields: string[]
  } {
    const missingFields: string[] = []

    if (!profile) {
      return { valid: false, missingFields: ["Profile not found. Please complete your profile first."] }
    }

    if (!profile.date_of_birth && !profile.dateOfBirth) missingFields.push("dateOfBirth")
    if (!profile.address_line1 && !profile.address) missingFields.push("addressLine1")
    if (!profile.city) missingFields.push("city")
    if (!profile.state) missingFields.push("state")
    if (!profile.postal_code && !profile.postalCode && !profile.zip) missingFields.push("postalCode")
    if (!profile.monthly_income_cents && !profile.monthlyIncomeCents && !profile.annualIncome)
      missingFields.push("monthlyIncomeCents")
    if (
      profile.monthly_housing_cents === undefined &&
      profile.monthlyHousingCents === undefined &&
      profile.monthlyHousing === undefined
    ) {
      missingFields.push("monthlyHousingCents")
    }

    return { valid: missingFields.length === 0, missingFields }
  }

  // Start pre-qualification process
  async startPreQual(
    userId: string,
    input: PreQualStartInput,
    requestContext: { ipAddress?: string; userAgent?: string },
  ) {
    // 1. Validate consent
    if (!input.consentGiven) {
      throw new Error("Consent is required to proceed with pre-qualification")
    }

    // 2. Load and validate profile
    const profile = await this.getBuyerProfile(userId)
    const validation = this.validateProfileForPreQual(profile as Record<string, unknown>)

    if (!validation.valid) {
      throw new Error(`Profile incomplete. Missing: ${validation.missingFields.join(", ")}`)
    }

    // 3. Record consent
    await prisma.$executeRaw`
      INSERT INTO credit_consent_events (id, user_id, consent_given, consent_text, provider_name, ip_address, user_agent, created_at)
      VALUES (
        gen_random_uuid()::text,
        ${userId},
        ${input.consentGiven},
        ${input.consentText || DEFAULT_CONSENT_TEXT},
        ${MockPreQualProvider.PROVIDER_NAME},
        ${requestContext.ipAddress || null},
        ${requestContext.userAgent || null},
        now()
      )
    `

    // 4. Build provider request payload
    const requestPayload = {
      firstName: profile!.firstName || "",
      lastName: profile!.lastName || "",
      dateOfBirth:
        (profile as any).date_of_birth?.toISOString().split("T")[0] ||
        (profile as any).dateOfBirth?.toISOString().split("T")[0] ||
        "",
      addressLine1: (profile as any).address_line1 || (profile as any).address || "",
      city: profile!.city || "",
      state: profile!.state || "",
      postalCode: (profile as any).postal_code || (profile as any).postalCode || (profile as any).zip || "",
      monthlyIncomeCents:
        (profile as any).monthly_income_cents ||
        (profile as any).monthlyIncomeCents ||
        Math.floor((((profile as any).annualIncome || 0) / 12) * 100),
      monthlyHousingCents:
        (profile as any).monthly_housing_cents ||
        (profile as any).monthlyHousingCents ||
        Math.floor(((profile as any).monthlyHousing || 0) * 100),
      ssnLast4: input.ssnLast4,
    }

    // 5. Call provider
    let providerResponse: PreQualProviderResponse
    let providerEventStatus: "SUCCESS" | "ERROR" = "SUCCESS"
    let providerErrorMessage: string | null = null

    try {
      providerResponse = await MockPreQualProvider.prequalify(requestPayload)
      if (!providerResponse.success) {
        providerEventStatus = "ERROR"
        providerErrorMessage = providerResponse.errorMessage || "Pre-qualification failed"
      }
    } catch (error) {
      providerEventStatus = "ERROR"
      providerErrorMessage = error instanceof Error ? error.message : "Provider error"
      providerResponse = { success: false, errorMessage: providerErrorMessage }
    }

    // 6. Expire any existing ACTIVE pre-quals for this user
    await prisma.preQualification.updateMany({
      where: {
        buyerId: userId,
        prequal_status: "ACTIVE",
      },
      data: {
        prequal_status: "EXPIRED",
        updatedAt: new Date(),
      },
    })

    // 7. Create new pre-qualification record
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + (PREQUAL_EXPIRY_DAYS || 30))

    const newStatus: PreQualStatus = providerResponse.success ? "ACTIVE" : "FAILED"

    const prequal = await prisma.preQualification.create({
      data: {
        buyerId: userId,
        prequal_status: newStatus,
        creditTier: (providerResponse.creditTier as any) || null,
        maxOtd: providerResponse.approvedAmountCents ? providerResponse.approvedAmountCents / 100 : null,
        max_otd_amount_cents: providerResponse.approvedAmountCents || null,
        estimatedMonthlyMin: providerResponse.minMonthlyPaymentCents
          ? providerResponse.minMonthlyPaymentCents / 100
          : null,
        min_monthly_payment_cents: providerResponse.minMonthlyPaymentCents || null,
        estimatedMonthlyMax: providerResponse.maxMonthlyPaymentCents
          ? providerResponse.maxMonthlyPaymentCents / 100
          : null,
        max_monthly_payment_cents: providerResponse.maxMonthlyPaymentCents || null,
        dti: providerResponse.dtiRatio || null,
        dti_ratio: providerResponse.dtiRatio || null,
        provider_name: MockPreQualProvider.PROVIDER_NAME,
        provider_reference_id: providerResponse.providerReferenceId || null,
        raw_response_json: providerResponse as any,
        softPullCompleted: providerResponse.success,
        softPullDate: new Date(),
        consentGiven: true,
        consentDate: new Date(),
        expiresAt: providerResponse.success ? expiresAt : null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    })

    // 8. Log provider event
    await prisma.$executeRaw`
      INSERT INTO prequal_provider_events (id, user_id, pre_qualification_id, request_payload, response_payload, status, error_message, created_at)
      VALUES (
        gen_random_uuid()::text,
        ${userId},
        ${prequal.id},
        ${JSON.stringify(requestPayload)}::jsonb,
        ${JSON.stringify(providerResponse)}::jsonb,
        ${providerEventStatus},
        ${providerErrorMessage},
        now()
      )
    `

    // 9. Log compliance event
    await prisma.complianceEvent.create({
      data: {
        eventType: "SOFT_CREDIT_PULL",
        userId,
        buyerId: userId,
        severity: providerResponse.success ? "INFO" : "WARN",
        details: {
          prequalId: prequal.id,
          status: newStatus,
          creditTier: providerResponse.creditTier,
          maxOtdCents: providerResponse.approvedAmountCents,
          providerName: MockPreQualProvider.PROVIDER_NAME,
        },
        createdAt: new Date(),
      },
    })

    // 10. Return result
    if (!providerResponse.success) {
      return {
        success: false,
        error: providerResponse.errorMessage || "Pre-qualification failed. Please try again or contact support.",
      }
    }

    return {
      success: true,
      preQualification: {
        id: prequal.id,
        status: "ACTIVE",
        creditTier: providerResponse.creditTier,
        maxOtdAmountCents: providerResponse.approvedAmountCents,
        minMonthlyPaymentCents: providerResponse.minMonthlyPaymentCents,
        maxMonthlyPaymentCents: providerResponse.maxMonthlyPaymentCents,
        dtiRatio: providerResponse.dtiRatio,
        expiresAt,
        providerName: MockPreQualProvider.PROVIDER_NAME,
      },
    }
  }

  // Refresh pre-qualification (re-run)
  async refreshPreQual(userId: string, requestContext: { ipAddress?: string; userAgent?: string }) {
    // Load existing consent - we still need fresh consent for refresh
    return this.startPreQual(userId, { consentGiven: true, consentText: DEFAULT_CONSENT_TEXT }, requestContext)
  }

  // Admin: Get prequal history for user
  async getPreQualHistoryForUser(userId: string) {
    const [preQuals, consentEvents, providerEvents] = await Promise.all([
      prisma.preQualification.findMany({
        where: { buyerId: userId },
        orderBy: { createdAt: "desc" },
      }),
      prisma.$queryRaw<
        Array<{
          id: string
          user_id: string
          consent_given: boolean
          consent_text: string
          provider_name: string
          ip_address: string | null
          user_agent: string | null
          created_at: Date
        }>
      >`SELECT * FROM credit_consent_events WHERE user_id = ${userId} ORDER BY created_at DESC`,
      prisma.$queryRaw<
        Array<{
          id: string
          user_id: string
          pre_qualification_id: string | null
          request_payload: unknown
          response_payload: unknown
          status: string
          error_message: string | null
          created_at: Date
        }>
      >`SELECT * FROM prequal_provider_events WHERE user_id = ${userId} ORDER BY created_at DESC`,
    ])

    const activePreQual = preQuals.find((p: any) => p.prequal_status === "ACTIVE" && p.expiresAt && p.expiresAt > new Date())

    return {
      activePreQualification: activePreQual || null,
      preQualificationHistory: preQuals,
      consentEvents,
      providerEvents,
    }
  }

  // Admin: Revoke pre-qualification
  async revokePreQual(userId: string, adminUserId: string, reason?: string) {
    const activePreQual = await this.getActivePrequalification(userId)

    if (!activePreQual) {
      throw new Error("No active pre-qualification found for this user")
    }

    await prisma.preQualification.update({
      where: { id: activePreQual.id },
      data: {
        prequal_status: "REVOKED",
        updatedAt: new Date(),
      },
    })

    // Log compliance event
    await prisma.complianceEvent.create({
      data: {
        eventType: "PREQUAL_REVOKED",
        userId,
        buyerId: userId,
        severity: "WARN",
        details: {
          prequalId: activePreQual.id,
          revokedBy: adminUserId,
          reason: reason || "Admin revocation",
        },
        createdAt: new Date(),
      },
    })

    return { success: true }
  }
}

// Export singleton instance
export const prequalService = new PreQualService()
export default prequalService
