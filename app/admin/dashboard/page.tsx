"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, DollarSign, Handshake, TrendingUp, Users, Gavel } from "lucide-react"
import useSWR from "swr"
import Link from "next/link"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function AdminDashboardPage() {
  const { data, error, isLoading } = useSWR("/api/admin/dashboard", fetcher, {
    refreshInterval: 30000,
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Loading platform metrics...</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-24" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600">Failed to load dashboard data</p>
      </div>
    )
  }

  const { stats, funnel, topDealers, topAffiliates } = data || {}

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Platform overview and key metrics</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-[#2D1B69]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Buyers</CardTitle>
            <Users className="h-4 w-4 text-[#2D1B69]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalBuyers || 0}</div>
            <p className="text-xs text-gray-500">
              <span className="text-green-600 font-medium">{stats?.activeBuyers || 0}</span> active (30d)
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#7ED321]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Dealers</CardTitle>
            <Building2 className="h-4 w-4 text-[#7ED321]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeDealers || 0}</div>
            <p className="text-xs text-gray-500">of {stats?.totalDealers || 0} total dealers</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#00D9FF]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Auctions (30d)</CardTitle>
            <Gavel className="h-4 w-4 text-[#00D9FF]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.auctionsLast30Days || 0}</div>
            <p className="text-xs text-gray-500">
              <span className="text-green-600 font-medium">{stats?.activeAuctions || 0}</span> currently active
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#0066FF]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Deals Completed</CardTitle>
            <Handshake className="h-4 w-4 text-[#0066FF]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.completedDeals || 0}</div>
            <p className="text-xs text-gray-500">
              <span className="text-green-600 font-medium">{stats?.dealsLast30Days || 0}</span> in last 30 days
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats?.totalRevenue || 0)}</div>
            <p className="text-xs text-gray-500">
              <span className="text-green-600 font-medium">{formatCurrency(stats?.revenueLast30Days || 0)}</span> (30d)
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pending Deposits</CardTitle>
            <DollarSign className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.pendingDeposits || 0}</div>
            <p className="text-xs text-gray-500">Held deposits awaiting release</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Affiliate Payouts</CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats?.totalAffiliatePayouts || 0)}</div>
            <p className="text-xs text-gray-500">
              <span className="text-green-600 font-medium">
                {formatCurrency(stats?.affiliatePayoutsLast30Days || 0)}
              </span>{" "}
              (30d)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Funnel & Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Conversion Funnel */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Conversion Funnel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { label: "Signups", value: funnel?.signups || 0, color: "bg-[#2D1B69]" },
                { label: "Pre-Qualified", value: funnel?.preQuals || 0, color: "bg-[#7ED321]" },
                { label: "Shortlists Created", value: funnel?.shortlists || 0, color: "bg-[#00D9FF]" },
                { label: "Auctions Started", value: funnel?.auctions || 0, color: "bg-[#0066FF]" },
                { label: "Deals Selected", value: funnel?.dealsSelected || 0, color: "bg-purple-500" },
                { label: "Fees Paid", value: funnel?.feesPaid || 0, color: "bg-green-500" },
                { label: "Completed", value: funnel?.completed || 0, color: "bg-green-600" },
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-32 text-sm text-gray-600">{step.label}</div>
                  <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${step.color} rounded-full transition-all`}
                      style={{
                        width: `${funnel?.signups ? (step.value / funnel.signups) * 100 : 0}%`,
                      }}
                    />
                  </div>
                  <div className="w-16 text-sm font-medium text-right">{step.value}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Dealers */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Top Dealers</CardTitle>
            <Link href="/admin/dealers" className="text-sm text-[#2D1B69] hover:underline">
              View all
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topDealers?.length > 0 ? (
                topDealers.map((dealer: any, i: number) => (
                  <div key={dealer.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#2D1B69] text-white flex items-center justify-center text-sm font-medium">
                        {i + 1}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{dealer.name}</p>
                        <p className="text-xs text-gray-500">{dealer.wonDeals} deals won</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-600">{dealer.winRate}%</p>
                      <p className="text-xs text-gray-500">win rate</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm text-center py-4">No dealer data available</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Affiliates */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Top Affiliates</CardTitle>
            <Link href="/admin/affiliates" className="text-sm text-[#2D1B69] hover:underline">
              View all
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topAffiliates?.length > 0 ? (
                topAffiliates.map((affiliate: any, i: number) => (
                  <div key={affiliate.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#7ED321] text-white flex items-center justify-center text-sm font-medium">
                        {i + 1}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{affiliate.name}</p>
                        <p className="text-xs text-gray-500">{affiliate.totalReferrals} referrals</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-600">{formatCurrency(affiliate.totalEarnings)}</p>
                      <p className="text-xs text-gray-500">total earned</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm text-center py-4">No affiliate data available</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/admin/dealers?status=pending"
                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Building2 className="h-5 w-5 text-[#2D1B69] mb-2" />
                <p className="font-medium text-sm">Review Dealers</p>
                <p className="text-xs text-gray-500">Pending verification</p>
              </Link>
              <Link
                href="/admin/contracts?status=FAIL"
                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <TrendingUp className="h-5 w-5 text-red-500 mb-2" />
                <p className="font-medium text-sm">Contract Issues</p>
                <p className="text-xs text-gray-500">Failed scans</p>
              </Link>
              <Link href="/admin/payments" className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <DollarSign className="h-5 w-5 text-green-500 mb-2" />
                <p className="font-medium text-sm">Process Refunds</p>
                <p className="text-xs text-gray-500">Pending requests</p>
              </Link>
              <Link href="/admin/compliance" className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <Users className="h-5 w-5 text-yellow-500 mb-2" />
                <p className="font-medium text-sm">Compliance Logs</p>
                <p className="text-xs text-gray-500">Recent events</p>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
