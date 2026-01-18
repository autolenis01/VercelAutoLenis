export const dynamic = "force-dynamic"

import { redirect } from "next/navigation"
import { getSessionUser } from "@/lib/auth-server"
import { SEODashboard } from "./seo-dashboard"

export default async function SEOPage() {
  const user = await getSessionUser()

  if (!user || user.role !== "ADMIN") {
    redirect("/auth/signin")
  }

  return <SEODashboard />
}
