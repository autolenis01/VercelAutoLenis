import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"

export default function PrivacyPage() {
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
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
        <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">Last updated: January 2024</p>

        <div className="prose prose-purple max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">
              AutoLenis ("we," "our," or "us") respects your privacy and is committed to protecting your personal
              information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information
              when you use our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. Information We Collect</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">2.1 Personal Information</h3>
                <p className="text-muted-foreground leading-relaxed mb-2">
                  We collect information that you provide directly to us, including:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                  <li>Name, email address, phone number</li>
                  <li>Mailing address</li>
                  <li>Date of birth</li>
                  <li>Social Security number (for credit checks)</li>
                  <li>Employment and income information</li>
                  <li>Driver's license information</li>
                  <li>Payment information</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">2.2 Credit Information</h3>
                <p className="text-muted-foreground leading-relaxed">
                  With your consent, we obtain credit reports and credit scores from credit bureaus for
                  pre-qualification purposes.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">2.3 Usage Information</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We automatically collect information about how you use our service, including IP address, browser
                  type, pages visited, and time spent on pages.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">2.4 Vehicle Preferences</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We collect information about your vehicle preferences, search history, and shortlisted vehicles.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. How We Use Your Information</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">We use your information to:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Provide and improve our services</li>
              <li>Process pre-qualification requests and credit checks</li>
              <li>Facilitate auctions and connect you with dealers</li>
              <li>Process payments and refunds</li>
              <li>Verify contracts through Contract Shield</li>
              <li>Coordinate insurance and e-signature services</li>
              <li>Schedule vehicle pickup</li>
              <li>Send service-related notifications</li>
              <li>Detect and prevent fraud</li>
              <li>Comply with legal obligations</li>
              <li>Analyze usage and improve our platform</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. How We Share Your Information</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">4.1 With Dealers</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We share limited information with dealers participating in your auction, including your vehicle
                  preferences and pre-qualified budget range. We do not share your full credit report with dealers.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">4.2 With Service Providers</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We share information with third-party service providers who perform services on our behalf, including
                  credit bureaus, payment processors, insurance providers, and e-signature services.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">4.3 With Lenders</h3>
                <p className="text-muted-foreground leading-relaxed">
                  If you choose to finance your vehicle through our partner lenders, we share necessary information to
                  process your loan application.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">4.4 For Legal Reasons</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We may disclose your information if required by law, court order, or governmental request, or to
                  protect our rights and safety.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">4.5 With Affiliates</h3>
                <p className="text-muted-foreground leading-relaxed">
                  If you were referred by an affiliate, we share limited information necessary to calculate and pay
                  commissions.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Credit Reporting</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use soft credit inquiries for pre-qualification, which do not affect your credit score. If you proceed
              with financing, the lender will perform a hard credit inquiry, which may impact your credit score.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Data Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              We implement industry-standard security measures to protect your information, including encryption, secure
              servers, and access controls. However, no method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">7. Data Retention</h2>
            <p className="text-muted-foreground leading-relaxed">
              We retain your information for as long as necessary to provide our services and comply with legal
              obligations. You may request deletion of your account and data at any time, subject to legal retention
              requirements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">8. Your Rights and Choices</h2>
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed mb-2">You have the right to:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Access and review your personal information</li>
                <li>Request corrections to inaccurate information</li>
                <li>Request deletion of your account and data</li>
                <li>Opt out of marketing communications</li>
                <li>Withdraw consent for credit checks</li>
                <li>Export your data in a portable format</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                To exercise these rights, contact us at info@autolenis.com
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">9. Cookies and Tracking</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use cookies and similar tracking technologies to improve your experience, analyze usage, and serve
              personalized content. You can control cookies through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">10. Third-Party Links</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our service may contain links to third-party websites. We are not responsible for the privacy practices of
              these external sites.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">11. Children's Privacy</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our service is not intended for individuals under 18 years of age. We do not knowingly collect information
              from children.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">12. California Privacy Rights</h2>
            <p className="text-muted-foreground leading-relaxed">
              California residents have additional rights under the California Consumer Privacy Act (CCPA), including
              the right to know what personal information we collect and the right to opt out of the sale of personal
              information. We may sell or share your personal information for business purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">13. Changes to This Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of material changes by posting the
              updated policy on our website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">14. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              For questions about this Privacy Policy or our data practices, contact us at:
            </p>
            <div className="mt-4 text-muted-foreground">
              <p>AutoLenis Privacy Team</p>
              <p>Email: info@autolenis.com</p>
              <p>Phone: 1-800-AUTO-LENS</p>
            </div>
          </section>
        </div>
      </div>

      <footer className="bg-muted py-12 border-t border-border mt-16">
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
