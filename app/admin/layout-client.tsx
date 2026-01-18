"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  Users,
  Building2,
  DollarSign,
  FileWarning,
  LayoutDashboard,
  Handshake,
  Settings,
  LogOut,
  Gavel,
  Heart,
  ShieldCheck,
  HeadphonesIcon,
  Search,
  Bell,
  Menu,
  X,
  Car,
  RefreshCcw,
} from "lucide-react"
import { Suspense } from "react"
import { cn } from "@/lib/utils"

const iconMap: Record<string, any> = {
  LayoutDashboard,
  Users,
  Building2,
  Gavel,
  Handshake,
  DollarSign,
  Heart,
  ShieldCheck,
  FileWarning,
  Settings,
  HeadphonesIcon,
  Search,
  Car,
  RefreshCcw,
}

interface NavItem {
  href: string
  label: string
  icon: string
}

export function AdminLayoutClient({
  children,
  nav,
  userEmail,
}: {
  children: React.ReactNode
  nav: NavItem[]
  userEmail: string
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
    if (href === "/admin/dashboard") {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-[#2D1B69] text-white" role="banner">
        <div className="px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 -ml-2 hover:bg-white/10 rounded-lg touch-target focus-ring"
                aria-label="Open navigation menu"
                aria-expanded={mobileMenuOpen}
              >
                <Menu className="h-6 w-6" aria-hidden="true" />
              </button>
              <Link href="/admin/dashboard" className="flex items-center gap-2 sm:gap-3 focus-ring rounded-lg">
                <Image
                  src="/images/auto-20lenis.png"
                  alt=""
                  width={40}
                  height={40}
                  className="w-8 h-8 sm:w-10 sm:h-10"
                  priority
                />
                <span className="text-lg sm:text-xl font-bold hidden sm:inline">Admin</span>
              </Link>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 lg:gap-6">
              {/* Quick Search - Hidden on small mobile */}
              <div className="relative hidden md:block">
                <label htmlFor="admin-quick-search" className="sr-only">
                  Quick search
                </label>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" aria-hidden="true" />
                <input
                  id="admin-quick-search"
                  type="text"
                  placeholder="Quick search..."
                  className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 w-40 lg:w-64"
                  aria-label="Search admin panel"
                />
              </div>
              {/* Notifications */}
              <button
                className="relative p-2 hover:bg-white/10 rounded-lg touch-target focus-ring"
                aria-label="View notifications"
              >
                <Bell className="h-5 w-5" aria-hidden="true" />
                <span
                  className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"
                  aria-label="You have unread notifications"
                />
              </button>
              {/* User Menu */}
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="text-right hidden lg:block">
                  <p className="text-sm font-medium truncate max-w-[120px]">{userEmail}</p>
                  <p className="text-xs text-white/60">Super Admin</p>
                </div>
                <button
                onClick={async () => {
                  try {
                    await fetch("/api/admin/auth/signout", { method: "POST", credentials: "include" })
                  } finally {
                    window.location.href = "/admin/sign-in"
                  }
                }}
                className="flex items-center gap-2 px-2 sm:px-3 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded-lg touch-target focus-ring"
                aria-label="Log out of admin account"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">Log Out</span>
              </button>
              </div>
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
          <div className="fixed left-0 top-0 bottom-0 w-full max-w-xs sm:max-w-sm bg-white shadow-xl overflow-y-auto safe-bottom">
            <div className="sticky top-0 p-4 border-b flex items-center justify-between bg-[#2D1B69] text-white">
              <span className="font-semibold">Admin Menu</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg touch-target focus-ring"
                aria-label="Close navigation menu"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            {/* Mobile search */}
            <div className="p-4 border-b md:hidden">
              <div className="relative">
                <label htmlFor="admin-mobile-search" className="sr-only">
                  Quick search
                </label>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" aria-hidden="true" />
                <input
                  id="admin-mobile-search"
                  type="text"
                  placeholder="Quick search..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2D1B69]/30"
                  aria-label="Search admin panel"
                />
              </div>
            </div>
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
                      "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm touch-target focus-ring",
                      active
                        ? "bg-[#2D1B69]/10 text-[#2D1B69] font-medium"
                        : "hover:bg-gray-100 text-gray-700 hover:text-[#2D1B69]",
                    )}
                  >
                    <Icon className={cn("h-5 w-5", active ? "text-[#2D1B69]" : "")} aria-hidden="true" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      )}

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside
          className="hidden lg:block w-64 min-h-[calc(100vh-57px)] bg-white border-r flex-shrink-0"
          role="navigation"
          aria-label="Main navigation"
        >
          <nav className="p-4 space-y-1 sticky top-[57px] max-h-[calc(100vh-57px)] overflow-y-auto">
            {nav.map((item) => {
              const Icon = iconMap[item.icon] || LayoutDashboard
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm focus-ring",
                    active
                      ? "bg-[#2D1B69]/10 text-[#2D1B69] font-medium"
                      : "hover:bg-gray-100 text-gray-700 hover:text-[#2D1B69]",
                  )}
                >
                  <Icon className={cn("h-5 w-5", active ? "text-[#2D1B69]" : "")} aria-hidden="true" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main id="main-content" className="flex-1 p-4 sm:p-6 min-w-0" role="main">
          <Suspense fallback={<div className="animate-pulse bg-muted h-32 rounded-lg" />}>{children}</Suspense>
        </main>
      </div>
    </div>
  )
}
