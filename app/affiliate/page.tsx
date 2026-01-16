"use client"

import Link from "next/link"
import {
  ArrowRight,
  DollarSign,
  TrendingUp,
  CheckCircle,
  Car,
  Calculator,
  Link2,
  Shield,
  Users,
  Briefcase,
  Heart,
} from "lucide-react"
import { PublicNav } from "@/components/layout/public-nav"
import { PublicFooter } from "@/components/layout/public-footer"

export default function AffiliateProgramPage() {
  return (
    <div className="min-h-screen bg-background">
      <PublicNav />

      {/* Hero - Direct, no-nonsense explanation */}
      <section className="relative bg-[#2D1B69] text-white overflow-hidden">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm">
                <DollarSign className="w-4 h-4 text-[#7ED321]" />
                <span className="text-sm text-white/90">Referral Program</span>
              </div>

              <div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-balance">
                  Share AutoLenis,{" "}
                  <span className="bg-gradient-to-r from-[#7ED321] via-[#00D9FF] to-[#0066FF] bg-clip-text text-transparent">
                    Get Paid
                  </span>
                </h1>
              </div>

              <p className="text-lg md:text-xl text-white/80 text-balance max-w-xl">
                Know someone looking for a car? Send them our way. When they buy through AutoLenis, you earn a referral
                fee. No selling, no recruiting, just sharing a link.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/auth/signup?role=affiliate"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[#7ED321] to-[#00D9FF] text-[#2D1B69] font-semibold hover:opacity-90 transition-opacity"
                >
                  Get Your Link
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/affiliate/income"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-colors"
                >
                  <Calculator className="w-5 h-5" />
                  See the Math
                </Link>
              </div>
            </div>

            {/* Right Card - Clearer, less salesy */}
            <div className="relative">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 md:p-8 space-y-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-900 font-bold text-xl">The Deal</span>
                  <span className="px-3 py-1 rounded-full bg-[#7ED321]/10 text-[#7ED321] text-sm font-semibold">
                    Free
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-[#7ED321] flex-shrink-0" />
                    <span>Get a personal referral link</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-[#7ED321] flex-shrink-0" />
                    <span>Share it with people who need cars</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-[#7ED321] flex-shrink-0" />
                    <span>Earn 15% when they buy</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-[#7ED321] flex-shrink-0" />
                    <span>Link never expires</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600 mb-2">When someone uses your link and buys a car:</div>
                  <div className="text-3xl font-bold text-[#2D1B69]">You Get 15%</div>
                </div>

                <Link
                  href="/affiliate/income"
                  className="block w-full py-4 rounded-xl bg-gradient-to-r from-[#7ED321] to-[#00D9FF] text-[#2D1B69] font-semibold text-lg text-center hover:opacity-90 transition-opacity"
                >
                  See Full Details
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="text-2xl font-bold text-white">15%</div>
                  <div className="text-sm text-white/70">Your Cut</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="text-2xl font-bold text-white">Free</div>
                  <div className="text-sm text-white/70">To Join</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="text-2xl font-bold text-white">∞</div>
                  <div className="text-sm text-white/70">Link Life</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Clarification - Address the MLM concern directly */}
      <section className="py-12 bg-gradient-to-r from-[#7ED321]/10 via-[#00D9FF]/10 to-[#0066FF]/10 border-y border-gray-200">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold">This is Not MLM</h2>
            <p className="text-lg text-muted-foreground">
              Let's be clear: you don't recruit people to sell anything. You don't build a team. You don't have quotas
              or meetings. You just share a link. When someone uses it to buy a car, you get paid. That's the whole
              thing.
            </p>
          </div>
        </div>
      </section>

      {/* How It Actually Works - Very simple steps */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Three steps. That's it.</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-[#7ED321]/10 flex items-center justify-center mb-6 mx-auto">
                  <span className="text-2xl font-bold text-[#7ED321]">1</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Sign Up</h3>
                <p className="text-muted-foreground">
                  Create a free account and get your personal referral link. Takes 2 minutes.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-[#00D9FF]/10 flex items-center justify-center mb-6 mx-auto">
                  <span className="text-2xl font-bold text-[#00D9FF]">2</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Share Your Link</h3>
                <p className="text-muted-foreground">
                  Send it to friends, family, coworkers—anyone you know who's looking for a car.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-[#0066FF]/10 flex items-center justify-center mb-6 mx-auto">
                  <span className="text-2xl font-bold text-[#0066FF]">3</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Get Paid</h3>
                <p className="text-muted-foreground">
                  When they complete a purchase through AutoLenis, you earn a referral fee.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Compensation - Straightforward explanation */}
      <section className="py-20 bg-[#2D1B69] text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">What You Earn</h2>
            <p className="text-lg text-white/80 max-w-3xl mx-auto">
              You get 15% of our fee when someone you referred buys a car. Plus, if that person refers someone else who
              buys, you get a smaller bonus from those purchases too.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 mb-8">
              <h3 className="text-xl font-bold mb-6 text-center">The Breakdown</h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#7ED321] flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-[#2D1B69]">1</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-lg">Someone you referred buys a car</p>
                      <span className="text-[#7ED321] font-bold text-xl">15%</span>
                    </div>
                    <p className="text-white/70">
                      You shared your link, they used it, they bought a car. You get 15% of our fee.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#00D9FF] flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-[#2D1B69]">2</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-lg">Their referral buys a car</p>
                      <span className="text-[#00D9FF] font-bold text-xl">3%</span>
                    </div>
                    <p className="text-white/70">
                      The person you referred gets their own link. When their friend buys, you get a 3% bonus.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#0066FF] flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-[#2D1B69]">3</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-lg">One more level out</p>
                      <span className="text-[#0066FF] font-bold text-xl">2%</span>
                    </div>
                    <p className="text-white/70">
                      This goes one more step. If that person's referral buys, you get 2%. That's as deep as it goes.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h4 className="font-bold mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#7ED321]" />
                Quick Rules
              </h4>
              <ul className="space-y-2 text-white/80 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-[#7ED321]">•</span>
                  <span>You get paid when the car purchase actually closes—not just when someone applies.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#7ED321]">•</span>
                  <span>Don't make stuff up about what AutoLenis can do. Be honest when you share.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#7ED321]">•</span>
                  <span>Only refer real people who actually want to buy cars. Not bots. Not fake leads.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/affiliate/income"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-gradient-to-r from-[#7ED321] to-[#00D9FF] text-[#2D1B69] font-semibold text-lg hover:opacity-90 transition-opacity"
            >
              See Examples & Calculator
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Who This Is Good For - Practical examples */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Who Does This Work For?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Basically anyone who knows people who buy cars. Here are some examples.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#7ED321]/10 flex items-center justify-center mb-6 mx-auto">
                <Users className="w-8 h-8 text-[#7ED321]" />
              </div>
              <h3 className="text-xl font-bold mb-3">Financial Advisors</h3>
              <p className="text-muted-foreground text-sm">
                Your clients ask you about big purchases anyway. Now you can point them somewhere good.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#00D9FF]/10 flex items-center justify-center mb-6 mx-auto">
                <Briefcase className="w-8 h-8 text-[#00D9FF]" />
              </div>
              <h3 className="text-xl font-bold mb-3">HR & Office Managers</h3>
              <p className="text-muted-foreground text-sm">
                New hires, relocating employees—people at work ask about cars. You can help.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#0066FF]/10 flex items-center justify-center mb-6 mx-auto">
                <Heart className="w-8 h-8 text-[#0066FF]" />
              </div>
              <h3 className="text-xl font-bold mb-3">Community Leaders</h3>
              <p className="text-muted-foreground text-sm">
                Church groups, local organizations—when someone needs a car, you can share a resource.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#2D1B69]/10 flex items-center justify-center mb-6 mx-auto">
                <TrendingUp className="w-8 h-8 text-[#2D1B69]" />
              </div>
              <h3 className="text-xl font-bold mb-3">Anyone, Really</h3>
              <p className="text-muted-foreground text-sm">
                If you know people who buy cars and you want to help them out, this works.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Two Ways to Join */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Two Ways to Get Started</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl p-8 border-2 border-[#7ED321]/20">
              <div className="w-16 h-16 rounded-2xl bg-[#7ED321]/10 flex items-center justify-center mb-6 mx-auto">
                <Car className="w-8 h-8 text-[#7ED321]" />
              </div>
              <div className="inline-flex px-3 py-1 rounded-full bg-[#7ED321]/20 text-[#7ED321] text-sm font-semibold mb-4">
                Buying a Car?
              </div>
              <h3 className="text-2xl font-bold mb-4">You Get a Link Automatically</h3>
              <p className="text-muted-foreground mb-6">
                When you buy a car through AutoLenis, you automatically get your own referral link. Share it with others
                and earn when they buy too.
              </p>
              <Link
                href="/buyer/onboarding"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#7ED321] text-white font-semibold hover:opacity-90 transition-opacity w-full"
              >
                Start Shopping for a Car
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            <div className="bg-white rounded-2xl p-8 border-2 border-[#00D9FF]/20">
              <div className="w-16 h-16 rounded-2xl bg-[#00D9FF]/10 flex items-center justify-center mb-6 mx-auto">
                <Link2 className="w-8 h-8 text-[#00D9FF]" />
              </div>
              <div className="inline-flex px-3 py-1 rounded-full bg-[#00D9FF]/20 text-[#00D9FF] text-sm font-semibold mb-4">
                Not Buying Right Now?
              </div>
              <h3 className="text-2xl font-bold mb-4">Sign Up Directly</h3>
              <p className="text-muted-foreground mb-6">
                You don't need to buy a car to participate. Just sign up, get your link, and start sharing. It's free.
              </p>
              <Link
                href="/auth/signup?role=affiliate"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#00D9FF] text-white font-semibold hover:opacity-90 transition-opacity w-full"
              >
                Get Your Referral Link
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ - Real questions, real answers */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">Questions</h2>

            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <h3 className="font-bold text-lg mb-2">Is this multi-level marketing?</h3>
                <p className="text-muted-foreground">
                  No. You're not recruiting people to join a sales team. You're not selling products. You just share a
                  link, and when someone uses it to buy a car, you get paid. The "levels" just mean that if your
                  referral also refers someone, you get a small bonus from that too—but you're not managing anyone or
                  building anything.
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <h3 className="font-bold text-lg mb-2">When do I get paid?</h3>
                <p className="text-muted-foreground">
                  After the car deal closes. Not when someone clicks your link, not when they apply—when they actually
                  buy a car and the transaction is complete.
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <h3 className="font-bold text-lg mb-2">Does my link expire?</h3>
                <p className="text-muted-foreground">
                  Nope. Your link works as long as you're in the program. Share it today, someone uses it next year—you
                  still get paid.
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <h3 className="font-bold text-lg mb-2">What does "15% of the fee" mean?</h3>
                <p className="text-muted-foreground">
                  AutoLenis earns a fee when we connect a buyer with a dealer and the deal closes. You get 15% of what
                  we earn. The buyer doesn't pay more because of you—you're getting a cut of our side.
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <h3 className="font-bold text-lg mb-2">Do I have to buy a car myself to participate?</h3>
                <p className="text-muted-foreground">
                  No. You can sign up for the referral program without ever buying a car through us.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-[#2D1B69] text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold">Ready to Start?</h2>
            <p className="text-xl text-white/80">
              Get your referral link in a couple minutes. It's free, and it never expires.
            </p>
            <Link
              href="/auth/signup?role=affiliate"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-gradient-to-r from-[#7ED321] to-[#00D9FF] text-[#2D1B69] font-semibold text-lg hover:opacity-90 transition-opacity"
            >
              Get Your Link
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-6 bg-gray-100 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-xs text-gray-500 leading-relaxed">
              Referral rewards are paid on completed, valid transactions only. AutoLenis reserves the right to modify
              program terms. This is not a guarantee of income—what you earn depends on who you refer and whether they
              complete a purchase.
            </p>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
