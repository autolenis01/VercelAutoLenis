"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FAQPage() {
  const faqs = [
    {
      category: "Getting Started",
      questions: [
        {
          q: "How does AutoLenis work?",
          a: "AutoLenis uses a silent reverse auction to help you get the best price on your next vehicle. Complete a quick pre-qualification, search our inventory, create a shortlist, and let dealers compete for your business.",
        },
        {
          q: "Is there a fee to use AutoLenis?",
          a: "There is a $99 refundable deposit to start your auction. Our concierge service fee ($499 for vehicles under $35k, $750 for vehicles over $35k) is only charged when you complete a deal. You can pay directly or include it in your financing.",
        },
        {
          q: "How long does the process take?",
          a: "Most buyers complete the entire process in 5-7 days. Pre-qualification takes minutes, auctions run for 24-48 hours, and contract finalization typically takes 2-3 days.",
        },
      ],
    },
    {
      category: "Pre-Qualification",
      questions: [
        {
          q: "Does pre-qualification affect my credit score?",
          a: "No. We use a soft credit pull which does not impact your credit score. Only when you finalize financing will a hard inquiry occur.",
        },
        {
          q: "What information do I need for pre-qualification?",
          a: "You'll need basic personal information, employment details, income verification, and consent for a soft credit check.",
        },
        {
          q: "How long is my pre-qualification valid?",
          a: "Pre-qualifications are typically valid for 30 days. After that, you may need to resubmit to get updated approval amounts.",
        },
      ],
    },
    {
      category: "Auctions",
      questions: [
        {
          q: "How does the reverse auction work?",
          a: "After you shortlist vehicles, we invite verified dealers to submit their best offers. Dealers compete to win your business, driving prices down. You see the results and choose the best deal.",
        },
        {
          q: "Can dealers see each other's bids?",
          a: "No. Our silent auction ensures dealers cannot see competing offers, encouraging them to submit their most competitive pricing.",
        },
        {
          q: "What if no dealers submit offers?",
          a: "If you receive no offers, your $99 deposit is automatically refunded. We'll work with you to adjust your search criteria or budget.",
        },
      ],
    },
    {
      category: "Pricing & Fees",
      questions: [
        {
          q: "What is included in the concierge service fee?",
          a: "Our fee covers expert guidance through the entire process, auction management, Contract Shield protection, insurance coordination, e-signature handling, and pickup scheduling.",
        },
        {
          q: "Can I include the fee in my loan?",
          a: "Yes. You can choose to include the AutoLenis fee in your financing. We'll show you exactly how it affects your monthly payment before you decide.",
        },
        {
          q: "Are there any hidden fees?",
          a: "No. Our Contract Shield technology scans all dealer contracts to ensure no hidden or junk fees are added. What dealers quote is what you pay.",
        },
      ],
    },
    {
      category: "Contract Shield",
      questions: [
        {
          q: "What is Contract Shield?",
          a: "Contract Shield is an automated review tool that compares your contract documents to your accepted offer and typical fee ranges for your area. It helps identify items that may be worth reviewing with the dealer before you sign. It does not provide legal, tax, or financial advice.",
        },
        {
          q: "What happens if Contract Shield flags something?",
          a: "If Contract Shield flags an item, it means there may be a difference from your accepted offer or the fee appears outside typical ranges for your area. The dealer will have an opportunity to clarify or correct the item. You should review flagged items carefully and discuss any questions with the dealer.",
        },
        {
          q: "Does Contract Shield guarantee my contract is correct?",
          a: "No. Contract Shield is an informational tool designed to help you identify potential discrepancies. It may not detect every issue. You are responsible for reviewing and understanding your contract before signing. If you have questions, consider speaking with a qualified professional.",
        },
      ],
    },
    {
      category: "Financing",
      questions: [
        {
          q: "Can I use my own financing?",
          a: "Yes. If you have pre-approval from your bank or credit union, you can upload that documentation and use external financing.",
        },
        {
          q: "What lenders does AutoLenis work with?",
          a: "We partner with major automotive lenders to offer competitive financing options. Specific lenders vary based on your credit profile and the vehicle.",
        },
      ],
    },
    {
      category: "Pickup & Delivery",
      questions: [
        {
          q: "How do I get my vehicle?",
          a: "You'll schedule a pickup appointment at the dealership. Use your unique QR code when you arrive to complete the delivery process.",
        },
        {
          q: "Does AutoLenis offer home delivery?",
          a: "Currently, all pickups occur at the dealership. We're working on home delivery options for future releases.",
        },
      ],
    },
    {
      category: "For Dealers",
      questions: [
        {
          q: "How do dealers join AutoLenis?",
          a: "Dealers complete an application, undergo verification, and agree to our integrity standards. Approved dealers gain access to our auction platform.",
        },
        {
          q: "What are the benefits for dealers?",
          a: "Dealers get access to pre-qualified buyers, reduced advertising costs, faster sales cycles, and automated compliance through Contract Shield.",
        },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/images/auto-20lenis.png" alt="AutoLenis" width={40} height={40} className="rounded-lg" />
              <span className="text-xl font-semibold text-foreground">AutoLenis</span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Link
                href="/how-it-works"
                className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
              >
                How It Works
              </Link>
              <Link
                href="/pricing"
                className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="/dealer-application"
                className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
              >
                For Dealers
              </Link>
              <Link
                href="/contact"
                className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
              >
                Contact
              </Link>
              <Link
                href="/affiliate"
                className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
              >
                Affiliate Program
              </Link>
              <Link
                href="/auth/signin"
                className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="px-4 py-2 rounded-lg bg-brand-purple text-white text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-[#2D1B69] text-white overflow-hidden">
        <div className="container mx-auto px-4 py-16 md:py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-balance">
              Frequently Asked{" "}
              <span className="bg-gradient-to-r from-[#7ED321] via-[#00D9FF] to-[#0066FF] bg-clip-text text-transparent">
                Questions
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 text-balance max-w-2xl mx-auto">
              Find answers to common questions about AutoLenis, our process, and how we help you get the best deal on
              your next vehicle.
            </p>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
            preserveAspectRatio="none"
          >
            <path
              d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z"
              fill="hsl(var(--background))"
            />
          </svg>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          {faqs.map((category, idx) => (
            <div key={idx} className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-brand-purple">{category.category}</h2>
              <Accordion type="single" collapsible className="space-y-4">
                {category.questions.map((faq, qIdx) => (
                  <AccordionItem key={qIdx} value={`${idx}-${qIdx}`} className="border rounded-lg px-6 bg-card">
                    <AccordionTrigger className="text-left font-semibold hover:text-brand-purple">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#2D1B69] via-[#0066FF] to-[#00D9FF] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">Still have questions?</h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto text-balance">
            Our team is here to help. Reach out and we'll get back to you within 24 hours.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-[#2D1B69] font-semibold text-lg hover:bg-white/90 transition-colors"
          >
            Contact Us
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Image src="/images/auto-20lenis.png" alt="AutoLenis" width={32} height={32} className="rounded-lg" />
                <span className="text-lg font-semibold">AutoLenis</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Revolutionizing car buying with transparency and technology.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/how-it-works" className="hover:text-foreground transition-colors">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-foreground transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/buyer/onboarding" className="hover:text-foreground transition-colors">
                    Get Started
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Partners</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/dealer-application" className="hover:text-foreground transition-colors">
                    Become a Dealer
                  </Link>
                </li>
                <li>
                  <Link href="/affiliate" className="hover:text-foreground transition-colors">
                    Affiliate Program
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/faq" className="hover:text-foreground transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-foreground transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/legal/terms" className="hover:text-foreground transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/legal/privacy" className="hover:text-foreground transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© 2025 AutoLenis. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/legal/terms" className="hover:text-foreground transition-colors">
                Terms
              </Link>
              <Link href="/legal/privacy" className="hover:text-foreground transition-colors">
                Privacy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
