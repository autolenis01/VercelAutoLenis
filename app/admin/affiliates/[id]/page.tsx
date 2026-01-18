"use client"

import { use } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Users, Link as LinkIcon, TrendingUp, DollarSign, MousePointer, UserPlus } from "lucide-react"
import useSWR from "swr"
import Link from "next/link"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function AdminAffiliateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data, error, isLoading } = useSWR(`/api/admin/affiliates/${id}`, fetcher)

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/affiliates">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="h-8 w-48 bg-gray-200 animate-pulse rounded" />
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="pt-6">
                <div className="h-24 bg-gray-100 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error || !data?.affiliate) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/affiliates">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Affiliate Not Found</h1>
        </div>
        <p className="text-gray-500">The affiliate you are looking for does not exist.</p>
      </div>
    )
  }

  const affiliate = data.affiliate
  const user = affiliate.user
  const metrics = affiliate.metrics || {}
  const referrals = affiliate.referrals || []
  const commissions = affiliate.commissions || []
  const clicks = affiliate.clicks || []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/affiliates">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {affiliate.firstName || user?.first_name || ""} {affiliate.lastName || user?.last_name || ""}
            </h1>
            <p className="text-gray-500">{user?.email || affiliate.email || "No email"}</p>
          </div>
          <span
            className={`ml-4 px-3 py-1 rounded-full text-sm font-medium ${
              affiliate.status === "ACTIVE"
                ? "bg-green-100 text-green-800"
                : affiliate.status === "SUSPENDED"
                  ? "bg-red-100 text-red-800"
                  : "bg-gray-100 text-gray-800"
            }`}
          >
            {affiliate.status || "ACTIVE"}
          </span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <MousePointer className="h-8 w-8 text-[#2D1B69]" />
              <div>
                <p className="text-sm text-gray-500">Total Clicks</p>
                <p className="text-lg font-semibold">{metrics.totalClicks || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <UserPlus className="h-8 w-8 text-[#00D9FF]" />
              <div>
                <p className="text-sm text-gray-500">Referrals</p>
                <p className="text-lg font-semibold">{metrics.totalReferrals || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-[#7ED321]" />
              <div>
                <p className="text-sm text-gray-500">Conversion Rate</p>
                <p className="text-lg font-semibold">{metrics.conversionRate || "0.00"}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-500">Total Earnings</p>
                <p className="text-lg font-semibold text-green-600">
                  {formatCurrency(affiliate.totalEarnings || 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="referrals">Referrals</TabsTrigger>
          <TabsTrigger value="commissions">Commissions</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Affiliate Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Identity</h4>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm text-gray-500">Full Name</dt>
                      <dd className="font-medium">
                        {affiliate.firstName || user?.first_name || ""}{" "}
                        {affiliate.lastName || user?.last_name || "Not available"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Email</dt>
                      <dd className="font-medium">{user?.email || affiliate.email || "Not available"}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Phone</dt>
                      <dd className="font-medium">{user?.phone || affiliate.phone || "Not available"}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Member Since</dt>
                      <dd className="font-medium">
                        {user?.createdAt ? formatDate(user.createdAt) : affiliate.createdAt ? formatDate(affiliate.createdAt) : "Not available"}
                      </dd>
                    </div>
                  </dl>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Referral Setup</h4>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm text-gray-500">Referral Code</dt>
                      <dd className="font-mono font-medium text-lg">
                        {affiliate.refCode || affiliate.ref_code || "Not available"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Referral Link</dt>
                      <dd className="font-medium text-sm break-all">
                        {affiliate.refCode || affiliate.ref_code
                          ? `https://autolenis.com/ref/${affiliate.refCode || affiliate.ref_code}`
                          : "Not available"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Landing Slug</dt>
                      <dd className="font-medium">
                        {affiliate.landingSlug || affiliate.landing_slug || "Not available"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Status</dt>
                      <dd>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            affiliate.status === "ACTIVE"
                              ? "bg-green-100 text-green-800"
                              : affiliate.status === "SUSPENDED"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {affiliate.status || "ACTIVE"}
                        </span>
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="referrals">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Referrals ({referrals.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {referrals.length > 0 ? (
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Referred User</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {referrals.map((referral: any) => (
                      <tr key={referral.id}>
                        <td className="px-4 py-3 text-sm font-mono">{referral.referredUserId?.slice(0, 12)}...</td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              referral.status === "COMPLETED"
                                ? "bg-green-100 text-green-800"
                                : referral.status === "PENDING"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {referral.status || "PENDING"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">{formatDate(referral.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-500">No referrals found for this affiliate.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="commissions">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Commissions ({commissions.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {commissions.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3 mb-6">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-gray-600">Total Earnings</p>
                      <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(affiliate.totalEarnings || 0)}
                      </p>
                    </div>
                    <div className="p-4 bg-yellow-50 rounded-lg">
                      <p className="text-sm text-gray-600">Pending</p>
                      <p className="text-2xl font-bold text-yellow-600">
                        {formatCurrency(affiliate.pendingEarnings || 0)}
                      </p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-600">Available Balance</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {formatCurrency((affiliate.available_balance_cents || affiliate.availableBalanceCents || 0) / 100)}
                      </p>
                    </div>
                  </div>
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {commissions.map((commission: any) => (
                        <tr key={commission.id}>
                          <td className="px-4 py-3 text-sm font-medium">
                            {formatCurrency(commission.amount || (commission.amountCents || 0) / 100)}
                          </td>
                          <td className="px-4 py-3 text-sm">{commission.type || "REFERRAL"}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                commission.status === "PAID"
                                  ? "bg-green-100 text-green-800"
                                  : commission.status === "PENDING"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {commission.status || "PENDING"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">{formatDate(commission.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500">No commissions found for this affiliate.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Click-to-Referral Conversion</span>
                      <span className="text-sm font-medium">{metrics.conversionRate || "0.00"}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${Math.min(Number.parseFloat(metrics.conversionRate || "0"), 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
                <dl className="space-y-3">
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Total Clicks</dt>
                    <dd className="font-medium">{metrics.totalClicks || 0}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Total Referrals</dt>
                    <dd className="font-medium">{metrics.totalReferrals || 0}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Total Commissions</dt>
                    <dd className="font-medium">{metrics.totalCommissions || 0}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Paid Commissions</dt>
                    <dd className="font-medium">{metrics.paidCommissions || 0}</dd>
                  </div>
                  <div className="flex justify-between pt-3 border-t">
                    <dt className="text-gray-900 font-medium">Lifetime Value</dt>
                    <dd className="font-bold text-green-600">
                      {formatCurrency(affiliate.totalEarnings || 0)}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Recent Clicks */}
              {clicks.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-3">Recent Clicks</h4>
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">IP Address</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Referrer</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {clicks.slice(0, 10).map((click: any) => (
                        <tr key={click.id}>
                          <td className="px-4 py-3 text-sm font-mono">{click.ipAddress || "Unknown"}</td>
                          <td className="px-4 py-3 text-sm truncate max-w-xs">{click.referrer || "Direct"}</td>
                          <td className="px-4 py-3 text-sm text-gray-500">{formatDate(click.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
