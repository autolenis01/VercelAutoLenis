import type React from "react"
import { redirect } from "next/navigation"
import { getSessionUser } from "@/lib/auth-server"
import { BuyerLayoutClient } from "./layout-client"

export default async function BuyerLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser()

  if (!user || user.role !== "BUYER") {
    redirect("/auth/signin")
  }

  const nav = [
    { href: "/buyer/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
    { href: "/buyer/prequal", label: "Pre-Qualification", icon: "CheckCircle2" },
    { href: "/buyer/search", label: "Search Vehicles", icon: "Search" },
    { href: "/buyer/shortlist", label: "Shortlist", icon: "Heart" },
    { href: "/buyer/trade-in", label: "Trade-In", icon: "Car" },
    { href: "/buyer/auction", label: "Auctions & Offers", icon: "Gavel" },
    {
      href: "/buyer/deal",
      label: "My Deal",
      icon: "FileText",
      subItems: [
        { href: "/buyer/deal", label: "Summary" },
        { href: "/buyer/deal/financing", label: "Financing" },
        { href: "/buyer/deal/fee", label: "Concierge Fee" },
        { href: "/buyer/deal/insurance", label: "Insurance" },
        { href: "/buyer/deal/contract", label: "Contract Shield" },
        { href: "/buyer/deal/esign", label: "E-Sign" },
        { href: "/buyer/deal/pickup", label: "Pickup & QR" },
      ],
    },
    { href: "/buyer/contracts", label: "Contracts", icon: "Shield" },
    { href: "/affiliate/portal/dashboard", label: "Referrals & Earnings", icon: "Users2" },
    { href: "/buyer/settings", label: "Settings", icon: "Settings" },
  ]

  return (
    <BuyerLayoutClient nav={nav} userEmail={user.email}>
      {children}
    </BuyerLayoutClient>
  )
}
