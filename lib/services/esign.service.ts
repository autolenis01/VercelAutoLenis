import { prisma } from "@/lib/db"
import crypto from "crypto"

// E-Sign provider abstraction - can be swapped for DocuSign, HelloSign, etc.
interface ESignProvider {
  createEnvelope(params: {
    documents: { name: string; url: string }[]
    signers: { email: string; name: string; role: string }[]
    redirectUrl: string
    metadata?: Record<string, any>
  }): Promise<{ envelopeId: string; signingUrl?: string }>

  voidEnvelope(envelopeId: string, reason: string): Promise<void>

  getEnvelopeStatus(envelopeId: string): Promise<{
    status: "CREATED" | "SENT" | "COMPLETED" | "DECLINED" | "VOIDED"
    completedAt?: Date
  }>
}

// Mock provider for development
class MockESignProvider implements ESignProvider {
  async createEnvelope(params: any) {
    const envelopeId = `env_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`
    return {
      envelopeId,
      signingUrl: `https://esign-mock.autolenis.com/sign/${envelopeId}`,
    }
  }

  async voidEnvelope(envelopeId: string, reason: string) {
    // Mock void - in production, call provider API
  }

  async getEnvelopeStatus(envelopeId: string) {
    return { status: "SENT" as const }
  }
}

export class ESignService {
  private provider: ESignProvider

  constructor(provider?: ESignProvider) {
    this.provider = provider || new MockESignProvider()
  }

  // Verify webhook signature from provider
  verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
    const expectedSignature = crypto.createHmac("sha256", secret).update(payload).digest("hex")
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
  }

  // Create e-sign envelope (dealer action)
  async createEnvelope(
    selectedDealId: string,
    dealerUserId: string,
    options?: { provider?: string; embeddedSigning?: boolean },
  ) {
    // Load deal with all required relations
    const deal = await prisma.selectedDeal.findUnique({
      where: { id: selectedDealId },
      include: {
        auctionOffer: {
          include: {
            dealer: true,
          },
        },
        user: true,
        buyerProfile: true,
        contractDocuments: true,
        contractShieldScan: true,
      },
    })

    if (!deal) {
      throw new Error("Deal not found")
    }

    // Verify dealer ownership
    const dealerUser = await prisma.dealerUser.findFirst({
      where: { userId: dealerUserId },
    })

    if (!dealerUser || dealerUser.dealerId !== deal.auctionOffer?.dealer?.id) {
      throw new Error("Unauthorized: You do not own this deal")
    }

    // Check preconditions
    if (deal.deal_status !== "CONTRACT_PASSED") {
      throw new Error("Contract not yet approved by Contract Shield. Current status: " + deal.deal_status)
    }

    // Get contract documents
    const documents =
      deal.contractDocuments
        ?.filter((doc: any) => ["BUYERS_ORDER", "FINANCE_CONTRACT", "ADDENDUM"].includes(doc.type))
        .map((doc: any) => ({
          name: doc.type,
          url: doc.file_url || doc.fileUrl,
        })) || []

    if (documents.length === 0) {
      throw new Error("No contract documents found for signing")
    }

    // Build signers list
    const buyer = deal.user
    const buyerProfile = deal.buyerProfile
    const dealer = deal.auctionOffer?.dealer

    const signers = [
      {
        email: buyer?.email || "",
        name:
          `${buyerProfile?.firstName || buyer?.first_name || ""} ${buyerProfile?.lastName || buyer?.last_name || ""}`.trim() ||
          "Buyer",
        role: "BUYER",
      },
    ]

    if (dealer?.email) {
      signers.push({
        email: dealer.email,
        name: dealer.name || "Dealer",
        role: "DEALER",
      })
    }

    // Call provider to create envelope
    const providerName = options?.provider || "mock"
    const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://autolenis.com"}/buyer/deal/esign/complete`

    const providerResult = await this.provider.createEnvelope({
      documents,
      signers,
      redirectUrl,
      metadata: {
        selectedDealId,
        dealerUserId,
      },
    })

    // Create or update envelope record
    const existingEnvelope = await prisma.eSignEnvelope.findFirst({
      where: {
        OR: [{ selected_deal_id: selectedDealId }, { dealId: selectedDealId }],
        status: { in: ["CREATED", "SENT", "PENDING"] },
      },
    })

    let envelope
    if (existingEnvelope) {
      envelope = await prisma.eSignEnvelope.update({
        where: { id: existingEnvelope.id },
        data: {
          provider: providerName,
          provider_envelope_id: providerResult.envelopeId,
          providerEnvelopeId: providerResult.envelopeId,
          provider_envelope_id_alt: providerResult.envelopeId,
          providerEnvelopeIdAlt: providerResult.envelopeId,
          signing_url: providerResult.signingUrl,
          signingUrl: providerResult.signingUrl,
          signUrl: providerResult.signingUrl,
          sign_url: providerResult.signingUrl,
          status: "SENT",
          sentAt: new Date(),
          sent_at: new Date(),
          meta_json: { signers, documents, options },
          updatedAt: new Date(),
          updated_at: new Date(),
        },
      })
    } else {
      envelope = await prisma.eSignEnvelope.create({
        data: {
          selected_deal_id: selectedDealId,
          dealId: selectedDealId,
          deal_id: selectedDealId,
          provider: providerName,
          provider_envelope_id: providerResult.envelopeId,
          providerEnvelopeId: providerResult.envelopeId,
          provider_envelope_id_alt: providerResult.envelopeId,
          providerEnvelopeIdAlt: providerResult.envelopeId,
          signing_url: providerResult.signingUrl,
          signingUrl: providerResult.signingUrl,
          signUrl: providerResult.signingUrl,
          sign_url: providerResult.signingUrl,
          status: "SENT",
          sentAt: new Date(),
          sent_at: new Date(),
          meta_json: { signers, documents, options },
        },
      })
    }

    // Log event
    await prisma.$executeRaw`
      INSERT INTO "esign_events" ("id", "selected_deal_id", "envelope_id", "type", "provider", "details")
      VALUES (
        ${crypto.randomUUID()},
        ${selectedDealId},
        ${envelope.id},
        'ENVELOPE_CREATED',
        ${providerName},
        ${JSON.stringify({ signers, documentCount: documents.length, createdBy: dealerUserId })}::jsonb
      )
    `

    return {
      id: envelope.id,
      selectedDealId,
      provider: providerName,
      providerEnvelopeId: providerResult.envelopeId,
      status: envelope.status,
      signingUrl: providerResult.signingUrl,
      createdAt: envelope.createdAt,
    }
  }

  // Get e-sign status for buyer
  async getEnvelopeForBuyer(selectedDealId: string, buyerId: string) {
    // Verify buyer ownership
    const deal = await prisma.selectedDeal.findUnique({
      where: { id: selectedDealId },
    })

    if (!deal) {
      throw new Error("Deal not found")
    }

    const dealUserId = deal.user_id || deal.buyerId
    if (dealUserId !== buyerId) {
      throw new Error("Unauthorized: This is not your deal")
    }

    const envelope = await prisma.eSignEnvelope.findFirst({
      where: {
        OR: [{ selected_deal_id: selectedDealId }, { dealId: selectedDealId }],
      },
      orderBy: { createdAt: "desc" },
    })

    return {
      dealStatus: deal.deal_status || deal.status,
      envelope: envelope
        ? {
            status: envelope.status,
            signingUrl: envelope.signing_url || envelope.signingUrl || envelope.signUrl,
            completedAt: envelope.completedAt || envelope.completed_timestamp,
            sentAt: envelope.sentAt,
          }
        : null,
    }
  }

  // Handle webhook from e-sign provider
  async handleWebhook(payload: {
    provider: string
    envelope_id: string
    status: "COMPLETED" | "DECLINED" | "VOIDED"
    completed_at?: string
    raw?: any
  }) {
    // Find envelope by provider envelope ID
    const envelope = await prisma.eSignEnvelope.findFirst({
      where: {
        OR: [
          { provider_envelope_id: payload.envelope_id },
          { providerEnvelopeId: payload.envelope_id },
          { providerEnvelopeIdAlt: payload.envelope_id },
        ],
      },
    })

    if (!envelope) {
      throw new Error(`Envelope not found: ${payload.envelope_id}`)
    }

    const selectedDealId = envelope.selected_deal_id || envelope.dealId
    const completedAt = payload.completed_at ? new Date(payload.completed_at) : new Date()

    // Update envelope status
    await prisma.eSignEnvelope.update({
      where: { id: envelope.id },
      data: {
        status: payload.status,
        completedAt: payload.status === "COMPLETED" ? completedAt : undefined,
        completed_at: payload.status === "COMPLETED" ? completedAt : undefined,
        completed_timestamp: payload.status === "COMPLETED" ? completedAt : undefined,
        updatedAt: new Date(),
        updated_at: new Date(),
      },
    })

    // If completed, update deal status to SIGNED
    if (payload.status === "COMPLETED" && selectedDealId) {
      const deal = await prisma.selectedDeal.findUnique({
        where: { id: selectedDealId },
      })

      if (deal && (deal.deal_status === "CONTRACT_PASSED" || deal.status === "CONTRACT_PASSED")) {
        await prisma.selectedDeal.update({
          where: { id: selectedDealId },
          data: {
            deal_status: "SIGNED",
            status: "SIGNED",
            updatedAt: new Date(),
            updated_at: new Date(),
          },
        })

        // Log status change
        await prisma.$executeRaw`
          INSERT INTO "deal_status_history" ("id", "selected_deal_id", "previous_status", "new_status", "changed_by_role", "notes")
          VALUES (
            ${crypto.randomUUID()},
            ${selectedDealId},
            'CONTRACT_PASSED',
            'SIGNED',
            'SYSTEM',
            'E-sign completed via webhook'
          )
        `
      }
    }

    // Log webhook event
    await prisma.$executeRaw`
      INSERT INTO "esign_events" ("id", "selected_deal_id", "envelope_id", "type", "provider", "details")
      VALUES (
        ${crypto.randomUUID()},
        ${selectedDealId},
        ${envelope.id},
        ${"WEBHOOK_" + payload.status},
        ${payload.provider},
        ${JSON.stringify({ raw: payload.raw, completedAt: payload.completed_at })}::jsonb
      )
    `

    return { success: true, status: payload.status }
  }

  // Admin: Get full e-sign details
  async getEnvelopeForAdmin(selectedDealId: string) {
    const deal = await prisma.selectedDeal.findUnique({
      where: { id: selectedDealId },
      include: {
        user: true,
        buyerProfile: true,
        auctionOffer: {
          include: { dealer: true },
        },
      },
    })

    if (!deal) {
      throw new Error("Deal not found")
    }

    const envelope = await prisma.eSignEnvelope.findFirst({
      where: {
        OR: [{ selected_deal_id: selectedDealId }, { dealId: selectedDealId }],
      },
      orderBy: { createdAt: "desc" },
    })

    // Get events
    const events = await prisma.$queryRaw<any[]>`
      SELECT * FROM "esign_events" 
      WHERE "selected_deal_id" = ${selectedDealId}
      ORDER BY "created_at" DESC
      LIMIT 50
    `

    return {
      deal: {
        id: deal.id,
        status: deal.deal_status || deal.status,
        buyerEmail: deal.user?.email,
        buyerName: `${deal.buyerProfile?.firstName || ""} ${deal.buyerProfile?.lastName || ""}`.trim(),
        dealerName: deal.auctionOffer?.dealer?.name,
      },
      envelope: envelope
        ? {
            id: envelope.id,
            provider: envelope.provider,
            providerEnvelopeId: envelope.provider_envelope_id || envelope.providerEnvelopeId,
            status: envelope.status,
            signingUrl: envelope.signing_url || envelope.signingUrl,
            sentAt: envelope.sentAt,
            completedAt: envelope.completedAt || envelope.completed_timestamp,
            metaJson: envelope.meta_json,
            createdAt: envelope.createdAt,
          }
        : null,
      events,
    }
  }

  // Admin: Void envelope
  async voidEnvelope(selectedDealId: string, adminUserId: string, reason: string) {
    const envelope = await prisma.eSignEnvelope.findFirst({
      where: {
        OR: [{ selected_deal_id: selectedDealId }, { dealId: selectedDealId }],
        status: { in: ["CREATED", "SENT", "PENDING"] },
      },
    })

    if (!envelope) {
      throw new Error("No active envelope found to void")
    }

    // Call provider to void (if not mock)
    if (envelope.provider !== "mock") {
      await this.provider.voidEnvelope(envelope.provider_envelope_id || envelope.providerEnvelopeId || "", reason)
    }

    // Update envelope
    await prisma.eSignEnvelope.update({
      where: { id: envelope.id },
      data: {
        status: "VOIDED",
        updatedAt: new Date(),
        updated_at: new Date(),
      },
    })

    // Log event
    await prisma.$executeRaw`
      INSERT INTO "esign_events" ("id", "selected_deal_id", "envelope_id", "type", "provider", "details")
      VALUES (
        ${crypto.randomUUID()},
        ${selectedDealId},
        ${envelope.id},
        'ENVELOPE_VOIDED',
        ${envelope.provider},
        ${JSON.stringify({ reason, voidedBy: adminUserId })}::jsonb
      )
    `

    return { success: true, message: "Envelope voided" }
  }

  // Get envelope status stub
  async getEnvelopeStatus(envelopeId: string) {
    return { id: envelopeId, status: "pending", message: "Method stub - to be implemented" }
  }
}

export const esignService = new ESignService()
