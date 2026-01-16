"use client"

export const dynamic = "force-dynamic"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DollarSign,
  TrendingUp,
  Users,
  MousePointerClick,
  Loader2,
  ArrowRight,
  Gift,
  Copy,
  Check,
  Calculator,
} from "lucide-react"
import Link from "next/link"
import useSWR from "swr"
import { useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function AffiliateDashboardPage() {
  const { data, isLoading, error } = useSWR("/api/affiliate/dashboard", fetcher, {
    refreshInterval: 30000,
  })
  const [copied, setCopied] = useState(false)

  const copyLink = () => {
    if (data?.affiliate?.referralLink) {
      navigator.clipboard.writeText(data.affiliate.referralLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Failed to load dashboard data</p>
      </div>
    )
  }

  const { affiliate, stats, referralLevels, clicksChart } = data

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {affiliate?.firstName || "Affiliate"}!</h1>
          <p className="text-muted-foreground mt-1">Track your referrals and earnings in real-time</p>
        </div>
        <Button asChild className="bg-gradient-to-r from-[#7ED321] to-[#00D9FF] text-[#2D1B69]">
          <Link href="/affiliate/portal/link">
            Share Link <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Quick Copy Link */}
      <Card className="border-[#7ED321]/20 bg-gradient-to-r from-[#7ED321]/5 to-[#00D9FF]/5">
        <CardContent className="py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Gift className="h-5 w-5 text-[#7ED321]" />
              <span className="font-medium">Your Referral Link:</span>
              <code className="bg-white/80 px-3 py-1 rounded text-sm font-mono">{affiliate?.referralLink}</code>
            </div>
            <Button variant="outline" size="sm" onClick={copyLink}>
              {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.totalClicks?.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground">+{stats?.recentClicks || 0} in last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Sign-ups</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.totalReferrals || 0}</div>
            <p className="text-xs text-muted-foreground">{stats?.conversionRate || 0}% conversion rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <TrendingUp className="h-4 w-4 text-[#00D9FF]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#00D9FF]">${(stats?.pendingCommissions || 0).toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">{stats?.pendingCommissionCount || 0} awaiting payout</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
            <DollarSign className="h-4 w-4 text-[#7ED321]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#7ED321]">
              ${((stats?.pendingCommissions || 0) + (stats?.paidCommissions || 0)).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">${(stats?.totalPaidOut || 0).toFixed(2)} paid out</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Clicks Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Click Activity</CardTitle>
            <CardDescription>Link clicks over the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            {clicksChart && clicksChart.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={clicksChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(val) =>
                      new Date(val).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                    }
                    fontSize={12}
                  />
                  <YAxis fontSize={12} />
                  <Tooltip
                    labelFormatter={(val) => new Date(val).toLocaleDateString()}
                    formatter={(val: number) => [`${val} clicks`, "Clicks"]}
                  />
                  <Line type="monotone" dataKey="clicks" stroke="#7ED321" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[200px] flex items-center justify-center bg-muted/50 rounded-lg">
                <p className="text-muted-foreground">No click data yet. Share your link to get started!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Referrals by Level */}
        <Card>
          <CardHeader>
            <CardTitle>Referrals by Level</CardTitle>
            <CardDescription>Your multi-level network breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3].map((level) => {
                const count = referralLevels?.[`level${level}` as keyof typeof referralLevels] || 0
                const rate = level === 1 ? 0.15 : level === 2 ? 0.03 : 0.02
                const maxCount = Math.max(
                  referralLevels?.level1 || 0,
                  referralLevels?.level2 || 0,
                  referralLevels?.level3 || 0,
                  1,
                )
                const percentage = (count / maxCount) * 100
                const color = level === 1 ? "#7ED321" : level === 2 ? "#00D9FF" : "#0066FF"

                return (
                  <div key={level} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>
                        Level {level} ({(rate * 100).toFixed(0)}%)
                      </span>
                      <span className="font-medium">{count} referrals</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: color,
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Commission Structure */}
      <Card>
        <CardHeader>
          <CardTitle>3-Level Commission Structure</CardTitle>
          <CardDescription>Earn commissions on your entire referral network</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {[
              { level: 1, rate: 15, color: "#7ED321", label: "Direct" },
              { level: 2, rate: 3, color: "#00D9FF", label: "2nd Origin" },
              { level: 3, rate: 2, color: "#0066FF", label: "3rd Origin" },
            ].map((item) => (
              <div
                key={item.level}
                className="text-center p-4 rounded-xl border-2"
                style={{ borderColor: item.color + "40", backgroundColor: item.color + "10" }}
              >
                <div className="text-2xl font-bold" style={{ color: item.color }}>
                  {item.rate}%
                </div>
                <div className="text-sm text-muted-foreground">{item.label}</div>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground text-center mt-4">
            Commission is calculated on the service fee per completed car purchase
          </p>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-4">
        <Link href="/affiliate/portal/income-calculator">
          <Card className="hover:border-[#7ED321]/50 transition-colors cursor-pointer h-full">
            <CardContent className="pt-6">
              <Calculator className="h-8 w-8 text-[#7ED321] mb-3" />
              <h3 className="font-semibold">Income Calculator</h3>
              <p className="text-sm text-muted-foreground">Estimate earnings and plan your goals</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/affiliate/portal/referrals">
          <Card className="hover:border-[#7ED321]/50 transition-colors cursor-pointer h-full">
            <CardContent className="pt-6">
              <Users className="h-8 w-8 text-[#7ED321] mb-3" />
              <h3 className="font-semibold">View Referrals</h3>
              <p className="text-sm text-muted-foreground">See all your referred users and their status</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/affiliate/portal/commissions">
          <Card className="hover:border-[#00D9FF]/50 transition-colors cursor-pointer h-full">
            <CardContent className="pt-6">
              <DollarSign className="h-8 w-8 text-[#00D9FF] mb-3" />
              <h3 className="font-semibold">Commission History</h3>
              <p className="text-sm text-muted-foreground">Track all your earnings and payouts</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/affiliate/portal/payouts">
          <Card className="hover:border-[#0066FF]/50 transition-colors cursor-pointer h-full">
            <CardContent className="pt-6">
              <TrendingUp className="h-8 w-8 text-[#0066FF] mb-3" />
              <h3 className="font-semibold">Request Payout</h3>
              <p className="text-sm text-muted-foreground">Withdraw your available balance</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
