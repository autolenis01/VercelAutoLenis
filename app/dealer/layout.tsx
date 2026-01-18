import type React from "react"
import { redirect } from "next/navigation"
import { getSessionUser } from "@/lib/auth-server"
import { DealerLayoutClient } from "./layout-client"

export default async function DealerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getSessionUser()

  if (!user || !["DEALER", "DEALER_USER"].includes(user.role)) {
    redirect("/auth/signin")
  }

  const nav = [
    { href: "/dealer/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
    { href: "/dealer/leads", label: "Leads", icon: "Users" },
    { href: "/dealer/offers", label: "Offers", icon: "HandCoins" },
    { href: "/dealer/inventory", label: "Inventory", icon: "Package" },
    { href: "/dealer/auctions", label: "Auctions", icon: "Building2" },
    { href: "/dealer/auctions/invited", label: "Invited Auctions", icon: "Building2", indent: true },
    { href: "/dealer/auctions/offers", label: "Offers Submitted", icon: "FileText", indent: true },
    { href: "/dealer/contracts", label: "Contracts & Contract Shield", icon: "FileText" },
    { href: "/dealer/documents", label: "Documents", icon: "FileText" },
    { href: "/dealer/messages", label: "Messages", icon: "MessageSquare" },
    { href: "/dealer/pickups", label: "Pickups", icon: "Calendar" },
    { href: "/dealer/profile", label: "Dealer Profile", icon: "Building2" },
    { href: "/dealer/settings", label: "Dealer Settings", icon: "Settings" },
  ]

  return (
    <DealerLayoutClient nav={nav} userEmail={user.email}>
      {children}
    </DealerLayoutClient>
  )
}
