import Image from "next/image"
import Link from "next/link"
import { Shield } from "lucide-react"

export function PublicFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-muted py-10 sm:py-12 lg:py-16 border-t border-border" role="contentinfo">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 mb-8 lg:mb-12">
          {/* Brand Section */}
          <div className="col-span-2 sm:col-span-2 md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 sm:gap-3 mb-4 focus-ring rounded-lg">
              <Image
                src="/images/auto-20lenis.png"
                alt=""
                width={32}
                height={32}
                className="rounded-lg w-7 h-7 sm:w-8 sm:h-8"
              />
              <span className="text-base sm:text-lg font-semibold">AutoLenis</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              Your trusted automotive concierge platform connecting buyers with lenders and dealers.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Product</h3>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <Link href="/how-it-works" className="hover:text-foreground transition-colors focus-ring rounded">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/insurance" className="hover:text-foreground transition-colors focus-ring rounded">
                  Insurance
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-foreground transition-colors focus-ring rounded">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/buyer/onboarding" className="hover:text-foreground transition-colors focus-ring rounded">
                  Get Started
                </Link>
              </li>
              <li>
                <Link href="/dealer-application" className="hover:text-foreground transition-colors focus-ring rounded">
                  For Dealers
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Company</h3>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-foreground transition-colors focus-ring rounded">
                  About
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-foreground transition-colors focus-ring rounded">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-foreground transition-colors focus-ring rounded">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/affiliate" className="hover:text-foreground transition-colors focus-ring rounded">
                  Partner Program
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Legal</h3>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <Link href="/privacy" className="hover:text-foreground transition-colors focus-ring rounded">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-foreground transition-colors focus-ring rounded">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/legal/dealer-terms" className="hover:text-foreground transition-colors focus-ring rounded">
                  Dealer Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 sm:pt-8 border-t border-border">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs sm:text-sm text-muted-foreground order-2 sm:order-1">
              &copy; {currentYear} AutoLenis. All rights reserved.
            </p>

            {/* Admin Access */}
            <div className="flex items-center gap-4 sm:gap-6 order-1 sm:order-2">
              <Link
                href="/admin/sign-in"
                className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors focus-ring rounded"
              >
                <Shield className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Admin Sign In</span>
              </Link>
              <Link
                href="/admin/signup"
                className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors focus-ring rounded"
              >
                <Shield className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Admin Sign Up</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
