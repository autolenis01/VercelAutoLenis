"use client"

import { use } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, User, CreditCard, Gavel, Car, DollarSign, Users } from "lucide-react"
import useSWR from "swr"
import Link from "next/link"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function AdminBuyerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data, error, isLoading } = useSWR(`/api/admin/buyers/${id}`, fetcher)

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
          <Link href="/admin/buyers">
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

  if (error || !data) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/buyers">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Buyer Not Found</h1>
        </div>
        <p className="text-gray-500">The buyer you are looking for does not exist.</p>
      </div>
    )
  }

  const buyer = data.buyer
  const profile = buyer?.buyer?.profile
  const preQual = buyer?.buyer?.preQualification
  const auctions = buyer?.buyer?.auctions || []
  const deals = buyer?.buyer?.selectedDeals || []
  const affiliate = buyer?.affiliate

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/buyers">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {profile?.firstName || buyer?.first_name || "Unknown"} {profile?.lastName || buyer?.last_name || ""}
            </h1>
            <p className="text-gray-500">{buyer?.email}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent">
            Disable Account
          </Button>
          <Button variant="outline">Reset Password</Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <CreditCard className="h-8 w-8 text-[#2D1B69]" />
              <div>
                <p className="text-sm text-gray-500">Pre-Qual Status</p>
                <p className="text-lg font-semibold">
                  {preQual ? (
                    <span className="text-green-600">{formatCurrency(preQual.maxOtd || 0)} Max OTD</span>
                  ) : (
                    <span className="text-gray-400">Not Pre-Qualified</span>
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Gavel className="h-8 w-8 text-[#00D9FF]" />
              <div>
                <p className="text-sm text-gray-500">Auctions</p>
                <p className="text-lg font-semibold">{auctions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Car className="h-8 w-8 text-[#7ED321]" />
              <div>
                <p className="text-sm text-gray-500">Deals</p>
                <p className="text-lg font-semibold">{deals.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-sm text-gray-500">Affiliate</p>
                <p className="text-lg font-semibold">
                  {affiliate ? (
                    <span className="text-green-600">Active</span>
                  ) : (
                    <span className="text-gray-400">No</span>
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="prequal">Pre-Qualification</TabsTrigger>
          <TabsTrigger value="auctions">Auctions</TabsTrigger>
          <TabsTrigger value="deals">Deals</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          {affiliate && <TabsTrigger value="affiliate">Affiliate</TabsTrigger>}
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Contact Information</h4>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm text-gray-500">Email</dt>
                      <dd className="font-medium">{buyer?.email || "-"}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Phone</dt>
                      <dd className="font-medium">{profile?.phone || buyer?.phone || "-"}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Address</dt>
                      <dd className="font-medium">
                        {profile?.address || profile?.address_line1 || "-"}
                        {profile?.city && `, ${profile.city}`}
                        {profile?.state && `, ${profile.state}`}
                        {profile?.zip || profile?.postalCode || ""}
                      </dd>
                    </div>
                  </dl>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Account Details</h4>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm text-gray-500">Role</dt>
                      <dd className="font-medium">{buyer?.role || "BUYER"}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Member Since</dt>
                      <dd className="font-medium">{formatDate(buyer?.createdAt)}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Employment</dt>
                      <dd className="font-medium">{profile?.employmentStatus || profile?.employer || "-"}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Housing</dt>
                      <dd className="font-medium">{profile?.housingStatus || "-"}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prequal">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Pre-Qualification Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              {preQual ? (
                <div className="grid gap-6 md:grid-cols-2">
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm text-gray-500">Max OTD Amount</dt>
                      <dd className="text-xl font-bold text-green-600">
                        {formatCurrency(preQual.maxOtd || (preQual.max_otd_amount_cents || 0) / 100)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Credit Tier</dt>
                      <dd className="font-medium">{preQual.creditTier || "-"}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">DTI Ratio</dt>
                      <dd className="font-medium">{preQual.dti ? `${(preQual.dti * 100).toFixed(1)}%` : "-"}</dd>
                    </div>
                  </dl>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm text-gray-500">Monthly Payment Range</dt>
                      <dd className="font-medium">
                        {formatCurrency(preQual.estimatedMonthlyMin || 0)} -{" "}
                        {formatCurrency(preQual.estimatedMonthlyMax || 0)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Soft Pull Date</dt>
                      <dd className="font-medium">{preQual.softPullDate ? formatDate(preQual.softPullDate) : "-"}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Expires</dt>
                      <dd className="font-medium">{preQual.expiresAt ? formatDate(preQual.expiresAt) : "-"}</dd>
                    </div>
                  </dl>
                </div>
              ) : (
                <p className="text-gray-500">This buyer has not completed pre-qualification.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="auctions">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gavel className="h-5 w-5" />
                Auctions ({auctions.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {auctions.length > 0 ? (
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Offers</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {auctions.map((auction: any) => (
                      <tr key={auction.id}>
                        <td className="px-4 py-3 text-sm font-mono">{auction.id.slice(0, 8)}...</td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              auction.status === "ACTIVE"
                                ? "bg-green-100 text-green-800"
                                : auction.status === "CLOSED"
                                  ? "bg-gray-100 text-gray-800"
                                  : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {auction.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">{auction.offers?.length || 0}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{formatDate(auction.createdAt)}</td>
                        <td className="px-4 py-3">
                          <Link
                            href={`/admin/auctions/${auction.id}`}
                            className="text-[#2D1B69] hover:underline text-sm"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-500">No auctions found for this buyer.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deals">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5" />
                Deals ({deals.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {deals.length > 0 ? (
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Vehicle</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Dealer</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">OTD</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {deals.map((deal: any) => (
                      <tr key={deal.id}>
                        <td className="px-4 py-3 text-sm">
                          {deal.inventoryItem?.vehicle
                            ? `${deal.inventoryItem.vehicle.year} ${deal.inventoryItem.vehicle.make} ${deal.inventoryItem.vehicle.model}`
                            : "Unknown"}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {deal.dealer?.name || deal.dealer?.businessName || "Unknown"}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium">
                          {formatCurrency(deal.cashOtd || (deal.totalOtdAmountCents || 0) / 100)}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              deal.status === "COMPLETED"
                                ? "bg-green-100 text-green-800"
                                : deal.status === "CANCELLED"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {deal.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">{formatDate(deal.createdAt)}</td>
                        <td className="px-4 py-3">
                          <Link href={`/admin/deals/${deal.id}`} className="text-[#2D1B69] hover:underline text-sm">
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-500">No deals found for this buyer.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Payments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {deals.map((deal: any) => (
                  <div key={deal.id} className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Deal: {deal.id.slice(0, 8)}...</h4>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <p className="text-sm text-gray-500">Deposit</p>
                        <p className="font-medium">
                          {deal.deposit ? (
                            <span className={deal.deposit.status === "PAID" ? "text-green-600" : "text-yellow-600"}>
                              {formatCurrency(deal.deposit.amount || 99)} - {deal.deposit.status}
                            </span>
                          ) : (
                            <span className="text-gray-400">Not paid</span>
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Service Fee</p>
                        <p className="font-medium">
                          {deal.serviceFee ? (
                            <span className={deal.serviceFee.status === "PAID" ? "text-green-600" : "text-yellow-600"}>
                              {formatCurrency(deal.serviceFee.amount || (deal.serviceFee.baseFeeCents || 0) / 100)} -{" "}
                              {deal.serviceFee.status}
                            </span>
                          ) : (
                            <span className="text-gray-400">Not paid</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {deals.length === 0 && <p className="text-gray-500">No payment records found.</p>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {affiliate && (
          <TabsContent value="affiliate">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Affiliate Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm text-gray-500">Referral Code</dt>
                      <dd className="font-mono font-medium">
                        {affiliate.referralCode || affiliate.refCode || affiliate.ref_code}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Total Referrals</dt>
                      <dd className="font-medium">{affiliate.referrals?.length || 0}</dd>
                    </div>
                  </dl>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm text-gray-500">Total Earnings</dt>
                      <dd className="text-xl font-bold text-green-600">
                        {formatCurrency(affiliate.totalEarnings || 0)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Pending Earnings</dt>
                      <dd className="font-medium">{formatCurrency(affiliate.pendingEarnings || 0)}</dd>
                    </div>
                  </dl>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
