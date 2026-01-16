"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  Shield,
  CheckCircle,
  DollarSign,
  X,
  Check,
  Lock,
  FileCheck,
  Car,
  Users,
  Sparkles,
} from "lucide-react"
import { PublicNav } from "@/components/layout/public-nav"
import { PublicFooter } from "@/components/layout/public-footer"
import { QualificationEstimateStrip } from "@/components/calculator/qualification-estimate-strip"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <PublicNav />

      {/* Hero Section - More conversational, less corporate */}
      <section className="relative bg-[#2D1B69] text-white overflow-hidden">
        <div className="container mx-auto px-4 py-12 sm:py-16 md:py-20 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-6 sm:space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm">
                <Car className="w-4 h-4 text-[#7ED321]" />
                <span className="text-xs sm:text-sm text-white/90">Your car-buying guide</span>
              </div>

              <div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-balance">
                  Buy Your Next Car{" "}
                  <span className="bg-gradient-to-r from-[#7ED321] via-[#00D9FF] to-[#0066FF] bg-clip-text text-transparent">
                    Without the Runaround
                  </span>
                </h1>
              </div>

              <p className="text-base sm:text-lg md:text-xl text-white/80 text-balance max-w-xl mx-auto lg:mx-0">
                We connect you with lenders and dealers so you can compare real offers, understand your options, and
                drive away in a car you can actually afford. No games, no pressure.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                <Link
                  href="/buyer/onboarding"
                  className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 rounded-lg bg-gradient-to-r from-[#7ED321] to-[#00D9FF] text-[#2D1B69] font-semibold hover:opacity-90 transition-opacity touch-target"
                >
                  Get Started
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/how-it-works"
                  className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 rounded-lg border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-colors touch-target"
                >
                  How It Works
                </Link>
              </div>
            </div>

            {/* Right Card - More approachable language */}
            <div className="relative mt-4 lg:mt-0">
              <div className="bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-2xl p-5 sm:p-6 md:p-8 space-y-5 sm:space-y-6 border border-gray-200 max-w-md mx-auto lg:max-w-none">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <span className="text-gray-900 font-bold text-lg sm:text-xl">Quick Start</span>
                  <span className="px-2 sm:px-3 py-1 rounded-full bg-[#7ED321]/10 text-[#7ED321] text-xs sm:text-sm font-semibold">
                    5 minutes
                  </span>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-[#7ED321] flex-shrink-0" />
                    <span className="text-gray-700 text-sm sm:text-base">Tell us what you're looking for</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-[#7ED321] flex-shrink-0" />
                    <span className="text-gray-700 text-sm sm:text-base">See financing options from real lenders</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-[#7ED321] flex-shrink-0" />
                    <span className="text-gray-700 text-sm sm:text-base">Compare and pick what works for you</span>
                  </div>
                </div>

                <div className="pt-3 sm:pt-4 border-t border-gray-200">
                  <div className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">Your info stays protected</div>
                  <div className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-[#2D1B69]" />
                    <span className="text-lg font-semibold text-[#2D1B69]">Secure & Private</span>
                  </div>
                </div>

                <Link
                  href="/buyer/onboarding"
                  className="block w-full py-3 sm:py-4 rounded-lg sm:rounded-xl bg-gradient-to-r from-[#7ED321] to-[#00D9FF] text-[#2D1B69] font-semibold text-base sm:text-lg text-center hover:opacity-90 transition-opacity touch-target"
                >
                  Start Now
                </Link>
              </div>

              {/* Stats - More meaningful stats */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-4 sm:mt-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-white/20 text-center">
                  <div className="text-lg sm:text-2xl font-bold text-white">500+</div>
                  <div className="text-xs sm:text-sm text-white/70">Dealers</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-white/20 text-center">
                  <div className="text-lg sm:text-2xl font-bold text-white">50+</div>
                  <div className="text-xs sm:text-sm text-white/70">Lenders</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-white/20 text-center">
                  <div className="text-lg sm:text-2xl font-bold text-white">Free</div>
                  <div className="text-xs sm:text-sm text-white/70">To Use</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <QualificationEstimateStrip />

      <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-br from-white via-gray-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/abstract-geometric-pattern-subtle.jpg')] opacity-[0.02]"></div>
        <div className="container mx-auto px-4 relative">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-4 text-gray-900">
            Car Buying <span className="text-[#2D1B69]">Shouldn't Be This Hard</span>
          </h2>
          <p className="text-center text-lg text-muted-foreground mb-12 sm:mb-16 max-w-3xl mx-auto">
            You know the feeling—walking into a dealership and wondering if you're getting a fair deal. We built
            AutoLenis because we've been there too.
          </p>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
            {/* The Old Way */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-red-600/5 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative bg-white rounded-2xl border-2 border-red-100 p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                    <X className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">The Old Way</h3>
                </div>
                <div className="space-y-4">
                  {[
                    "Driving from dealer to dealer",
                    "Hours of back-and-forth negotiation",
                    "Wondering what everyone else paid",
                    "Surprise fees at signing",
                    "Feeling pressured to decide now",
                    "Not sure if your rate is fair",
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

            {/* With AutoLenis */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#7ED321]/20 via-[#00D9FF]/10 to-[#0066FF]/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative bg-white rounded-2xl border-2 border-[#7ED321]/30 p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7ED321] to-[#00D9FF] flex items-center justify-center">
                    <Check className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">With AutoLenis</h3>
                </div>
                <div className="space-y-4">
                  {[
                    "Apply once, see multiple options",
                    "Real offers from real lenders",
                    "See all costs upfront",
                    "Compare deals side by side",
                    "Take your time to decide",
                    "Review contracts before you sign",
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

      {/* How It Works - Simpler, clearer steps */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">Here's How It Works</h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto px-4">
              Four simple steps from "I need a car" to "I got my car"
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="relative text-center sm:text-left">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-[#7ED321]/10 flex items-center justify-center mb-4 sm:mb-6 mx-auto sm:mx-0">
                <span className="text-xl sm:text-2xl font-bold text-[#7ED321]">1</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">Tell Us About You</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Fill out a quick form with your basics—what you're looking for, your budget, and where you are.
              </p>
            </div>

            <div className="relative text-center sm:text-left">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-[#00D9FF]/10 flex items-center justify-center mb-4 sm:mb-6 mx-auto sm:mx-0">
                <span className="text-xl sm:text-2xl font-bold text-[#00D9FF]">2</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">We Find Your Options</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                We share your info with our network of lenders and dealers who can help. They come back with real
                offers.
              </p>
            </div>

            <div className="relative text-center sm:text-left">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-[#0066FF]/10 flex items-center justify-center mb-4 sm:mb-6 mx-auto sm:mx-0">
                <span className="text-xl sm:text-2xl font-bold text-[#0066FF]">3</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">Compare & Choose</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                See everything side by side—rates, payments, terms. Pick the one that makes sense for you.
              </p>
            </div>

            <div className="relative text-center sm:text-left">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-[#2D1B69]/10 flex items-center justify-center mb-4 sm:mb-6 mx-auto sm:mx-0">
                <span className="text-xl sm:text-2xl font-bold text-[#2D1B69]">4</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">Get Your Car</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Finalize with your chosen dealer, sign the paperwork, and drive away. Simple as that.
              </p>
            </div>
          </div>

          <div className="text-center mt-8 sm:mt-12">
            <Link
              href="/how-it-works"
              className="inline-flex items-center gap-2 text-[#2D1B69] font-semibold hover:underline text-sm sm:text-base"
            >
              See the full process
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why AutoLenis - More genuine, less corporate */}
      <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <span className="inline-block px-4 py-1.5 bg-[#2D1B69]/10 text-[#2D1B69] text-sm font-medium rounded-full mb-4">
              Why People Use AutoLenis
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">We're On Your Side</h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              Buying a car is a big deal. Here's how we make it less stressful.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              <div className="relative bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-[#2D1B69]/30 transition-all duration-300 group">
                <div className="w-14 h-14 rounded-xl bg-[#2D1B69]/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-7 h-7 text-[#2D1B69]" />
                </div>
                <h3 className="text-xl font-bold mb-3">No Surprises</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  See all the fees and costs upfront. What you see is what you pay.
                </p>
              </div>

              <div className="relative bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-[#00D9FF]/30 transition-all duration-300 group">
                <div className="w-14 h-14 rounded-xl bg-[#00D9FF]/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Users className="w-7 h-7 text-[#00D9FF]" />
                </div>
                <h3 className="text-xl font-bold mb-3">Real Options</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Multiple lenders compete for your business. You pick the winner.
                </p>
              </div>

              <div className="relative bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-[#7ED321]/30 transition-all duration-300 group">
                <div className="w-14 h-14 rounded-xl bg-[#7ED321]/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Shield className="w-7 h-7 text-[#7ED321]" />
                </div>
                <h3 className="text-xl font-bold mb-3">Contract Review</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Our tools flag things to watch out for before you sign anything.
                </p>
              </div>

              <div className="relative bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-[#0066FF]/30 transition-all duration-300 group">
                <div className="w-14 h-14 rounded-xl bg-[#0066FF]/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Lock className="w-7 h-7 text-[#0066FF]" />
                </div>
                <h3 className="text-xl font-bold mb-3">Your Data, Protected</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We only share your info with lenders and dealers who can actually help you.
                </p>
              </div>
            </div>

            <div className="text-center mt-10 sm:mt-12">
              <p className="text-muted-foreground mb-4">Ready to see what's out there?</p>
              <Link href="/buyer/onboarding">
                <Button size="lg" className="bg-[#2D1B69] hover:bg-[#3d2575] text-white px-8">
                  Get Started
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contract Shield - More relatable explanation */}
      <section className="py-16 sm:py-20 md:py-24 bg-[#f5f5f7]">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-6xl mx-auto">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2D1B69]/10 border border-[#2D1B69]/20">
                <Shield className="w-4 h-4 text-[#2D1B69]" />
                <span className="text-sm font-semibold text-[#2D1B69]">Contract Shield</span>
              </div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">Know What You're Signing</h2>

              <p className="text-lg text-muted-foreground leading-relaxed">
                Car contracts can be confusing. Our Contract Shield tool scans your paperwork and highlights anything
                you should look at twice—like unexpected fees, warranty terms, or clauses that could cost you later.
              </p>

              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#7ED321]/20 flex items-center justify-center mt-1 flex-shrink-0">
                    <Check className="w-4 h-4 text-[#7ED321]" />
                  </div>
                  <span className="text-gray-700">Spots hidden fees and add-ons</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#7ED321]/20 flex items-center justify-center mt-1 flex-shrink-0">
                    <Check className="w-4 h-4 text-[#7ED321]" />
                  </div>
                  <span className="text-gray-700">Explains terms in plain English</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#7ED321]/20 flex items-center justify-center mt-1 flex-shrink-0">
                    <Check className="w-4 h-4 text-[#7ED321]" />
                  </div>
                  <span className="text-gray-700">Flags things worth asking about</span>
                </li>
              </ul>

              <Link
                href="/buyer/onboarding"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#2D1B69] text-white font-semibold hover:bg-[#3d2575] transition-colors"
              >
                Try It Out
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 border border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-[#7ED321]/10 flex items-center justify-center">
                    <FileCheck className="w-5 h-5 text-[#7ED321]" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Contract Analysis</div>
                    <div className="text-sm text-gray-500">Sample results</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                    <div className="flex items-center gap-2 mb-1">
                      <Check className="w-4 h-4 text-green-600" />
                      <span className="font-medium text-green-800">APR matches quote</span>
                    </div>
                    <p className="text-sm text-green-700">The rate in your contract matches what you were offered.</p>
                  </div>

                  <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                    <div className="flex items-center gap-2 mb-1">
                      <Shield className="w-4 h-4 text-yellow-600" />
                      <span className="font-medium text-yellow-800">Extended warranty add-on</span>
                    </div>
                    <p className="text-sm text-yellow-700">
                      There's a $1,200 warranty included. You can often negotiate this or decline it.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                    <div className="flex items-center gap-2 mb-1">
                      <Check className="w-4 h-4 text-green-600" />
                      <span className="font-medium text-green-800">Standard loan terms</span>
                    </div>
                    <p className="text-sm text-green-700">
                      No prepayment penalties. You can pay it off early without extra fees.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Program - More straightforward referral explanation */}
      <section className="py-16 sm:py-20 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#7ED321]/10 border border-[#7ED321]/20">
                  <DollarSign className="w-4 h-4 text-[#7ED321]" />
                  <span className="text-sm font-semibold text-[#7ED321]">Referral Program</span>
                </div>

                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                  Know Someone Who Needs a Car?
                </h2>

                <p className="text-lg text-muted-foreground leading-relaxed">
                  If you've had a good experience with AutoLenis, share it. When someone uses your link and buys a car,
                  you get paid. It's that simple—no selling, no recruiting, just sharing.
                </p>

                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <div className="text-2xl font-bold text-[#7ED321]">15%</div>
                    <div className="text-sm text-muted-foreground">Direct referral</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <div className="text-2xl font-bold text-[#00D9FF]">3%</div>
                    <div className="text-sm text-muted-foreground">Their referrals</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <div className="text-2xl font-bold text-[#0066FF]">2%</div>
                    <div className="text-sm text-muted-foreground">Third level</div>
                  </div>
                </div>

                <Link
                  href="/affiliate"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#7ED321] text-white font-semibold hover:opacity-90 transition-opacity"
                >
                  Learn About the Program
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>

              <div className="bg-gradient-to-br from-[#7ED321]/10 via-[#00D9FF]/10 to-[#0066FF]/10 rounded-2xl p-8">
                <h3 className="text-xl font-bold mb-6">How It Works</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#7ED321] flex items-center justify-center flex-shrink-0">
                      <span className="font-bold text-white text-sm">1</span>
                    </div>
                    <div>
                      <div className="font-semibold">Get your link</div>
                      <div className="text-sm text-muted-foreground">Sign up and grab your personal referral link</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#00D9FF] flex items-center justify-center flex-shrink-0">
                      <span className="font-bold text-white text-sm">2</span>
                    </div>
                    <div>
                      <div className="font-semibold">Share it</div>
                      <div className="text-sm text-muted-foreground">
                        Send it to friends, family, or anyone looking for a car
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#0066FF] flex items-center justify-center flex-shrink-0">
                      <span className="font-bold text-white text-sm">3</span>
                    </div>
                    <div>
                      <div className="font-semibold">Get paid</div>
                      <div className="text-sm text-muted-foreground">
                        When they buy a car, you earn a referral reward
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ - More conversational Q&A */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Common Questions</h2>

            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-lg mb-2">Is AutoLenis a lender or a dealer?</h3>
                <p className="text-muted-foreground">
                  Neither. We're a platform that connects you with lenders and dealers. They handle the financing and
                  sell you the car—we just help you find good options and compare them.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-lg mb-2">Does this hurt my credit score?</h3>
                <p className="text-muted-foreground">
                  The initial look is a soft inquiry, which doesn't affect your score. If you move forward with a
                  specific lender, they may do a hard pull as part of their process—but that's normal for any loan.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-lg mb-2">Is there a cost to use AutoLenis?</h3>
                <p className="text-muted-foreground">
                  Nope. It's free for buyers. We get paid by the dealers and lenders when a deal closes, not by you.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-lg mb-2">What if my credit isn't great?</h3>
                <p className="text-muted-foreground">
                  We work with lenders across the credit spectrum. You might not get the lowest rate, but we'll show you
                  what's actually available to you—no false promises.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-lg mb-2">How long does this take?</h3>
                <p className="text-muted-foreground">
                  The application takes about 5 minutes. Getting offers back usually happens within a day or two. How
                  fast you close depends on you and the dealer.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA - Simple, direct */}
      <section className="py-16 sm:py-20 md:py-24 bg-[#2D1B69] text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold">Ready to Find Your Next Car?</h2>
            <p className="text-xl text-white/80">See what lenders and dealers can offer you. Takes about 5 minutes.</p>
            <Link
              href="/buyer/onboarding"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-gradient-to-r from-[#7ED321] to-[#00D9FF] text-[#2D1B69] font-semibold text-lg hover:opacity-90 transition-opacity"
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Disclaimer - Clearer, more readable */}
      <section className="py-6 bg-gray-100 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-xs text-gray-500 leading-relaxed">
              AutoLenis connects you with lenders and dealers—we don't make loans or sell cars ourselves. Financing is
              subject to lender approval and terms. We can't guarantee you'll be approved or get a specific rate. Always
              read your contracts carefully before signing.
            </p>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
