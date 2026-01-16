// Shared TypeScript types for AutoLenis platform

// User and Role Types
export type UserRole = "BUYER" | "DEALER" | "DEALER_USER" | "ADMIN" | "SUPER_ADMIN" | "AFFILIATE" | "AFFILIATE_ONLY"

export interface User {
  id: string
  email: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
}

export interface BuyerProfile {
  id: string
  userId: string
  firstName: string
  lastName: string
  phone: string
  address: string
  city: string
  state: string
  zip: string
  employment: string
  employer: string
  annualIncome: number
  housingStatus: string
  monthlyHousing: number
  createdAt: Date
  updatedAt: Date
}

export type CreditTier = "EXCELLENT" | "GOOD" | "FAIR" | "POOR"

export interface PreQualification {
  id: string
  userId: string
  creditScore: number | null
  creditTier: CreditTier
  maxOtd: number
  estimatedMonthlyMin: number
  estimatedMonthlyMax: number
  dti: number
  approved: boolean
  expiresAt: Date
  createdAt: Date
  updatedAt: Date
}

export interface Dealer {
  id: string
  name: string
  licenseNumber: string
  address: string
  city: string
  state: string
  zip: string
  phone: string
  email: string
  verified: boolean
  integrityScore: number
  createdAt: Date
  updatedAt: Date
}

export interface AdminUser {
  id: string
  userId: string
  permissions: string[]
  createdAt: Date
  updatedAt: Date
}

export interface Affiliate {
  id: string
  userId: string
  referralCode: string
  parentAffiliateId: string | null
  level: number
  totalEarnings: number
  createdAt: Date
  updatedAt: Date
}

// Vehicle and Inventory Types
export interface Vehicle {
  id: string
  vin: string
  year: number
  make: string
  model: string
  trim: string
  mileage: number
  color: string
  createdAt: Date
  updatedAt: Date
}

export interface InventoryItem {
  id: string
  vehicleId: string
  dealerId: string
  listPrice: number
  condition: string
  available: boolean
  zipCode: string
  createdAt: Date
  updatedAt: Date
}

export interface Shortlist {
  id: string
  userId: string
  createdAt: Date
  updatedAt: Date
}

// Auction Types
export type AuctionStatus = "PENDING" | "ACTIVE" | "CLOSED" | "CANCELLED"

export interface Auction {
  id: string
  userId: string
  shortlistId: string
  status: AuctionStatus
  depositPaid: boolean
  closesAt: Date
  createdAt: Date
  updatedAt: Date
}

export interface AuctionOffer {
  id: string
  auctionId: string
  dealerId: string
  inventoryItemId: string
  cashOtd: number
  taxAmount: number
  feesBreakdown: any
  createdAt: Date
  updatedAt: Date
}

// Deal Types
export type DealStatus = "SELECTED" | "FINANCING" | "INSURED" | "CONTRACTED" | "SIGNED" | "COMPLETED" | "CANCELLED"

export interface SelectedDeal {
  id: string
  auctionId: string
  userId: string
  offerId: string
  status: DealStatus
  createdAt: Date
  updatedAt: Date
}

// Payment Types
export type FeePaymentMethod = "CARD" | "LOAN_INCLUSION"
export type PaymentStatus = "PENDING" | "PAID" | "REFUNDED" | "FAILED"

export interface ServiceFeePayment {
  id: string
  dealId: string
  amount: number
  method: FeePaymentMethod
  status: PaymentStatus
  stripePaymentId: string | null
  createdAt: Date
  updatedAt: Date
}

// Insurance Types
export type InsuranceStatus = "PENDING" | "ACTIVE" | "CANCELLED"

export interface InsurancePolicy {
  id: string
  dealId: string
  carrier: string
  policyNumber: string
  coverageType: string
  status: InsuranceStatus
  createdAt: Date
  updatedAt: Date
}

// Contract Types
export type ContractStatus = "PENDING" | "SCANNING" | "ISSUES_FOUND" | "PASSED" | "REJECTED"

export interface ContractDocument {
  id: string
  dealId: string
  dealerId: string
  status: ContractStatus
  uploadedAt: Date
  updatedAt: Date
}

export interface ContractShieldScan {
  id: string
  contractId: string
  aprMatch: boolean
  paymentMatch: boolean
  otdMatch: boolean
  junkFeesDetected: boolean
  overallScore: number
  scannedAt: Date
}

// E-Sign Types
export type ESignStatus = "PENDING" | "SENT" | "SIGNED" | "COMPLETED" | "DECLINED"

export interface ESignEnvelope {
  id: string
  dealId: string
  providerId: string
  status: ESignStatus
  createdAt: Date
  updatedAt: Date
}

// Pickup Types
export type PickupStatus = "SCHEDULED" | "CONFIRMED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED"

export interface PickupAppointment {
  id: string
  dealId: string
  scheduledDate: Date
  qrCode: string
  status: PickupStatus
  createdAt: Date
  updatedAt: Date
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Pre-Qualification Types
export interface PreQualRequest {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zip: string
  employment: string
  employer: string
  annualIncome: number
  housingStatus: string
  monthlyHousing: number
  ssn: string
  dob: string
  consentGiven: boolean
}

export interface PreQualResult {
  approved: boolean
  maxOtd: number
  creditTier: CreditTier
  estimatedMonthlyMin: number
  estimatedMonthlyMax: number
  expiresAt: Date
}

// Best Price Types
export interface BestPriceResults {
  bestCash: BestPriceOptionDetail
  bestMonthly: BestPriceOptionDetail
  balanced: BestPriceOptionDetail
  allOffers: OfferDetail[]
}

export interface BestPriceOptionDetail {
  offerId: string
  dealerId: string
  dealerName: string
  inventoryItemId: string
  vehicle: Vehicle
  cashOtd: number
  monthlyPayment: number | null
  score: number
}

export interface OfferDetail extends Omit<BestPriceOptionDetail, "score"> {
  taxAmount: number
  feesBreakdown: Record<string, number>
  financingOptions: any[] // FinancingOptionInput[]
}

// Fee Payment Types
export interface FeeOptions {
  baseFee: number
  depositCredit: number
  finalAmount: number
  options: {
    payDirectly: boolean
    includeInLoan: boolean
  }
}

export interface LoanImpactCalculation {
  feeAmount: number
  apr: number
  termMonths: number
  baseMonthly: number
  newMonthly: number
  monthlyIncrease: number
  totalExtraCost: number
  totalFinanced: number
}

// Insurance Types
export interface InsuranceQuoteRequest {
  vehicleId: string
  coverageType: "LIABILITY" | "COLLISION" | "COMPREHENSIVE" | "FULL"
}

export interface InsuranceQuoteResult {
  carrier: string
  coverageType: string
  monthlyPremium: number
  sixMonthPremium: number
  coverageLimits: Record<string, string>
  deductibles: Record<string, number>
}

// Contract Shield Types
export interface ContractShieldResult {
  status: ContractStatus
  aprMatch: boolean
  paymentMatch: boolean
  otdMatch: boolean
  junkFeesDetected: boolean
  missingAddendums: string[]
  overallScore: number
  fixList: FixListItemDetail[]
}

export interface FixListItemDetail {
  category: string
  description: string
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
  expectedFix: string
  resolved: boolean
}

// Affiliate Types
export interface AffiliateDashboard {
  totalEarnings: number
  pendingEarnings: number
  totalClicks: number
  totalReferrals: number
  completedDeals: number
  commissions: CommissionDetail[]
}

export interface CommissionDetail {
  level: number
  dealId: string
  baseAmount: number
  commissionRate: number
  commissionAmount: number
  status: string
  createdAt: Date
}

// Financing Option Input Type
export type FinancingOptionInput = {}
