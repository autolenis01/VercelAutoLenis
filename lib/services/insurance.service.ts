import { prisma } from "@/lib/db"

// Insurance provider interface for abstraction
interface InsuranceProviderAdapter {
  name: string
  requestQuotes(input: QuoteRequestInput): Promise<ProviderQuoteResponse[]>
  bindPolicy(quoteRef: string, effectiveDate: Date, applicant: ApplicantInfo): Promise<BindPolicyResponse>
}

interface QuoteRequestInput {
  applicant: ApplicantInfo
  vehicle: VehicleInfo
  coveragePreferences?: CoveragePreferences
}

interface ApplicantInfo {
  firstName: string
  lastName: string
  dateOfBirth: string
  address: {
    line1: string
    line2?: string
    city: string
    state: string
    postalCode: string
  }
  email?: string
  phone?: string
}

interface VehicleInfo {
  year: number
  make: string
  model: string
  trim?: string
  vin?: string
  isNew: boolean
}

interface CoveragePreferences {
  liabilityLimits?: string
  collisionDeductibleCents?: number
  comprehensiveDeductibleCents?: number
}

interface ProviderQuoteResponse {
  carrierName: string
  productName: string
  premiumMonthlyCents: number
  premiumSemiAnnualCents?: number
  premiumAnnualCents?: number
  coverageJson: Record<string, any>
  quoteRef: string
  validUntil?: Date
}

interface BindPolicyResponse {
  policyNumber: string
  carrierName: string
  effectiveDate: Date
  endDate?: Date
  documentUrl?: string
  rawResponse: Record<string, any>
}

// Mock provider adapter (replace with real API integration)
class MockInsuranceProvider implements InsuranceProviderAdapter {
  name = "AutoLenis Partner Network"

  async requestQuotes(input: QuoteRequestInput): Promise<ProviderQuoteResponse[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    const baseMonthly = 12000 + Math.floor(Math.random() * 5000) // $120-$170

    return [
      {
        carrierName: "Progressive",
        productName: "Full Coverage 100/300",
        premiumMonthlyCents: baseMonthly,
        premiumSemiAnnualCents: baseMonthly * 6 - 500, // Small discount
        premiumAnnualCents: baseMonthly * 12 - 1500,
        coverageJson: {
          liability: "100/300",
          collisionDeductible: 1000,
          comprehensiveDeductible: 500,
          uninsuredMotorist: "100/300",
          medicalPayments: 5000,
        },
        quoteRef: `PROG-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
      {
        carrierName: "Geico",
        productName: "Standard Protection",
        premiumMonthlyCents: baseMonthly - 800,
        premiumSemiAnnualCents: (baseMonthly - 800) * 6 - 400,
        premiumAnnualCents: (baseMonthly - 800) * 12 - 1200,
        coverageJson: {
          liability: "50/100",
          collisionDeductible: 500,
          comprehensiveDeductible: 500,
          uninsuredMotorist: "50/100",
          medicalPayments: 2500,
        },
        quoteRef: `GEICO-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      {
        carrierName: "State Farm",
        productName: "Premium Coverage Plus",
        premiumMonthlyCents: baseMonthly + 1500,
        premiumSemiAnnualCents: (baseMonthly + 1500) * 6 - 800,
        premiumAnnualCents: (baseMonthly + 1500) * 12 - 2000,
        coverageJson: {
          liability: "250/500",
          collisionDeductible: 500,
          comprehensiveDeductible: 250,
          uninsuredMotorist: "250/500",
          medicalPayments: 10000,
          rentalReimbursement: true,
          roadsideAssistance: true,
        },
        quoteRef: `SF-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    ]
  }

  async bindPolicy(quoteRef: string, effectiveDate: Date, applicant: ApplicantInfo): Promise<BindPolicyResponse> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const carrier = quoteRef.startsWith("PROG") ? "Progressive" : quoteRef.startsWith("GEICO") ? "Geico" : "State Farm"

    return {
      policyNumber: `POL-${carrier.substring(0, 3).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`,
      carrierName: carrier,
      effectiveDate,
      endDate: new Date(effectiveDate.getTime() + 6 * 30 * 24 * 60 * 60 * 1000), // 6 months
      documentUrl: `https://cdn.autolenis.com/policies/${quoteRef}/proof-of-insurance.pdf`,
      rawResponse: {
        status: "BOUND",
        quoteRef,
        bindDate: new Date().toISOString(),
        applicantName: `${applicant.firstName} ${applicant.lastName}`,
      },
    }
  }
}

// Get active provider
function getProvider(): InsuranceProviderAdapter {
  // In production, this would load from insurance_providers table
  return new MockInsuranceProvider()
}

export class InsuranceService {
  // Log insurance event
  private static async logEvent(
    type: string,
    selectedDealId: string | null,
    userId: string | null,
    providerName: string | null,
    details: Record<string, any>,
  ) {
    await prisma.$executeRaw`
      INSERT INTO "insurance_events" ("id", "selected_deal_id", "user_id", "type", "provider_name", "details", "created_at")
      VALUES (gen_random_uuid()::text, ${selectedDealId}, ${userId}, ${type}, ${providerName}, ${JSON.stringify(details)}::jsonb, NOW())
    `
  }

  // Get insurance overview for a deal
  static async getInsuranceOverview(userId: string, dealId: string) {
    // Verify ownership
    const deal = await prisma.selectedDeal.findFirst({
      where: {
        id: dealId,
        OR: [{ user_id: userId }, { buyerId: userId }],
      },
      include: {
        insurancePolicy: true,
      },
    })

    if (!deal) {
      throw new Error("Deal not found or unauthorized")
    }

    // Get quotes for this deal
    const quotes = await prisma.insuranceQuote.findMany({
      where: { selected_deal_id: dealId },
      orderBy: { createdAt: "desc" },
    })

    // Get policies for this deal
    const policies = await prisma.insurancePolicy.findMany({
      where: {
        OR: [{ dealId }, { selected_deal_id: dealId }],
      },
      orderBy: { createdAt: "desc" },
    })

    return {
      selected_deal: {
        id: deal.id,
        insurance_status: deal.insurance_status || "NOT_SELECTED",
      },
      quotes: quotes.map((q) => ({
        id: q.id,
        carrier_name: q.carrier_name || q.carrier,
        product_name: q.product_name || q.productName,
        premium_monthly_cents: q.premium_monthly_cents || Math.round((q.monthlyPremium || 0) * 100),
        premium_semi_annual_cents: q.premium_semi_annual_cents || Math.round((q.sixMonthPremium || 0) * 100),
        premium_annual_cents: q.premium_annual_cents,
        coverage: q.coverage_json || q.coverageJson || q.coverageLimits,
        quote_ref: q.quote_ref,
        quote_status: q.quote_status || "NEW",
        valid_until: q.valid_until || q.expiresAt,
        created_at: q.createdAt,
      })),
      policies: policies.map((p) => ({
        id: p.id,
        type: p.type || "AUTOLENIS",
        carrier_name: p.carrier,
        policy_number: p.policy_number_v2 || p.policyNumber,
        vehicle_vin: p.vehicle_vin,
        start_date: p.start_date || p.startDate,
        end_date: p.end_date || p.endDate,
        document_url: p.documentUrl,
        is_verified: p.is_verified || false,
        status: p.status,
      })),
    }
  }

  // Request insurance quotes from provider
  static async requestQuotes(userId: string, dealId: string, coveragePreferences?: CoveragePreferences) {
    // Verify ownership and get deal details
    const deal = await prisma.selectedDeal.findFirst({
      where: {
        id: dealId,
        OR: [{ user_id: userId }, { buyerId: userId }],
      },
      include: {
        auctionOffer: {
          include: {
            inventoryItem: {
              include: {
                vehicle: true,
              },
            },
          },
        },
      },
    })

    if (!deal) {
      throw new Error("Deal not found or unauthorized")
    }

    // Get buyer profile
    const buyerProfile = await prisma.buyerProfile.findFirst({
      where: { userId },
    })

    if (!buyerProfile) {
      throw new Error("Buyer profile not found. Please complete your profile first.")
    }

    // Validate required profile fields
    if (!buyerProfile.firstName || !buyerProfile.lastName) {
      throw new Error("Please complete your name in your profile")
    }

    // Get vehicle info
    const vehicle = deal.auctionOffer?.inventoryItem?.vehicle
    const inventoryItem = deal.auctionOffer?.inventoryItem

    if (!vehicle) {
      throw new Error("Vehicle information not found for this deal")
    }

    // Build applicant info
    const applicant: ApplicantInfo = {
      firstName: buyerProfile.firstName,
      lastName: buyerProfile.lastName,
      dateOfBirth: buyerProfile.date_of_birth?.toISOString() || buyerProfile.dateOfBirth?.toISOString() || "",
      address: {
        line1: buyerProfile.address_line1 || buyerProfile.address || "",
        line2: buyerProfile.address_line2 || buyerProfile.addressLine2 || undefined,
        city: buyerProfile.city || "",
        state: buyerProfile.state || "",
        postalCode: buyerProfile.postal_code || buyerProfile.postalCode || buyerProfile.zip || "",
      },
      phone: buyerProfile.phone || undefined,
    }

    // Build vehicle info
    const vehicleInfo: VehicleInfo = {
      year: vehicle.year,
      make: vehicle.make,
      model: vehicle.model,
      trim: vehicle.trim || undefined,
      vin: inventoryItem?.vin || vehicle.vin || undefined,
      isNew: inventoryItem?.is_new || inventoryItem?.isNew || false,
    }

    // Log quote request
    await this.logEvent("QUOTE_REQUESTED", dealId, userId, null, {
      applicant: { ...applicant, dateOfBirth: "[REDACTED]" },
      vehicle: vehicleInfo,
      coveragePreferences,
    })

    try {
      // Call provider
      const provider = getProvider()
      const providerQuotes = await provider.requestQuotes({
        applicant,
        vehicle: vehicleInfo,
        coveragePreferences,
      })

      const savedQuotes = await Promise.all(
        providerQuotes.map(async (quote) => {
          return prisma.insuranceQuote.create({
            data: {
              buyerId: userId,
              buyer_id: userId,
              selected_deal_id: dealId,
              vehicleId: vehicle.id,
              vehicle_id: vehicle.id,
              carrier: quote.carrierName,
              carrier_name: quote.carrierName,
              product_name: quote.productName,
              productName: quote.productName,
              monthlyPremium: quote.premiumMonthlyCents / 100,
              monthly_premium: quote.premiumMonthlyCents / 100,
              premium_monthly_cents: quote.premiumMonthlyCents,
              sixMonthPremium: quote.premiumSemiAnnualCents ? quote.premiumSemiAnnualCents / 100 : null,
              six_month_premium: quote.premiumSemiAnnualCents ? quote.premiumSemiAnnualCents / 100 : null,
              premium_semi_annual_cents: quote.premiumSemiAnnualCents,
              premium_annual_cents: quote.premiumAnnualCents,
              coverage_json: quote.coverageJson,
              coverageJson: quote.coverageJson,
              coverageLimits: quote.coverageJson,
              coverage_limits: quote.coverageJson,
              quote_ref: quote.quoteRef,
              quote_status: "NEW",
              valid_until: quote.validUntil,
              expiresAt: quote.validUntil,
              expires_at: quote.validUntil,
              vehicle_vin: vehicleInfo.vin,
              provider_name: provider.name,
            },
          })
        }),
      )

      // Log success
      await this.logEvent("QUOTE_RECEIVED", dealId, userId, getProvider().name, {
        quoteCount: savedQuotes.length,
        carriers: savedQuotes.map((q) => q.carrier_name),
      })

      return savedQuotes.map((q) => ({
        id: q.id,
        carrier_name: q.carrier_name,
        product_name: q.product_name,
        premium_monthly_cents: q.premium_monthly_cents,
        premium_semi_annual_cents: q.premium_semi_annual_cents,
        premium_annual_cents: q.premium_annual_cents,
        coverage: q.coverage_json,
        quote_ref: q.quote_ref,
        quote_status: q.quote_status,
        valid_until: q.valid_until,
      }))
    } catch (error: any) {
      // Log failure
      await this.logEvent("QUOTE_FAILED", dealId, userId, null, {
        error: error.message,
      })
      throw new Error(`Failed to get insurance quotes: ${error.message}`)
    }
  }

  // Select a quote (AutoLenis path)
  static async selectQuote(userId: string, dealId: string, quoteId: string) {
    // Verify deal ownership
    const deal = await prisma.selectedDeal.findFirst({
      where: {
        id: dealId,
        OR: [{ user_id: userId }, { buyerId: userId }],
      },
    })

    if (!deal) {
      throw new Error("Deal not found or unauthorized")
    }

    // Verify quote exists and belongs to this deal
    const quote = await prisma.insuranceQuote.findUnique({
      where: { id: quoteId },
    })

    if (!quote || quote.selected_deal_id !== dealId) {
      throw new Error("Quote not found or does not belong to this deal")
    }

    // Check if quote is expired
    const validUntil = quote.valid_until || quote.expiresAt
    if (validUntil && new Date(validUntil) < new Date()) {
      throw new Error("This quote has expired. Please request new quotes.")
    }

    // Update quote status
    await prisma.insuranceQuote.update({
      where: { id: quoteId },
      data: { quote_status: "SELECTED" },
    })

    // Update deal insurance status
    await prisma.selectedDeal.update({
      where: { id: dealId },
      data: { insurance_status: "SELECTED_AUTOLENIS" },
    })

    // Log event
    await this.logEvent("QUOTE_SELECTED", dealId, userId, quote.provider_name, {
      quoteId,
      carrier: quote.carrier_name || quote.carrier,
      premiumMonthlyCents: quote.premium_monthly_cents,
    })

    return {
      quote_id: quoteId,
      carrier_name: quote.carrier_name || quote.carrier,
      product_name: quote.product_name,
      premium_monthly_cents: quote.premium_monthly_cents,
      insurance_status: "SELECTED_AUTOLENIS",
    }
  }

  // Bind policy with provider (AutoLenis path)
  static async bindPolicy(userId: string, dealId: string, quoteId: string, effectiveDate: Date) {
    // Verify deal ownership
    const deal = await prisma.selectedDeal.findFirst({
      where: {
        id: dealId,
        OR: [{ user_id: userId }, { buyerId: userId }],
      },
      include: {
        auctionOffer: {
          include: {
            inventoryItem: {
              include: { vehicle: true },
            },
          },
        },
      },
    })

    if (!deal) {
      throw new Error("Deal not found or unauthorized")
    }

    // Verify quote
    const quote = await prisma.insuranceQuote.findUnique({
      where: { id: quoteId },
    })

    if (!quote || quote.selected_deal_id !== dealId) {
      throw new Error("Quote not found or does not belong to this deal")
    }

    // Check expiration
    const validUntil = quote.valid_until || quote.expiresAt
    if (validUntil && new Date(validUntil) < new Date()) {
      throw new Error("This quote has expired")
    }

    // Get buyer profile for bind request
    const buyerProfile = await prisma.buyerProfile.findFirst({
      where: { userId },
    })

    if (!buyerProfile) {
      throw new Error("Buyer profile not found")
    }

    const applicant: ApplicantInfo = {
      firstName: buyerProfile.firstName || "",
      lastName: buyerProfile.lastName || "",
      dateOfBirth: buyerProfile.date_of_birth?.toISOString() || "",
      address: {
        line1: buyerProfile.address_line1 || buyerProfile.address || "",
        city: buyerProfile.city || "",
        state: buyerProfile.state || "",
        postalCode: buyerProfile.postal_code || buyerProfile.zip || "",
      },
    }

    try {
      // Call provider to bind
      const provider = getProvider()
      const bindResult = await provider.bindPolicy(quote.quote_ref || quoteId, effectiveDate, applicant)

      const policy = await prisma.insurancePolicy.create({
        data: {
          dealId,
          selected_deal_id: dealId,
          deal_id: dealId,
          userId,
          user_id: userId,
          type: "AUTOLENIS",
          status: "BOUND",
          carrier: bindResult.carrierName,
          carrier_name: bindResult.carrierName,
          policyNumber: bindResult.policyNumber,
          policy_number: bindResult.policyNumber,
          policy_number_v2: bindResult.policyNumber,
          vehicle_vin: quote.vehicle_vin,
          startDate: bindResult.effectiveDate,
          start_date: bindResult.effectiveDate,
          endDate: bindResult.endDate,
          end_date: bindResult.endDate,
          documentUrl: bindResult.documentUrl,
          document_url: bindResult.documentUrl,
          raw_policy_json: bindResult.rawResponse,
          coverageType: quote.product_name || "FULL",
          coverage_type: quote.product_name || "FULL",
          monthlyPremium: (quote.premium_monthly_cents || 0) / 100,
          monthly_premium: (quote.premium_monthly_cents || 0) / 100,
        },
      })

      // Update quote status
      await prisma.insuranceQuote.update({
        where: { id: quoteId },
        data: { quote_status: "CONVERTED" },
      })

      // Update deal status
      await prisma.selectedDeal.update({
        where: { id: dealId },
        data: { insurance_status: "BOUND" },
      })

      // Log event
      await this.logEvent("POLICY_BOUND", dealId, userId, getProvider().name, {
        policyId: policy.id,
        policyNumber: policy.policyNumber,
        carrier: policy.carrier,
        effectiveDate: bindResult.effectiveDate,
      })

      return {
        policy_id: policy.id,
        policy_number: policy.policyNumber,
        carrier_name: policy.carrier,
        start_date: policy.start_date,
        end_date: policy.end_date,
        document_url: policy.documentUrl,
        insurance_status: "BOUND",
      }
    } catch (error: any) {
      await this.logEvent("ERROR", dealId, userId, null, {
        action: "BIND_POLICY",
        error: error.message,
        quoteId,
      })
      throw new Error(`Failed to bind policy: ${error.message}`)
    }
  }

  // Upload external insurance proof
  static async uploadExternalProof(
    userId: string,
    dealId: string,
    carrierName: string,
    policyNumber: string,
    startDate: Date,
    endDate: Date | null,
    documentUrl: string,
  ) {
    // Verify deal ownership
    const deal = await prisma.selectedDeal.findFirst({
      where: {
        id: dealId,
        OR: [{ user_id: userId }, { buyerId: userId }],
      },
    })

    if (!deal) {
      throw new Error("Deal not found or unauthorized")
    }

    // Upsert policy
    const existingPolicy = await prisma.insurancePolicy.findFirst({
      where: {
        OR: [{ dealId }, { selected_deal_id: dealId }],
        type: "EXTERNAL",
      },
    })

    let policy
    if (existingPolicy) {
      policy = await prisma.insurancePolicy.update({
        where: { id: existingPolicy.id },
        data: {
          carrier: carrierName,
          carrier_name: carrierName,
          policyNumber,
          policy_number: policyNumber,
          policy_number_v2: policyNumber,
          startDate,
          start_date: startDate,
          endDate,
          end_date: endDate,
          documentUrl,
          document_url: documentUrl,
          status: "EXTERNAL_UPLOADED",
          is_verified: false, // Reset verification on update
        },
      })
    } else {
      policy = await prisma.insurancePolicy.create({
        data: {
          dealId,
          selected_deal_id: dealId,
          deal_id: dealId,
          userId,
          user_id: userId,
          type: "EXTERNAL",
          status: "EXTERNAL_UPLOADED",
          carrier: carrierName,
          carrier_name: carrierName,
          policyNumber,
          policy_number: policyNumber,
          policy_number_v2: policyNumber,
          startDate,
          start_date: startDate,
          endDate,
          end_date: endDate,
          documentUrl,
          document_url: documentUrl,
          coverageType: "EXTERNAL",
          coverage_type: "EXTERNAL",
          is_verified: false,
        },
      })
    }

    // Update deal status
    await prisma.selectedDeal.update({
      where: { id: dealId },
      data: { insurance_status: "EXTERNAL_PROOF_UPLOADED" },
    })

    // Log event
    await this.logEvent("POLICY_UPLOAD", dealId, userId, null, {
      policyId: policy.id,
      carrier: carrierName,
      policyNumber,
      documentUrl,
    })

    return {
      policy_id: policy.id,
      carrier_name: policy.carrier,
      policy_number: policy.policy_number_v2 || policy.policyNumber,
      start_date: policy.start_date,
      end_date: policy.end_date,
      document_url: policy.documentUrl,
      is_verified: policy.is_verified,
      insurance_status: "EXTERNAL_PROOF_UPLOADED",
    }
  }

  // Dealer view (read-only)
  static async getDealerView(dealerId: string, dealId: string) {
    // Verify dealer owns this deal's offer
    const deal = await prisma.selectedDeal.findFirst({
      where: {
        id: dealId,
        auctionOffer: {
          dealer_id: dealerId,
        },
      },
      include: {
        insurancePolicy: true,
      },
    })

    if (!deal) {
      throw new Error("Deal not found or unauthorized")
    }

    const policy = deal.insurancePolicy

    return {
      insurance_status: deal.insurance_status || "NOT_SELECTED",
      policy_summary: policy
        ? {
            type: policy.type || "AUTOLENIS",
            carrier_name: policy.carrier,
            policy_number: policy.policy_number_v2 || policy.policyNumber,
            start_date: policy.start_date || policy.startDate,
            end_date: policy.end_date || policy.endDate,
          }
        : null,
    }
  }

  // Admin: Get full insurance detail
  static async getAdminFullDetail(dealId: string) {
    const deal = await prisma.selectedDeal.findUnique({
      where: { id: dealId },
    })

    if (!deal) {
      throw new Error("Deal not found")
    }

    // Get all quotes
    const quotes = await prisma.insuranceQuote.findMany({
      where: { selected_deal_id: dealId },
      orderBy: { createdAt: "desc" },
    })

    // Get all policies
    const policies = await prisma.insurancePolicy.findMany({
      where: {
        OR: [{ dealId }, { selected_deal_id: dealId }],
      },
      orderBy: { createdAt: "desc" },
    })

    // Get events
    const eventsResult = await prisma.$queryRaw<any[]>`
      SELECT * FROM "insurance_events"
      WHERE "selected_deal_id" = ${dealId}
      ORDER BY "created_at" DESC
    `

    return {
      deal: {
        id: deal.id,
        insurance_status: deal.insurance_status,
        user_id: deal.user_id || deal.buyerId,
      },
      quotes: quotes.map((q) => ({
        id: q.id,
        carrier_name: q.carrier_name || q.carrier,
        product_name: q.product_name || q.productName,
        premium_monthly_cents: q.premium_monthly_cents,
        premium_semi_annual_cents: q.premium_semi_annual_cents,
        premium_annual_cents: q.premium_annual_cents,
        coverage_json: q.coverage_json || q.coverageJson,
        quote_ref: q.quote_ref,
        quote_status: q.quote_status || "NEW",
        valid_until: q.valid_until,
        vehicle_vin: q.vehicle_vin,
        provider_name: q.provider_name,
        created_at: q.createdAt,
      })),
      policies: policies.map((p) => ({
        id: p.id,
        type: p.type,
        carrier: p.carrier,
        policy_number: p.policy_number_v2 || p.policyNumber,
        vehicle_vin: p.vehicle_vin,
        start_date: p.start_date,
        end_date: p.end_date,
        document_url: p.documentUrl,
        raw_policy_json: p.raw_policy_json,
        is_verified: p.is_verified,
        status: p.status,
        created_at: p.createdAt,
      })),
      events: eventsResult,
    }
  }

  // Admin: Verify external policy
  static async verifyExternalPolicy(adminUserId: string, dealId: string, policyId: string, verified: boolean) {
    // Verify policy belongs to deal and is EXTERNAL type
    const policy = await prisma.insurancePolicy.findFirst({
      where: {
        id: policyId,
        OR: [{ dealId }, { selected_deal_id: dealId }],
        type: "EXTERNAL",
      },
    })

    if (!policy) {
      throw new Error("External policy not found for this deal")
    }

    // Update verification status
    await prisma.insurancePolicy.update({
      where: { id: policyId },
      data: { is_verified: verified },
    })

    // Log event
    await this.logEvent("POLICY_VERIFIED", dealId, adminUserId, null, {
      policyId,
      verified,
      adminUserId,
    })

    return {
      policy_id: policyId,
      is_verified: verified,
      carrier_name: policy.carrier,
      policy_number: policy.policy_number_v2 || policy.policyNumber,
    }
  }
}

export const insuranceService = new InsuranceService()
