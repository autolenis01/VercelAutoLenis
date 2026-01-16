"use client"

import { PublicNav } from "@/components/layout/public-nav"
import { PublicFooter } from "@/components/layout/public-footer"
import Link from "next/link"
import {
  Shield,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  FileSearch,
  Eye,
  FileText,
  HelpCircle,
  Info,
} from "lucide-react"

export default function ContractShieldPage() {
  const features = [
    {
      icon: FileSearch,
      title: "Automated Review",
      description:
        "Our system compares contract numbers against your accepted offer to help identify potential discrepancies worth reviewing.",
    },
    {
      icon: Eye,
      title: "Fee Comparison",
      description:
        "We compare fees against typical ranges for your area. This may help you identify items to discuss with the dealer.",
    },
    {
      icon: AlertTriangle,
      title: "Difference Flagging",
      description:
        "If we notice differences between the contract and your accepted offer, we'll highlight them for your review.",
    },
    {
      icon: HelpCircle,
      title: "Review Assistance",
      description: "Get plain-language explanations of items that may need clarification before you sign.",
    },
  ]

  const flaggedItems = [
    { name: "Documentation Fee", status: "review", amount: "$799", note: "Higher than typical for your area" },
    { name: "Paint Protection", status: "info", amount: "$1,299", note: "Optional - confirm you requested this" },
    { name: "APR", status: "success", amount: "4.9%", note: "Matches your financing offer" },
    { name: "Total Price", status: "success", amount: "$32,450", note: "Matches accepted offer" },
    { name: "Trade-in Value", status: "success", amount: "$8,500", note: "Matches agreed value" },
  ]

  const stats = [
    { value: "$1,847", label: "Average Savings Per Contract" },
    { value: "23%", label: "Contracts Have Hidden Fees" },
    { value: "99.7%", label: "Detection Accuracy" },
    { value: "< 30s", label: "Analysis Time" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <PublicNav />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#2D1B69] via-[#3d2066] to-[#2D1B69] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-[#7ED321] rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#00D9FF] rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 py-20 md:py-28 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm">
                <Shield className="w-4 h-4 text-[#7ED321]" />
                <span className="text-sm text-white/90">Contract Review Assistant</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-balance">
                Contract Shield
                <span className="text-[#7ED321]">™</span>
              </h1>

              <p className="text-xl text-white/80 max-w-xl text-pretty">
                Our automated review tool compares your contract against your accepted offer and helps identify items
                that may be worth reviewing with the dealer before you sign.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[#7ED321] to-[#00D9FF] text-[#2D1B69] font-semibold hover:opacity-90 transition-opacity shadow-xl hover:shadow-2xl"
                >
                  Get Started
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="#how-it-works"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-colors"
                >
                  Learn More
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-4 text-sm text-white/60">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#7ED321]" />
                  <span>Automated scanning</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#7ED321]" />
                  <span>Instant results</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#7ED321]" />
                  <span>Free for buyers</span>
                </div>
              </div>
            </div>

            {/* Contract Analysis Preview Card */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#7ED321]/20 to-[#00D9FF]/20 rounded-2xl blur-3xl animate-pulse" />

              <div className="relative bg-white rounded-2xl shadow-2xl p-6 md:p-8 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#2D1B69]/10 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-[#2D1B69]" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Contract Review</div>
                      <div className="text-sm text-gray-500">2024 Honda Accord EX-L</div>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                    2 Items to Review
                  </span>
                </div>

                <div className="space-y-3">
                  {flaggedItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100 hover:border-gray-200 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {item.status === "success" ? (
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        ) : item.status === "review" ? (
                          <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                        ) : (
                          <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />
                        )}
                        <div>
                          <div className="font-medium text-gray-900 text-sm">{item.name}</div>
                          <div className="text-xs text-gray-500">{item.note}</div>
                        </div>
                      </div>
                      <span
                        className={`font-semibold text-sm ${
                          item.status === "success"
                            ? "text-green-600"
                            : item.status === "review"
                              ? "text-amber-600"
                              : "text-blue-600"
                        }`}
                      >
                        {item.amount}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 rounded-xl bg-blue-50 border border-blue-100">
                  <div className="flex items-center gap-2 text-blue-700 font-semibold">
                    <Info className="w-5 h-5 flex-shrink-0" />
                    Items Flagged for Your Review
                  </div>
                  <p className="text-sm text-blue-600 mt-1">
                    We've highlighted a few items you may want to discuss with the dealer
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50 border-y border-gray-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-[#2D1B69] mb-2">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-4 py-1 rounded-full bg-[#2D1B69]/10 text-[#2D1B69] text-sm font-semibold mb-4">
              How It Works
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-balance">Simple Contract Review</h2>
            <p className="text-lg text-gray-600 text-pretty">
              Contract Shield automatically reviews uploaded contract documents and compares them to your accepted
              offer.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7ED321] to-[#00D9FF] flex items-center justify-center mx-auto shadow-lg">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">1. Documents Uploaded</h3>
              <p className="text-gray-600 text-pretty">
                When the dealer uploads contract documents, our system automatically begins review.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00D9FF] to-[#0066FF] flex items-center justify-center mx-auto shadow-lg">
                <FileSearch className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">2. Comparison Run</h3>
              <p className="text-gray-600 text-pretty">
                We compare contract details against your accepted offer and typical fee ranges for your area.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0066FF] to-[#2D1B69] flex items-center justify-center mx-auto shadow-lg">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">3. Review Summary</h3>
              <p className="text-gray-600 text-pretty">
                You receive a summary highlighting any items that may be worth discussing with the dealer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-4 py-1 rounded-full bg-[#7ED321]/10 text-[#7ED321] text-sm font-semibold mb-4">
              Features
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-balance">What We Review</h2>
            <p className="text-lg text-gray-600 text-pretty">
              Contract Shield compares several aspects of your purchase agreement to help you ask informed questions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg hover:border-[#2D1B69]/20 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-[#2D1B69]/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-[#2D1B69]" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-pretty">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Prominent Disclaimer Section */}
      <section className="py-16 bg-white border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-gray-600" />
                Important Information
              </h3>
              <div className="text-sm text-gray-600 space-y-3 leading-relaxed">
                <p>
                  <strong>Contract Shield is an informational tool only.</strong> It does not provide legal, tax, or
                  financial advice. It is designed to help you identify potential discrepancies for discussion with your
                  dealer.
                </p>
                <p>
                  Contract Shield may not detect every issue. The tool compares data based on what we have available and
                  typical reference information. It cannot guarantee accuracy or completeness.
                </p>
                <p>
                  <strong>You are responsible for reviewing and understanding your contract before signing.</strong> If
                  you have questions about your rights or obligations, consider speaking with a qualified attorney or
                  professional.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#2D1B69] via-[#3d2066] to-[#2D1B69] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-64 h-64 bg-[#7ED321] rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#00D9FF] rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-balance">Review Your Contract Before Signing</h2>
            <p className="text-xl text-white/80 text-pretty">
              Contract Shield is included with every AutoLenis purchase to help you review your contract details.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/signup"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-gradient-to-r from-[#7ED321] to-[#00D9FF] text-[#2D1B69] font-semibold text-lg hover:opacity-90 transition-opacity shadow-xl hover:shadow-2xl"
              >
                Get Started
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

      <PublicFooter />
    </div>
  )
}
