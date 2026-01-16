"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  LinkIcon,
  TrendingUp,
  Users,
  DollarSign,
  CreditCard,
  ImageIcon,
  Settings,
  LogOut,
  Car,
  Menu,
  X,
  Calculator,
} from "lucide-react"
import { cn } from "@/lib/utils"

const iconMap: Record<string, any> = {
  LayoutDashboard,
  LinkIcon,
  TrendingUp,
  Users,
  DollarSign,
  CreditCard,
  ImageIcon,
  Settings,
  Calculator,
}

interface NavItem {
  href: string
  label: string
  icon: string
}

export function AffiliateLayoutClient({
  children,
  nav,
  userEmail,
  isBuyerAffiliate,
}: {
  children: React.ReactNode
  nav: NavItem[]
  userEmail: string
  isBuyerAffiliate: boolean
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

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

  const isActive = (href: string) => {
    if (href === "/affiliate/portal/dashboard") {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-[#2D1B69] text-white" role="banner">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 -ml-2 hover:bg-white/10 rounded-lg touch-target focus-ring"
                aria-label="Open navigation menu"
                aria-expanded={mobileMenuOpen}
              >
                <Menu className="h-6 w-6" aria-hidden="true" />
              </button>
              <Link
                href="/affiliate/portal/dashboard"
                className="flex items-center gap-2 sm:gap-3 focus-ring rounded-lg"
              >
                <Users className="h-7 w-7 sm:h-8 sm:w-8" aria-hidden="true" />
                <span className="text-lg sm:text-xl font-bold hidden sm:inline">AutoLenis Affiliate</span>
                <span className="text-lg font-bold sm:hidden">Affiliates</span>
              </Link>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              {isBuyerAffiliate && (
                <Link
                  href="/buyer/dashboard"
                  className="hidden sm:flex items-center gap-2 text-xs sm:text-sm text-white/80 hover:text-white px-2 sm:px-3 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition-colors focus-ring"
                >
                  <Car className="h-4 w-4" aria-hidden="true" />
                  <span className="hidden md:inline">Buyer Dashboard</span>
                  <span className="md:hidden">Buyer</span>
                </Link>
              )}
              <span
                className="text-xs sm:text-sm text-white/80 hidden md:inline truncate max-w-[150px] lg:max-w-[200px]"
                aria-label={`Logged in as ${userEmail}`}
              >
                {userEmail}
              </span>
              <form action="/api/auth/signout" method="POST">
                <button
                  className="flex items-center gap-2 text-sm text-white/80 hover:text-white p-2 hover:bg-white/10 rounded-lg touch-target focus-ring"
                  aria-label="Log out of your account"
                >
                  <LogOut className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                  <span className="hidden sm:inline">Log Out</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation menu">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="fixed left-0 top-0 bottom-0 w-full max-w-xs sm:max-w-sm bg-background shadow-xl overflow-y-auto safe-bottom">
            <div className="sticky top-0 p-4 border-b flex items-center justify-between bg-[#2D1B69] text-white">
              <span className="font-semibold">Menu</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg touch-target focus-ring"
                aria-label="Close navigation menu"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            {isBuyerAffiliate && (
              <div className="p-3 border-b">
                <Link
                  href="/buyer/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 text-sm bg-[#2D1B69]/10 text-[#2D1B69] rounded-lg touch-target focus-ring"
                >
                  <Car className="h-5 w-5" aria-hidden="true" />
                  <span>Switch to Buyer Dashboard</span>
                </Link>
              </div>
            )}
            <nav className="p-3 sm:p-4 space-y-1" aria-label="Main navigation">
              {nav.map((item) => {
                const Icon = iconMap[item.icon] || LayoutDashboard
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors touch-target focus-ring",
                      active
                        ? "bg-[#2D1B69]/10 text-[#2D1B69] font-medium"
                        : "hover:bg-muted text-foreground hover:text-foreground",
                    )}
                  >
                    <Icon className={cn("h-5 w-5 flex-shrink-0", active ? "text-[#2D1B69]" : "")} aria-hidden="true" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-4 sm:py-6 lg:py-8">
        <div className="flex gap-6 lg:gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0" role="navigation" aria-label="Main navigation">
            <nav className="space-y-1 sticky top-24">
              {nav.map((item) => {
                const Icon = iconMap[item.icon] || LayoutDashboard
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors focus-ring",
                      active
                        ? "bg-[#2D1B69]/10 text-[#2D1B69] font-medium"
                        : "hover:bg-muted text-foreground hover:text-foreground",
                    )}
                  >
                    <Icon className={cn("h-5 w-5 flex-shrink-0", active ? "text-[#2D1B69]" : "")} aria-hidden="true" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                )
              })}
            </nav>
          </aside>

          {/* Main Content */}
          <main id="main-content" className="flex-1 min-w-0" role="main">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
