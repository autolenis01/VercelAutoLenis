import { getSupabase } from "@/lib/db"
import { stripe } from "@/lib/stripe"
import { DEPOSIT_AMOUNT_CENTS, FEE_STRUCTURE_CENTS } from "@/lib/constants"

export class PaymentService {
  static calculateBaseFee(totalOtdCents: number): number {
    if (totalOtdCents <= FEE_STRUCTURE_CENTS.LOW_TIER.threshold) {
      return FEE_STRUCTURE_CENTS.LOW_TIER.fee // 49900 cents ($499)
    }
    return FEE_STRUCTURE_CENTS.HIGH_TIER.fee // 75000 cents ($750)
  }

  static async createDepositPayment(buyerId: string, auctionId: string) {
    const supabase = getSupabase()

    const { data: existing } = await supabase
      .from("DepositPayment")
      .select("*")
      .eq("buyerId", buyerId)
      .eq("auctionId", auctionId)
      .eq("status", "PAID")
      .limit(1)
      .maybeSingle()

    if (existing) {
      return { payment: existing, alreadyPaid: true }
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: DEPOSIT_AMOUNT_CENTS,
      currency: "usd",
      metadata: {
        buyerId,
        auctionId,
        type: "deposit",
      },
    })

    const now = new Date().toISOString()

    const { data: payment, error } = await supabase
      .from("DepositPayment")
      .insert({
        id: crypto.randomUUID(),
        buyerId,
        auctionId,
        amountCents: DEPOSIT_AMOUNT_CENTS,
        amount_cents: DEPOSIT_AMOUNT_CENTS,
        status: "PENDING",
        provider: "stripe",
        providerPaymentId: paymentIntent.id,
        provider_payment_id: paymentIntent.id,
        createdAt: now,
        updatedAt: now,
      })
      .select()
      .single()

    if (error) throw new Error(`Failed to create deposit payment: ${error.message}`)

    return { payment, clientSecret: paymentIntent.client_secret }
  }

  static async confirmDepositPayment(paymentIntentId: string) {
    const supabase = getSupabase()

    const { data: payment } = await supabase
      .from("DepositPayment")
      .select("*")
      .or(`providerPaymentId.eq.${paymentIntentId},provider_payment_id.eq.${paymentIntentId}`)
      .limit(1)
      .maybeSingle()

    if (!payment) {
      throw new Error("Payment not found")
    }

    await supabase
      .from("DepositPayment")
      .update({ status: "PAID", updatedAt: new Date().toISOString() })
      .eq("id", payment.id)

    await supabase.from("ComplianceEvent").insert({
      id: crypto.randomUUID(),
      eventType: "DEPOSIT_PAYMENT",
      type: "DEPOSIT_PAID",
      userId: payment.buyerId,
      details: {
        amountCents: payment.amountCents || payment.amount_cents,
        paymentIntentId,
      },
      createdAt: new Date().toISOString(),
    })

    return payment
  }

  static async getFeeOptions(dealId: string) {
    const supabase = getSupabase()

    const { data: deal } = await supabase
      .from("SelectedDeal")
      .select(`
        *,
        buyer:BuyerProfile(*)
      `)
      .eq("id", dealId)
      .single()

    if (!deal) {
      throw new Error("Deal not found")
    }

    const totalOtdCents =
      deal.totalOtdAmountCents || deal.total_otd_amount_cents || (deal.cashOtd ? Math.round(deal.cashOtd * 100) : 0)

    const baseFeeCents = this.calculateBaseFee(totalOtdCents)

    const { data: depositPayment } = await supabase
      .from("DepositPayment")
      .select("*")
      .eq("buyerId", deal.buyerId)
      .eq("status", "PAID")
      .order("createdAt", { ascending: false })
      .limit(1)
      .maybeSingle()

    const depositAppliedCents = depositPayment ? DEPOSIT_AMOUNT_CENTS : 0
    const remainingCents = baseFeeCents - depositAppliedCents

    const { data: existingPayment } = await supabase
      .from("ServiceFeePayment")
      .select("*")
      .eq("dealId", dealId)
      .limit(1)
      .maybeSingle()

    return {
      dealId,
      totalOtdCents,
      baseFeeCents,
      depositAppliedCents,
      remainingCents,
      existingPayment,
      options: {
        payDirectly: true,
        includeInLoan: true,
      },
    }
  }

  static async createServiceFeePayment(dealId: string, userId: string) {
    const supabase = getSupabase()
    const feeOptions = await this.getFeeOptions(dealId)

    if (feeOptions.existingPayment?.status === "PAID") {
      return { payment: feeOptions.existingPayment, alreadyPaid: true }
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: feeOptions.remainingCents,
      currency: "usd",
      metadata: {
        dealId,
        userId,
        type: "service_fee",
        baseFeeCents: feeOptions.baseFeeCents.toString(),
        depositAppliedCents: feeOptions.depositAppliedCents.toString(),
      },
    })

    const now = new Date().toISOString()
    const paymentId = feeOptions.existingPayment?.id || crypto.randomUUID()

    const { data: payment, error } = feeOptions.existingPayment
      ? await supabase
          .from("ServiceFeePayment")
          .update({
            providerPaymentId: paymentIntent.id,
            provider_payment_id: paymentIntent.id,
            status: "PENDING",
            updatedAt: now,
          })
          .eq("id", paymentId)
          .select()
          .single()
      : await supabase
          .from("ServiceFeePayment")
          .insert({
            id: paymentId,
            dealId,
            baseFeeCents: feeOptions.baseFeeCents,
            base_fee_cents: feeOptions.baseFeeCents,
            depositAppliedCents: feeOptions.depositAppliedCents,
            deposit_applied_cents: feeOptions.depositAppliedCents,
            remainingCents: feeOptions.remainingCents,
            remaining_cents: feeOptions.remainingCents,
            method: "CARD_DIRECT",
            status: "PENDING",
            provider: "stripe",
            providerPaymentId: paymentIntent.id,
            provider_payment_id: paymentIntent.id,
            user_id: userId,
            createdAt: now,
            updatedAt: now,
          })
          .select()
          .single()

    if (error) throw new Error(`Failed to create service fee payment: ${error.message}`)

    return { payment, clientSecret: paymentIntent.client_secret, feeOptions }
  }

  static async confirmServiceFeePayment(paymentIntentId: string) {
    const supabase = getSupabase()

    const { data: payment } = await supabase
      .from("ServiceFeePayment")
      .select("*")
      .or(`providerPaymentId.eq.${paymentIntentId},provider_payment_id.eq.${paymentIntentId}`)
      .limit(1)
      .maybeSingle()

    if (!payment) {
      throw new Error("Payment not found")
    }

    await supabase
      .from("ServiceFeePayment")
      .update({ status: "PAID", method: "CARD_DIRECT", updatedAt: new Date().toISOString() })
      .eq("id", payment.id)

    if (payment.dealId) {
      const { data: deal } = await supabase
        .from("SelectedDeal")
        .update({
          status: "FEE_PAID",
          deal_status: "FEE_PAID",
          updatedAt: new Date().toISOString(),
        })
        .eq("id", payment.dealId)
        .select(`
          *,
          buyer:BuyerProfile(
            *,
            user:User(*)
          )
        `)
        .single()

      if (deal?.buyer?.user) {
        const { data: referral } = await supabase
          .from("Referral")
          .select("*")
          .eq("referredUserId", deal.buyer.userId)
          .limit(1)
          .maybeSingle()

        if (referral) {
          const baseFee = payment.baseFeeCents || payment.base_fee_cents || 0
          await this.processCommissions(referral.affiliateId, payment.id, baseFee)
        }
      }

      await supabase.from("ComplianceEvent").insert({
        id: crypto.randomUUID(),
        eventType: "SERVICE_FEE_PAYMENT",
        type: "FEE_PAID",
        userId: payment.user_id || deal?.buyerId,
        relatedId: payment.dealId,
        details: {
          baseFeeCents: payment.baseFeeCents || payment.base_fee_cents,
          depositAppliedCents: payment.depositAppliedCents || payment.deposit_applied_cents,
          remainingCents: payment.remainingCents || payment.remaining_cents,
          method: "CARD_DIRECT",
          paymentIntentId,
        },
        createdAt: new Date().toISOString(),
      })
    }

    return payment
  }

  static async processCommissions(affiliateId: string, serviceFeePaymentId: string, baseFeeCents: number) {
    const supabase = getSupabase()
    const commissionRates = [0.2, 0.15, 0.1, 0.05, 0.03] // 5 levels: 20%, 15%, 10%, 5%, 3%
    let currentAffiliateId: string | null = affiliateId
    let level = 1

    while (currentAffiliateId && level <= 5) {
      const { data: affiliate } = await supabase
        .from("Affiliate")
        .select(`
          *,
          user:User(*)
        `)
        .eq("id", currentAffiliateId)
        .single()

      if (!affiliate) break

      const commissionRate = commissionRates[level - 1]
      const commissionCents = Math.round(baseFeeCents * commissionRate)

      await supabase.from("Commission").insert({
        id: crypto.randomUUID(),
        affiliateId: currentAffiliateId,
        serviceFeePaymentId,
        service_fee_payment_id: serviceFeePaymentId,
        level,
        commissionRate,
        amountCents: commissionCents,
        amount_cents: commissionCents,
        status: "PENDING",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })

      const { data: currentAffiliate } = await supabase
        .from("Affiliate")
        .select("pendingEarnings")
        .eq("id", currentAffiliateId)
        .single()

      const newPending = (currentAffiliate?.pendingEarnings || 0) + commissionCents / 100

      await supabase
        .from("Affiliate")
        .update({
          pendingEarnings: newPending,
          updatedAt: new Date().toISOString(),
        })
        .eq("id", currentAffiliateId)

      const { data: parentReferral } = await supabase
        .from("Referral")
        .select("affiliateId")
        .eq("referredUserId", affiliate.userId)
        .limit(1)
        .maybeSingle()

      currentAffiliateId = parentReferral?.affiliateId || null
      level++
    }
  }

  static calculateLoanImpact(feeAmountCents: number, apr: number, termMonths: number, baseMonthlyPaymentCents: number) {
    const monthlyRate = apr / 12 / 100
    const feeAmount = feeAmountCents / 100

    const feeMonthly =
      (feeAmount * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / (Math.pow(1 + monthlyRate, termMonths) - 1)

    const baseMonthly = baseMonthlyPaymentCents / 100
    const newMonthly = baseMonthly + feeMonthly
    const totalExtraCost = feeMonthly * termMonths

    return {
      feeAmountCents,
      apr,
      termMonths,
      baseMonthlyPaymentCents,
      baseMonthlyCents: baseMonthlyPaymentCents,
      newMonthlyCents: Math.round(newMonthly * 100),
      deltaMonthlyCents: Math.round(feeMonthly * 100),
      totalExtraCostCents: Math.round(totalExtraCost * 100),
      feeAmount: feeAmount,
      baseMonthly: baseMonthly,
      newMonthly: newMonthly,
      monthlyIncrease: feeMonthly,
      totalExtraCost: totalExtraCost,
    }
  }

  static async getLoanImpact(dealId: string) {
    const supabase = getSupabase()

    const { data: deal } = await supabase.from("SelectedDeal").select("*").eq("id", dealId).single()

    if (!deal) {
      throw new Error("Deal not found")
    }

    const feeOptions = await this.getFeeOptions(dealId)

    const apr = deal.apr || 7.9
    const termMonths = deal.termMonths || 60
    const baseLoanCents =
      deal.baseLoanAmountCents || deal.base_loan_amount_cents || Math.round((deal.cashOtd || 0) * 100)

    const monthlyRate = apr / 12 / 100
    const baseMonthlyPaymentCents = Math.round(
      (((baseLoanCents / 100) * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
        (Math.pow(1 + monthlyRate, termMonths) - 1)) *
        100,
    )

    const impact = this.calculateLoanImpact(feeOptions.remainingCents, apr, termMonths, baseMonthlyPaymentCents)

    return { ...impact, dealId, feeOptions }
  }

  static async agreeLoanInclusion(dealId: string, userId: string, ipAddress: string, userAgent: string) {
    const supabase = getSupabase()
    const impact = await this.getLoanImpact(dealId)
    const now = new Date().toISOString()

    const { data: existingPayment } = await supabase
      .from("ServiceFeePayment")
      .select("*")
      .eq("dealId", dealId)
      .limit(1)
      .maybeSingle()

    const paymentId = existingPayment?.id || crypto.randomUUID()

    const { data: payment } = existingPayment
      ? await supabase
          .from("ServiceFeePayment")
          .update({
            method: "LENDER_DIRECT",
            status: "PENDING",
            updatedAt: now,
          })
          .eq("id", paymentId)
          .select()
          .single()
      : await supabase
          .from("ServiceFeePayment")
          .insert({
            id: paymentId,
            dealId,
            baseFeeCents: impact.feeOptions.baseFeeCents,
            base_fee_cents: impact.feeOptions.baseFeeCents,
            depositAppliedCents: impact.feeOptions.depositAppliedCents,
            deposit_applied_cents: impact.feeOptions.depositAppliedCents,
            remainingCents: impact.feeOptions.remainingCents,
            remaining_cents: impact.feeOptions.remainingCents,
            method: "LENDER_DIRECT",
            status: "PENDING",
            user_id: userId,
            createdAt: now,
            updatedAt: now,
          })
          .select()
          .single()

    const { data: disclosure } = await supabase
      .from("FeeFinancingDisclosure")
      .insert({
        id: crypto.randomUUID(),
        selected_deal_id: dealId,
        user_id: userId,
        fee_amount_cents: impact.feeAmountCents,
        base_loan_amount_cents: impact.feeOptions.totalOtdCents,
        base_monthly_cents: impact.baseMonthlyCents,
        new_monthly_cents: impact.newMonthlyCents,
        delta_monthly_cents: impact.deltaMonthlyCents,
        total_extra_cost_cents: impact.totalExtraCostCents,
        consent_at: new Date(),
        auth_ip: ipAddress,
        auth_user_agent: userAgent,
        snapshot_json: {
          apr: impact.apr,
          termMonths: impact.termMonths,
          baseFeeCents: impact.feeOptions.baseFeeCents,
          depositAppliedCents: impact.feeOptions.depositAppliedCents,
          remainingCents: impact.feeOptions.remainingCents,
        },
        created_at_v2: now,
      })
      .select()
      .single()

    await supabase
      .from("SelectedDeal")
      .update({
        status: "FEE_PENDING",
        deal_status: "FEE_PENDING",
        updatedAt: now,
      })
      .eq("id", dealId)

    await supabase.from("ComplianceEvent").insert({
      id: crypto.randomUUID(),
      eventType: "FEE_FINANCING_DISCLOSURE",
      type: "FEE_LOAN_INCLUSION_AGREED",
      userId,
      relatedId: dealId,
      ipAddress,
      details: {
        feeAmountCents: impact.feeAmountCents,
        deltaMonthlyCents: impact.deltaMonthlyCents,
        totalExtraCostCents: impact.totalExtraCostCents,
        disclosureId: disclosure.id,
      },
      createdAt: now,
    })

    return { payment, disclosure, impact }
  }

  static async processLenderDisbursement(dealId: string) {
    const supabase = getSupabase()

    const { data: payment } = await supabase
      .from("ServiceFeePayment")
      .select("*")
      .eq("dealId", dealId)
      .eq("method", "LENDER_DIRECT")
      .limit(1)
      .maybeSingle()

    if (!payment) {
      throw new Error("No lender-direct payment found for this deal")
    }

    const now = new Date().toISOString()

    const { data: disbursement } = await supabase
      .from("LenderFeeDisbursement")
      .insert({
        id: crypto.randomUUID(),
        dealId,
        amount_cents: payment.remainingCents || payment.remaining_cents || 0,
        status: "PENDING",
        requested_at_v2: now,
      })
      .select()
      .single()

    await supabase
      .from("LenderFeeDisbursement")
      .update({
        status: "DISBURSED",
        disbursed_timestamp: now,
      })
      .eq("id", disbursement.id)

    await supabase.from("ServiceFeePayment").update({ status: "PAID", updatedAt: now }).eq("id", payment.id)

    const { data: deal } = await supabase
      .from("SelectedDeal")
      .update({
        status: "FEE_PAID",
        deal_status: "FEE_PAID",
        updatedAt: now,
      })
      .eq("id", dealId)
      .select(`
        *,
        buyer:BuyerProfile(
          *,
          user:User(*)
        )
      `)
      .single()

    if (deal?.buyer?.user) {
      const { data: referral } = await supabase
        .from("Referral")
        .select("*")
        .eq("referredUserId", deal.buyer.userId)
        .limit(1)
        .maybeSingle()

      if (referral) {
        const baseFee = payment.baseFeeCents || payment.base_fee_cents || 0
        await this.processCommissions(referral.affiliateId, payment.id, baseFee)
      }
    }

    return disbursement
  }

  static async processRefund(paymentId: string, type: "deposit" | "service_fee", reason: string, adminId: string) {
    const supabase = getSupabase()
    const now = new Date().toISOString()

    if (type === "deposit") {
      const { data: payment } = await supabase.from("DepositPayment").select("*").eq("id", paymentId).single()

      if (!payment) throw new Error("Deposit payment not found")

      const providerPaymentId = payment.providerPaymentId || payment.provider_payment_id

      if (providerPaymentId) {
        const refund = await stripe.refunds.create({
          payment_intent: providerPaymentId,
          reason: "requested_by_customer",
        })

        await supabase
          .from("DepositPayment")
          .update({
            status: "REFUNDED",
            refundId: refund.id,
            refundedAt: now,
            refunded_timestamp: now,
            reason,
            updatedAt: now,
          })
          .eq("id", paymentId)

        await supabase.from("ComplianceEvent").insert({
          id: crypto.randomUUID(),
          eventType: "DEPOSIT_REFUND",
          type: "DEPOSIT_REFUNDED",
          userId: adminId,
          relatedId: paymentId,
          details: {
            amountCents: payment.amountCents || payment.amount_cents,
            reason,
            refundId: refund.id,
          },
          createdAt: now,
        })
      }

      return { success: true, refundId: payment.refundId }
    } else {
      const { data: payment } = await supabase.from("ServiceFeePayment").select("*").eq("id", paymentId).single()

      if (!payment) throw new Error("Service fee payment not found")

      const providerPaymentId = payment.providerPaymentId || payment.provider_payment_id

      if (providerPaymentId && payment.method === "CARD_DIRECT") {
        const refund = await stripe.refunds.create({
          payment_intent: providerPaymentId,
          reason: "requested_by_customer",
        })

        await supabase
          .from("ServiceFeePayment")
          .update({
            status: "REFUNDED",
            refundId: refund.id,
            refundedAt: now,
            refunded_timestamp: now,
            updatedAt: now,
          })
          .eq("id", paymentId)

        await supabase
          .from("Commission")
          .update({ status: "REVERSED", updatedAt: now })
          .or(`serviceFeePaymentId.eq.${paymentId},service_fee_payment_id.eq.${paymentId}`)

        await supabase.from("ComplianceEvent").insert({
          id: crypto.randomUUID(),
          eventType: "SERVICE_FEE_REFUND",
          type: "FEE_REFUNDED",
          userId: adminId,
          relatedId: paymentId,
          details: {
            amountCents: payment.remainingCents || payment.remaining_cents,
            reason,
            refundId: refund.id,
          },
          createdAt: now,
        })
      }

      return { success: true }
    }
  }

  static async getAllPayments(filters?: { type?: string; status?: string }) {
    const supabase = getSupabase()

    const depositsQuery = supabase
      .from("DepositPayment")
      .select(`
        *,
        buyer:BuyerProfile(
          *,
          user:User(*)
        )
      `)
      .order("createdAt", { ascending: false })
      .limit(100)

    if (filters?.status) {
      depositsQuery.eq("status", filters.status)
    }

    const { data: deposits } = await depositsQuery

    const serviceFeesQuery = supabase
      .from("ServiceFeePayment")
      .select(`
        *,
        deal:SelectedDeal(
          *,
          buyer:BuyerProfile(*)
        )
      `)
      .order("createdAt", { ascending: false })
      .limit(100)

    if (filters?.status) {
      serviceFeesQuery.eq("status", filters.status)
    }

    const { data: serviceFees } = await serviceFeesQuery

    return { deposits: deposits || [], serviceFees: serviceFees || [] }
  }

  static async getBuyerPaymentHistory(buyerId: string) {
    const supabase = getSupabase()

    const { data: deposits } = await supabase
      .from("DepositPayment")
      .select("*")
      .eq("buyerId", buyerId)
      .order("createdAt", { ascending: false })

    const { data: serviceFees } = await supabase
      .from("ServiceFeePayment")
      .select(`
        *,
        deal:SelectedDeal(*)
      `)
      .eq("deal.buyerId", buyerId)
      .order("createdAt", { ascending: false })

    return { deposits: deposits || [], serviceFees: serviceFees || [] }
  }

  async checkIfDepositPaid(buyerId: string, auctionId: string) {
    const supabase = getSupabase()
    const { data: existing } = await supabase
      .from("DepositPayment")
      .select("id, status, amount")
      .eq("buyerId", buyerId)
      .eq("auctionId", auctionId)
      .eq("status", "PAID")
      .limit(1)
      .maybeSingle()

    return existing !== null
  }

  async processDepositPaymentIntent(paymentIntentId: string) {
    const supabase = getSupabase()
    const { data: payment } = await supabase
      .from("DepositPayment")
      .select("id, buyerId, auctionId, status, amount, providerPaymentId, provider_payment_id")
      .or(`providerPaymentId.eq.${paymentIntentId},provider_payment_id.eq.${paymentIntentId}`)
      .limit(1)
      .maybeSingle()

    if (!payment) {
      throw new Error("Payment not found")
    }

    await supabase
      .from("DepositPayment")
      .update({ status: "PAID", updatedAt: new Date().toISOString() })
      .eq("id", payment.id)

    await supabase.from("ComplianceEvent").insert({
      id: crypto.randomUUID(),
      eventType: "DEPOSIT_PAYMENT",
      type: "DEPOSIT_PAID",
      userId: payment.buyerId,
      details: {
        amountCents: payment.amountCents || payment.amount_cents,
        paymentIntentId,
      },
      createdAt: new Date().toISOString(),
    })

    return payment
  }

  async getOrCreateServiceFeePayment(dealId: string) {
    const supabase = getSupabase()
    const { data: deal } = await supabase
      .from("SelectedDeal")
      .select(`
        *,
        buyer:BuyerProfile(*)
      `)
      .eq("id", dealId)
      .single()

    if (!deal) {
      throw new Error("Deal not found")
    }

    const totalOtdCents =
      deal.totalOtdAmountCents || deal.total_otd_amount_cents || (deal.cashOtd ? Math.round(deal.cashOtd * 100) : 0)

    const baseFeeCents = this.calculateBaseFee(totalOtdCents)

    const { data: depositPayment } = await supabase
      .from("DepositPayment")
      .select("id, amount, status, createdAt")
      .eq("buyerId", deal.buyerId)
      .eq("status", "PAID")
      .order("createdAt", { ascending: false })
      .limit(1)
      .maybeSingle()

    const depositAppliedCents = depositPayment ? DEPOSIT_AMOUNT_CENTS : 0
    const remainingCents = baseFeeCents - depositAppliedCents

    const { data: existingPayment } = await supabase
      .from("ServiceFeePayment")
      .select("id, dealId, status, baseFeeCents, base_fee_cents")
      .eq("dealId", dealId)
      .limit(1)
      .maybeSingle()

    if (existingPayment?.status === "PAID") {
      return { payment: existingPayment, alreadyPaid: true }
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: remainingCents,
      currency: "usd",
      metadata: {
        dealId,
        type: "service_fee",
        baseFeeCents: baseFeeCents.toString(),
        depositAppliedCents: depositAppliedCents.toString(),
      },
    })

    const now = new Date().toISOString()
    const paymentId = existingPayment?.id || crypto.randomUUID()

    const { data: payment, error } = existingPayment
      ? await supabase
          .from("ServiceFeePayment")
          .update({
            providerPaymentId: paymentIntent.id,
            provider_payment_id: paymentIntent.id,
            status: "PENDING",
            updatedAt: now,
          })
          .eq("id", paymentId)
          .select()
          .single()
      : await supabase
          .from("ServiceFeePayment")
          .insert({
            id: paymentId,
            dealId,
            baseFeeCents,
            base_fee_cents: baseFeeCents,
            depositAppliedCents,
            deposit_applied_cents: depositAppliedCents,
            remainingCents,
            remaining_cents: remainingCents,
            method: "CARD_DIRECT",
            status: "PENDING",
            provider: "stripe",
            providerPaymentId: paymentIntent.id,
            provider_payment_id: paymentIntent.id,
            createdAt: now,
            updatedAt: now,
          })
          .select()
          .single()

    if (error) throw new Error(`Failed to create service fee payment: ${error.message}`)

    return { payment, clientSecret: paymentIntent.client_secret }
  }

  async processServiceFeePaymentIntent(paymentIntentId: string) {
    const supabase = getSupabase()
    const { data: payment } = await supabase
      .from("ServiceFeePayment")
      .select(`
        id, 
        dealId, 
        buyerId, 
        status, 
        baseFeeCents, 
        base_fee_cents,
        providerPaymentId,
        provider_payment_id
      `)
      .or(`providerPaymentId.eq.${paymentIntentId},provider_payment_id.eq.${paymentIntentId}`)
      .limit(1)
      .maybeSingle()

    if (!payment) {
      throw new Error("Payment not found")
    }

    await supabase
      .from("ServiceFeePayment")
      .update({ status: "PAID", method: "CARD_DIRECT", updatedAt: new Date().toISOString() })
      .eq("id", payment.id)

    if (payment.dealId) {
      const { data: deal } = await supabase
        .from("SelectedDeal")
        .update({
          status: "FEE_PAID",
          deal_status: "FEE_PAID",
          updatedAt: new Date().toISOString(),
        })
        .eq("id", payment.dealId)
        .select(`
          *,
          buyer:BuyerProfile(
            *,
            user:User(*)
          )
        `)
        .single()

      if (deal?.buyer?.user) {
        const { data: referral } = await supabase
          .from("Referral")
          .select("*")
          .eq("referredUserId", deal.buyer.userId)
          .limit(1)
          .maybeSingle()

        if (referral) {
          const baseFee = payment.baseFeeCents || payment.base_fee_cents || 0
          await this.processCommissions(referral.affiliateId, payment.id, baseFee)
        }
      }

      await supabase.from("ComplianceEvent").insert({
        id: crypto.randomUUID(),
        eventType: "SERVICE_FEE_PAYMENT",
        type: "FEE_PAID",
        userId: payment.user_id || deal?.buyerId,
        relatedId: payment.dealId,
        details: {
          baseFeeCents: payment.baseFeeCents || payment.base_fee_cents,
          depositAppliedCents: payment.depositAppliedCents || payment.deposit_applied_cents,
          remainingCents: payment.remainingCents || payment.remaining_cents,
          method: "CARD_DIRECT",
          paymentIntentId,
        },
        createdAt: new Date().toISOString(),
      })
    }

    return payment
  }

  async getPaymentHistoryForBuyer(buyerId: string) {
    const supabase = getSupabase()

    const { data: deposits } = await supabase
      .from("DepositPayment")
      .select("id, amount, status, method, createdAt, auctionId")
      .eq("buyerId", buyerId)
      .order("createdAt", { ascending: false })

    const { data: serviceFees } = await supabase
      .from("ServiceFeePayment")
      .select(`
        id,
        baseFeeCents,
        base_fee_cents,
        status,
        method,
        createdAt,
        dealId
      `)
      .eq("deal.buyerId", buyerId)
      .order("createdAt", { ascending: false })

    return { deposits: deposits || [], serviceFees: serviceFees || [] }
  }
}

export const paymentService = new PaymentService()
export default paymentService
