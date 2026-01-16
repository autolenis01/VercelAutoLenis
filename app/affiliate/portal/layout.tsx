import type React from "react"
import { redirect } from "next/navigation"
import { getSessionUser } from "@/lib/auth-server"
import { AffiliateLayoutClient } from "./layout-client"

export default async function AffiliatePortalLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser()

  if (!user) {
    redirect("/affiliate?signin=required")
  }

  const isAffiliate =
    user.role === "AFFILIATE" || user.role === "AFFILIATE_ONLY" || (user.role === "BUYER" && user.is_affiliate === true)

  if (!isAffiliate) {
    redirect("/affiliate?signin=required")
  }

  const isBuyerAffiliate = user.role === "BUYER" && user.is_affiliate === true

  const nav = [
    { href: "/affiliate/portal/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
    { href: "/affiliate/portal/link", label: "My Referral Link", icon: "LinkIcon" },
    { href: "/affiliate/portal/income-calculator", label: "Income Calculator", icon: "Calculator" },
    { href: "/affiliate/portal/analytics", label: "Analytics", icon: "TrendingUp" },
    { href: "/affiliate/portal/referrals", label: "Referrals List", icon: "Users" },
    { href: "/affiliate/portal/commissions", label: "Commissions & Earnings", icon: "DollarSign" },
    { href: "/affiliate/portal/payouts", label: "Payout Settings", icon: "CreditCard" },
    { href: "/affiliate/portal/assets", label: "Promo Assets", icon: "ImageIcon" },
    { href: "/affiliate/portal/settings", label: "Account & Settings", icon: "Settings" },
  ]

  return (
    <AffiliateLayoutClient nav={nav} userEmail={user.email} isBuyerAffiliate={isBuyerAffiliate}>
      {children}
    </AffiliateLayoutClient>
  )
}
