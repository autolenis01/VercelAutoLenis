"use client"
import Link from "next/link"
import { ProtectedRoute } from "@/components/layout/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import { ContractShieldStatus } from "@/components/buyer/contract-shield-status"
import {
  Car,
  CheckCircle2,
  Gavel,
  FileText,
  ArrowRight,
  TrendingUp,
  Users2,
  Clock,
  DollarSign,
  AlertCircle,
} from "lucide-react"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function BuyerDashboardPage() {
  const { data, error, isLoading } = useSWR("/api/buyer/dashboard", fetcher, {
    refreshInterval: 30000,
  })

  const profile = data?.profile
  const preQual = data?.preQual
  const stats = data?.stats || {}

  // Calculate journey progress
  const journeySteps = [
    { label: "Pre-Qualified", completed: !!preQual && !preQual.isExpired },
    { label: "Vehicle Found", completed: (stats.shortlistCount || 0) > 0 },
    { label: "Auction Started", completed: (stats.activeAuctions || 0) > 0 || (stats.completedAuctions || 0) > 0 },
    { label: "Deal Selected", completed: (stats.activeDeals || 0) > 0 },
    { label: "Contract Reviewed", completed: stats.contractPassed || false },
    { label: "Pickup Scheduled", completed: stats.pickupScheduled || false },
  ]

  const completedSteps = journeySteps.filter((s) => s.completed).length
  const progressPercent = Math.round((completedSteps / journeySteps.length) * 100)

  if (isLoading) {
    return (
      <ProtectedRoute allowedRoles={["BUYER"]}>
        <div className="space-y-6">
          <div>
            <Skeleton className="h-9 w-48 mb-2" />
            <Skeleton className="h-5 w-64" />
          </div>
          <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (error) {
    return (
      <ProtectedRoute allowedRoles={["BUYER"]}>
        <div className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <h2 className="text-xl font-semibold mb-2">Failed to load dashboard</h2>
          <p className="text-muted-foreground">Please try refreshing the page</p>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute allowedRoles={["BUYER"]}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Welcome back{profile?.firstName ? `, ${profile.firstName}` : ""}!
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">Track your car buying journey</p>
        </div>

        {/* Journey Progress */}
        <Card className="bg-gradient-to-r from-[#2D1B69] to-[#0066FF] text-white overflow-hidden">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="font-semibold text-lg">Your Journey Progress</h3>
                <p className="text-white/80 text-sm">
                  {completedSteps} of {journeySteps.length} steps completed
                </p>
              </div>
              <div className="text-3xl sm:text-4xl font-bold">{progressPercent}%</div>
            </div>
            <Progress value={progressPercent} className="h-2 bg-white/20" />
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-4">
              {journeySteps.map((step, idx) => (
                <div key={idx} className="text-center">
                  <div
                    className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full mx-auto mb-1 flex items-center justify-center ${
                      step.completed ? "bg-[#7ED321]" : "bg-white/20"
                    }`}
                  >
                    {step.completed && <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-white" />}
                  </div>
                  <span className="text-[10px] sm:text-xs text-white/80 line-clamp-2">{step.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#7ED321]/10 flex items-center justify-center flex-shrink-0">
                  <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-[#7ED321]" />
                </div>
                <div className="min-w-0">
                  <p className="text-xl sm:text-2xl font-bold truncate">
                    {preQual && !preQual.isExpired
                      ? `$${((preQual.maxOtdAmountCents || preQual.maxOtd * 100) / 100).toLocaleString()}`
                      : "—"}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Buying Power</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#00D9FF]/10 flex items-center justify-center flex-shrink-0">
                  <Car className="h-5 w-5 sm:h-6 sm:w-6 text-[#00D9FF]" />
                </div>
                <div className="min-w-0">
                  <p className="text-xl sm:text-2xl font-bold">{stats.shortlistCount || 0}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Shortlisted</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#0066FF]/10 flex items-center justify-center flex-shrink-0">
                  <Gavel className="h-5 w-5 sm:h-6 sm:w-6 text-[#0066FF]" />
                </div>
                <div className="min-w-0">
                  <p className="text-xl sm:text-2xl font-bold">{stats.activeAuctions || 0}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Active Auctions</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#2D1B69]/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-[#2D1B69]" />
                </div>
                <div className="min-w-0">
                  <p className="text-xl sm:text-2xl font-bold">{stats.activeDeals || 0}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Active Deals</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Continue your car buying journey</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/buyer/prequal" className="block">
                <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-[#7ED321]/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="h-5 w-5 text-[#7ED321]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm sm:text-base">
                      {preQual && !preQual.isExpired ? "View Pre-Qualification" : "Get Pre-Qualified"}
                    </h4>
                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                      {preQual && !preQual.isExpired
                        ? "Review your buying power and credit tier"
                        : "Quick soft credit check with no impact on your score"}
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                </div>
              </Link>

              <Link href="/buyer/search" className="block">
                <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-[#00D9FF]/10 flex items-center justify-center flex-shrink-0">
                    <Car className="h-5 w-5 text-[#00D9FF]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm sm:text-base">Search Vehicles</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                      Browse thousands of vehicles from verified dealers
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                </div>
              </Link>

              <Link href="/buyer/auction" className="block">
                <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-[#0066FF]/10 flex items-center justify-center flex-shrink-0">
                    <Gavel className="h-5 w-5 text-[#0066FF]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm sm:text-base">Start an Auction</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                      Let dealers compete for your business
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                </div>
              </Link>

              {/* Contract Shield Status - Compact in quick actions */}
              <ContractShieldStatus compact />
            </CardContent>
          </Card>

          {/* Savings & Referrals */}
          <div className="space-y-6">
            {/* Savings Card */}
            <Card className="bg-gradient-to-br from-[#7ED321]/10 to-[#00D9FF]/10 border-[#7ED321]/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <TrendingUp className="h-5 w-5 text-[#7ED321]" />
                  Your Savings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl sm:text-3xl font-bold text-[#7ED321]">
                  ${(stats.totalSavings || 0).toLocaleString()}
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">Total savings through AutoLenis</p>
              </CardContent>
            </Card>

            {/* Referral Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Users2 className="h-5 w-5 text-[#0066FF]" />
                  Refer & Earn
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Earn $100 for every friend who completes a purchase
                </p>
                <Link href="/affiliate/portal/dashboard">
                  <Button className="w-full bg-[#0066FF] hover:bg-[#0066FF]/90">
                    Share Your Link
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Contract Shield Full Card */}
            <ContractShieldStatus />
          </div>
        </div>

        {/* Recent Activity */}
        {stats.recentActivity && stats.recentActivity.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.recentActivity.slice(0, 5).map((activity: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-3 text-sm">
                    <div
                      className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        activity.type === "auction"
                          ? "bg-[#0066FF]"
                          : activity.type === "offer"
                            ? "bg-[#7ED321]"
                            : "bg-gray-400"
                      }`}
                    />
                    <span className="flex-1 truncate">{activity.message}</span>
                    <span className="text-muted-foreground text-xs flex-shrink-0">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ProtectedRoute>
  )
}
