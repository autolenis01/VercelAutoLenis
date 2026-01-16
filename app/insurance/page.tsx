"use client"

import Link from "next/link"
import { ArrowRight, Shield, Upload, Star, FileSearch, CheckCircle } from "lucide-react"
import { PublicNav } from "@/components/layout/public-nav"
import { PublicFooter } from "@/components/layout/public-footer"

export default function InsurancePage() {
  return (
    <div className="min-h-screen bg-background">
      <PublicNav />

      {/* Hero Section */}
      <section className="relative bg-[#2D1B69] text-white overflow-hidden">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-sm text-white/90">Required for vehicle purchase</span>
              </div>

              {/* Main Headline */}
              <div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-balance">
                  Insurance{" "}
                  <span className="bg-gradient-to-r from-[#7ED321] via-[#00D9FF] to-[#0066FF] bg-clip-text text-transparent">
                    Made Simple
                  </span>
                </h1>
              </div>

              {/* Subheadline */}
              <p className="text-lg md:text-xl text-white/80 text-balance max-w-xl">
                Insurance is required before finalizing your vehicle purchase. Compare quotes from top providers or
                upload proof of your existing coverage—all in one seamless step.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/buyer/onboarding"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[#7ED321] to-[#00D9FF] text-[#2D1B69] font-semibold hover:opacity-90 transition-opacity"
                >
                  Start Your Purchase
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/how-it-works"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-colors"
                >
                  Learn How It Works
                </Link>
              </div>
            </div>

            {/* Right: Insurance Options Card */}
            <div className="relative">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 md:p-8 space-y-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-900 font-bold text-xl">Insurance Options</span>
                  <span className="px-3 py-1 rounded-full bg-[#7ED321]/10 text-[#7ED321] text-sm font-semibold">
                    Required Step
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-[#7ED321]/5 border border-[#7ED321]/20">
                    <div className="flex items-start gap-3">
                      <FileSearch className="w-6 h-6 text-[#7ED321] mt-0.5" />
                      <div>
                        <div className="font-semibold text-gray-900">Compare Quotes</div>
                        <div className="text-sm text-gray-600">Get quotes from multiple providers instantly</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#00D9FF]/5 border border-[#00D9FF]/20">
                    <div className="flex items-start gap-3">
                      <Upload className="w-6 h-6 text-[#00D9FF] mt-0.5" />
                      <div>
                        <div className="font-semibold text-gray-900">Upload Existing</div>
                        <div className="text-sm text-gray-600">Already have coverage? Upload proof to continue</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Shield className="w-4 h-4 text-[#2D1B69]" />
                    <span>Insurance verified before pickup</span>
                  </div>
                </div>

                <Link
                  href="/buyer/onboarding"
                  className="block w-full py-4 rounded-xl bg-gradient-to-r from-[#7ED321] to-[#00D9FF] text-[#2D1B69] font-semibold text-lg text-center hover:opacity-90 transition-opacity"
                >
                  Get Started
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="text-2xl font-bold text-white">5+</div>
                  <div className="text-sm text-white/70">Providers</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="text-2xl font-bold text-white">100%</div>
                  <div className="text-sm text-white/70">Compliant</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="text-2xl font-bold text-white">Fast</div>
                  <div className="text-sm text-white/70">Verification</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How Insurance Works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Insurance is integrated into your car buying journey—choose your path
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Option 1: Get Quotes */}
            <div className="bg-gradient-to-br from-[#7ED321]/5 to-[#7ED321]/10 rounded-2xl p-8 border-2 border-[#7ED321]/20">
              <div className="w-16 h-16 rounded-2xl bg-[#7ED321]/10 flex items-center justify-center mb-6">
                <FileSearch className="w-8 h-8 text-[#7ED321]" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Need Insurance?</h3>
              <p className="text-muted-foreground mb-6">
                We partner with top insurance providers to get you competitive quotes based on your vehicle and profile.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#7ED321] mt-0.5 flex-shrink-0" />
                  <span>Compare quotes from multiple providers</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#7ED321] mt-0.5 flex-shrink-0" />
                  <span>See coverage details side-by-side</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#7ED321] mt-0.5 flex-shrink-0" />
                  <span>Purchase directly through AutoLenis</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#7ED321] mt-0.5 flex-shrink-0" />
                  <span>Automatic verification—no delays</span>
                </li>
              </ul>
            </div>

            {/* Option 2: Upload Existing */}
            <div className="bg-gradient-to-br from-[#00D9FF]/5 to-[#00D9FF]/10 rounded-2xl p-8 border-2 border-[#00D9FF]/20">
              <div className="w-16 h-16 rounded-2xl bg-[#00D9FF]/10 flex items-center justify-center mb-6">
                <Upload className="w-8 h-8 text-[#00D9FF]" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Already Have Insurance?</h3>
              <p className="text-muted-foreground mb-6">
                If you have existing coverage, simply upload proof and we'll verify it meets state requirements.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#00D9FF] mt-0.5 flex-shrink-0" />
                  <span>Upload your insurance card or declaration</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#00D9FF] mt-0.5 flex-shrink-0" />
                  <span>We verify coverage meets requirements</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#00D9FF] mt-0.5 flex-shrink-0" />
                  <span>Instant approval in most cases</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#00D9FF] mt-0.5 flex-shrink-0" />
                  <span>Continue to pickup scheduling</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Why Insurance is Required */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Insurance is Required</h2>
              <p className="text-lg text-muted-foreground">
                Insurance protects you, the dealer, and ensures a smooth vehicle handoff
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <div className="w-12 h-12 rounded-xl bg-[#2D1B69]/10 flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-[#2D1B69]" />
                </div>
                <h3 className="text-lg font-bold mb-2">Legal Requirement</h3>
                <p className="text-sm text-muted-foreground">
                  Most states require proof of insurance before you can legally drive your new vehicle off the lot.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <div className="w-12 h-12 rounded-xl bg-[#7ED321]/10 flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-[#7ED321]" />
                </div>
                <h3 className="text-lg font-bold mb-2">Your Protection</h3>
                <p className="text-sm text-muted-foreground">
                  Coverage protects you financially from accidents, theft, and damage from the moment you take
                  ownership.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <div className="w-12 h-12 rounded-xl bg-[#00D9FF]/10 flex items-center justify-center mb-4">
                  <FileSearch className="w-6 h-6 text-[#00D9FF]" />
                </div>
                <h3 className="text-lg font-bold mb-2">Lender Requirement</h3>
                <p className="text-sm text-muted-foreground">
                  If you're financing, lenders require comprehensive and collision coverage to protect their investment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#2D1B69] text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold">Ready to Buy Your Car?</h2>
            <p className="text-xl text-white/80">
              Start your purchase journey. Insurance is just one simple step in our streamlined process.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/buyer/onboarding"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-gradient-to-r from-[#7ED321] to-[#00D9FF] text-[#2D1B69] font-semibold text-lg hover:opacity-90 transition-opacity"
              >
                Get Pre-Qualified Now
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/how-it-works"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg border-2 border-white/30 text-white font-semibold text-lg hover:bg-white/10 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
