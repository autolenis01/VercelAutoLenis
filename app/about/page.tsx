"use client"

import { PublicNav } from "@/components/layout/public-nav"
import { PublicFooter } from "@/components/layout/public-footer"
import Link from "next/link"
import { ArrowRight, Shield, Lock, FileCheck, Users, Target, Heart, Building2, Car, CheckCircle } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <PublicNav />

      {/* Hero - More personal, less corporate */}
      <section className="relative bg-[#2D1B69] text-white overflow-hidden">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm">
              <Building2 className="w-4 h-4 text-[#7ED321]" />
              <span className="text-sm text-white/90">About Us</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-balance">
              We Think Car Buying{" "}
              <span className="bg-gradient-to-r from-[#7ED321] via-[#00D9FF] to-[#0066FF] bg-clip-text text-transparent">
                Should Be Fair
              </span>
            </h1>

            <p className="text-lg md:text-xl text-white/80 text-balance max-w-2xl mx-auto">
              AutoLenis started because we were tired of watching people overpay for cars, sign contracts they didn't
              understand, or feel pressured into bad deals. We built something better.
            </p>

            <Link
              href="/how-it-works"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[#7ED321] to-[#00D9FF] text-[#2D1B69] font-semibold hover:opacity-90 transition-opacity"
            >
              See How It Works
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* What We Do - Plain language explanation */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <span className="inline-block px-4 py-1 rounded-full bg-[#2D1B69]/10 text-[#2D1B69] text-sm font-semibold">
                  What We Actually Do
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">The Short Version</h2>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>
                    You tell us you want to buy a car. We take your info and share it with a network of lenders and
                    dealers who can help. They send back real offers. You compare them and pick what works.
                  </p>
                  <p>That's it. We're the middleman that helps you see more options without visiting 10 dealerships.</p>
                  <p>
                    The lenders decide if they'll approve you and at what rate. The dealers have the cars and handle the
                    sale. We just make the connection easier and more transparent.
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Let's Be Clear</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#7ED321] mt-1 flex-shrink-0" />
                    <div>
                      <span className="font-semibold text-gray-900">We are:</span>
                      <span className="text-gray-600"> A platform that connects buyers with lenders and dealers</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#7ED321] mt-1 flex-shrink-0" />
                    <div>
                      <span className="font-semibold text-gray-900">We are:</span>
                      <span className="text-gray-600"> Free for car buyers to use</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full border-2 border-red-400 flex items-center justify-center mt-1 flex-shrink-0">
                      <div className="w-2 h-0.5 bg-red-400"></div>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900">We are not:</span>
                      <span className="text-gray-600"> A bank, credit union, or lender of any kind</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full border-2 border-red-400 flex items-center justify-center mt-1 flex-shrink-0">
                      <div className="w-2 h-0.5 bg-red-400"></div>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900">We are not:</span>
                      <span className="text-gray-600"> A car dealership—we don't own or sell cars</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why We Built This - Personal story, not corporate mission */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1 rounded-full bg-[#2D1B69]/10 text-[#2D1B69] text-sm font-semibold mb-4">
                Why We Built This
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Buying a Car Shouldn't Feel Like a Battle
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                We've all had that experience—walking into a dealership and feeling like you're walking into a
                negotiation you're destined to lose. The back-and-forth, the surprise fees, the "let me talk to my
                manager" routine. It doesn't have to be that way.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                <div className="w-14 h-14 rounded-xl bg-[#7ED321]/10 flex items-center justify-center mb-6">
                  <Target className="w-7 h-7 text-[#7ED321]" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">Transparency</h4>
                <p className="text-gray-600">
                  We show you the numbers. All of them. No hiding fees until the last minute or using confusing terms to
                  obscure the real cost.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                <div className="w-14 h-14 rounded-xl bg-[#00D9FF]/10 flex items-center justify-center mb-6">
                  <Shield className="w-7 h-7 text-[#00D9FF]" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">Protection</h4>
                <p className="text-gray-600">
                  Our Contract Shield tool helps you understand what you're signing. If something looks off, you'll know
                  before you commit.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                <div className="w-14 h-14 rounded-xl bg-[#2D1B69]/10 flex items-center justify-center mb-6">
                  <Heart className="w-7 h-7 text-[#2D1B69]" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">Access</h4>
                <p className="text-gray-600">
                  Not everyone has perfect credit or knows how to negotiate. We give everyone the same visibility into
                  their options.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Data & Privacy - Straightforward, not legalese */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1 rounded-full bg-[#7ED321]/10 text-[#7ED321] text-sm font-semibold mb-4">
                Your Data
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">We Take Privacy Seriously</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                You're trusting us with personal information. Here's how we handle it.
              </p>
            </div>

            <div className="bg-gradient-to-br from-[#2D1B69] to-[#1E0F42] rounded-2xl p-8 md:p-12 text-white mb-12">
              <p className="text-lg leading-relaxed mb-8">
                We collect your info because lenders need it to give you real offers. We share it with the lenders and
                dealers you're working with—that's the whole point. But we don't sell your data to random marketing
                companies or spam you with unrelated stuff.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Lock className="w-5 h-5 text-[#7ED321]" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Encrypted</h4>
                    <p className="text-sm text-white/80">
                      Your data is encrypted in transit and at rest. Industry standard stuff.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                    <FileCheck className="w-5 h-5 text-[#00D9FF]" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Consent-Based</h4>
                    <p className="text-sm text-white/80">
                      We tell you what we're doing with your info and get your okay first.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-[#0066FF]" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Purpose-Limited</h4>
                    <p className="text-sm text-white/80">
                      Your info goes to lenders and dealers for your car purchase. That's it.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-[#7ED321]" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">No Data Selling</h4>
                    <p className="text-sm text-white/80">
                      We make money when deals close, not by selling your contact info.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">The Fine Print, Summarized</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#7ED321] mt-1 flex-shrink-0" />
                  <p className="text-gray-600">
                    We're aware of regulations like FCRA and GLBA that govern how financial data should be handled. We
                    take compliance seriously.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#7ED321] mt-1 flex-shrink-0" />
                  <p className="text-gray-600">
                    We work with lenders and dealers who meet our standards for treating customers fairly.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#7ED321] mt-1 flex-shrink-0" />
                  <p className="text-gray-600">
                    We don't make promises we can't keep—like guaranteed approval or guaranteed savings.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It All Connects - Simple visual explanation */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1 rounded-full bg-[#00D9FF]/10 text-[#00D9FF] text-sm font-semibold mb-4">
                The Ecosystem
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It All Connects</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                We're in the middle, making the connection between you and the people who can actually get you a car.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center">
                <div className="w-16 h-16 rounded-2xl bg-[#7ED321]/10 flex items-center justify-center mb-6 mx-auto">
                  <Users className="w-8 h-8 text-[#7ED321]" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">You</h4>
                <p className="text-gray-600 text-sm">
                  You fill out an application and tell us what you're looking for. We show you real options from real
                  lenders and dealers.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center">
                <div className="w-16 h-16 rounded-2xl bg-[#00D9FF]/10 flex items-center justify-center mb-6 mx-auto">
                  <Building2 className="w-8 h-8 text-[#00D9FF]" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">Lenders</h4>
                <p className="text-gray-600 text-sm">
                  Banks and credit unions review your info and decide if they want to offer you financing. They set the
                  rates and terms.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center">
                <div className="w-16 h-16 rounded-2xl bg-[#2D1B69]/10 flex items-center justify-center mb-6 mx-auto">
                  <Car className="w-8 h-8 text-[#2D1B69]" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">Dealers</h4>
                <p className="text-gray-600 text-sm">
                  Licensed dealerships have the cars. They handle pricing, paperwork, and getting you the keys.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#2D1B69] text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold">Questions?</h2>
            <p className="text-xl text-white/80">
              We're happy to chat. Reach out if you want to know more about how AutoLenis works.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/how-it-works"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-gradient-to-r from-[#7ED321] to-[#00D9FF] text-[#2D1B69] font-semibold text-lg hover:opacity-90 transition-opacity"
              >
                See How It Works
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg border-2 border-white/30 text-white font-semibold text-lg hover:bg-white/10 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8 bg-gray-100 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-xs text-gray-500 leading-relaxed">
              AutoLenis is not a lender, bank, or dealership. Financing is provided by participating lenders and is
              subject to their approval. We don't guarantee you'll be approved or get a specific rate.
            </p>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
