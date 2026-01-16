"use client"

import { PublicNav } from "@/components/layout/public-nav"
import { PublicFooter } from "@/components/layout/public-footer"
import Link from "next/link"
import { ArrowRight, Check, DollarSign, TrendingDown } from "lucide-react"

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <PublicNav />

      <section className="relative bg-[#2D1B69] text-white overflow-hidden py-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#7ED321] opacity-5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#00D9FF] opacity-5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm mb-6">
              <DollarSign className="w-4 h-4 text-[#7ED321]" />
              <span className="text-sm text-white/90">Simple, transparent pricing</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">
              One Simple{" "}
              <span className="bg-gradient-to-r from-[#7ED321] via-[#00D9FF] to-[#0066FF] bg-clip-text text-transparent">
                Fee
              </span>
            </h1>
            <p className="text-xl text-white/80 leading-relaxed text-pretty">
              No hidden costs, no surprises. Just one concierge fee that covers your entire car buying experience.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Standard Tier */}
              <div className="relative bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-[#7ED321] transition-colors">
                <div className="mb-6">
                  <div className="inline-flex px-3 py-1 rounded-full bg-[#7ED321]/10 text-[#7ED321] text-sm font-semibold mb-4">
                    Most Popular
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Standard</h3>
                  <p className="text-muted-foreground">For purchases up to $35,000</p>
                </div>

                <div className="mb-8">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold">$499</span>
                    <span className="text-muted-foreground">concierge fee</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">Minus $99 deposit</p>
                </div>

                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#7ED321] mt-0.5 flex-shrink-0" />
                    <span>Instant pre-qualification</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#7ED321] mt-0.5 flex-shrink-0" />
                    <span>Silent reverse auction</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#7ED321] mt-0.5 flex-shrink-0" />
                    <span>Best price engine</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#7ED321] mt-0.5 flex-shrink-0" />
                    <span>Contract Shield AI verification</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#7ED321] mt-0.5 flex-shrink-0" />
                    <span>Insurance quotes</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#7ED321] mt-0.5 flex-shrink-0" />
                    <span>E-signature & QR pickup</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#7ED321] mt-0.5 flex-shrink-0" />
                    <span>Dedicated support</span>
                  </li>
                </ul>

                <Link
                  href="/buyer/onboarding"
                  className="block w-full text-center px-6 py-3 rounded-lg bg-gradient-to-r from-[#7ED321] to-[#00D9FF] text-[#2D1B69] font-semibold hover:opacity-90 transition-opacity"
                >
                  Get Started
                </Link>
              </div>

              {/* Premium Tier */}
              <div className="relative bg-gradient-to-br from-[#2D1B69] to-[#1E0F42] text-white border-2 border-[#2D1B69] rounded-2xl p-8 shadow-2xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#00D9FF] opacity-10 rounded-full blur-2xl" />
                <div className="relative">
                  <div className="mb-6">
                    <div className="inline-flex px-3 py-1 rounded-full bg-[#00D9FF]/20 text-[#00D9FF] text-sm font-semibold mb-4">
                      Premium
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Premium</h3>
                    <p className="text-white/70">For purchases over $35,000</p>
                  </div>

                  <div className="mb-8">
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold">$750</span>
                      <span className="text-white/70">concierge fee</span>
                    </div>
                    <p className="text-sm text-white/60 mt-2">Minus $99 deposit</p>
                  </div>

                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#00D9FF] mt-0.5 flex-shrink-0" />
                      <span>Everything in Standard</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#00D9FF] mt-0.5 flex-shrink-0" />
                      <span>Priority dealer network</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#00D9FF] mt-0.5 flex-shrink-0" />
                      <span>Luxury vehicle specialists</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#00D9FF] mt-0.5 flex-shrink-0" />
                      <span>White-glove concierge service</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#00D9FF] mt-0.5 flex-shrink-0" />
                      <span>Extended warranty options</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#00D9FF] mt-0.5 flex-shrink-0" />
                      <span>Premium financing rates</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#00D9FF] mt-0.5 flex-shrink-0" />
                      <span>VIP support line</span>
                    </li>
                  </ul>

                  <Link
                    href="/buyer/onboarding"
                    className="block w-full text-center px-6 py-3 rounded-lg bg-gradient-to-r from-[#00D9FF] to-[#0066FF] text-white font-semibold hover:opacity-90 transition-opacity"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fee Payment Options */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Flexible Payment Options</h2>
              <p className="text-lg text-muted-foreground">Choose how you want to pay your AutoLenis concierge fee</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Pay Directly */}
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-8">
                <div className="w-12 h-12 rounded-xl bg-[#7ED321]/10 flex items-center justify-center mb-6">
                  <DollarSign className="w-6 h-6 text-[#7ED321]" />
                </div>
                <h3 className="text-xl font-bold mb-3">Pay Directly</h3>
                <p className="text-muted-foreground mb-6">
                  Pay the concierge fee with your credit or debit card. Doesn't affect your loan amount or monthly
                  payment.
                </p>
                <div className="inline-flex px-3 py-1 rounded-full bg-[#7ED321]/10 text-[#7ED321] text-sm font-semibold">
                  Recommended
                </div>
              </div>

              {/* Include in Loan */}
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-8">
                <div className="w-12 h-12 rounded-xl bg-[#00D9FF]/10 flex items-center justify-center mb-6">
                  <TrendingDown className="w-6 h-6 text-[#00D9FF]" />
                </div>
                <h3 className="text-xl font-bold mb-3">Include in Loan</h3>
                <p className="text-muted-foreground mb-6">
                  Add the concierge fee to your auto loan. We'll show you the exact impact on your monthly payment
                  before you decide.
                </p>
                <p className="text-sm text-muted-foreground">Full transparency with our Loan Impact Calculator</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Pricing FAQs</h2>

            <div className="space-y-6">
              <div className="border-b pb-6">
                <h3 className="text-lg font-bold mb-2">What is the $99 deposit for?</h3>
                <p className="text-muted-foreground">
                  The $99 deposit starts your auction and ensures serious buyers. It's fully refundable if you don't
                  receive any offers, and it's credited toward your concierge fee if you complete the purchase.
                </p>
              </div>

              <div className="border-b pb-6">
                <h3 className="text-lg font-bold mb-2">Are there any other fees?</h3>
                <p className="text-muted-foreground">
                  No. The concierge fee is the only cost you pay to AutoLenis. Standard dealer fees (DMV, taxes, etc.)
                  still apply as they would with any car purchase, but we help you verify they're legitimate.
                </p>
              </div>

              <div className="border-b pb-6">
                <h3 className="text-lg font-bold mb-2">How is this different from traditional car buying?</h3>
                <p className="text-muted-foreground">
                  Traditional dealerships build their profit into the vehicle price. AutoLenis separates our service
                  fee, creating transparency and letting dealers compete on the actual car price—resulting in average
                  savings of $2,500.
                </p>
              </div>

              <div className="pb-6">
                <h3 className="text-lg font-bold mb-2">Can I get a refund if I change my mind?</h3>
                <p className="text-muted-foreground">
                  The $99 deposit is refundable if you don't receive offers or before you select a winning deal. The
                  concierge fee is charged only after you've chosen a deal and committed to the purchase.
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
            <h2 className="text-4xl md:text-5xl font-bold">Save Thousands on Your Next Car</h2>
            <p className="text-xl text-white/80">
              Our transparent pricing means you keep more money in your pocket—an average of $2,500 more.
            </p>
            <Link
              href="/buyer/onboarding"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-gradient-to-r from-[#7ED321] to-[#00D9FF] text-[#2D1B69] font-semibold text-lg hover:opacity-90 transition-opacity"
            >
              Get Pre-Qualified Now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
