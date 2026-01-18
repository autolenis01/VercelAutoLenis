import { prisma } from "@/lib/db"

export class AdminService {
  async getDashboardStats() {
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    const [
      totalBuyers,
      activeBuyers,
      totalDealers,
      activeDealers,
      activeAuctions,
      auctionsLast30Days,
      completedDeals,
      dealsLast30Days,
      totalRevenue,
      revenueLast30Days,
      pendingDeposits,
      totalAffiliatePayouts,
      affiliatePayoutsLast30Days,
    ] = await Promise.all([
      prisma.user.count({ where: { role: "BUYER" } }),
      prisma.user.count({
        where: {
          role: "BUYER",
          updatedAt: { gte: thirtyDaysAgo },
        },
      }),
      prisma.dealer.count(),
      prisma.dealer.count({ where: { active: true } }),
      prisma.auction.count({ where: { status: "ACTIVE" } }),
      prisma.auction.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.selectedDeal.count({ where: { status: "COMPLETED" } }),
      prisma.selectedDeal.count({
        where: {
          status: "COMPLETED",
          createdAt: { gte: thirtyDaysAgo },
        },
      }),
      prisma.serviceFeePayment.aggregate({
        where: { status: "PAID" },
        _sum: { amount: true },
      }),
      prisma.serviceFeePayment.aggregate({
        where: {
          status: "PAID",
          createdAt: { gte: thirtyDaysAgo },
        },
        _sum: { amount: true },
      }),
      prisma.depositPayment.count({ where: { status: "HELD" } }),
      prisma.payout.aggregate({
        where: { status: "PAID" },
        _sum: { amount: true },
      }),
      prisma.payout.aggregate({
        where: {
          status: "PAID",
          paidAt: { gte: thirtyDaysAgo },
        },
        _sum: { amount: true },
      }),
    ])

    return {
      totalBuyers,
      activeBuyers,
      totalDealers,
      activeDealers,
      activeAuctions,
      auctionsLast30Days,
      completedDeals,
      dealsLast30Days,
      totalRevenue: totalRevenue._sum.amount || 0,
      revenueLast30Days: revenueLast30Days._sum.amount || 0,
      pendingDeposits,
      totalAffiliatePayouts: totalAffiliatePayouts._sum.amount || 0,
      affiliatePayoutsLast30Days: affiliatePayoutsLast30Days._sum.amount || 0,
    }
  }

  async getFunnelData() {
    const [signups, preQuals, shortlists, auctions, dealsSelected, feesPaid, completed] = await Promise.all([
      prisma.user.count({ where: { role: "BUYER" } }),
      prisma.preQualification.count(),
      prisma.shortlist.count(),
      prisma.auction.count(),
      prisma.selectedDeal.count(),
      prisma.serviceFeePayment.count({ where: { status: "PAID" } }),
      prisma.selectedDeal.count({ where: { status: "COMPLETED" } }),
    ])

    return { signups, preQuals, shortlists, auctions, dealsSelected, feesPaid, completed }
  }

  async getTopDealers(limit = 10) {
    const dealers = await prisma.dealer.findMany({
      include: {
        _count: {
          select: {
            offers: true,
            selectedDeals: true,
          },
        },
      },
      orderBy: {
        selectedDeals: { _count: "desc" },
      },
      take: limit,
    })

    return dealers.map((dealer) => ({
      id: dealer.id,
      name: dealer.name || dealer.businessName || "Unknown",
      integrityScore: dealer.integrityScore || 0,
      totalOffers: dealer._count.offers,
      wonDeals: dealer._count.selectedDeals,
      winRate: dealer._count.offers > 0 ? ((dealer._count.selectedDeals / dealer._count.offers) * 100).toFixed(1) : "0",
    }))
  }

  async getTopAffiliates(limit = 10) {
    const affiliates = await prisma.affiliate.findMany({
      include: {
        user: true,
        _count: {
          select: {
            referrals: true,
            clicks: true,
          },
        },
      },
      orderBy: {
        totalEarnings: "desc",
      },
      take: limit,
    })

    return affiliates.map((a) => ({
      id: a.id,
      name: `${a.firstName || ""} ${a.lastName || ""}`.trim() || a.user?.email || "Unknown",
      email: a.user?.email || "",
      totalClicks: a._count.clicks,
      totalReferrals: a._count.referrals,
      totalEarnings: a.totalEarnings || 0,
      pendingEarnings: a.pendingEarnings || 0,
    }))
  }

  async getAllBuyers(filters?: {
    search?: string
    hasPreQual?: boolean
    hasActiveAuction?: boolean
    hasCompletedDeal?: boolean
    page?: number
    limit?: number
  }) {
    const page = filters?.page || 1
    const limit = filters?.limit || 50
    const skip = (page - 1) * limit

    const where: any = {
      role: "BUYER",
    }

    if (filters?.search) {
      where.OR = [
        { email: { contains: filters.search, mode: "insensitive" } },
        { first_name: { contains: filters.search, mode: "insensitive" } },
        { last_name: { contains: filters.search, mode: "insensitive" } },
      ]
    }

    const [buyers, total] = await Promise.all([
      prisma.user.findMany({
        where,
        include: {
          buyer: {
            include: {
              profile: true,
              preQualification: true,
              auctions: { where: { status: "ACTIVE" }, take: 1 },
              selectedDeals: { where: { status: "COMPLETED" }, take: 1 },
            },
          },
          affiliate: true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ])

    return {
      buyers: buyers.map((u) => ({
        id: u.id,
        email: u.email,
        firstName: u.first_name || u.buyer?.profile?.firstName || "",
        lastName: u.last_name || u.buyer?.profile?.lastName || "",
        phone: u.phone || u.buyer?.profile?.phone || "",
        role: u.role,
        isAffiliate: !!u.affiliate,
        hasPreQual: !!u.buyer?.preQualification,
        preQualStatus: u.buyer?.preQualification?.prequal_status || null,
        hasActiveAuction: (u.buyer?.auctions?.length || 0) > 0,
        hasCompletedDeal: (u.buyer?.selectedDeals?.length || 0) > 0,
        createdAt: u.createdAt,
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    }
  }

  async getBuyerDetail(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        buyer: {
          include: {
            profile: true,
            preQualification: true,
            preferences: true,
            shortlists: {
              include: {
                items: { include: { inventoryItem: { include: { vehicle: true } } } },
              },
            },
            auctions: {
              include: {
                offers: { include: { dealer: true } },
              },
              orderBy: { createdAt: "desc" },
            },
            selectedDeals: {
              include: {
                dealer: true,
                inventoryItem: { include: { vehicle: true } },
                serviceFee: true,
                deposit: true,
              },
              orderBy: { createdAt: "desc" },
            },
          },
        },
        affiliate: {
          include: {
            referrals: true,
            commissions: true,
          },
        },
      },
    })

    return user
  }

  async getAllDealers(filters?: {
    search?: string
    status?: "all" | "active" | "inactive" | "pending"
    page?: number
    limit?: number
  }) {
    const page = filters?.page || 1
    const limit = filters?.limit || 50
    const skip = (page - 1) * limit

    const where: any = {}

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: "insensitive" } },
        { businessName: { contains: filters.search, mode: "insensitive" } },
        { email: { contains: filters.search, mode: "insensitive" } },
      ]
    }

    if (filters?.status === "active") {
      where.active = true
      where.verified = true
    } else if (filters?.status === "inactive") {
      where.active = false
    } else if (filters?.status === "pending") {
      where.verified = false
    }

    const [dealers, total] = await Promise.all([
      prisma.dealer.findMany({
        where,
        include: {
          _count: {
            select: {
              inventoryItems: true,
              offers: true,
              selectedDeals: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.dealer.count({ where }),
    ])

    return {
      dealers: dealers.map((d) => ({
        id: d.id,
        name: d.name || d.businessName || "Unknown",
        email: d.email || "",
        city: d.city || "",
        state: d.state || "",
        verified: d.verified || false,
        active: d.active || false,
        integrityScore: d.integrityScore || 0,
        inventoryCount: d._count.inventoryItems,
        offersCount: d._count.offers,
        dealsCount: d._count.selectedDeals,
        winRate: d._count.offers > 0 ? ((d._count.selectedDeals / d._count.offers) * 100).toFixed(1) : "0",
        createdAt: d.createdAt,
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    }
  }

  async getAllAuctions(filters?: {
    status?: string
    page?: number
    limit?: number
  }) {
    const page = filters?.page || 1
    const limit = filters?.limit || 50
    const skip = (page - 1) * limit

    const where: any = {}
    if (filters?.status && filters.status !== "all") {
      where.status = filters.status
    }

    const [auctions, total] = await Promise.all([
      prisma.auction.findMany({
        where,
        include: {
          buyer: {
            include: {
              user: true,
              profile: true,
            },
          },
          shortlist: {
            include: {
              items: { include: { inventoryItem: { include: { vehicle: true } } } },
            },
          },
          participants: {
            include: { dealer: true },
          },
          offers: {
            include: { dealer: true },
          },
          bestPriceOptions: true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.auction.count({ where }),
    ])

    return {
      auctions: auctions.map((a) => ({
        id: a.id,
        buyerName:
          `${a.buyer?.profile?.firstName || ""} ${a.buyer?.profile?.lastName || ""}`.trim() ||
          a.buyer?.user?.email ||
          "Unknown",
        buyerEmail: a.buyer?.user?.email || "",
        status: a.status,
        startsAt: a.startsAt,
        endsAt: a.endsAt,
        closedAt: a.closedAt,
        dealersInvited: a.participants.length,
        offersReceived: a.offers.length,
        vehicleCount: a.shortlist?.items?.length || 0,
        createdAt: a.createdAt,
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    }
  }

  async getAllDeals(filters?: {
    status?: string
    startDate?: Date
    endDate?: Date
    page?: number
    limit?: number
  }) {
    const page = filters?.page || 1
    const limit = filters?.limit || 50
    const skip = (page - 1) * limit

    const where: any = {}
    if (filters?.status && filters.status !== "all") {
      where.status = filters.status
    }
    if (filters?.startDate) {
      where.createdAt = { ...where.createdAt, gte: filters.startDate }
    }
    if (filters?.endDate) {
      where.createdAt = { ...where.createdAt, lte: filters.endDate }
    }

    const [deals, total] = await Promise.all([
      prisma.selectedDeal.findMany({
        where,
        include: {
          buyer: {
            include: {
              user: true,
              profile: true,
            },
          },
          dealer: true,
          inventoryItem: {
            include: { vehicle: true },
          },
          serviceFee: true,
          deposit: true,
          esignEnvelope: true,
          contractShieldScan: true,
          pickupAppointment: true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.selectedDeal.count({ where }),
    ])

    return {
      deals: deals.map((d) => ({
        id: d.id,
        buyerName:
          `${d.buyer?.profile?.firstName || ""} ${d.buyer?.profile?.lastName || ""}`.trim() ||
          d.buyer?.user?.email ||
          "Unknown",
        buyerEmail: d.buyer?.user?.email || "",
        dealerName: d.dealer?.name || d.dealer?.businessName || "Unknown",
        vehicle: d.inventoryItem?.vehicle
          ? `${d.inventoryItem.vehicle.year} ${d.inventoryItem.vehicle.make} ${d.inventoryItem.vehicle.model}`
          : "Unknown",
        otdAmount: d.cashOtd || d.totalOtdAmountCents ? (d.totalOtdAmountCents || 0) / 100 : 0,
        status: d.status,
        depositStatus: d.deposit?.status || null,
        feeStatus: d.serviceFee?.status || null,
        esignStatus: d.esignEnvelope?.status || null,
        contractShieldStatus: d.contractShieldScan?.status || null,
        pickupStatus: d.pickupAppointment?.status || null,
        createdAt: d.createdAt,
        updatedAt: d.updatedAt,
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    }
  }

  async getAllPayments(filters?: {
    type?: "deposit" | "fee" | "all"
    status?: string
    page?: number
    limit?: number
  }) {
    const page = filters?.page || 1
    const limit = filters?.limit || 50
    const skip = (page - 1) * limit

    let deposits: any[] = []
    let fees: any[] = []
    let depositTotal = 0
    let feeTotal = 0

    if (!filters?.type || filters.type === "all" || filters.type === "deposit") {
      const depositWhere: any = {}
      if (filters?.status && filters.status !== "all") {
        depositWhere.status = filters.status
      }

      const [d, dt] = await Promise.all([
        prisma.depositPayment.findMany({
          where: depositWhere,
          include: {
            buyer: {
              include: {
                user: true,
                profile: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
          skip: filters?.type === "deposit" ? skip : 0,
          take: filters?.type === "deposit" ? limit : 25,
        }),
        prisma.depositPayment.count({ where: depositWhere }),
      ])
      deposits = d
      depositTotal = dt
    }

    if (!filters?.type || filters.type === "all" || filters.type === "fee") {
      const feeWhere: any = {}
      if (filters?.status && filters.status !== "all") {
        feeWhere.status = filters.status
      }

      const [f, ft] = await Promise.all([
        prisma.serviceFeePayment.findMany({
          where: feeWhere,
          include: {
            deal: {
              include: {
                buyer: {
                  include: {
                    user: true,
                    profile: true,
                  },
                },
              },
            },
          },
          orderBy: { createdAt: "desc" },
          skip: filters?.type === "fee" ? skip : 0,
          take: filters?.type === "fee" ? limit : 25,
        }),
        prisma.serviceFeePayment.count({ where: feeWhere }),
      ])
      fees = f
      feeTotal = ft
    }

    return {
      deposits: deposits.map((d) => ({
        id: d.id,
        type: "DEPOSIT",
        buyerName:
          `${d.buyer?.profile?.firstName || ""} ${d.buyer?.profile?.lastName || ""}`.trim() ||
          d.buyer?.user?.email ||
          "Unknown",
        amount: d.amount || (d.amountCents ? d.amountCents / 100 : 99),
        status: d.status,
        provider: d.provider || "stripe",
        providerRef: d.stripePaymentIntentId || d.providerPaymentId || "",
        createdAt: d.createdAt,
        refundedAt: d.refundedAt,
      })),
      fees: fees.map((f) => ({
        id: f.id,
        type: "SERVICE_FEE",
        dealId: f.dealId,
        buyerName:
          `${f.deal?.buyer?.profile?.firstName || ""} ${f.deal?.buyer?.profile?.lastName || ""}`.trim() ||
          f.deal?.buyer?.user?.email ||
          "Unknown",
        baseFee: f.baseFeeCents ? f.baseFeeCents / 100 : f.amount || 0,
        depositApplied: f.depositAppliedCents ? f.depositAppliedCents / 100 : 0,
        remaining: f.remainingCents ? f.remainingCents / 100 : f.amount || 0,
        method: f.method || "card",
        status: f.status,
        provider: f.provider || "stripe",
        providerRef: f.stripePaymentIntentId || f.providerPaymentId || "",
        createdAt: f.createdAt,
        refundedAt: f.refundedAt,
      })),
      depositTotal,
      feeTotal,
      page,
    }
  }

  async getAllAffiliates(filters?: {
    search?: string
    page?: number
    limit?: number
  }) {
    const page = filters?.page || 1
    const limit = filters?.limit || 50
    const skip = (page - 1) * limit

    const where: any = {}
    if (filters?.search) {
      where.OR = [
        { firstName: { contains: filters.search, mode: "insensitive" } },
        { lastName: { contains: filters.search, mode: "insensitive" } },
        { user: { email: { contains: filters.search, mode: "insensitive" } } },
      ]
    }

    const [affiliates, total] = await Promise.all([
      prisma.affiliate.findMany({
        where,
        include: {
          user: true,
          referrals: {
            include: {
              referredUser: true,
            },
          },
          commissions: true,
          clicks: true,
          payouts: true,
        },
        orderBy: { totalEarnings: "desc" },
        skip,
        take: limit,
      }),
      prisma.affiliate.count({ where }),
    ])

    return {
      affiliates: affiliates.map((a) => ({
        id: a.id,
        name: `${a.firstName || ""} ${a.lastName || ""}`.trim() || a.user?.email || "Unknown",
        email: a.user?.email || "",
        refCode: a.referralCode || a.refCode || a.ref_code || "",
        totalClicks: a.clicks?.length || 0,
        level1Referrals: a.referrals?.filter((r) => r.level === 1).length || 0,
        level2Referrals: a.referrals?.filter((r) => r.level === 2).length || 0,
        level3Referrals: a.referrals?.filter((r) => r.level === 3).length || 0,
        level4Referrals: a.referrals?.filter((r) => r.level === 4).length || 0,
        level5Referrals: a.referrals?.filter((r) => r.level === 5).length || 0,
        totalEarnings: a.totalEarnings || 0,
        pendingEarnings: a.pendingEarnings || 0,
        totalPayouts: a.payouts?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0,
        createdAt: a.createdAt,
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    }
  }

  async getComplianceEvents(filters?: {
    type?: string
    severity?: string
    userId?: string
    startDate?: Date
    page?: number
    limit?: number
  }) {
    const page = filters?.page || 1
    const limit = filters?.limit || 50
    const skip = (page - 1) * limit

    const where: any = {}
    if (filters?.type && filters.type !== "all") {
      where.type = filters.type
    }
    if (filters?.severity && filters.severity !== "all") {
      where.severity = filters.severity
    }
    if (filters?.userId) {
      where.userId = filters.userId
    }
    if (filters?.startDate) {
      where.createdAt = { gte: filters.startDate }
    }

    const [events, total] = await Promise.all([
      prisma.complianceEvent.findMany({
        where,
        include: {
          user: true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.complianceEvent.count({ where }),
    ])

    return {
      events: events.map((e) => ({
        id: e.id,
        type: e.type || e.eventType || "UNKNOWN",
        severity: e.severity || "INFO",
        userId: e.userId,
        userEmail: e.user?.email || "",
        details: e.details || {},
        ipAddress: e.ipAddress || e.ip_address || "",
        resolved: e.resolved || false,
        resolvedAt: e.resolvedAt,
        resolvedBy: e.resolvedBy,
        createdAt: e.createdAt,
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    }
  }

  async getContractShieldScans(filters?: {
    status?: string
    page?: number
    limit?: number
  }) {
    const page = filters?.page || 1
    const limit = filters?.limit || 50
    const skip = (page - 1) * limit

    const where: any = {}
    if (filters?.status && filters.status !== "all") {
      where.status = filters.status
    }

    const [scans, total] = await Promise.all([
      prisma.contractShieldScan.findMany({
        where,
        include: {
          deal: {
            include: {
              buyer: {
                include: {
                  user: true,
                  profile: true,
                },
              },
              dealer: true,
            },
          },
          fixListItems: true,
        },
        orderBy: { scannedAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.contractShieldScan.count({ where }),
    ])

    return {
      scans: scans.map((s) => ({
        id: s.id,
        dealId: s.selectedDealId,
        buyerName:
          `${s.deal?.buyer?.profile?.firstName || ""} ${s.deal?.buyer?.profile?.lastName || ""}`.trim() ||
          s.deal?.buyer?.user?.email ||
          "Unknown",
        dealerName: s.deal?.dealer?.name || s.deal?.dealer?.businessName || "Unknown",
        status: s.status,
        overallScore: s.overallScore || 0,
        issuesCount: s.issuesCount || s.fixListItems?.length || 0,
        aprMatch: s.aprMatch,
        otdMatch: s.otdMatch,
        paymentMatch: s.paymentMatch,
        junkFeesDetected: s.junkFeesDetected,
        issues:
          s.fixListItems?.map((i) => ({
            id: i.id,
            category: i.category,
            description: i.description,
            severity: i.severity,
            expectedFix: i.expectedFix,
            resolved: i.resolved,
          })) || [],
        scannedAt: s.scannedAt,
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    }
  }

  async getInsuranceData(filters?: {
    type?: string
    page?: number
    limit?: number
  }) {
    const page = filters?.page || 1
    const limit = filters?.limit || 50
    const skip = (page - 1) * limit

    const [quotes, policies, quotesTotal, policiesTotal] = await Promise.all([
      prisma.insuranceQuote.findMany({
        include: {
          buyer: {
            include: {
              user: true,
              profile: true,
            },
          },
          vehicle: true,
        },
        orderBy: { createdAt: "desc" },
        take: 25,
      }),
      prisma.insurancePolicy.findMany({
        include: {
          user: true,
          deal: {
            include: {
              buyer: {
                include: {
                  user: true,
                  profile: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.insuranceQuote.count(),
      prisma.insurancePolicy.count(),
    ])

    return {
      quotes: quotes.map((q) => ({
        id: q.id,
        buyerName:
          `${q.buyer?.profile?.firstName || ""} ${q.buyer?.profile?.lastName || ""}`.trim() ||
          q.buyer?.user?.email ||
          "Unknown",
        carrier: q.carrier || q.carrier_name || "Unknown",
        productName: q.productName || q.product_name || "",
        monthlyPremium: q.monthlyPremium || (q.monthlyPremiumCents ? q.monthlyPremiumCents / 100 : 0),
        vehicle: q.vehicle ? `${q.vehicle.year} ${q.vehicle.make} ${q.vehicle.model}` : "Unknown",
        expiresAt: q.expiresAt,
        createdAt: q.createdAt,
      })),
      policies: policies.map((p) => ({
        id: p.id,
        buyerName:
          `${p.deal?.buyer?.profile?.firstName || ""} ${p.deal?.buyer?.profile?.lastName || ""}`.trim() ||
          p.user?.email ||
          "Unknown",
        type: p.type,
        carrier: p.carrier || "Unknown",
        policyNumber: p.policyNumber || p.policy_number_v2 || "",
        status: p.status,
        startDate: p.startDate || p.start_date,
        endDate: p.endDate || p.end_date,
        monthlyPremium: p.monthlyPremium || 0,
        documentUrl: p.documentUrl || "",
        createdAt: p.createdAt,
      })),
      quotesTotal,
      policiesTotal,
      page,
      totalPages: Math.ceil(policiesTotal / limit),
    }
  }

  async getSystemSettings() {
    const settings = await prisma.adminSettings.findMany()

    const settingsMap: Record<string, any> = {}
    settings.forEach((s) => {
      settingsMap[s.key] = s.valueJson || s.value || null
    })

    return {
      depositAmount: settingsMap.deposit_amount || 99,
      feeTierOneCents: settingsMap.fee_tier_one_cents || 49900,
      feeTierTwoCents: settingsMap.fee_tier_two_cents || 75000,
      feeThresholdCents: settingsMap.fee_threshold_cents || 3500000,
      auctionDurationHours: settingsMap.auction_duration_hours || 48,
      depositGracePeriodHours: settingsMap.deposit_grace_period_hours || 24,
      feeFinancingEnabled: settingsMap.fee_financing_enabled !== false,
      affiliateCommissionL1: settingsMap.affiliate_commission_l1 || 0.2,
      affiliateCommissionL2: settingsMap.affiliate_commission_l2 || 0.15,
      affiliateCommissionL3: settingsMap.affiliate_commission_l3 || 0.1,
      affiliateCommissionL4: settingsMap.affiliate_commission_l4 || 0.05,
      affiliateCommissionL5: settingsMap.affiliate_commission_l5 || 0.03,
      affiliateMinPayout: settingsMap.affiliate_min_payout || 50,
    }
  }

  async updateSystemSettings(key: string, value: any, adminId: string) {
    await prisma.adminSettings.upsert({
      where: { key },
      create: {
        id: `setting_${Date.now()}`,
        key,
        valueJson: value,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      update: {
        valueJson: value,
        updatedAt: new Date(),
      },
    })

    await prisma.complianceEvent.create({
      data: {
        id: `ce_${Date.now()}`,
        type: "ADMIN_SETTING_CHANGED",
        userId: adminId,
        severity: "INFO",
        details: { key, newValue: value },
        createdAt: new Date(),
      },
    })

    return { success: true }
  }

  // Existing methods...
  async refundDeposit(depositId: string, reason: string, adminId: string) {
    const deposit = await prisma.depositPayment.findUnique({
      where: { id: depositId },
    })

    if (!deposit) throw new Error("Deposit not found")
    if (deposit.status !== "HELD") throw new Error("Deposit cannot be refunded")

    const refundId = `re_${Date.now()}`

    await prisma.depositPayment.update({
      where: { id: depositId },
      data: {
        status: "REFUNDED",
        refundedAt: new Date(),
        refundId,
        reason,
      },
    })

    await prisma.complianceEvent.create({
      data: {
        id: `ce_${Date.now()}`,
        type: "DEPOSIT_REFUNDED",
        userId: deposit.buyerId,
        severity: "INFO",
        details: {
          depositId,
          refundId,
          reason,
          adminId,
        },
        createdAt: new Date(),
      },
    })

    return { success: true, refundId }
  }

  async suspendDealer(dealerId: string, reason: string, adminId: string) {
    await prisma.dealer.update({
      where: { id: dealerId },
      data: { active: false },
    })

    await prisma.complianceEvent.create({
      data: {
        id: `ce_${Date.now()}`,
        type: "DEALER_SUSPENDED",
        userId: adminId,
        severity: "WARNING",
        details: { dealerId, reason },
        createdAt: new Date(),
      },
    })

    return { success: true }
  }

  async approveDealer(dealerId: string, adminId: string) {
    await prisma.dealer.update({
      where: { id: dealerId },
      data: { verified: true, active: true },
    })

    await prisma.complianceEvent.create({
      data: {
        id: `ce_${Date.now()}`,
        type: "DEALER_APPROVED",
        userId: adminId,
        severity: "INFO",
        details: { dealerId },
        createdAt: new Date(),
      },
    })

    return { success: true }
  }

  async getDealerPerformance() {
    const dealers = await prisma.dealer.findMany({
      include: {
        _count: {
          select: {
            offers: true,
            selectedDeals: true,
          },
        },
      },
    })

    return dealers.map((dealer) => ({
      id: dealer.id,
      name: dealer.name || dealer.businessName || "Unknown",
      integrityScore: dealer.integrityScore || 0,
      totalOffers: dealer._count.offers,
      wonDeals: dealer._count.selectedDeals,
      winRate: dealer._count.offers > 0 ? (dealer._count.selectedDeals / dealer._count.offers) * 100 : 0,
    }))
  }
}

export const adminService = new AdminService()
export default adminService
