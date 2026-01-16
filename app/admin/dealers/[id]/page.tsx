"use client"

import { use } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Building2, Package, Gavel, FileText, Shield, BarChart3 } from "lucide-react"
import useSWR from "swr"
import Link from "next/link"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function AdminDealerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data, error, isLoading, mutate } = useSWR(`/api/admin/dealers/${id}`, fetcher)

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const handleApprove = async () => {
    await fetch(`/api/admin/dealers/${id}/approve`, { method: "POST" })
    mutate()
  }

  const handleSuspend = async () => {
    await fetch(`/api/admin/dealers/${id}/suspend`, { method: "POST" })
    mutate()
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/dealers">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="h-8 w-48 bg-gray-200 animate-pulse rounded" />
        </div>
      </div>
    )
  }

  if (error || !data?.dealer) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/dealers">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Dealer Not Found</h1>
        </div>
      </div>
    )
  }

  const dealer = data.dealer

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/dealers">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{dealer.name || dealer.businessName}</h1>
            <p className="text-gray-500">
              {dealer.city}, {dealer.state}
            </p>
          </div>
          <span
            className={`ml-4 px-3 py-1 rounded-full text-sm font-medium ${
              dealer.verified && dealer.active
                ? "bg-green-100 text-green-800"
                : !dealer.verified
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
            }`}
          >
            {dealer.verified && dealer.active ? "Approved" : !dealer.verified ? "Pending" : "Suspended"}
          </span>
        </div>
        <div className="flex gap-2">
          {!dealer.verified && (
            <Button onClick={handleApprove} className="bg-green-600 hover:bg-green-700">
              Approve Dealer
            </Button>
          )}
          {dealer.active ? (
            <Button
              onClick={handleSuspend}
              variant="outline"
              className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
            >
              Suspend Dealer
            </Button>
          ) : (
            <Button
              onClick={handleApprove}
              variant="outline"
              className="text-green-600 border-green-200 hover:bg-green-50 bg-transparent"
            >
              Reinstate Dealer
            </Button>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Package className="h-8 w-8 text-[#2D1B69]" />
              <div>
                <p className="text-sm text-gray-500">Inventory</p>
                <p className="text-lg font-semibold">{dealer._count?.inventoryItems || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Gavel className="h-8 w-8 text-[#00D9FF]" />
              <div>
                <p className="text-sm text-gray-500">Offers Made</p>
                <p className="text-lg font-semibold">{dealer._count?.offers || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-[#7ED321]" />
              <div>
                <p className="text-sm text-gray-500">Deals Won</p>
                <p className="text-lg font-semibold">{dealer._count?.selectedDeals || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-sm text-gray-500">Integrity Score</p>
                <p className="text-lg font-semibold">{dealer.integrityScore || 100}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="offers">Offers</TabsTrigger>
          <TabsTrigger value="deals">Deals</TabsTrigger>
          <TabsTrigger value="scorecard">Scorecard</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Dealer Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Business Details</h4>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm text-gray-500">Business Name</dt>
                      <dd className="font-medium">{dealer.businessName || dealer.name}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Legal Name</dt>
                      <dd className="font-medium">{dealer.legalName || dealer.legal_name || "-"}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">License Number</dt>
                      <dd className="font-medium">{dealer.licenseNumber || "-"}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Email</dt>
                      <dd className="font-medium">{dealer.email || "-"}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Phone</dt>
                      <dd className="font-medium">{dealer.phone || "-"}</dd>
                    </div>
                  </dl>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Location</h4>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm text-gray-500">Address</dt>
                      <dd className="font-medium">
                        {dealer.address || dealer.address_line1 || "-"}
                        {dealer.address_line2 && `, ${dealer.address_line2}`}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">City</dt>
                      <dd className="font-medium">{dealer.city || "-"}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">State</dt>
                      <dd className="font-medium">{dealer.state || "-"}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">ZIP Code</dt>
                      <dd className="font-medium">{dealer.zip || dealer.postalCode || dealer.postal_code || "-"}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Member Since</dt>
                      <dd className="font-medium">{formatDate(dealer.createdAt)}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Inventory ({dealer.inventoryItems?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {dealer.inventoryItems?.length > 0 ? (
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Vehicle</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Stock #</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {dealer.inventoryItems.slice(0, 20).map((item: any) => (
                      <tr key={item.id}>
                        <td className="px-4 py-3 text-sm">
                          {item.vehicle ? `${item.vehicle.year} ${item.vehicle.make} ${item.vehicle.model}` : "Unknown"}
                        </td>
                        <td className="px-4 py-3 text-sm font-mono">{item.stockNumber || item.stock_number || "-"}</td>
                        <td className="px-4 py-3 text-sm font-medium">
                          ${(item.price || (item.priceCents || 0) / 100).toLocaleString()}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              item.status === "AVAILABLE" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {item.status || "AVAILABLE"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-500">No inventory items found.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="offers">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gavel className="h-5 w-5" />
                Offers ({dealer.offers?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {dealer.offers?.length > 0 ? (
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Auction</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">OTD Amount</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {dealer.offers.slice(0, 20).map((offer: any) => (
                      <tr key={offer.id}>
                        <td className="px-4 py-3 text-sm font-mono">{offer.auctionId?.slice(0, 8)}...</td>
                        <td className="px-4 py-3 text-sm font-medium">
                          ${(offer.cashOtd || (offer.cashOtdCents || 0) / 100).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">{formatDate(offer.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-500">No offers submitted.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deals">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Deals Won ({dealer.selectedDeals?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {dealer.selectedDeals?.length > 0 ? (
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Deal ID</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Vehicle</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">OTD</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {dealer.selectedDeals.map((deal: any) => (
                      <tr key={deal.id}>
                        <td className="px-4 py-3 text-sm font-mono">{deal.id.slice(0, 8)}...</td>
                        <td className="px-4 py-3 text-sm">
                          {deal.inventoryItem?.vehicle
                            ? `${deal.inventoryItem.vehicle.year} ${deal.inventoryItem.vehicle.make} ${deal.inventoryItem.vehicle.model}`
                            : "Unknown"}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium">
                          ${(deal.cashOtd || (deal.totalOtdAmountCents || 0) / 100).toLocaleString()}
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
                <p className="text-gray-500">No deals won yet.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scorecard">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Performance Scorecard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Integrity Score</span>
                      <span className="text-sm font-medium">{dealer.integrityScore || 100}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${dealer.integrityScore || 100}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Win Rate</span>
                      <span className="text-sm font-medium">
                        {dealer._count?.offers > 0
                          ? ((dealer._count.selectedDeals / dealer._count.offers) * 100).toFixed(1)
                          : 0}
                        %
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{
                          width: `${
                            dealer._count?.offers > 0 ? (dealer._count.selectedDeals / dealer._count.offers) * 100 : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
                <dl className="space-y-3">
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Total Offers</dt>
                    <dd className="font-medium">{dealer._count?.offers || 0}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Deals Won</dt>
                    <dd className="font-medium">{dealer._count?.selectedDeals || 0}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Active Inventory</dt>
                    <dd className="font-medium">{dealer._count?.inventoryItems || 0}</dd>
                  </div>
                </dl>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
