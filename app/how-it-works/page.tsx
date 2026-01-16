"use client"

import { PublicNav } from "@/components/layout/public-nav"
import { PublicFooter } from "@/components/layout/public-footer"
import Link from "next/link"
import {
  ArrowRight,
  CheckCircle,
  Shield,
  TrendingUp,
  Key,
  Users,
  Target,
  Heart,
  FileCheck,
  Lock,
  Building2,
  Car,
} from "lucide-react"

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-background">
      <PublicNav />

      {/* Hero Section - Updated to compliance-safe messaging */}
      <section className="relative bg-[#2D1B69] text-white overflow-hidden">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm">
                <Shield className="w-4 h-4 text-[#7ED321]" />
                <span className="text-sm text-white/90">Transparent, structured process</span>
              </div>

              {/* Main Headline */}
              <div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-balance">
                  How{" "}
                  <span className="bg-gradient-to-r from-[#7ED321] via-[#00D9FF] to-[#0066FF] bg-clip-text text-transparent">
                    AutoLenis
                  </span>{" "}
                  Works
                </h1>
              </div>

              {/* Subheadline - Professional, consent-focused */}
              <p className="text-lg md:text-xl text-white/80 text-balance max-w-xl">
                A guided digital experience that connects you with trusted lenders and licensed dealers—with full
                transparency at every step.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/buyer/onboarding"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[#7ED321] to-[#00D9FF] text-[#2D1B69] font-semibold hover:opacity-90 transition-opacity"
                >
                  Start Your Application
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-colors"
                >
                  Have Questions?
                </Link>
              </div>
            </div>

            {/* Right: Steps Overview Card - Updated step descriptions */}
            <div className="relative">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 md:p-8 space-y-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-900 font-bold text-xl">5 Clear Steps</span>
                  <span className="px-3 py-1 rounded-full bg-[#7ED321]/10 text-[#7ED321] text-sm font-semibold">
                    Guided Process
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#7ED321]/10 text-[#7ED321] font-bold flex items-center justify-center">
                      1
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Application & Consent</div>
                      <div className="text-sm text-gray-600">Provide info with clear authorization</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#00D9FF]/10 text-[#00D9FF] font-bold flex items-center justify-center">
                      2
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Lender Connection</div>
                      <div className="text-sm text-gray-600">Secure routing to lenders</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#0066FF]/10 text-[#0066FF] font-bold flex items-center justify-center">
                      3
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Dealer Matching</div>
                      <div className="text-sm text-gray-600">Connect with licensed dealers</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#2D1B69]/10 text-[#2D1B69] font-bold flex items-center justify-center">
                      4
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Review & Compare</div>
                      <div className="text-sm text-gray-600">Transparent offer comparison</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#7ED321]/10 text-[#7ED321] font-bold flex items-center justify-center">
                      5
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Complete Purchase</div>
                      <div className="text-sm text-gray-600">Finalize with the dealer</div>
                    </div>
                  </div>
                </div>

                <Link
                  href="/buyer/onboarding"
                  className="block w-full py-4 rounded-xl bg-gradient-to-r from-[#7ED321] to-[#00D9FF] text-[#2D1B69] font-semibold text-lg hover:opacity-90 transition-opacity text-center"
                >
                  Begin Your Application
                </Link>
              </div>

              {/* Stats - More neutral stats */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="text-2xl font-bold text-white">5</div>
                  <div className="text-sm text-white/70">Clear Steps</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="text-2xl font-bold text-white">Secure</div>
                  <div className="text-sm text-white/70">Process</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="text-2xl font-bold text-white">500+</div>
                  <div className="text-sm text-white/70">Partners</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section - Rewritten for compliance and clarity */}
      <section className="py-20 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1 rounded-full bg-[#2D1B69]/10 text-[#2D1B69] text-sm font-semibold mb-4">
                About AutoLenis
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">A Digital Concierge for Car Buyers</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                AutoLenis is a front-end digital platform that helps consumers navigate auto financing and vehicle
                purchases. We connect you with participating lenders and licensed dealers—we are not a lender or
                dealership ourselves.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900">What We Do</h3>
                <p className="text-gray-600 leading-relaxed">
                  We attract car buyers through digital channels and referrals. With clear consent, we collect your
                  information in a secure, structured application flow. We then route your application to participating
                  lenders and dealers who can serve your needs.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Lenders handle all underwriting and credit decisions. Dealers handle vehicle inventory, contracts, and
                  delivery. Our role is to make the connection seamless and transparent.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  We believe car buying should be clear, fair, and accessible. That's why we focus on transparency at
                  every step of the process.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-[#7ED321]/10 to-[#00D9FF]/10 rounded-2xl p-6 text-center">
                  <div className="text-4xl font-bold text-[#2D1B69]">500+</div>
                  <div className="text-sm text-gray-600 mt-1">Partner Dealers</div>
                </div>
                <div className="bg-gradient-to-br from-[#00D9FF]/10 to-[#0066FF]/10 rounded-2xl p-6 text-center">
                  <div className="text-4xl font-bold text-[#2D1B69]">Secure</div>
                  <div className="text-sm text-gray-600 mt-1">Data Handling</div>
                </div>
                <div className="bg-gradient-to-br from-[#0066FF]/10 to-[#2D1B69]/10 rounded-2xl p-6 text-center">
                  <div className="text-4xl font-bold text-[#2D1B69]">24/7</div>
                  <div className="text-sm text-gray-600 mt-1">Digital Access</div>
                </div>
                <div className="bg-gradient-to-br from-[#2D1B69]/10 to-[#7ED321]/10 rounded-2xl p-6 text-center">
                  <div className="text-4xl font-bold text-[#2D1B69]">Clear</div>
                  <div className="text-sm text-gray-600 mt-1">Consent Process</div>
                </div>
              </div>
            </div>

            {/* Core Values - Updated to compliance-focused values */}
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                <div className="w-14 h-14 rounded-xl bg-[#7ED321]/10 flex items-center justify-center mb-6">
                  <Target className="w-7 h-7 text-[#7ED321]" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">Transparency</h4>
                <p className="text-gray-600">
                  We believe you should understand every step of the process and every cost involved. No hidden terms,
                  no surprises.
                </p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                <div className="w-14 h-14 rounded-xl bg-[#00D9FF]/10 flex items-center justify-center mb-6">
                  <Lock className="w-7 h-7 text-[#00D9FF]" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">Data Protection</h4>
                <p className="text-gray-600">
                  Your information is collected with consent and protected with industry-standard security. We respect
                  your privacy.
                </p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                <div className="w-14 h-14 rounded-xl bg-[#2D1B69]/10 flex items-center justify-center mb-6">
                  <Heart className="w-7 h-7 text-[#2D1B69]" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">Consumer Focus</h4>
                <p className="text-gray-600">
                  We work to help you make informed decisions. Our tools are designed to support—not pressure—your
                  choices.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Steps - Rewritten with consent and compliance focus */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto space-y-16">
            {/* Step 1 - Emphasizes consent */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#7ED321]/10 text-[#7ED321] font-bold text-xl">
                  1
                </div>
                <h2 className="text-3xl md:text-4xl font-bold">Application & Consent</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Provide your information through our secure digital form. We clearly explain how your data will be
                  used and obtain your explicit consent before proceeding.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#7ED321] mt-1 flex-shrink-0" />
                    <span>Clear privacy disclosures</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#7ED321] mt-1 flex-shrink-0" />
                    <span>Explicit consent for data use</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#7ED321] mt-1 flex-shrink-0" />
                    <span>Encrypted, secure submission</span>
                  </li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-[#7ED321]/10 to-[#00D9FF]/10 rounded-2xl p-8 aspect-square flex items-center justify-center">
                <FileCheck className="w-32 h-32 text-[#7ED321]" />
              </div>
            </div>

            {/* Step 2 - Explains lender routing */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="bg-gradient-to-br from-[#00D9FF]/10 to-[#0066FF]/10 rounded-2xl p-8 aspect-square flex items-center justify-center md:order-1">
                <Building2 className="w-32 h-32 text-[#00D9FF]" />
              </div>
              <div className="space-y-6 md:order-2">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#00D9FF]/10 text-[#00D9FF] font-bold text-xl">
                  2
                </div>
                <h2 className="text-3xl md:text-4xl font-bold">Secure Lender Connection</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Your application is securely packaged and routed to participating lenders and credit unions in our
                  network. Lenders evaluate your application based on their own criteria.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#00D9FF] mt-1 flex-shrink-0" />
                    <span>Multiple lender options</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#00D9FF] mt-1 flex-shrink-0" />
                    <span>Credit unions and banks</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#00D9FF] mt-1 flex-shrink-0" />
                    <span>Lenders make all credit decisions</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Step 3 - Dealer matching */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#0066FF]/10 text-[#0066FF] font-bold text-xl">
                  3
                </div>
                <h2 className="text-3xl md:text-4xl font-bold">Dealer Matching</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Based on your preferences and financing status, we connect you with licensed dealers in our network
                  who have vehicles that match your criteria.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#0066FF] mt-1 flex-shrink-0" />
                    <span>Licensed, vetted dealers</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#0066FF] mt-1 flex-shrink-0" />
                    <span>Vehicle selection based on your needs</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#0066FF] mt-1 flex-shrink-0" />
                    <span>Dealers handle inventory and delivery</span>
                  </li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-[#0066FF]/10 to-[#2D1B69]/10 rounded-2xl p-8 aspect-square flex items-center justify-center">
                <Car className="w-32 h-32 text-[#0066FF]" />
              </div>
            </div>

            {/* Step 4 - Review and compare */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="bg-gradient-to-br from-[#2D1B69]/10 to-[#7ED321]/10 rounded-2xl p-8 aspect-square flex items-center justify-center md:order-1">
                <TrendingUp className="w-32 h-32 text-[#2D1B69]" />
              </div>
              <div className="space-y-6 md:order-2">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#2D1B69]/10 text-[#2D1B69] font-bold text-xl">
                  4
                </div>
                <h2 className="text-3xl md:text-4xl font-bold">Review & Compare</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Review financing options and vehicle offers transparently. Our tools help you understand terms and
                  compare offers side-by-side so you can make an informed decision.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#2D1B69] mt-1 flex-shrink-0" />
                    <span>Clear pricing breakdown</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#2D1B69] mt-1 flex-shrink-0" />
                    <span>Contract review assistance</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#2D1B69] mt-1 flex-shrink-0" />
                    <span>No pressure to proceed</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Step 5 - Complete purchase */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#7ED321]/10 text-[#7ED321] font-bold text-xl">
                  5
                </div>
                <h2 className="text-3xl md:text-4xl font-bold">Complete Your Purchase</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  When you're ready, finalize your purchase directly with the dealer. Review all documents carefully,
                  sign your agreements, and schedule vehicle pickup or delivery.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#7ED321] mt-1 flex-shrink-0" />
                    <span>Digital or in-person signing options</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#7ED321] mt-1 flex-shrink-0" />
                    <span>Flexible pickup or delivery</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#7ED321] mt-1 flex-shrink-0" />
                    <span>Support throughout the process</span>
                  </li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-[#7ED321]/10 to-[#00D9FF]/10 rounded-2xl p-8 aspect-square flex items-center justify-center">
                <Key className="w-32 h-32 text-[#7ED321]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1 rounded-full bg-[#2D1B69]/10 text-[#2D1B69] text-sm font-semibold mb-4">
                Compliance & Security
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Built with Privacy & Compliance in Mind
              </h2>
            </div>

            <div className="bg-white rounded-2xl p-8 md:p-12 border border-gray-200 shadow-sm">
              <p className="text-gray-600 leading-relaxed mb-6">
                We understand that compliance with the Fair Credit Reporting Act (FCRA) and the Gramm–Leach–Bliley Act
                (GLBA) is essential for any responsible relationship with lenders and credit unions. AutoLenis is
                committed to handling consumer data with strict privacy, security, and permissible-purpose standards.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#7ED321]/10 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-[#7ED321]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Data Protection</h4>
                    <p className="text-sm text-gray-600">
                      We use encryption and access controls to protect your information.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#00D9FF]/10 flex items-center justify-center flex-shrink-0">
                    <FileCheck className="w-5 h-5 text-[#00D9FF]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Clear Consent</h4>
                    <p className="text-sm text-gray-600">
                      Your data is only used with your explicit authorization for stated purposes.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#0066FF]/10 flex items-center justify-center flex-shrink-0">
                    <Lock className="w-5 h-5 text-[#0066FF]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Limited Sharing</h4>
                    <p className="text-sm text-gray-600">
                      We share data only with lenders and dealers for legitimate financing purposes.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#2D1B69]/10 flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-[#2D1B69]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Consumer Rights</h4>
                    <p className="text-sm text-gray-600">
                      We respect your rights under applicable privacy and consumer protection laws.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Updated to neutral language */}
      <section className="py-20 bg-[#2D1B69] text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold">Ready to Explore Your Options?</h2>
            <p className="text-xl text-white/80">
              Start your application today and connect with trusted lenders and dealers through our guided process.
            </p>
            <Link
              href="/buyer/onboarding"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-gradient-to-r from-[#7ED321] to-[#00D9FF] text-[#2D1B69] font-semibold text-lg hover:opacity-90 transition-opacity"
            >
              Start Your Application
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-8 bg-gray-100 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-xs text-gray-500 leading-relaxed">
              <strong>Important:</strong> AutoLenis is not a lender, bank, or dealership. All financing is provided by
              participating lenders and credit unions. Approval is subject to lender underwriting and credit review. We
              do not guarantee approval or specific terms. Please review all documents and terms before completing any
              transaction.
            </p>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
