"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

export function PublicNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileMenuOpen])

  const navLinks = [
    { href: "/how-it-works", label: "How It Works" },
    { href: "/pricing", label: "Pricing" },
    { href: "/refinance", label: "Refinance" },
    { href: "/about", label: "About" },
    { href: "/contract-shield", label: "Contract Shield" },
    { href: "/contact", label: "Contact" },
    { href: "/affiliate", label: "Partner Program" },
    { href: "/dealer-application", label: "For Dealers" },
  ]

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/")

  return (
    <nav
      className={cn(
        "border-b border-border/40 sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-background/95 backdrop-blur-md shadow-lg supports-[backdrop-filter]:bg-background/90"
          : "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
      )}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 sm:gap-3 focus-ring rounded-lg transition-opacity hover:opacity-90"
          >
            <Image
              src="/images/auto-20lenis.png"
              alt="AutoLenis logo"
              width={36}
              height={36}
              className="rounded-lg w-9 h-9 sm:w-10 sm:h-10"
              priority
            />
            <span className="text-lg sm:text-xl font-bold text-foreground">AutoLenis</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 focus-ring whitespace-nowrap relative",
                  isActive(link.href)
                    ? "text-foreground bg-gradient-to-r from-[#7ED321]/10 to-[#00D9FF]/10 font-semibold"
                    : "text-foreground/70 hover:text-foreground hover:bg-muted/70",
                )}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-gradient-to-r from-[#7ED321] to-[#00D9FF] rounded-full" />
                )}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/auth/signin"
              className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors focus-ring rounded-lg"
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#7ED321] to-[#00D9FF] text-[#2D1B69] text-sm font-semibold hover:opacity-90 hover:scale-105 transition-all duration-200 focus-ring shadow-md hover:shadow-lg"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 -mr-2 touch-target flex items-center justify-center rounded-lg hover:bg-muted transition-colors focus-ring"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-foreground" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6 text-foreground" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          id="mobile-menu"
        >
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          <div className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-background shadow-2xl overflow-y-auto safe-bottom animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="sticky top-0 flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur-sm z-10">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 focus-ring rounded-lg"
              >
                <Image src="/images/auto-20lenis.png" alt="AutoLenis" width={32} height={32} className="rounded-lg" />
                <span className="font-bold">AutoLenis</span>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 hover:bg-muted rounded-lg transition-colors touch-target focus-ring"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="p-4" aria-label="Mobile navigation">
              <ul className="space-y-1">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center px-4 py-3.5 text-base font-medium rounded-lg transition-all duration-200 touch-target focus-ring",
                        isActive(link.href)
                          ? "text-foreground bg-gradient-to-r from-[#7ED321]/10 to-[#00D9FF]/10 font-semibold"
                          : "text-foreground/80 hover:text-foreground hover:bg-muted",
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-6 pt-6 border-t border-border space-y-3">
                <Link
                  href="/auth/signin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center px-4 py-3.5 text-base font-medium text-foreground/80 hover:text-foreground hover:bg-muted rounded-lg transition-all duration-200 touch-target focus-ring"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center px-4 py-3.5 rounded-lg bg-gradient-to-r from-[#7ED321] to-[#00D9FF] text-[#2D1B69] text-base font-semibold hover:opacity-90 transition-all duration-200 touch-target focus-ring shadow-lg"
                >
                  Get Started
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </nav>
  )
}
