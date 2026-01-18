import { type NextRequest, NextResponse } from "next/server"
import { isDatabaseConfigured } from "@/lib/db"
import { emailService } from "@/lib/services/email.service"
import { EMAIL_CONFIG } from "@/lib/resend"
import { logger } from "@/lib/logger"

// OpenRoad Lending - Allowed States
const ALLOWED_STATES_OPENROAD = [
  "AL",
  "AR",
  "AZ",
  "CA",
  "CO",
  "DE",
  "FL",
  "GA",
  "IA",
  "ID",
  "IL",
  "IN",
  "KS",
  "KY",
  "LA",
  "MA",
  "MD",
  "ME",
  "MI",
  "MN",
  "MO",
  "MT",
  "NC",
  "ND",
  "NE",
  "NJ",
  "NM",
  "NY",
  "OH",
  "OK",
  "OR",
  "PA",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VA",
  "WA",
  "WV",
  "WY",
]

// OpenRoad Partner ID
const OPENROAD_PARTNER_ID = process.env.OPENROAD_PARTNER_ID || "autolenis"

interface RefinanceFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  state: string
  tcpaConsent: boolean
  vehicleYear: number
  vehicleMake: string
  vehicleModel: string
  mileage: number
  vehicleCondition: "EXCELLENT" | "GOOD" | "FAIR" | "POOR"
  loanBalance: number
  currentMonthlyPayment: number
  monthlyIncome: number
}

// Layer 1: Lender (OpenRoad) Filters - MANDATORY
function applyLenderFilters(data: RefinanceFormData): string[] {
  const currentYear = new Date().getFullYear()
  const vehicleAge = currentYear - data.vehicleYear
  const reasons: string[] = []

  if (vehicleAge > 13) reasons.push("lender_vehicle_too_old")
  if (data.mileage > 160000) reasons.push("lender_mileage_too_high")
  if (data.monthlyIncome < 2000) reasons.push("lender_income_too_low")
  if (!ALLOWED_STATES_OPENROAD.includes(data.state)) reasons.push("lender_state_not_allowed")

  return reasons
}

// Layer 2: AutoLenis Internal Filters - QUALITY CONTROL
function applyInternalFilters(data: RefinanceFormData): string[] {
  const reasons: string[] = []

  if (data.loanBalance < 8000) reasons.push("internal_loan_balance_too_low")
  if (data.vehicleCondition === "POOR") reasons.push("internal_vehicle_condition_poor")

  return reasons
}

export async function POST(request: NextRequest) {
  try {
    const dbConfigured = isDatabaseConfigured()
    if (!dbConfigured) {
      logger.warn("Refinance API: Database not configured, skipping DB operations")
    }

    const body = (await request.json()) as RefinanceFormData

    // Validate required fields
    if (!body.firstName || !body.lastName || !body.email || !body.phone || !body.state) {
      return NextResponse.json({ error: "Missing required personal information" }, { status: 400 })
    }

    if (!body.vehicleYear || !body.vehicleMake || !body.vehicleModel || !body.mileage || !body.vehicleCondition) {
      return NextResponse.json({ error: "Missing required vehicle information" }, { status: 400 })
    }

    if (!body.loanBalance || !body.currentMonthlyPayment || !body.monthlyIncome) {
      return NextResponse.json({ error: "Missing required loan information" }, { status: 400 })
    }

    if (!body.tcpaConsent) {
      return NextResponse.json({ error: "TCPA consent is required" }, { status: 400 })
    }

    // Apply two-layer filtering
    const lenderFailures = applyLenderFilters(body)
    const internalFailures = applyInternalFilters(body)
    const allReasons = [...lenderFailures, ...internalFailures]
    const qualified = allReasons.length === 0

    // Generate a unique lead ID
    const leadId = `lead-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`

    // Log the lead data
    logger.info("Refinance lead received", {
      leadId,
      qualified,
      reasons: allReasons,
      email: body.email,
      state: body.state,
    })

    try {
      const internalEmailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3d2066;">New Refinance Lead Submission</h2>
          <p><strong>Reference ID:</strong> ${leadId}</p>
          <p><strong>Status:</strong> ${qualified ? "✅ Pre-Qualified" : "❌ Not Qualified"}</p>
          
          <h3 style="color: #3d2066; margin-top: 20px;">Contact Information</h3>
          <ul style="list-style: none; padding: 0;">
            <li><strong>Name:</strong> ${body.firstName} ${body.lastName}</li>
            <li><strong>Email:</strong> ${body.email}</li>
            <li><strong>Phone:</strong> ${body.phone}</li>
            <li><strong>State:</strong> ${body.state}</li>
          </ul>
          
          <h3 style="color: #3d2066; margin-top: 20px;">Vehicle Information</h3>
          <ul style="list-style: none; padding: 0;">
            <li><strong>Vehicle:</strong> ${body.vehicleYear} ${body.vehicleMake} ${body.vehicleModel}</li>
            <li><strong>Mileage:</strong> ${body.mileage.toLocaleString()} miles</li>
            <li><strong>Condition:</strong> ${body.vehicleCondition}</li>
          </ul>
          
          <h3 style="color: #3d2066; margin-top: 20px;">Loan Information</h3>
          <ul style="list-style: none; padding: 0;">
            <li><strong>Current Loan Balance:</strong> $${body.loanBalance.toLocaleString()}</li>
            <li><strong>Monthly Payment:</strong> $${body.currentMonthlyPayment.toLocaleString()}</li>
            <li><strong>Monthly Income:</strong> $${body.monthlyIncome.toLocaleString()}</li>
          </ul>
          
          ${
            !qualified
              ? `
          <h3 style="color: #dc2626; margin-top: 20px;">Disqualification Reasons</h3>
          <ul>
            ${allReasons.map((r) => `<li>${r.replace(/_/g, " ").replace(/lender |internal /g, "")}</li>`).join("")}
          </ul>
          `
              : ""
          }
          
          <p style="margin-top: 20px; color: #666; font-size: 12px;">
            Submitted at: ${new Date().toLocaleString("en-US", { timeZone: "America/New_York" })} ET
          </p>
        </div>
      `

      const internalResult = await emailService.sendNotificationEmail(
        EMAIL_CONFIG.notificationRecipient,
        `[Refinance Lead] ${qualified ? "✅ Qualified" : "❌ Not Qualified"} - ${body.firstName} ${body.lastName}`,
        internalEmailHtml,
      )
      logger.debug("Refinance internal notification sent", { result: internalResult })
    } catch (emailError) {
      logger.error("Refinance internal notification failed", { error: emailError })
    }

    if (qualified) {
      const redirectUrl = `https://openroadlending.com/apply?partner_id=${OPENROAD_PARTNER_ID}&sub_id=${leadId}`

      try {
        const qualifiedResult = await emailService.sendRefinanceQualifiedEmail(
          body.email,
          body.firstName,
          redirectUrl,
          leadId,
        )
        logger.debug("Refinance qualified email sent", { result: qualifiedResult })
      } catch (emailError) {
        logger.error("Refinance qualified email failed", { error: emailError })
      }

      return NextResponse.json({
        qualified: true,
        leadId,
        redirectUrl,
      })
    } else {
      try {
        const declinedResult = await emailService.sendRefinanceDeclinedEmail(
          body.email,
          body.firstName,
          allReasons,
          leadId,
        )
        logger.debug("Refinance declined email sent", { result: declinedResult })
      } catch (emailError) {
        logger.error("Refinance declined email failed", { error: emailError })
      }

      return NextResponse.json({
        qualified: false,
        leadId,
        reasons: allReasons,
      })
    }
  } catch (error) {
    logger.error("Refinance API error", { error })
    return NextResponse.json(
      {
        error: "Failed to process eligibility check. Please try again.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
