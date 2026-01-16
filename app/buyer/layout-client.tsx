"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, usePathname } from "next/navigation"
import {
  LayoutDashboard,
  CheckCircle2,
  Search,
  Heart,
  Gavel,
  FileText,
  Users2,
  Settings,
  ChevronDown,
  ChevronRight,
  LogOut,
  Menu,
  X,
  Car,
  Shield,
  Home,
} from "lucide-react"
import { cn } from "@/lib/utils"

const iconMap: Record<string, any> = {
  LayoutDashboard,
  CheckCircle2,
  Search,
  Heart,
  Gavel,
  FileText,
  Users2,
  Settings,
  Car,
  Shield,
  Home,
}

interface NavItem {
  href: string
  label: string
  icon: string
  subItems?: Array<{ href: string; label: string }>
}

export function BuyerLayoutClient({
  children,
  nav,
  userEmail,
}: {
  children: React.ReactNode
  nav: NavItem[]
  userEmail: string
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const router = useRouter()
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

  useEffect(() => {
    nav.forEach((item) => {
      if (item.subItems) {
        const isSubItemActive = item.subItems.some((sub) => pathname === sub.href)
        if (isSubItemActive && !expandedItems.includes(item.href)) {
          setExpandedItems((prev) => [...prev, item.href])
        }
      }
    })
  }, [pathname, nav])

  const handleLogout = async () => {
    if (isLoggingOut) return

    setIsLoggingOut(true)
    try {
      const response = await fetch("/api/auth/signout", {
        method: "POST",
        credentials: "include",
      })

      if (response.ok) {
        await new Promise((resolve) => setTimeout(resolve, 100))
        window.location.href = "/"
      } else {
        setIsLoggingOut(false)
      }
    } catch (error) {
      setIsLoggingOut(false)
    }
  }

  const isActive = (href: string) => {
    if (href === "/buyer/dashboard") {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  const toggleExpand = (href: string) => {
    setExpandedItems((prev) => (prev.includes(href) ? prev.filter((h) => h !== href) : [...prev, href]))
  }

  const NavItemComponent = ({ item, mobile = false }: { item: NavItem; mobile?: boolean }) => {
    const Icon = iconMap[item.icon] || LayoutDashboard
    const active = isActive(item.href)
    const hasSubItems = item.subItems && item.subItems.length > 0
    const isExpanded = expandedItems.includes(item.href)

    return (
      <div>
        <div className="flex items-center">
          <Link
            href={item.href}
            onClick={() => mobile && !hasSubItems && setMobileMenuOpen(false)}
            className={cn(
              "flex-1 flex items-center gap-3 px-4 py-3 rounded-lg transition-colors focus-ring",
              mobile ? "touch-target" : "",
              active
                ? "bg-[#2D1B69]/10 text-[#2D1B69] font-medium"
                : "hover:bg-muted text-foreground hover:text-foreground",
            )}
          >
            <Icon className={cn("h-5 w-5 flex-shrink-0", active ? "text-[#2D1B69]" : "")} aria-hidden="true" />
            <span className="truncate">{item.label}</span>
          </Link>
          {hasSubItems && (
            <button
              onClick={() => toggleExpand(item.href)}
              className={cn("p-2 rounded-lg hover:bg-muted transition-colors focus-ring", mobile ? "touch-target" : "")}
              aria-expanded={isExpanded}
              aria-label={isExpanded ? "Collapse submenu" : "Expand submenu"}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
              ) : (
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          )}
        </div>
        {hasSubItems && isExpanded && (
          <div className="ml-8 mt-1 space-y-1">
            {item.subItems!.map((subItem) => (
              <Link
                key={subItem.href}
                href={subItem.href}
                onClick={() => mobile && setMobileMenuOpen(false)}
                className={cn(
                  "block px-4 py-2.5 text-sm rounded-lg transition-colors focus-ring",
                  mobile ? "touch-target" : "",
                  pathname === subItem.href
                    ? "bg-[#2D1B69]/10 text-[#2D1B69] font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted",
                )}
              >
                {subItem.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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
              <Link href="/buyer/dashboard" className="flex items-center gap-2 sm:gap-3 focus-ring rounded-lg">
                <Image
                  src="/images/auto-20lenis.png"
                  alt=""
                  width={40}
                  height={40}
                  className="w-8 h-8 sm:w-10 sm:h-10"
                  priority
                />
                <span className="text-lg sm:text-xl font-bold hidden sm:inline">AutoLenis</span>
              </Link>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <span
                className="text-xs sm:text-sm text-white/80 hidden md:inline truncate max-w-[150px] lg:max-w-[200px]"
                aria-label={`Logged in as ${userEmail}`}
              >
                {userEmail}
              </span>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center gap-2 text-sm text-white/80 hover:text-white p-2 hover:bg-white/10 rounded-lg touch-target disabled:opacity-50 disabled:cursor-not-allowed focus-ring"
                aria-label="Log out of your account"
              >
                <LogOut className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                <span className="hidden sm:inline">{isLoggingOut ? "Logging out..." : "Log Out"}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
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
            <nav className="p-3 sm:p-4 space-y-1" aria-label="Main navigation">
              {nav.map((item) => (
                <NavItemComponent key={item.href} item={item} mobile />
              ))}
            </nav>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-4 sm:py-6 lg:py-8">
        <div className="flex gap-6 lg:gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0" role="navigation" aria-label="Main navigation">
            <nav className="space-y-1 sticky top-24">
              {nav.map((item) => (
                <NavItemComponent key={item.href} item={item} />
              ))}
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
