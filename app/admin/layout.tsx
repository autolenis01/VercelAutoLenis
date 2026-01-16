import type React from "react"
import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { getSessionUser } from "@/lib/auth-server"
import { AdminLayoutClient } from "./layout-client"

const adminPublicRoutes = [
  "/admin/sign-in",
  "/admin/signup",
  "/admin/login",
  "/admin/mfa/enroll",
  "/admin/mfa/challenge",
]

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersList = await headers()
  const pathname = headersList.get("x-pathname") || ""

  // Check if current route is public
  const isPublicRoute = adminPublicRoutes.some((route) => pathname === route || pathname.startsWith(route + "/"))

  if (isPublicRoute) {
    return <>{children}</>
  }

  const user = await getSessionUser()

  if (!user || !["ADMIN", "SUPER_ADMIN"].includes(user.role)) {
    redirect("/admin/sign-in")
  }

  const nav = [
    { href: "/admin/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
    { href: "/admin/buyers", label: "Buyers", icon: "Users" },
    { href: "/admin/dealers", label: "Dealers & Inventory", icon: "Building2" },
    { href: "/admin/auctions", label: "Auctions & Offers", icon: "Gavel" },
    { href: "/admin/trade-ins", label: "Trade-Ins", icon: "Car" },
    { href: "/admin/deals", label: "Deals", icon: "Handshake" },
    { href: "/admin/refinance", label: "Refinance", icon: "RefreshCcw" },
    { href: "/admin/payments", label: "Payments & Refunds", icon: "DollarSign" },
    { href: "/admin/affiliates", label: "Affiliate & Payouts", icon: "Users" },
    { href: "/admin/insurance", label: "Insurance & Coverage", icon: "Heart" },
    { href: "/admin/contracts", label: "Contract Shield & Docs", icon: "ShieldCheck" },
    { href: "/admin/compliance", label: "Compliance & Logs", icon: "FileWarning" },
    { href: "/admin/seo", label: "SEO & Content", icon: "Search" },
    { href: "/admin/settings", label: "System Settings", icon: "Settings" },
    { href: "/admin/support", label: "Support Tools", icon: "HeadphonesIcon" },
  ]

  return (
    <AdminLayoutClient nav={nav} userEmail={user.email}>
      {children}
    </AdminLayoutClient>
  )
}
