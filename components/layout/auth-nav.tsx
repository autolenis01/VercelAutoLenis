"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { useState } from "react"

export function AuthNav({ showSignUp = false, showSignIn = false }: { showSignUp?: boolean; showSignIn?: boolean }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="border-b border-white/10 bg-[#3d2066]/95 backdrop-blur sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <Image src="/images/auto-20lenis.png" alt="AutoLenis" width={40} height={40} className="rounded-lg" />
            <span className="text-xl font-semibold text-white">AutoLenis</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/how-it-works" className="text-sm font-medium text-white/80 hover:text-white transition-colors">
              How It Works
            </Link>
            <Link href="/pricing" className="text-sm font-medium text-white/80 hover:text-white transition-colors">
              Pricing
            </Link>
            <Link
              href="/dealer-application"
              className="text-sm font-medium text-white/80 hover:text-white transition-colors"
            >
              For Dealers
            </Link>
            <Link href="/contact" className="text-sm font-medium text-white/80 hover:text-white transition-colors">
              Contact
            </Link>

            {showSignIn && (
              <Link
                href="/auth/signin"
                className="text-sm font-medium text-white/80 hover:text-white transition-colors"
              >
                Sign In
              </Link>
            )}

            {showSignUp && (
              <Link href="/auth/signup">
                <Button className="bg-gradient-to-r from-[#4ade80] to-[#22d3ee] text-[#3d2066] hover:opacity-90">
                  Get Started
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3 border-t border-white/10 pt-4">
            <Link
              href="/how-it-works"
              className="block text-sm font-medium text-white/80 hover:text-white transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="/pricing"
              className="block text-sm font-medium text-white/80 hover:text-white transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/dealer-application"
              className="block text-sm font-medium text-white/80 hover:text-white transition-colors"
            >
              For Dealers
            </Link>
            <Link
              href="/contact"
              className="block text-sm font-medium text-white/80 hover:text-white transition-colors"
            >
              Contact
            </Link>
            {showSignIn && (
              <Link
                href="/auth/signin"
                className="block text-sm font-medium text-white/80 hover:text-white transition-colors"
              >
                Sign In
              </Link>
            )}
            {showSignUp && (
              <Link href="/auth/signup" className="block">
                <Button className="w-full bg-gradient-to-r from-[#4ade80] to-[#22d3ee] text-[#3d2066] hover:opacity-90">
                  Get Started
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
