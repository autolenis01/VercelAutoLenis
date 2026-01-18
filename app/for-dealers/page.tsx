"use client"

import { PublicNav } from "@/components/layout/public-nav"
import { PublicFooter } from "@/components/layout/public-footer"
import Link from "next/link"
import { ArrowRight, Check, TrendingUp, Zap, Shield, Users } from "lucide-react"

export default function ForDealersPage() {
  return (
    <div className="min-h-screen bg-background">
      <PublicNav />

      {/* Hero Section */}
      <section className="relative bg-[#2D1B69] text-white overflow-hidden py-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#7ED321] opacity-5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#00D9FF] opacity-5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm mb-6">
              <Users className="w-4 h-4 text-[#7ED321]" />
              <span className="text-sm text-white/90">Join Our Dealer Network</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">
              Grow Your Business with{" "}
              <span className="bg-gradient-to-r from-[#7ED321] via-[#00D9FF] to-[#0066FF] bg-clip-text text-transparent">
                AutoLenis
              </span>
            </h1>
            <p className="text-xl text-white/80 leading-relaxed text-pretty mb-8">
              Connect with pre-qualified buyers actively looking for vehicles like yours. No bidding wars, no haggling—just clean, profitable deals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/dealer-application"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-gradient-to-r from-[#7ED321] to-[#00D9FF] text-[#2D1B69] font-semibold text-lg hover:opacity-90 transition-opacity"
              >
                Apply Now
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/auth/signin"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg border-2 border-white/20 text-white font-semibold text-lg hover:bg-white/10 transition-colors"
              >
                Dealer Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Join AutoLenis?</h2>
              <p className="text-lg text-muted-foreground">The smarter way to sell vehicles</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-xl bg-[#7ED321]/10 flex items-center justify-center mb-6">
                  <Zap className="w-8 h-8 text-[#7ED321]" />
                </div>
                <h3 className="text-xl font-bold mb-3">Pre-Qualified Buyers</h3>
                <p className="text-muted-foreground">
                  Every lead is serious. All buyers have completed credit pre-qualification and paid a deposit before reaching you.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-xl bg-[#00D9FF]/10 flex items-center justify-center mb-6">
                  <TrendingUp className="w-8 h-8 text-[#00D9FF]" />
                </div>
                <h3 className="text-xl font-bold mb-3">Silent Auction Model</h3>
                <p className="text-muted-foreground">
                  Submit your best offer without seeing competitors' bids. No race to the bottom—just your best price.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-xl bg-[#0066FF]/10 flex items-center justify-center mb-6">
                  <Shield className="w-8 h-8 text-[#0066FF]" />
                </div>
                <h3 className="text-xl font-bold mb-3">Contract Shield</h3>
                <p className="text-muted-foreground">
                  AI-powered contract verification ensures deal integrity and reduces chargebacks and disputes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
              <p className="text-lg text-muted-foreground">Simple, efficient, profitable</p>
            </div>

            <div className="space-y-8">
              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 rounded-full bg-[#7ED321] text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Get Invited to Auctions</h3>
                  <p className="text-muted-foreground">
                    Receive invitations for buyers looking for vehicles in your inventory. All buyers are pre-qualified with verified financing.
                  </p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 rounded-full bg-[#00D9FF] text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Submit Your Best Offer</h3>
                  <p className="text-muted-foreground">
                    Review the buyer's requirements and submit your out-the-door price. You can't see other dealers' offers, so focus on your margin, not the competition.
                  </p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 rounded-full bg-[#0066FF] text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Win & Close the Deal</h3>
                  <p className="text-muted-foreground">
                    If selected, finalize the paperwork with Contract Shield verification, e-signature, and schedule QR code pickup. Get paid, deliver the vehicle, done.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features List */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">What You Get</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-[#7ED321] mt-1 flex-shrink-0" />
                <span>Access to serious, pre-qualified buyers</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-[#7ED321] mt-1 flex-shrink-0" />
                <span>Silent reverse auction platform</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-[#7ED321] mt-1 flex-shrink-0" />
                <span>Inventory management tools</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-[#7ED321] mt-1 flex-shrink-0" />
                <span>Contract Shield AI verification</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-[#7ED321] mt-1 flex-shrink-0" />
                <span>E-signature integration</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-[#7ED321] mt-1 flex-shrink-0" />
                <span>QR code pickup scheduling</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-[#7ED321] mt-1 flex-shrink-0" />
                <span>Deal tracking & analytics</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-[#7ED321] mt-1 flex-shrink-0" />
                <span>Dedicated dealer support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#2D1B69] text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold">Ready to Join?</h2>
            <p className="text-xl text-white/80">
              Start receiving qualified leads and growing your dealership with AutoLenis.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/dealer-application"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-gradient-to-r from-[#7ED321] to-[#00D9FF] text-[#2D1B69] font-semibold text-lg hover:opacity-90 transition-opacity"
              >
                Apply to Join Network
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/auth/signin"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg border-2 border-white/20 text-white font-semibold text-lg hover:bg-white/10 transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
