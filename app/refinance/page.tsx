"use client"

import type React from "react"

import { useState, useMemo, useCallback } from "react"
import Link from "next/link"
import { PublicNav } from "@/components/layout/public-nav"
import { PublicFooter } from "@/components/layout/public-footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import {
  DollarSign,
  Shield,
  CheckCircle,
  ArrowRight,
  Loader2,
  AlertCircle,
  ExternalLink,
  TrendingDown,
  Clock,
  Lock,
  BadgeCheck,
  Banknote,
  X,
  Check,
} from "lucide-react"

// US States for dropdown
const US_STATES = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
  { value: "DC", label: "District of Columbia" },
]

// Vehicle conditions
const VEHICLE_CONDITIONS = [
  { value: "EXCELLENT", label: "Excellent" },
  { value: "GOOD", label: "Good" },
  { value: "FAIR", label: "Fair" },
  { value: "POOR", label: "Poor" },
]

const VEHICLE_DATA: Record<string, string[]> = {
  Acura: ["ILX", "Integra", "MDX", "NSX", "RDX", "RLX", "TL", "TLX", "TSX", "ZDX"],
  "Alfa Romeo": ["4C", "Giulia", "Giulietta", "Stelvio", "Tonale"],
  "Aston Martin": ["DB11", "DB12", "DBX", "DBS", "Rapide", "Vantage", "Vanquish"],
  Audi: [
    "A3",
    "A4",
    "A5",
    "A6",
    "A7",
    "A8",
    "e-tron",
    "e-tron GT",
    "Q3",
    "Q4 e-tron",
    "Q5",
    "Q6 e-tron",
    "Q7",
    "Q8",
    "R8",
    "RS3",
    "RS5",
    "RS6",
    "RS7",
    "S3",
    "S4",
    "S5",
    "S6",
    "S7",
    "S8",
    "SQ5",
    "SQ7",
    "SQ8",
    "TT",
  ],
  Bentley: ["Bentayga", "Continental GT", "Flying Spur"],
  BMW: [
    "1 Series",
    "2 Series",
    "3 Series",
    "4 Series",
    "5 Series",
    "6 Series",
    "7 Series",
    "8 Series",
    "i3",
    "i4",
    "i5",
    "i7",
    "i8",
    "iX",
    "M2",
    "M3",
    "M4",
    "M5",
    "M8",
    "X1",
    "X2",
    "X3",
    "X4",
    "X5",
    "X6",
    "X7",
    "XM",
    "Z4",
  ],
  Buick: ["Cascada", "Enclave", "Encore", "Encore GX", "Envision", "Envista", "LaCrosse", "Regal", "Verano"],
  Cadillac: ["ATS", "CT4", "CT5", "CT6", "CTS", "Escalade", "Escalade ESV", "Lyriq", "XT4", "XT5", "XT6", "XTS"],
  Chevrolet: [
    "Avalanche",
    "Blazer",
    "Bolt EUV",
    "Bolt EV",
    "Camaro",
    "Colorado",
    "Corvette",
    "Cruze",
    "Equinox",
    "Express",
    "Impala",
    "Malibu",
    "Silverado 1500",
    "Silverado 2500HD",
    "Silverado 3500HD",
    "Sonic",
    "Spark",
    "Suburban",
    "Tahoe",
    "Trailblazer",
    "Traverse",
    "Trax",
  ],
  Chrysler: ["200", "300", "Pacifica", "Voyager"],
  Dodge: [
    "Challenger",
    "Charger",
    "Dart",
    "Durango",
    "Grand Caravan",
    "Hornet",
    "Journey",
    "Ram 1500",
    "Ram 2500",
    "Ram 3500",
  ],
  Ferrari: ["296 GTB", "296 GTS", "488", "812", "F8", "Portofino", "Purosangue", "Roma", "SF90"],
  Fiat: ["124 Spider", "500", "500L", "500X"],
  Ford: [
    "Bronco",
    "Bronco Sport",
    "E-Series",
    "EcoSport",
    "Edge",
    "Escape",
    "Expedition",
    "Explorer",
    "F-150",
    "F-150 Lightning",
    "F-250",
    "F-350",
    "Fiesta",
    "Flex",
    "Focus",
    "Fusion",
    "Maverick",
    "Mustang",
    "Mustang Mach-E",
    "Ranger",
    "Taurus",
    "Transit",
    "Transit Connect",
  ],
  Genesis: ["G70", "G80", "G90", "GV60", "GV70", "GV80"],
  GMC: [
    "Acadia",
    "Canyon",
    "Hummer EV",
    "Sierra 1500",
    "Sierra 2500HD",
    "Sierra 3500HD",
    "Terrain",
    "Yukon",
    "Yukon XL",
  ],
  Honda: [
    "Accord",
    "Civic",
    "Clarity",
    "CR-V",
    "CR-Z",
    "Element",
    "Fit",
    "HR-V",
    "Insight",
    "Odyssey",
    "Passport",
    "Pilot",
    "Prologue",
    "Ridgeline",
  ],
  Hyundai: [
    "Accent",
    "Azera",
    "Elantra",
    "Ioniq",
    "Ioniq 5",
    "Ioniq 6",
    "Kona",
    "Nexo",
    "Palisade",
    "Santa Cruz",
    "Santa Fe",
    "Sonata",
    "Tucson",
    "Veloster",
    "Venue",
  ],
  Infiniti: ["Q50", "Q60", "Q70", "QX30", "QX50", "QX55", "QX60", "QX70", "QX80"],
  Jaguar: ["E-Pace", "F-Pace", "F-Type", "I-Pace", "XE", "XF", "XJ"],
  Jeep: [
    "Cherokee",
    "Compass",
    "Gladiator",
    "Grand Cherokee",
    "Grand Cherokee L",
    "Grand Wagoneer",
    "Renegade",
    "Wagoneer",
    "Wrangler",
  ],
  Kia: [
    "Carnival",
    "EV6",
    "EV9",
    "Forte",
    "K5",
    "K900",
    "Niro",
    "Optima",
    "Rio",
    "Seltos",
    "Sorento",
    "Soul",
    "Sportage",
    "Stinger",
    "Telluride",
  ],
  Lamborghini: ["Aventador", "Huracan", "Revuelto", "Urus"],
  "Land Rover": [
    "Defender",
    "Discovery",
    "Discovery Sport",
    "Range Rover",
    "Range Rover Evoque",
    "Range Rover Sport",
    "Range Rover Velar",
  ],
  Lexus: ["CT", "ES", "GS", "GX", "IS", "LC", "LS", "LX", "NX", "RC", "RX", "RZ", "TX", "UX"],
  Lincoln: ["Aviator", "Continental", "Corsair", "MKC", "MKS", "MKT", "MKX", "MKZ", "Nautilus", "Navigator"],
  Lucid: ["Air", "Gravity"],
  Maserati: ["Ghibli", "GranTurismo", "Grecale", "Levante", "MC20", "Quattroporte"],
  Mazda: ["CX-3", "CX-30", "CX-5", "CX-50", "CX-70", "CX-9", "CX-90", "Mazda3", "Mazda6", "MX-30", "MX-5 Miata"],
  McLaren: ["570S", "600LT", "720S", "750S", "765LT", "Artura", "GT"],
  "Mercedes-Benz": [
    "A-Class",
    "AMG GT",
    "B-Class",
    "C-Class",
    "CLA",
    "CLS",
    "E-Class",
    "EQB",
    "EQE",
    "EQE SUV",
    "EQS",
    "EQS SUV",
    "G-Class",
    "GLA",
    "GLB",
    "GLC",
    "GLE",
    "GLS",
    "Maybach",
    "Metris",
    "S-Class",
    "SL",
    "SLC",
    "Sprinter",
  ],
  Mini: ["Clubman", "Convertible", "Cooper", "Countryman", "Hardtop"],
  Mitsubishi: ["Eclipse Cross", "Mirage", "Outlander", "Outlander Sport"],
  Nissan: [
    "370Z",
    "Altima",
    "Armada",
    "Ariya",
    "Frontier",
    "GT-R",
    "Kicks",
    "Leaf",
    "Maxima",
    "Murano",
    "Pathfinder",
    "Rogue",
    "Rogue Sport",
    "Sentra",
    "Titan",
    "Versa",
    "Z",
  ],
  Polestar: ["1", "2", "3", "4"],
  Porsche: ["718 Boxster", "718 Cayman", "911", "Cayenne", "Macan", "Panamera", "Taycan"],
  Ram: ["1500", "2500", "3500", "ProMaster", "ProMaster City"],
  Rivian: ["R1S", "R1T"],
  "Rolls-Royce": ["Cullinan", "Dawn", "Ghost", "Phantom", "Spectre", "Wraith"],
  Subaru: ["Ascent", "BRZ", "Crosstrek", "Forester", "Impreza", "Legacy", "Outback", "Solterra", "WRX"],
  Tesla: ["Model 3", "Model S", "Model X", "Model Y", "Cybertruck"],
  Toyota: [
    "4Runner",
    "86",
    "Avalon",
    "bZ4X",
    "Camry",
    "C-HR",
    "Corolla",
    "Corolla Cross",
    "Crown",
    "Grand Highlander",
    "GR86",
    "GR Corolla",
    "GR Supra",
    "Highlander",
    "Land Cruiser",
    "Mirai",
    "Prius",
    "RAV4",
    "Sequoia",
    "Sienna",
    "Tacoma",
    "Tundra",
    "Venza",
  ],
  Volkswagen: [
    "Arteon",
    "Atlas",
    "Atlas Cross Sport",
    "Beetle",
    "Golf",
    "Golf GTI",
    "Golf R",
    "ID.4",
    "ID.Buzz",
    "Jetta",
    "Passat",
    "Taos",
    "Tiguan",
  ],
  Volvo: ["C40 Recharge", "S60", "S90", "V60", "V90", "XC40", "XC40 Recharge", "XC60", "XC90", "EX30", "EX90"],
}

// Get sorted list of makes
const VEHICLE_MAKES = Object.keys(VEHICLE_DATA).sort()

interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  state: string
  tcpaConsent: boolean
  vehicleYear: string
  vehicleMake: string
  vehicleModel: string
  mileage: string
  vehicleCondition: string
  loanBalance: string
  currentMonthlyPayment: string
  monthlyIncome: string
}

interface EligibilityResult {
  qualified: boolean
  leadId: string
  redirectUrl?: string
  reasons?: string[]
  message?: string // Added message field
}

export default function RefinancePage() {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    state: "",
    tcpaConsent: false,
    vehicleYear: "",
    vehicleMake: "",
    vehicleModel: "",
    mileage: "",
    vehicleCondition: "",
    loanBalance: "",
    currentMonthlyPayment: "",
    monthlyIncome: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [result, setResult] = useState<EligibilityResult | null>(null)

  const availableModels = useMemo(() => {
    if (!formData.vehicleMake) return []
    return VEHICLE_DATA[formData.vehicleMake] || []
  }, [formData.vehicleMake])

  const formatPhoneNumber = (value: string): string => {
    const digits = value.replace(/\D/g, "")
    if (digits.length <= 3) return digits
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`
  }

  const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }))
    setError(null)

    setFormData((prev) => {
      const newData = { ...prev, [field]: value }
      if (field === "vehicleMake") {
        newData.vehicleModel = ""
      }
      return newData
    })

    if (field === "email" && typeof value === "string" && value.length > 0) {
      if (!isValidEmail(value)) {
        setFieldErrors((prev) => ({ ...prev, email: "Please enter a valid email address" }))
      }
    }

    if (field === "phone" && typeof value === "string") {
      const digits = value.replace(/\D/g, "")
      if (digits.length > 0 && digits.length < 10) {
        setFieldErrors((prev) => ({ ...prev, phone: "Please enter a 10-digit phone number" }))
      }
    }
  }

  const handleBlur = useCallback((field: keyof FormData) => {
    setFormData((prev) => {
      const value = prev[field]

      if (field === "firstName" && typeof value === "string" && !value.trim()) {
        setFieldErrors((prevErrors) => ({ ...prevErrors, firstName: "First name is required" }))
      }
      if (field === "lastName" && typeof value === "string" && !value.trim()) {
        setFieldErrors((prevErrors) => ({ ...prevErrors, lastName: "Last name is required" }))
      }
      if (field === "email" && typeof value === "string" && value && !isValidEmail(value)) {
        setFieldErrors((prevErrors) => ({ ...prevErrors, email: "Please enter a valid email address" }))
      }

      return prev
    })
  }, [])

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof FormData, string>> = {}

    if (!formData.firstName.trim()) {
      errors.firstName = "First name is required"
    }
    if (!formData.lastName.trim()) {
      errors.lastName = "Last name is required"
    }
    if (!formData.email || !isValidEmail(formData.email)) {
      errors.email = "Please enter a valid email address"
    }
    const phoneDigits = formData.phone.replace(/\D/g, "")
    if (!phoneDigits || phoneDigits.length < 10) {
      errors.phone = "Please enter a valid 10-digit phone number"
    }
    if (!formData.state) {
      errors.state = "Please select your state"
    }
    if (!formData.tcpaConsent) {
      setError("Please agree to the contact consent to continue")
      return false
    }
    if (!formData.vehicleYear) {
      errors.vehicleYear = "Please select a year"
    }
    if (!formData.vehicleMake) {
      errors.vehicleMake = "Please select a make"
    }
    if (!formData.vehicleModel) {
      errors.vehicleModel = "Please select a model"
    }
    if (!formData.mileage || Number.parseInt(formData.mileage) < 0) {
      errors.mileage = "Please enter valid mileage"
    }
    if (!formData.vehicleCondition) {
      errors.vehicleCondition = "Please select condition"
    }
    if (!formData.loanBalance || Number.parseFloat(formData.loanBalance) <= 0) {
      errors.loanBalance = "Please enter your loan balance"
    }
    if (!formData.currentMonthlyPayment || Number.parseFloat(formData.currentMonthlyPayment) <= 0) {
      errors.currentMonthlyPayment = "Please enter your monthly payment"
    }
    if (!formData.monthlyIncome || Number.parseFloat(formData.monthlyIncome) <= 0) {
      errors.monthlyIncome = "Please enter your monthly income"
    }

    setFieldErrors(errors)

    if (Object.keys(errors).length > 0) {
      setError("Please complete all required fields")
      const firstErrorField = Object.keys(errors)[0] || ""
      if (firstErrorField) {
        document.getElementById(firstErrorField)?.focus()
      }
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch("/api/refinance/check-eligibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          phone: formData.phone.replace(/\D/g, ""),
          vehicleYear: Number.parseInt(formData.vehicleYear),
          mileage: Number.parseInt(formData.mileage),
          loanBalance: Number.parseFloat(formData.loanBalance),
          currentMonthlyPayment: Number.parseFloat(formData.currentMonthlyPayment),
          monthlyIncome: Number.parseFloat(formData.monthlyIncome),
        }),
      })

      // Check if response is JSON before parsing
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text()
        console.error("[Refinance] Non-JSON response:", text)
        throw new Error(
          "The server returned an unexpected response. Please try again later or contact support if the issue persists.",
        )
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to check eligibility")
      }

      setResult(data)

      setTimeout(() => {
        document.getElementById("eligibility-result")?.scrollIntoView({ behavior: "smooth", block: "center" })
      }, 100)
    } catch (err) {
      console.error("[Refinance] Error:", err)
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRedirect = async () => {
    if (!result?.redirectUrl || !result?.leadId) return

    setIsRedirecting(true)

    try {
      await fetch("/api/refinance/record-redirect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId: result.leadId }),
      })
    } catch (err) {
      console.error("Failed to record redirect:", err)
    }

    window.open(result.redirectUrl, "_blank")

    setTimeout(() => setIsRedirecting(false), 1000)
  }

  const scrollToForm = () => {
    document.getElementById("refinance-form")?.scrollIntoView({ behavior: "smooth" })
  }

  // Result Screen
  if (result) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <PublicNav />
        <main className="flex-1">
          <section className="relative bg-[#2D1B69] text-white overflow-hidden">
            <div className="container mx-auto px-4 py-20 md:py-32">
              <div className="max-w-2xl mx-auto text-center">
                {result.qualified ? (
                  <>
                    <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-[#7ED321]/20 flex items-center justify-center">
                      <CheckCircle className="w-12 h-12 text-[#7ED321]" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">You May Qualify!</h1>
                    <p className="text-xl text-white/80 mb-10 max-w-lg mx-auto">
                      Based on the information you provided, you meet the basic criteria. Continue to our lending
                      partner to complete your secure application.
                    </p>
                    <Button
                      onClick={handleRedirect}
                      disabled={isRedirecting}
                      size="lg"
                      className="bg-gradient-to-r from-[#7ED321] to-[#00D9FF] text-[#2D1B69] font-semibold hover:opacity-90 px-8 py-6 text-lg"
                    >
                      {isRedirecting ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Opening...
                        </>
                      ) : (
                        <>
                          Continue to Secure Application
                          <ExternalLink className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </Button>
                    <p className="text-sm text-white/60 mt-6">
                      You will be redirected to our trusted lending partner to complete your application.
                    </p>
                  </>
                ) : (
                  <>
                    <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-white/10 flex items-center justify-center">
                      <AlertCircle className="w-12 h-12 text-white/70" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">We Couldn't Find a Match</h1>
                    <p className="text-xl text-white/80 mb-8 max-w-lg mx-auto">
                      Unfortunately, based on the information provided, we weren't able to find a refinancing option
                      that fits your situation at this time.
                    </p>
                    <div className="bg-white/10 rounded-2xl p-6 mb-10 text-left max-w-md mx-auto">
                      <p className="text-sm text-white/70 mb-3 font-medium">This could be due to:</p>
                      <ul className="text-sm text-white/60 space-y-2">
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-white/40"></span>
                          Vehicle age or mileage requirements
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-white/40"></span>
                          Loan balance minimums
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-white/40"></span>
                          State eligibility restrictions
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-white/40"></span>
                          Income requirements
                        </li>
                      </ul>
                    </div>
                    <Button
                      onClick={() => setResult(null)}
                      variant="outline"
                      size="lg"
                      className="border-white/30 text-white hover:bg-white/10"
                    >
                      Try Again with Different Information
                    </Button>
                  </>
                )}
              </div>
            </div>
          </section>
        </main>
        <PublicFooter />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PublicNav />

      <main className="flex-1">
        {/* Hero Section - Clean, matching homepage style */}
        <section className="relative bg-[#2D1B69] text-white overflow-hidden">
          <div className="container mx-auto px-4 py-12 sm:py-16 md:py-20 lg:py-24">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="space-y-6 sm:space-y-8 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm">
                  <TrendingDown className="w-4 h-4 text-[#7ED321]" />
                  <span className="text-xs sm:text-sm text-white/90">Auto Refinance</span>
                </div>

                <div>
                  <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-balance">
                    Lower Your{" "}
                    <span className="bg-gradient-to-r from-[#7ED321] via-[#00D9FF] to-[#0066FF] bg-clip-text text-transparent">
                      Car Payment
                    </span>
                  </h1>
                </div>

                <p className="text-base sm:text-lg md:text-xl text-white/80 text-balance max-w-xl mx-auto lg:mx-0">
                  You may be paying more than you should. In minutes, see if refinancing could reduce your payment and
                  increase your savings—without impacting your credit score.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                  <Button
                    onClick={scrollToForm}
                    className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 rounded-lg bg-gradient-to-r from-[#7ED321] to-[#00D9FF] text-[#2D1B69] font-semibold hover:opacity-90 transition-opacity"
                  >
                    Check Eligibility
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                  <Link
                    href="/how-it-works"
                    className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 rounded-lg border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-colors"
                  >
                    How It Works
                  </Link>
                </div>
              </div>

              {/* Right Card - Benefits Summary */}
              <div className="relative mt-4 lg:mt-0">
                <div className="bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-2xl p-5 sm:p-6 md:p-8 space-y-5 sm:space-y-6 border border-gray-200 max-w-md mx-auto lg:max-w-none">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <span className="text-gray-900 font-bold text-lg sm:text-xl">Quick Eligibility Check</span>
                    <span className="px-2 sm:px-3 py-1 rounded-full bg-[#7ED321]/10 text-[#7ED321] text-xs sm:text-sm font-semibold">
                      2 minutes
                    </span>
                  </div>

                  <div className="space-y-3 sm:space-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-[#7ED321] flex-shrink-0" />
                      <span className="text-gray-700 text-sm sm:text-base">No Social Security number required</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-[#7ED321] flex-shrink-0" />
                      <span className="text-gray-700 text-sm sm:text-base">No credit score impact</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-[#7ED321] flex-shrink-0" />
                      <span className="text-gray-700 text-sm sm:text-base">Instant results</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-[#7ED321] flex-shrink-0" />
                      <span className="text-gray-700 text-sm sm:text-base">Matched with trusted lending partners</span>
                    </div>
                  </div>

                  <div className="pt-3 sm:pt-4 border-t border-gray-200">
                    <div className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">
                      Your information stays protected
                    </div>
                    <div className="flex items-center gap-2">
                      <Lock className="w-5 h-5 text-[#2D1B69]" />
                      <span className="text-lg font-semibold text-[#2D1B69]">Secure & Private</span>
                    </div>
                  </div>

                  <Button
                    onClick={scrollToForm}
                    className="block w-full py-3 sm:py-4 rounded-lg sm:rounded-xl bg-gradient-to-r from-[#7ED321] to-[#00D9FF] text-[#2D1B69] font-semibold text-base sm:text-lg text-center hover:opacity-90 transition-opacity"
                  >
                    Start Now
                  </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-4 sm:mt-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-white/20 text-center">
                    <div className="text-lg sm:text-2xl font-bold text-white">100%</div>
                    <div className="text-xs sm:text-sm text-white/70">Free</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-white/20 text-center">
                    <div className="text-lg sm:text-2xl font-bold text-white">2 min</div>
                    <div className="text-xs sm:text-sm text-white/70">check</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-white/20 text-center">
                    <div className="text-lg sm:text-2xl font-bold text-white">$0</div>
                    <div className="text-xs sm:text-sm text-white/70">credit impact</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison Section - Old Way vs With Refinancing */}
        <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-br from-white via-gray-50 to-white relative overflow-hidden">
          <div className="container mx-auto px-4 relative">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4 text-gray-900">
              Your Car Loan <span className="text-[#2D1B69]">Could Be Costing You More</span>
            </h2>
            <p className="text-center text-lg text-muted-foreground mb-12 sm:mb-16 max-w-3xl mx-auto">
              Interest rates change. Your credit might have improved. Either way, you could be overpaying every month.
            </p>

            <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
              {/* Stuck with Current Loan */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-red-600/5 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative bg-white rounded-2xl border-2 border-red-100 p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                      <X className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Stuck with Your Loan</h3>
                  </div>
                  <div className="space-y-4">
                    {[
                      "Paying the same rate you got years ago",
                      "Missing out on better terms",
                      "Higher monthly payments than needed",
                      "More interest paid over time",
                      "Less money for other goals",
                      "Feeling locked in to a bad deal",
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-3 group/item">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center mt-0.5 group-hover/item:bg-red-200 transition-colors">
                          <X className="w-4 h-4 text-red-600" />
                        </div>
                        <span className="text-gray-700 text-base leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* With Refinancing */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-[#7ED321]/20 via-[#00D9FF]/10 to-[#0066FF]/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative bg-white rounded-2xl border-2 border-[#7ED321]/30 p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7ED321] to-[#00D9FF] flex items-center justify-center">
                      <Check className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">With Refinancing</h3>
                  </div>
                  <div className="space-y-4">
                    {[
                      "Potentially lower interest rate",
                      "Reduced monthly payments",
                      "Pay less interest over time",
                      "Free up money each month",
                      "No cost to check eligibility",
                      "Quick and easy process",
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-3 group/item">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#7ED321]/20 flex items-center justify-center mt-0.5 group-hover/item:bg-[#7ED321]/30 transition-colors">
                          <Check className="w-4 h-4 text-[#7ED321]" />
                        </div>
                        <span className="text-gray-700 text-base leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How Refinancing Works */}
        <section className="py-12 sm:py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10 sm:mb-12 md:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">How It Works</h2>
              <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto px-4">
                Three simple steps to potentially lower your car payment
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto">
              <div className="relative text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-[#7ED321]/10 flex items-center justify-center mb-4 sm:mb-6 mx-auto">
                  <span className="text-xl sm:text-2xl font-bold text-[#7ED321]">1</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">Quick Check</h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Answer a few questions about your vehicle and current loan. No SSN needed.
                </p>
              </div>

              <div className="relative text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-[#00D9FF]/10 flex items-center justify-center mb-4 sm:mb-6 mx-auto">
                  <span className="text-xl sm:text-2xl font-bold text-[#00D9FF]">2</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">See Results</h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Find out instantly if you meet basic eligibility criteria for refinancing.
                </p>
              </div>

              <div className="relative text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-[#0066FF]/10 flex items-center justify-center mb-4 sm:mb-6 mx-auto">
                  <span className="text-xl sm:text-2xl font-bold text-[#0066FF]">3</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">Connect & Save</h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  If eligible, connect with a trusted lender to complete your application.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Refinance Section */}
        <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10 sm:mb-12 md:mb-16">
              <span className="inline-block px-4 py-1.5 bg-[#2D1B69]/10 text-[#2D1B69] text-sm font-medium rounded-full mb-4">
                Why Refinance?
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">Benefits of Refinancing</h2>
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
                Here's why thousands of drivers consider refinancing their auto loans.
              </p>
            </div>

            <div className="max-w-5xl mx-auto">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                <div className="relative bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-[#2D1B69]/30 transition-all duration-300 group">
                  <div className="w-14 h-14 rounded-xl bg-[#2D1B69]/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    <TrendingDown className="w-7 h-7 text-[#2D1B69]" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Lower Rate</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Rates may have dropped since you got your loan, or your credit may have improved.
                  </p>
                </div>

                <div className="relative bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-[#00D9FF]/30 transition-all duration-300 group">
                  <div className="w-14 h-14 rounded-xl bg-[#00D9FF]/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    <Banknote className="w-7 h-7 text-[#00D9FF]" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Lower Payment</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    A better rate or longer term could reduce what you pay each month.
                  </p>
                </div>

                <div className="relative bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-[#7ED321]/30 transition-all duration-300 group">
                  <div className="w-14 h-14 rounded-xl bg-[#7ED321]/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    <DollarSign className="w-7 h-7 text-[#7ED321]" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Save Money</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Pay less in total interest over the life of your loan.
                  </p>
                </div>

                <div className="relative bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-[#0066FF]/30 transition-all duration-300 group">
                  <div className="w-14 h-14 rounded-xl bg-[#0066FF]/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    <Clock className="w-7 h-7 text-[#0066FF]" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Flexible Terms</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Choose a new loan term that fits your current financial situation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Application Form Section */}
        <section id="refinance-form" className="py-16 sm:py-20 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10 sm:mb-12">
              <span className="inline-block px-4 py-1.5 bg-[#7ED321]/10 text-[#7ED321] text-sm font-medium rounded-full mb-4">
                Free Eligibility Check
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">See If You Qualify</h2>
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
                No Social Security number required. No credit impact. Takes about 2 minutes.
              </p>
            </div>

            <Card className="max-w-3xl mx-auto shadow-xl border-0">
              <CardContent className="p-6 md:p-10">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Personal Information */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-[#2D1B69] text-white text-sm flex items-center justify-center">
                        1
                      </span>
                      Personal Information
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange("firstName", e.target.value)}
                          onBlur={() => handleBlur("firstName")}
                          placeholder="John"
                          className={`h-12 ${fieldErrors.firstName ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                          aria-describedby={fieldErrors.firstName ? "firstName-error" : undefined}
                          required
                        />
                        {fieldErrors.firstName && (
                          <p id="firstName-error" className="text-xs text-red-500">
                            {fieldErrors.firstName}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange("lastName", e.target.value)}
                          onBlur={() => handleBlur("lastName")}
                          placeholder="Smith"
                          className={`h-12 ${fieldErrors.lastName ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                          aria-describedby={fieldErrors.lastName ? "lastName-error" : undefined}
                          required
                        />
                        {fieldErrors.lastName && (
                          <p id="lastName-error" className="text-xs text-red-500">
                            {fieldErrors.lastName}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          onBlur={() => handleBlur("email")}
                          placeholder="john@example.com"
                          className={`h-12 ${fieldErrors.email ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                          aria-describedby={fieldErrors.email ? "email-error" : undefined}
                          required
                        />
                        {fieldErrors.email && (
                          <p id="email-error" className="text-xs text-red-500">
                            {fieldErrors.email}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => {
                            const formatted = formatPhoneNumber(e.target.value)
                            handleInputChange("phone", formatted)
                          }}
                          placeholder="(555) 123-4567"
                          className={`h-12 ${fieldErrors.phone ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                          aria-describedby={fieldErrors.phone ? "phone-error" : undefined}
                          maxLength={14}
                          required
                        />
                        {fieldErrors.phone && (
                          <p id="phone-error" className="text-xs text-red-500">
                            {fieldErrors.phone}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Select value={formData.state} onValueChange={(value) => handleInputChange("state", value)}>
                        <SelectTrigger
                          id="state"
                          className={`h-12 ${fieldErrors.state ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                        >
                          <SelectValue placeholder="Select your state" />
                        </SelectTrigger>
                        <SelectContent>
                          {US_STATES.map((state) => (
                            <SelectItem key={state.value} value={state.value}>
                              {state.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {fieldErrors.state && <p className="text-xs text-red-500">{fieldErrors.state}</p>}
                    </div>
                  </div>

                  {/* Vehicle Information */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-[#2D1B69] text-white text-sm flex items-center justify-center">
                        2
                      </span>
                      Vehicle Information
                    </h3>
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="vehicleYear">Year</Label>
                        <Select
                          value={formData.vehicleYear}
                          onValueChange={(value) => handleInputChange("vehicleYear", value)}
                        >
                          <SelectTrigger
                            id="vehicleYear"
                            className={`h-12 ${fieldErrors.vehicleYear ? "border-red-500" : ""}`}
                          >
                            <SelectValue placeholder="Select year" />
                          </SelectTrigger>
                          <SelectContent className="max-h-[300px]">
                            {Array.from({ length: 25 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                              <SelectItem key={year} value={year.toString()}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {fieldErrors.vehicleYear && <p className="text-xs text-red-500">{fieldErrors.vehicleYear}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="vehicleMake">Make</Label>
                        <Select
                          value={formData.vehicleMake}
                          onValueChange={(value) => handleInputChange("vehicleMake", value)}
                        >
                          <SelectTrigger
                            id="vehicleMake"
                            className={`h-12 ${fieldErrors.vehicleMake ? "border-red-500" : ""}`}
                          >
                            <SelectValue placeholder="Select make" />
                          </SelectTrigger>
                          <SelectContent className="max-h-[300px]">
                            {VEHICLE_MAKES.map((make) => (
                              <SelectItem key={make} value={make}>
                                {make}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {fieldErrors.vehicleMake && <p className="text-xs text-red-500">{fieldErrors.vehicleMake}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="vehicleModel">Model</Label>
                        <Select
                          value={formData.vehicleModel}
                          onValueChange={(value) => handleInputChange("vehicleModel", value)}
                          disabled={!formData.vehicleMake}
                        >
                          <SelectTrigger
                            id="vehicleModel"
                            className={`h-12 ${fieldErrors.vehicleModel ? "border-red-500" : ""}`}
                          >
                            <SelectValue placeholder={formData.vehicleMake ? "Select model" : "Select make first"} />
                          </SelectTrigger>
                          <SelectContent className="max-h-[300px]">
                            {availableModels.map((model) => (
                              <SelectItem key={model} value={model}>
                                {model}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {fieldErrors.vehicleModel && <p className="text-xs text-red-500">{fieldErrors.vehicleModel}</p>}
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="mileage">Current Mileage</Label>
                        <Input
                          id="mileage"
                          type="number"
                          value={formData.mileage}
                          onChange={(e) => handleInputChange("mileage", e.target.value)}
                          placeholder="45000"
                          className={`h-12 ${fieldErrors.mileage ? "border-red-500" : ""}`}
                          min="0"
                          required
                        />
                        {fieldErrors.mileage && <p className="text-xs text-red-500">{fieldErrors.mileage}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="vehicleCondition">Vehicle Condition</Label>
                        <Select
                          value={formData.vehicleCondition}
                          onValueChange={(value) => handleInputChange("vehicleCondition", value)}
                        >
                          <SelectTrigger
                            id="vehicleCondition"
                            className={`h-12 ${fieldErrors.vehicleCondition ? "border-red-500" : ""}`}
                          >
                            <SelectValue placeholder="Select condition" />
                          </SelectTrigger>
                          <SelectContent>
                            {VEHICLE_CONDITIONS.map((condition) => (
                              <SelectItem key={condition.value} value={condition.value}>
                                {condition.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {fieldErrors.vehicleCondition && (
                          <p className="text-xs text-red-500">{fieldErrors.vehicleCondition}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Loan Information */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-[#2D1B69] text-white text-sm flex items-center justify-center">
                        3
                      </span>
                      Loan Information
                    </h3>
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="loanBalance">Current Loan Balance</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                          <Input
                            id="loanBalance"
                            type="number"
                            value={formData.loanBalance}
                            onChange={(e) => handleInputChange("loanBalance", e.target.value)}
                            placeholder="15000"
                            className={`pl-7 h-12 ${fieldErrors.loanBalance ? "border-red-500" : ""}`}
                            min="0"
                            required
                          />
                        </div>
                        {fieldErrors.loanBalance && <p className="text-xs text-red-500">{fieldErrors.loanBalance}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="currentMonthlyPayment">Monthly Payment</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                          <Input
                            id="currentMonthlyPayment"
                            type="number"
                            value={formData.currentMonthlyPayment}
                            onChange={(e) => handleInputChange("currentMonthlyPayment", e.target.value)}
                            placeholder="350"
                            className={`pl-7 h-12 ${fieldErrors.currentMonthlyPayment ? "border-red-500" : ""}`}
                            min="0"
                            required
                          />
                        </div>
                        {fieldErrors.currentMonthlyPayment && (
                          <p className="text-xs text-red-500">{fieldErrors.currentMonthlyPayment}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="monthlyIncome">Monthly Income</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                          <Input
                            id="monthlyIncome"
                            type="number"
                            value={formData.monthlyIncome}
                            onChange={(e) => handleInputChange("monthlyIncome", e.target.value)}
                            placeholder="4000"
                            className={`pl-7 h-12 ${fieldErrors.monthlyIncome ? "border-red-500" : ""}`}
                            min="0"
                            required
                          />
                        </div>
                        {fieldErrors.monthlyIncome && (
                          <p className="text-xs text-red-500">{fieldErrors.monthlyIncome}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Consent */}
                  <div className="bg-gray-50 rounded-xl p-5">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="tcpaConsent"
                        checked={formData.tcpaConsent}
                        onCheckedChange={(checked) => handleInputChange("tcpaConsent", checked as boolean)}
                        className="mt-1 flex-shrink-0"
                      />
                      <Label htmlFor="tcpaConsent" className="text-sm text-gray-600 leading-relaxed cursor-pointer">
                        By checking this box, I consent to receive calls, texts, and emails from AutoLenis and its
                        lending partners regarding refinancing options. I understand that my consent is not required to
                        make a purchase. Message and data rates may apply. I agree to the{" "}
                        <Link
                          href="/legal/terms"
                          className="text-[#2D1B69] font-medium underline hover:no-underline whitespace-nowrap"
                        >
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link
                          href="/legal/privacy"
                          className="text-[#2D1B69] font-medium underline hover:no-underline whitespace-nowrap"
                        >
                          Privacy Policy
                        </Link>
                        .
                      </Label>
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div
                      className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3"
                      role="alert"
                    >
                      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                      <span className="text-red-700 text-sm">{error}</span>
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full py-6 text-lg bg-gradient-to-r from-[#7ED321] to-[#00D9FF] text-[#2D1B69] font-semibold hover:opacity-90 transition-opacity"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Checking Eligibility...
                      </>
                    ) : (
                      <>
                        Check My Eligibility
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>

                  <p className="text-center text-xs text-gray-500">
                    This eligibility check does not affect your credit score.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-12 sm:py-16 bg-[#2D1B69] text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Shield className="w-12 h-12 mx-auto mb-6 text-[#7ED321]" />
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">Your Information is Safe with Us</h2>
              <p className="text-white/70 mb-8 max-w-2xl mx-auto">
                We use bank-level encryption to protect your data. Your information is only shared with our trusted
                lending partners when you choose to proceed with an application.
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                <div className="flex items-center gap-2">
                  <BadgeCheck className="w-5 h-5 text-[#7ED321]" />
                  <span className="text-sm text-white/80">256-bit SSL Encryption</span>
                </div>
                <div className="flex items-center gap-2">
                  <BadgeCheck className="w-5 h-5 text-[#7ED321]" />
                  <span className="text-sm text-white/80">Trusted Lender Partners</span>
                </div>
                <div className="flex items-center gap-2">
                  <BadgeCheck className="w-5 h-5 text-[#7ED321]" />
                  <span className="text-sm text-white/80">No Hidden Fees</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  )
}
