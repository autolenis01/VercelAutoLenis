"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowRight,
  Calculator,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Car,
  TrendingUp,
  Gift,
} from "lucide-react"
import { PublicNav } from "@/components/layout/public-nav"
import { PublicFooter } from "@/components/layout/public-footer"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"

const COMMISSION_RATES = [0.15, 0.03, 0.02]
const LEVEL_NAMES = ["Direct Referral", "2nd Origin", "3rd Origin"]
const LEVEL_COLORS = ["#7ED321", "#00D9FF", "#0066FF"]

const INCOME_DISTRIBUTION = [0.75, 0.15, 0.1]

export default function AffiliateIncomePage() {
  const [selectedPackage, setSelectedPackage] = useState(750)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [calculatorTab, setCalculatorTab] = useState("estimate")

  // Calculate default sales to achieve ~$2,500 with proper distribution
  const getDefaultSales = (pkg: number) => {
    const targetIncome = 2500
    const sales: number[] = []
    for (let i = 0; i < 3; i++) {
      const levelIncome = targetIncome * (INCOME_DISTRIBUTION[i] ?? 0)
      const commissionPerSale = pkg * (COMMISSION_RATES[i] ?? 0)
      sales.push(Math.round(levelIncome / commissionPerSale))
    }
    return sales
  }

  const [salesByLevel, setSalesByLevel] = useState(getDefaultSales(750))
  const [goalIncome, setGoalIncome] = useState(5000)

  // Calculate total income
  const calculateIncome = () => {
    return salesByLevel.reduce((total, sales, index) => {
      return total + sales * selectedPackage * (COMMISSION_RATES[index] ?? 0)
    }, 0)
  }

  // Calculate sales needed for goal using the distribution formula
  const calculateSalesForGoal = () => {
    const sales: number[] = []
    for (let i = 0; i < 3; i++) {
      const levelIncome = goalIncome * (INCOME_DISTRIBUTION[i] ?? 0)
      const commissionPerSale = selectedPackage * (COMMISSION_RATES[i] ?? 0)
      sales.push(Math.ceil(levelIncome / commissionPerSale))
    }
    return sales
  }

  const totalIncome = calculateIncome()
  const salesForGoal = calculateSalesForGoal()

  const faqs = [
    {
      question: "Is this a multi-level marketing (MLM) program?",
      answer:
        "No. This is a referral program based on car purchases, not recruitment. You share your link, and when someone buys a car, you earn a commission. There are no teams to build, no quotas to meet, no meetings to attend, and no one to recruit. The 'network origin bonuses' simply mean that when a car purchase traces back to your original referral (up to 3 levels), you receive a small bonus—but this happens automatically through car sales, not through recruiting people.",
    },
    {
      question: "How do network origin bonuses work?",
      answer:
        "Every AutoLenis customer automatically receives a referral link when they buy a car. If someone you referred shares their link and another person buys a car, you receive a 3% bonus because that sale originated from your network. This continues for up to 3 purchases in the chain. You don't have to do anything—it happens automatically when cars are purchased.",
    },
    {
      question: "Does my referral link expire?",
      answer:
        "No, your referral link never expires. As long as you're in the program, your link remains active. You can share it today, and if someone uses it to buy a car months or years later, you still earn your commission.",
    },
    {
      question: "How much can I realistically earn?",
      answer:
        "Your earnings depend on how many people use your link to buy cars. For each direct referral (someone who buys using YOUR link), you earn 15% of the package price. On a $750 package, that's $112.50 per car. Network origin bonuses (3% and 2% for 2nd and 3rd level) add additional income when car purchases trace back to your referrals. The total commission structure is 20% across all levels.",
    },
    {
      question: "When and how do I get paid?",
      answer:
        "Commissions are paid out monthly via direct deposit or PayPal. Once a car purchase is completed and the transaction is verified, your commission is credited to your account and included in the next payout cycle.",
    },
    {
      question: "Do I need to buy a car to participate?",
      answer:
        "No. You can join the referral program for free and receive your link immediately. However, if you do purchase a car through AutoLenis, you'll automatically be enrolled and receive your referral link as part of the process.",
    },
  ]

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <PublicNav />

      {/* Hero Section */}
      <section className="bg-[#3d2066] text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/5 mb-6">
              <Calculator className="w-4 h-4 text-[#7ED321]" />
              <span className="text-sm">Income Calculator</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance">See How Much You Can Earn</h1>
            <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto mb-8">
              Earn <span className="text-[#7ED321] font-bold">up to 20% commission</span> when someone buys a car using
              your link. Plus, receive network origin bonuses when car purchases trace back to your referrals—no
              recruiting required.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works - Network Origin Explanation */}
      <section className="py-16 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#3d2066] mb-4">How You Earn</h2>
            <p className="text-lg text-[#666] max-w-2xl mx-auto">
              A simple referral program based on car purchases, not recruitment
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="bg-[#3d2066] rounded-2xl p-8 text-white mb-8">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-[#7ED321] flex items-center justify-center mx-auto mb-4">
                    <Car className="w-8 h-8 text-[#3d2066]" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Direct Referral</h3>
                  <p className="text-white/70 text-sm mb-3">Someone buys a car using YOUR link</p>
                  <div className="text-3xl font-bold text-[#7ED321]">15%</div>
                  <div className="text-sm text-white/60">${(selectedPackage * 0.15).toFixed(2)} per sale</div>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-[#00D9FF] flex items-center justify-center mx-auto mb-4">
                    <Gift className="w-8 h-8 text-[#3d2066]" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">2nd Origin Bonus</h3>
                  <p className="text-white/70 text-sm mb-3">Your referral's referral buys a car</p>
                  <div className="text-3xl font-bold text-[#00D9FF]">3%</div>
                  <div className="text-sm text-white/60">${(selectedPackage * 0.03).toFixed(2)} bonus</div>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-[#0066FF] flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">3rd Origin Bonus</h3>
                  <p className="text-white/70 text-sm mb-3">Third level car purchase in your network</p>
                  <div className="text-3xl font-bold text-[#0066FF]">2%</div>
                  <div className="text-sm text-white/60">${(selectedPackage * 0.02).toFixed(2)} bonus</div>
                </div>
              </div>
            </div>

            {/* Clarification Box */}
            <div className="bg-[#7ED321]/10 border border-[#7ED321]/30 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-[#7ED321] flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-[#3d2066] mb-2">This is NOT multi-level marketing</h4>
                  <p className="text-[#666]">
                    You don't recruit anyone. Every AutoLenis customer automatically gets a referral link when they buy
                    a car. Network origin bonuses happen automatically when car purchases trace back to your original
                    referral (up to 3 levels). There are no teams, no downlines, no meetings—just share your link and
                    earn when cars are purchased.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Commission Structure */}
      <section className="py-16 bg-[#faf9f7]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#3d2066] mb-4">Commission Structure</h2>
            <p className="text-lg text-[#666] max-w-2xl mx-auto">
              Earn up to 20% total commission on direct referrals plus bonuses from your network
            </p>
          </div>

          {/* Package Selector */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => {
                setSelectedPackage(499)
                setSalesByLevel(getDefaultSales(499))
              }}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                selectedPackage === 499
                  ? "bg-[#3d2066] text-white"
                  : "bg-white border-2 border-[#e5e5e5] text-[#3d2066] hover:border-[#3d2066]"
              }`}
            >
              $499 Package
            </button>
            <button
              onClick={() => {
                setSelectedPackage(750)
                setSalesByLevel(getDefaultSales(750))
              }}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                selectedPackage === 750
                  ? "bg-[#3d2066] text-white"
                  : "bg-white border-2 border-[#e5e5e5] text-[#3d2066] hover:border-[#3d2066]"
              }`}
            >
              $750 Package
              <span className="ml-2 text-xs bg-[#7ED321] text-white px-2 py-0.5 rounded-full">Popular</span>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto">
            {COMMISSION_RATES.map((rate, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 text-center border-2 transition-all hover:shadow-lg"
                style={{ borderColor: `${LEVEL_COLORS[index]}40` }}
              >
                <div className="text-3xl md:text-4xl font-bold mb-2" style={{ color: LEVEL_COLORS[index] }}>
                  {(rate * 100).toFixed(0)}%
                </div>
                <div className="text-sm text-[#666] mb-2">{LEVEL_NAMES[index] ?? ''}</div>
                <div className="text-lg font-semibold text-[#3d2066]">${(selectedPackage * rate).toFixed(2)}</div>
                <div className="text-xs text-[#999]">per car sold</div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#3d2066] text-white">
              <span className="text-lg font-semibold">Total Commission:</span>
              <span className="text-2xl font-bold text-[#7ED321]">20%</span>
            </div>
          </div>
        </div>
      </section>

      {/* Real Example - Updated to 3 levels with new commission amounts */}
      <section className="py-16 bg-[#3d2066] text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Real Example: How Earnings Add Up</h2>
              <p className="text-lg text-white/80">See how network origin bonuses work with actual car purchases</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="space-y-6">
                <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-[#7ED321] flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-[#3d2066]">1</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">Your friend Sarah uses your link to buy a car ($750 package)</p>
                    <p className="text-white/70">
                      You earn: <span className="text-[#7ED321] font-bold">$112.50</span> (15% direct referral)
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-[#00D9FF] flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-[#3d2066]">2</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">
                      Sarah shares her link (she got one automatically). Her coworker Mike buys a car.
                    </p>
                    <p className="text-white/70">Sarah earns $112.50 (her direct referral)</p>
                    <p className="text-white/70">
                      You earn: <span className="text-[#00D9FF] font-bold">$22.50</span> (3% network origin bonus)
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-[#0066FF] flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-[#3d2066]">3</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">
                      Mike's neighbor sees his new car and uses Mike's link to buy one too.
                    </p>
                    <p className="text-white/70">Mike earns $112.50, Sarah earns $22.50</p>
                    <p className="text-white/70">
                      You earn: <span className="text-[#0066FF] font-bold">$15.00</span> (2% network origin bonus)
                    </p>
                  </div>
                </div>

                <div className="border-t border-white/20 pt-6 mt-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg">Your total from just these 3 car sales:</span>
                    <span className="text-3xl font-bold text-[#7ED321]">$150.00</span>
                  </div>
                  <p className="text-white/60 text-sm mt-2">
                    You only shared your link once with Sarah. The rest happened automatically through car purchases.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Income Calculator */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#3d2066] mb-4">Income Calculator</h2>
            <p className="text-lg text-[#666] max-w-2xl mx-auto">
              Estimate your potential earnings or calculate what it takes to hit your income goal
            </p>
          </div>

          <Card className="max-w-4xl mx-auto border-2 border-[#e5e5e5]">
            <CardContent className="p-6 md:p-8">
              {/* Package selector in calculator */}
              <div className="flex items-center justify-between mb-6 pb-6 border-b">
                <span className="font-semibold text-[#3d2066]">Package Price:</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedPackage(499)
                      setSalesByLevel(getDefaultSales(499))
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedPackage === 499
                        ? "bg-[#3d2066] text-white"
                        : "bg-[#f5f5f5] text-[#3d2066] hover:bg-[#e5e5e5]"
                    }`}
                  >
                    $499
                  </button>
                  <button
                    onClick={() => {
                      setSelectedPackage(750)
                      setSalesByLevel(getDefaultSales(750))
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedPackage === 750
                        ? "bg-[#3d2066] text-white"
                        : "bg-[#f5f5f5] text-[#3d2066] hover:bg-[#e5e5e5]"
                    }`}
                  >
                    $750
                  </button>
                </div>
              </div>

              <Tabs value={calculatorTab} onValueChange={setCalculatorTab}>
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="estimate" className="text-base">
                    Estimate My Income
                  </TabsTrigger>
                  <TabsTrigger value="goal" className="text-base">
                    Hit My Income Goal
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="estimate">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <h3 className="font-semibold text-[#3d2066] text-lg">Adjust Car Sales by Origin</h3>
                      {salesByLevel.map((sales, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium" style={{ color: LEVEL_COLORS[index] }}>
                              {LEVEL_NAMES[index]} ({((COMMISSION_RATES[index] ?? 0) * 100).toFixed(0)}%)
                            </span>
                            <span className="text-sm text-[#666]">
                              {sales} sales = ${(sales * selectedPackage * (COMMISSION_RATES[index] ?? 0)).toFixed(2)}
                            </span>
                          </div>
                          <Slider
                            value={[sales]}
                            onValueChange={(value) => {
                              const newSales = [...salesByLevel]
                              newSales[index] = value[0] ?? 0
                              setSalesByLevel(newSales)
                            }}
                            max={index === 0 ? 50 : 100}
                            step={1}
                            className="w-full"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="bg-[#3d2066] rounded-2xl p-6 flex flex-col justify-center text-white">
                      <div className="text-center">
                        <div className="text-sm text-white/70 mb-2">Estimated Monthly Income</div>
                        <div className="text-5xl font-bold text-[#7ED321] mb-4">
                          ${totalIncome.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </div>
                        <div className="text-sm text-white/70">per month</div>
                      </div>
                      <div className="mt-6 pt-6 border-t border-white/20 space-y-2">
                        {salesByLevel.map((sales, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span className="text-white/70">{LEVEL_NAMES[index]}:</span>
                            <span style={{ color: LEVEL_COLORS[index] }}>
                              ${(sales * selectedPackage * (COMMISSION_RATES[index] ?? 0)).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="goal">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <h3 className="font-semibold text-[#3d2066] text-lg">Set Your Monthly Goal</h3>
                      <div>
                        <label className="block text-sm font-medium text-[#666] mb-2">Target Monthly Income</label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#999]" />
                          <Input
                            type="number"
                            value={goalIncome}
                            onChange={(e) => setGoalIncome(Number(e.target.value))}
                            className="pl-10 text-xl font-bold h-14"
                          />
                        </div>
                      </div>

                      <div className="bg-[#f5f5f5] rounded-xl p-4 space-y-3">
                        <div className="text-sm font-medium text-[#3d2066] mb-3">
                          Sales needed (using 75/15/10 distribution):
                        </div>
                        {salesForGoal.map((sales, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <span className="text-sm" style={{ color: LEVEL_COLORS[index] }}>
                              {LEVEL_NAMES[index] ?? ''} ({((INCOME_DISTRIBUTION[index] ?? 0) * 100).toFixed(0)}% of income):
                            </span>
                            <span className="font-bold text-[#3d2066]">{sales} sales</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-[#7ED321]/10 rounded-2xl p-6 flex flex-col justify-center border-2 border-[#7ED321]/30">
                      <div className="text-center">
                        <div className="text-sm text-[#666] mb-2">Direct Referrals Needed</div>
                        <div className="text-6xl font-bold text-[#7ED321] mb-2">{salesForGoal[0] ?? 0}</div>
                        <div className="text-sm text-[#666] mb-4">car sales per month</div>
                        <div className="text-xs text-[#999]">
                          That's about {Math.ceil((salesForGoal[0] ?? 0) / 4)} per week using your direct link
                        </div>
                      </div>
                      <div className="mt-6 pt-6 border-t border-[#7ED321]/30">
                        <div className="text-center text-sm text-[#666]">
                          Network origin bonuses add an additional{" "}
                          <span className="font-bold text-[#3d2066]">${(goalIncome * 0.25).toLocaleString()}</span> from
                          car purchases that trace back to you
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-[#faf9f7]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#3d2066] mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-[#666] max-w-2xl mx-auto">
              Everything you need to know about the referral program
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl border border-[#e5e5e5] overflow-hidden">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-[#faf9f7] transition-colors"
                >
                  <span className="font-semibold text-[#3d2066]">{faq.question}</span>
                  {expandedFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-[#3d2066] flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[#3d2066] flex-shrink-0" />
                  )}
                </button>
                {expandedFaq === index && <div className="px-6 pb-4 text-[#666]">{faq.answer}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#3d2066]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Start Earning?</h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
            Get your free referral link and earn up to 20% on every car purchase, plus network origin bonuses
          </p>
          <Link
            href="/auth/signup?role=affiliate"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-[#3d2066] font-semibold text-lg hover:bg-[#f5f5f5] transition-colors"
          >
            Get My Referral Link
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
