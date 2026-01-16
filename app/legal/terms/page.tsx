import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
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
                href="/faq"
                className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
              >
                FAQ
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

      <section className="relative bg-[#2D1B69] text-white overflow-hidden">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
          <p className="text-white/70">Last updated: January 2024</p>
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

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="prose prose-lg max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing or using AutoLenis ("Service"), you agree to be bound by these Terms of Service ("Terms"). If
              you do not agree to these Terms, do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. Description of Service</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              AutoLenis is a vehicle purchasing platform that connects buyers with dealers through a reverse auction
              system. Our services include:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Pre-qualification and credit assessment</li>
              <li>Vehicle search and shortlisting</li>
              <li>Silent reverse auction management</li>
              <li>Contract Shield review and verification</li>
              <li>Insurance coordination</li>
              <li>E-signature services</li>
              <li>Pickup scheduling and coordination</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. User Accounts</h2>
            <p className="text-muted-foreground leading-relaxed">
              You must create an account to use certain features of the Service. You are responsible for maintaining the
              confidentiality of your account credentials and for all activities under your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Fees and Payments</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">4.1 Deposit</h3>
                <p className="text-muted-foreground leading-relaxed">
                  A $99 refundable deposit is required to initiate an auction. This deposit will be refunded if no
                  dealer offers are received.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">4.2 Concierge Service Fee</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our concierge service fee is $499 for vehicles with an out-the-door (OTD) price under $35,000, and
                  $750 for vehicles $35,000 and over. The deposit is credited toward this fee. You may pay this fee
                  directly or include it in your financing.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">4.3 Payment Processing</h3>
                <p className="text-muted-foreground leading-relaxed">
                  All payments are processed securely through our payment processor. By providing payment information,
                  you authorize us to charge the applicable fees.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Pre-Qualification and Credit Checks</h2>
            <p className="text-muted-foreground leading-relaxed">
              By consenting to pre-qualification, you authorize AutoLenis to perform a soft credit inquiry. Soft
              inquiries do not affect your credit score. Final financing will require a hard credit inquiry from the
              lender.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Auctions</h2>
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                AutoLenis facilitates reverse auctions where dealers submit offers for vehicles on your shortlist.
                Auctions are silent, meaning dealers cannot see competing offers.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                You are not obligated to accept any offer. If you choose to proceed with a dealer offer, you will enter
                into a purchase agreement directly with that dealer.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">7. Contract Shield</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Contract Shield is an automated review feature that compares contract documents against your accepted
              offer and basic reference data. It is designed to help identify potential discrepancies for your review.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              <strong>Contract Shield does not:</strong>
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
              <li>Provide legal, tax, or financial advice</li>
              <li>Guarantee that your contract is correct, complete, or enforceable</li>
              <li>Replace the need for you to carefully review all documents</li>
              <li>Guarantee detection of every possible issue or discrepancy</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed">
              Any flags or messages provided by Contract Shield are for informational purposes only. You are responsible
              for reviewing and understanding your contract before signing. If you have questions about your rights or
              obligations, consider speaking with a qualified attorney or other professional.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">8. Dealer Relationships</h2>
            <p className="text-muted-foreground leading-relaxed">
              AutoLenis is not a dealer and does not sell vehicles. We connect you with independent dealers. Your
              vehicle purchase agreement is directly with the dealer, not AutoLenis.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">9. Affiliate Program</h2>
            <p className="text-muted-foreground leading-relaxed">
              Participants in our affiliate program must comply with our affiliate terms and conditions. Commissions are
              paid only on completed deals where our concierge service fee has been received.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">10. Communications, Marketing, and Third-Party Partners</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              AutoLenis may communicate with you through email, SMS, or other means to provide updates, marketing
              offers, or information related to third-party partners. You agree to receive such communications and
              authorize AutoLenis to use your contact information for these purposes.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              You may opt-out of marketing communications at any time by following the instructions provided in the
              communications or by contacting us directly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">11. Prohibited Conduct</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">You agree not to:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Provide false or misleading information</li>
              <li>Impersonate any person or entity</li>
              <li>Attempt to manipulate auction results</li>
              <li>Use the Service for any illegal purpose</li>
              <li>Interfere with the operation of the Service</li>
              <li>Attempt to gain unauthorized access to systems or accounts</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">12. Intellectual Property</h2>
            <p className="text-muted-foreground leading-relaxed">
              All content, features, and functionality of the Service are owned by AutoLenis and are protected by
              copyright, trademark, and other intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">13. Disclaimer of Warranties</h2>
            <p className="text-muted-foreground leading-relaxed">
              THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. AUTOLENIS DISCLAIMS ALL WARRANTIES,
              EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND
              NON-INFRINGEMENT.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">14. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, AUTOLENIS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
              SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF YOUR USE OF THE SERVICE.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">15. Indemnification</h2>
            <p className="text-muted-foreground leading-relaxed">
              You agree to indemnify and hold harmless AutoLenis from any claims, damages, or expenses arising from your
              use of the Service or violation of these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">16. Termination</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may terminate or suspend your account at any time for violation of these Terms. You may terminate your
              account by contacting us.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">17. Changes to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to modify these Terms at any time. Continued use of the Service after changes
              constitutes acceptance of the modified Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">18. Governing Law</h2>
            <p className="text-muted-foreground leading-relaxed">
              These Terms are governed by the laws of the State of Delaware, without regard to conflict of law
              principles.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">19. Contact Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              For questions about these Terms, contact us at info@autolenis.com
            </p>
          </section>
        </div>
      </div>

      <footer className="bg-muted py-12 border-t border-border mt-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold mb-4">AutoLenis</h3>
              <p className="text-sm">Smart car buying powered by reverse auctions.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/legal/terms" className="hover:text-white">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/legal/privacy" className="hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/legal/dealer-terms" className="hover:text-white">
                    Dealer Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-sm text-center">
            © 2025 AutoLenis. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
