"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PublicNav } from "@/components/layout/public-nav"
import { PublicFooter } from "@/components/layout/public-footer"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  ArrowRight,
  Users,
  Shield,
  CheckCircle,
  Star,
  DollarSign,
  Zap,
  Loader2,
  TrendingUp,
  Clock,
  Target,
  Handshake,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function DealerApplicationPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    // Business Info
    dealershipName: "",
    businessType: "",
    yearsInBusiness: "",
    licenseNumber: "",
    taxId: "",
    // Contact Info
    contactName: "",
    contactTitle: "",
    email: "",
    phone: "",
    password: "",
    // Location
    address: "",
    city: "",
    state: "",
    zipCode: "",
    // Inventory
    averageInventory: "",
    primaryVehicleTypes: "",
    monthlyVolume: "",
    // Additional
    website: "",
    howDidYouHear: "",
    additionalInfo: "",
    agreeToTerms: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const signupResponse = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          firstName: formData.contactName.split(" ")[0] || formData.contactName,
          lastName: formData.contactName.split(" ").slice(1).join(" ") || "",
          role: "DEALER",
        }),
      })

      const signupData = await signupResponse.json()

      if (!signupData.success) {
        throw new Error(signupData.error || "Failed to create account")
      }

      const registerResponse = await fetch("/api/dealer/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dealershipName: formData.dealershipName,
          businessType: formData.businessType,
          licenseNumber: formData.licenseNumber,
          yearsInBusiness: formData.yearsInBusiness,
          contactName: formData.contactName,
          contactTitle: formData.contactTitle,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          averageInventory: formData.averageInventory,
          monthlyVolume: formData.monthlyVolume,
          website: formData.website,
          additionalInfo: formData.additionalInfo,
        }),
      })

      const registerData = await registerResponse.json()

      if (registerData.error) {
        throw new Error(registerData.error)
      }

      toast({
        title: "Application Submitted!",
        description: "We'll review your application and get back to you within 2 business days.",
      })

      router.push("/dealer/onboarding?pending=true")
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: error.message || "Please try again or contact support.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <PublicNav />

      {/* Hero Section - matches homepage layout */}
      <section className="relative bg-[#2D1B69] text-white overflow-hidden">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-sm text-white/90">Join 500+ dealers nationwide</span>
              </div>

              {/* Main Headline */}
              <div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-balance">
                  Grow Your{" "}
                  <span className="bg-gradient-to-r from-[#7ED321] via-[#00D9FF] to-[#0066FF] bg-clip-text text-transparent">
                    Dealership
                  </span>
                </h1>
              </div>

              {/* Subheadline */}
              <p className="text-lg md:text-xl text-white/80 text-balance max-w-xl">
                Connect with pre-qualified buyers actively looking for vehicles. No upfront costs—you only pay when you
                make a sale.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#apply"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[#7ED321] to-[#00D9FF] text-[#2D1B69] font-semibold hover:opacity-90 transition-opacity"
                >
                  Apply Now
                  <ArrowRight className="w-5 h-5" />
                </a>
                <Link
                  href="/how-it-works"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-colors"
                >
                  How It Works
                </Link>
              </div>
            </div>

            {/* Right: Benefits Card */}
            <div className="relative">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 md:p-8 space-y-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-900 font-bold text-xl">Dealer Benefits</span>
                  <span className="px-3 py-1 rounded-full bg-[#7ED321]/10 text-[#7ED321] text-sm font-semibold">
                    No Upfront Cost
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#7ED321] mt-0.5" />
                    <span className="text-gray-700">Pre-qualified, ready-to-buy leads</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#7ED321] mt-0.5" />
                    <span className="text-gray-700">Pay only when you close a deal</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#7ED321] mt-0.5" />
                    <span className="text-gray-700">Streamlined digital contracts</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#7ED321] mt-0.5" />
                    <span className="text-gray-700">Real-time inventory management</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#7ED321] mt-0.5" />
                    <span className="text-gray-700">Dedicated dealer support team</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-500 mb-2">Average increase in sales</div>
                  <div className="text-3xl font-bold text-[#2D1B69]">+35%</div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="text-2xl font-bold text-white">500+</div>
                  <div className="text-sm text-white/70">Dealers</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="text-2xl font-bold text-white">50K+</div>
                  <div className="text-sm text-white/70">Buyers</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="text-2xl font-bold text-white">$0</div>
                  <div className="text-sm text-white/70">Upfront</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Qualified Leads - Cohesive Content Section */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00D9FF]/10 border border-[#00D9FF]/20 mb-6">
              <Target className="w-4 h-4 text-[#00D9FF]" />
              <span className="text-sm font-medium text-[#00D9FF]">Qualified Leads</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Connect with Buyers Who Are <span className="text-[#00D9FF]">Ready to Purchase</span>
            </h2>
            <p className="text-lg text-gray-600">
              Stop wasting time on tire-kickers. Every lead you receive is pre-qualified with verified credit scores,
              confirmed budgets, and genuine purchase intent.
            </p>
          </div>

          {/* Content Grid - Two Column Layout */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left Column - Benefits List */}
            <div className="space-y-8">
              {/* Benefit 1 */}
              <div className="flex gap-5">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#7ED321]/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-[#7ED321]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Pre-Qualified Buyers Only</h3>
                  <p className="text-gray-600">
                    Every buyer completes our 5-minute pre-qualification process. You receive their credit tier, budget
                    range, and vehicle preferences before making contact.
                  </p>
                </div>
              </div>

              {/* Benefit 2 */}
              <div className="flex gap-5">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#00D9FF]/10 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-[#00D9FF]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Pay-Per-Sale Model</h3>
                  <p className="text-gray-600">
                    No monthly fees, no subscriptions, no upfront costs. You only pay a small commission when you
                    successfully close a deal through our platform.
                  </p>
                </div>
              </div>

              {/* Benefit 3 */}
              <div className="flex gap-5">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#0066FF]/10 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-[#0066FF]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Streamlined Sales Process</h3>
                  <p className="text-gray-600">
                    Digital contracts, e-signatures, and automated compliance checks mean you can close deals faster
                    with less paperwork and fewer delays.
                  </p>
                </div>
              </div>

              {/* Benefit 4 */}
              <div className="flex gap-5">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#2D1B69]/10 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-[#2D1B69]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Built-In Compliance</h3>
                  <p className="text-gray-600">
                    Our platform automatically ensures all deals meet state and federal regulatory requirements,
                    protecting both you and your customers.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Stats Card */}
            <div className="lg:sticky lg:top-8">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-8">Results Our Dealers See</h3>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-[#7ED321]" />
                      <span className="text-sm text-gray-500">Close Rate</span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900">92%</div>
                    <div className="text-sm text-gray-500">on qualified leads</div>
                  </div>

                  <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-5 h-5 text-[#00D9FF]" />
                      <span className="text-sm text-gray-500">ROI</span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900">3x</div>
                    <div className="text-sm text-gray-500">vs traditional ads</div>
                  </div>

                  <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-5 h-5 text-[#0066FF]" />
                      <span className="text-sm text-gray-500">Time to Sale</span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900">24h</div>
                    <div className="text-sm text-gray-500">average</div>
                  </div>

                  <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Handshake className="w-5 h-5 text-[#2D1B69]" />
                      <span className="text-sm text-gray-500">Partner Network</span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900">500+</div>
                    <div className="text-sm text-gray-500">dealerships</div>
                  </div>
                </div>

                {/* Testimonial Quote */}
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <p className="text-gray-700 italic mb-4">
                    "We've increased our monthly sales by 40% since joining AutoLenis. The quality of leads is unlike
                    anything we've seen from other platforms."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#2D1B69] flex items-center justify-center text-white font-semibold">
                      MJ
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Michael Johnson</div>
                      <div className="text-sm text-gray-500">Johnson Auto Group, TX</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Partner Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Partner With AutoLenis</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join our network and access a stream of pre-qualified buyers ready to purchase
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#7ED321]/10 flex items-center justify-center mb-6 mx-auto">
                <Users className="w-8 h-8 text-[#7ED321]" />
              </div>
              <h3 className="text-xl font-bold mb-3">Qualified Leads</h3>
              <p className="text-muted-foreground">
                Every buyer is pre-qualified with verified credit and budget before they reach you.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#00D9FF]/10 flex items-center justify-center mb-6 mx-auto">
                <DollarSign className="w-8 h-8 text-[#00D9FF]" />
              </div>
              <h3 className="text-xl font-bold mb-3">Pay Per Sale</h3>
              <p className="text-muted-foreground">
                No monthly fees or subscriptions. You only pay a small commission when you close a deal.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#0066FF]/10 flex items-center justify-center mb-6 mx-auto">
                <Zap className="w-8 h-8 text-[#0066FF]" />
              </div>
              <h3 className="text-xl font-bold mb-3">Fast Process</h3>
              <p className="text-muted-foreground">
                Digital contracts and e-signatures mean deals close faster than traditional sales.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#2D1B69]/10 flex items-center justify-center mb-6 mx-auto">
                <Shield className="w-8 h-8 text-[#2D1B69]" />
              </div>
              <h3 className="text-xl font-bold mb-3">Compliance Built-In</h3>
              <p className="text-muted-foreground">
                Our platform ensures all deals meet regulatory requirements automatically.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="apply" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Apply to Join Our Network</h2>
              <p className="text-lg text-muted-foreground">
                Complete the application below and our team will review within 2 business days.
              </p>
            </div>

            <Card className="border-2">
              <CardHeader>
                <CardTitle>Dealer Application</CardTitle>
                <CardDescription>Step {step} of 3</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {step === 1 && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold">Business Information</h3>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="dealershipName">Dealership Name *</Label>
                          <Input
                            id="dealershipName"
                            value={formData.dealershipName}
                            onChange={(e) => setFormData({ ...formData, dealershipName: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="businessType">Business Type *</Label>
                          <Select
                            value={formData.businessType}
                            onValueChange={(value) => setFormData({ ...formData, businessType: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="franchise">Franchise Dealer</SelectItem>
                              <SelectItem value="independent">Independent Dealer</SelectItem>
                              <SelectItem value="used">Used Car Dealer</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="licenseNumber">Dealer License Number *</Label>
                          <Input
                            id="licenseNumber"
                            value={formData.licenseNumber}
                            onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="yearsInBusiness">Years in Business *</Label>
                          <Select
                            value={formData.yearsInBusiness}
                            onValueChange={(value) => setFormData({ ...formData, yearsInBusiness: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0-2">0-2 years</SelectItem>
                              <SelectItem value="3-5">3-5 years</SelectItem>
                              <SelectItem value="6-10">6-10 years</SelectItem>
                              <SelectItem value="10+">10+ years</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <Button
                        type="button"
                        onClick={() => setStep(2)}
                        className="w-full bg-gradient-to-r from-[#7ED321] to-[#00D9FF] text-[#2D1B69] font-semibold"
                      >
                        Continue
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold">Contact & Location</h3>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="contactName">Contact Name *</Label>
                          <Input
                            id="contactName"
                            value={formData.contactName}
                            onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="contactTitle">Title *</Label>
                          <Input
                            id="contactTitle"
                            value={formData.contactTitle}
                            onChange={(e) => setFormData({ ...formData, contactTitle: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone *</Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password">Create Password *</Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="Minimum 8 characters"
                          minLength={8}
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          required
                        />
                        <p className="text-xs text-muted-foreground">
                          You'll use this to access your dealer portal once approved.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address">Address *</Label>
                        <Input
                          id="address"
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          required
                        />
                      </div>

                      <div className="grid md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="city">City *</Label>
                          <Input
                            id="city"
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state">State *</Label>
                          <Input
                            id="state"
                            value={formData.state}
                            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="zipCode">ZIP Code *</Label>
                          <Input
                            id="zipCode"
                            value={formData.zipCode}
                            onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">
                          Back
                        </Button>
                        <Button
                          type="button"
                          onClick={() => setStep(3)}
                          className="flex-1 bg-gradient-to-r from-[#7ED321] to-[#00D9FF] text-[#2D1B69] font-semibold"
                        >
                          Continue
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold">Inventory & Additional Info</h3>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="averageInventory">Average Inventory Size *</Label>
                          <Select
                            value={formData.averageInventory}
                            onValueChange={(value) => setFormData({ ...formData, averageInventory: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1-25">1-25 vehicles</SelectItem>
                              <SelectItem value="26-50">26-50 vehicles</SelectItem>
                              <SelectItem value="51-100">51-100 vehicles</SelectItem>
                              <SelectItem value="100+">100+ vehicles</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="monthlyVolume">Monthly Sales Volume *</Label>
                          <Select
                            value={formData.monthlyVolume}
                            onValueChange={(value) => setFormData({ ...formData, monthlyVolume: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1-10">1-10 vehicles</SelectItem>
                              <SelectItem value="11-25">11-25 vehicles</SelectItem>
                              <SelectItem value="26-50">26-50 vehicles</SelectItem>
                              <SelectItem value="50+">50+ vehicles</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="website">Website (optional)</Label>
                        <Input
                          id="website"
                          type="url"
                          placeholder="https://"
                          value={formData.website}
                          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="additionalInfo">Additional Information (optional)</Label>
                        <Textarea
                          id="additionalInfo"
                          placeholder="Tell us anything else you'd like us to know..."
                          value={formData.additionalInfo}
                          onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
                          rows={4}
                        />
                      </div>

                      <div className="flex items-start gap-3">
                        <Checkbox
                          id="agreeToTerms"
                          checked={formData.agreeToTerms}
                          onCheckedChange={(checked) => setFormData({ ...formData, agreeToTerms: checked as boolean })}
                        />
                        <Label htmlFor="agreeToTerms" className="text-sm text-muted-foreground leading-relaxed">
                          I agree to the{" "}
                          <Link href="/legal/dealer-terms" className="text-[#2D1B69] underline">
                            Dealer Terms of Service
                          </Link>{" "}
                          and{" "}
                          <Link href="/legal/privacy" className="text-[#2D1B69] underline">
                            Privacy Policy
                          </Link>
                          .
                        </Label>
                      </div>

                      <div className="flex gap-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setStep(2)}
                          className="flex-1"
                          disabled={isSubmitting}
                        >
                          Back
                        </Button>
                        <Button
                          type="submit"
                          disabled={!formData.agreeToTerms || isSubmitting}
                          className="flex-1 bg-gradient-to-r from-[#7ED321] to-[#00D9FF] text-[#2D1B69] font-semibold"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            "Submit Application"
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#2D1B69] text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold">Ready to Grow Your Business?</h2>
            <p className="text-xl text-white/80">
              Join hundreds of dealers who are increasing their sales with AutoLenis.
            </p>
            <a
              href="#apply"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-gradient-to-r from-[#7ED321] to-[#00D9FF] text-[#2D1B69] font-semibold text-lg hover:opacity-90 transition-opacity"
            >
              Apply Now
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
