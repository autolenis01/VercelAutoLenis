import { prisma } from "@/lib/db"
import { AUCTION_DURATION_HOURS } from "@/lib/constants"

export class AuctionService {
  static async validateAuctionPrerequisites(buyerId: string) {
    const buyer = await prisma.buyerProfile.findUnique({
      where: { id: buyerId },
      include: {
        preQualification: true,
        shortlists: {
          where: { active: true },
          include: { items: true },
        },
      },
    })

    const errors: string[] = []

    // Check pre-qualification
    if (!buyer?.preQualification || buyer.preQualification.status !== "APPROVED") {
      errors.push("PREQUAL_REQUIRED")
    }

    // Check shortlist has items
    const activeShortlist = buyer?.shortlists?.[0]
    if (!activeShortlist || activeShortlist.items.length === 0) {
      errors.push("SHORTLIST_EMPTY")
    }

    // Check deposit paid
    const depositPayment = await prisma.depositPayment.findFirst({
      where: {
        buyerId,
        status: "SUCCEEDED",
        refunded: false,
      },
      orderBy: { createdAt: "desc" },
    })

    if (!depositPayment) {
      errors.push("DEPOSIT_REQUIRED")
    }

    return {
      valid: errors.length === 0,
      errors,
      buyer,
      activeShortlist,
      depositPayment,
    }
  }

  static async createAuction(buyerId: string, shortlistId: string) {
    // Validate prerequisites
    const validation = await this.validateAuctionPrerequisites(buyerId)

    if (!validation.valid) {
      throw new Error(`Prerequisites not met: ${validation.errors.join(", ")}`)
    }

    // Get shortlist items to find dealers
    const shortlist = await prisma.shortlist.findUnique({
      where: { id: shortlistId },
      include: {
        items: {
          include: {
            inventoryItem: {
              include: { dealer: true },
            },
          },
        },
      },
    })

    if (!shortlist || shortlist.items.length === 0) {
      throw new Error("Shortlist is empty")
    }

    // Calculate auction timing
    const startsAt = new Date()
    const endsAt = new Date(startsAt)
    endsAt.setHours(endsAt.getHours() + (AUCTION_DURATION_HOURS || 24))

    // Create auction
    const auction = await prisma.auction.create({
      data: {
        buyerId,
        shortlistId,
        status: "OPEN",
        startsAt,
        endsAt,
      },
    })

    // Link deposit to auction
    if (validation.depositPayment) {
      await prisma.depositPayment.update({
        where: { id: validation.depositPayment.id },
        data: { auctionId: auction.id },
      })
    }

    // Invite dealers (unique dealers from shortlist + nearby dealers with matching inventory)
    const shortlistDealerIds = Array.from(new Set(shortlist.items.map((item: any) => item.inventoryItem.dealerId)))

    // Also find dealers with matching vehicles in their inventory
    const vehicleIds = shortlist.items.map((item: any) => item.inventoryItem.vehicleId)
    const matchingInventory = await prisma.inventoryItem.findMany({
      where: {
        vehicleId: { in: vehicleIds },
        status: "AVAILABLE",
        dealerId: { notIn: shortlistDealerIds },
      },
      select: { dealerId: true },
    })

    const allDealerIds = Array.from(new Set([...shortlistDealerIds, ...matchingInventory.map((i: any) => i.dealerId)]))

    await Promise.all(
      allDealerIds.map((dealerId) =>
        prisma.auctionParticipant.create({
          data: {
            auctionId: auction.id,
            dealerId,
            invitedAt: new Date(),
          },
        }),
      ),
    )

    // Log compliance event
    await prisma.complianceEvent.create({
      data: {
        eventType: "AUCTION_CREATED",
        userId: validation.buyer?.userId,
        entityType: "AUCTION",
        entityId: auction.id,
        metadata: {
          shortlistId,
          vehicleCount: shortlist.items.length,
          dealerCount: allDealerIds.length,
        },
      },
    })

    return this.getAuction(auction.id)
  }

  static async getAuction(auctionId: string) {
    return prisma.auction.findUnique({
      where: { id: auctionId },
      include: {
        buyer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            city: true,
            state: true,
            preQualification: {
              select: {
                maxOtd: true,
                budgetMin: true,
                budgetMax: true,
                creditTier: true,
              },
            },
          },
        },
        shortlist: {
          include: {
            items: {
              include: {
                inventoryItem: {
                  include: {
                    vehicle: true,
                    dealer: {
                      select: {
                        id: true,
                        businessName: true,
                        city: true,
                        state: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        participants: {
          include: {
            dealer: {
              select: {
                id: true,
                businessName: true,
                city: true,
                state: true,
                integrityScore: true,
              },
            },
          },
        },
        offers: {
          include: {
            financingOptions: true,
            participant: {
              include: {
                dealer: {
                  select: {
                    id: true,
                    businessName: true,
                    city: true,
                    state: true,
                    integrityScore: true,
                  },
                },
              },
            },
          },
        },
        bestPriceOptions: true,
      },
    })
  }

  static async getBuyerAuctions(buyerId: string) {
    return prisma.auction.findMany({
      where: { buyerId },
      include: {
        shortlist: {
          include: {
            items: {
              include: {
                inventoryItem: {
                  include: { vehicle: true },
                },
              },
            },
          },
        },
        participants: true,
        offers: {
          include: {
            financingOptions: true,
            participant: {
              include: { dealer: true },
            },
          },
        },
        bestPriceOptions: true,
      },
      orderBy: { createdAt: "desc" },
    })
  }

  static async getDealerAuctions(dealerId: string) {
    const participants = await prisma.auctionParticipant.findMany({
      where: { dealerId },
      include: {
        auction: {
          include: {
            buyer: {
              select: {
                city: true,
                state: true,
                preQualification: {
                  select: {
                    budgetMin: true,
                    budgetMax: true,
                  },
                },
              },
            },
            shortlist: {
              include: {
                items: {
                  include: {
                    inventoryItem: {
                      include: { vehicle: true },
                    },
                  },
                },
              },
            },
            offers: {
              where: { participant: { dealerId } },
            },
          },
        },
      },
      orderBy: { invitedAt: "desc" },
    })

    return participants.map((p: any) => ({
      ...p.auction,
      participantId: p.id,
      invitedAt: p.invitedAt,
      respondedAt: p.respondedAt,
      hasSubmittedOffer: p.auction.offers.length > 0,
    }))
  }

  static async getDealerAuctionDetail(auctionId: string, dealerId: string) {
    const participant = await prisma.auctionParticipant.findFirst({
      where: { auctionId, dealerId },
    })

    if (!participant) {
      throw new Error("Dealer not invited to this auction")
    }

    const auction = await prisma.auction.findUnique({
      where: { id: auctionId },
      include: {
        buyer: {
          include: { preQualification: true },
        },
      },
    })

    // Get dealer's matching inventory
    const vehicleIds = auction?.shortlist?.items.map((item: any) => item.inventoryItem.vehicleId) || []
    const dealerInventory = await prisma.inventoryItem.findMany({
      where: {
        dealerId,
        status: "AVAILABLE",
        OR: [
          { vehicleId: { in: vehicleIds } },
          { id: { in: auction?.shortlist?.items.map((i: any) => i.inventoryItemId) || [] } },
        ],
      },
      include: { vehicle: true },
    })

    // Get dealer's existing offer
    const existingOffer = await prisma.auctionOffer.findFirst({
      where: { auctionId, participantId: participant.id },
      include: { financingOptions: true },
    })

    return {
      auction,
      participantId: participant.id,
      dealerInventory,
      existingOffer,
    }
  }

  static async submitOffer(
    auctionId: string,
    dealerId: string,
    offerData: {
      inventoryItemId: string
      cashOtdCents: number
      taxAmountCents: number
      feesBreakdown: Record<string, number>
      financingOptions: Array<{
        lenderName?: string
        apr: number
        termMonths: number
        downPaymentCents: number
        monthlyPaymentCents: number
      }>
    },
  ) {
    // Verify auction is active
    const auction = await prisma.auction.findUnique({
      where: { id: auctionId },
      include: {
        buyer: {
          include: { preQualification: true },
        },
      },
    })

    if (!auction) {
      throw new Error("Auction not found")
    }

    if (auction.status !== "OPEN") {
      throw new Error("Auction is not open for offers")
    }

    if (new Date() > auction.endsAt) {
      throw new Error("Auction has ended")
    }

    // Verify dealer is participant
    const participant = await prisma.auctionParticipant.findFirst({
      where: { auctionId, dealerId },
    })

    if (!participant) {
      throw new Error("Dealer not invited to this auction")
    }

    // Verify price is within budget
    if (auction.buyer.preQualification && offerData.cashOtdCents > auction.buyer.preQualification.maxOtd * 100) {
      throw new Error("Offer exceeds buyer's pre-qualified budget")
    }

    // Delete existing offers from this dealer for this auction (one best offer rule)
    await prisma.auctionOffer.deleteMany({
      where: {
        auctionId,
        participantId: participant.id,
      },
    })

    // Create new offer
    const offer = await prisma.auctionOffer.create({
      data: {
        auctionId,
        participantId: participant.id,
        inventoryItemId: offerData.inventoryItemId,
        cashOtd: offerData.cashOtdCents / 100,
        taxAmount: offerData.taxAmountCents / 100,
        feesBreakdown: offerData.feesBreakdown,
        financingOptions: {
          create: offerData.financingOptions.map((opt: any) => ({
            lenderName: opt.lenderName || "Dealer Finance",
            apr: opt.apr,
            termMonths: opt.termMonths,
            downPayment: opt.downPaymentCents / 100,
            monthlyPayment: opt.monthlyPaymentCents / 100,
          })),
        },
      },
      include: {
        financingOptions: true,
      },
    })

    // Update participant responded_at
    await prisma.auctionParticipant.update({
      where: { id: participant.id },
      data: { respondedAt: new Date() },
    })

    // Log compliance event
    await prisma.complianceEvent.create({
      data: {
        eventType: "OFFER_SUBMITTED",
        entityType: "AUCTION_OFFER",
        entityId: offer.id,
        metadata: {
          auctionId,
          dealerId,
          cashOtdCents: offerData.cashOtdCents,
        },
      },
    })

    return offer
  }

  static async closeAuction(auctionId: string) {
    const auction = await prisma.auction.findUnique({
      where: { id: auctionId },
      include: { offers: true },
    })

    if (!auction) {
      throw new Error("Auction not found")
    }

    if (auction.offers.length === 0) {
      // No offers - mark as NO_OFFERS and refund deposit
      await prisma.auction.update({
        where: { id: auctionId },
        data: {
          status: "NO_OFFERS",
          closedAt: new Date(),
        },
      })

      // Refund deposit
      const depositPayment = await prisma.depositPayment.findFirst({
        where: { auctionId },
      })

      if (depositPayment) {
        await prisma.depositPayment.update({
          where: { id: depositPayment.id },
          data: {
            refunded: true,
            refundedAt: new Date(),
            refundReason: "No offers received",
          },
        })
      }
    } else {
      // Has offers - mark closed
      await prisma.auction.update({
        where: { id: auctionId },
        data: {
          status: "CLOSED",
          closedAt: new Date(),
        },
      })
    }

    return this.getAuction(auctionId)
  }

  // Cron job helper to auto-close expired auctions
  static async closeExpiredAuctions() {
    const expiredAuctions = await prisma.auction.findMany({
      where: {
        status: "OPEN",
        endsAt: { lte: new Date() },
      },
    })

    for (const auction of expiredAuctions) {
      await this.closeAuction(auction.id)
    }

    return expiredAuctions.length
  }
}

export const auctionService = new AuctionService()
export default auctionService
