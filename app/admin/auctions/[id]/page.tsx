"use client"

import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, Car, DollarSign, Calendar, Building2 } from "lucide-react"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function AuctionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const auctionId = params["id"] as string

  const { data: auction, error, isLoading } = useSWR(`/api/admin/auctions/${auctionId}`, fetcher)

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

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
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Auctions
        </Button>
        <div className="flex items-center justify-center p-12">
          <p className="text-gray-500">Loading auction details...</p>
        </div>
      </div>
    )
  }

  if (error || !auction) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Auctions
        </Button>
        <div className="flex items-center justify-center p-12">
          <p className="text-red-500">Failed to load auction details</p>
        </div>
      </div>
    )
  }

  const statusColors: Record<string, string> = {
    DRAFT: "bg-gray-100 text-gray-800",
    ACTIVE: "bg-green-100 text-green-800",
    CLOSED: "bg-blue-100 text-blue-800",
    CANCELLED: "bg-red-100 text-red-800",
    NO_OFFERS: "bg-yellow-100 text-yellow-800",
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-900">Auction #{auctionId.slice(0, 8)}</h1>
              <Badge className={statusColors[auction.status] || "bg-gray-100"}>
                {auction.status}
              </Badge>
            </div>
            <p className="text-gray-500 mt-1">Created {formatDate(auction.createdAt)}</p>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Dealers Invited</CardTitle>
            <Building2 className="h-4 w-4 text-[#2D1B69]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{auction.dealersInvited || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Offers Received</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{auction.offersReceived || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Vehicles</CardTitle>
            <Car className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{auction.vehicleCount || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Time Remaining</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {auction.status === "ACTIVE" && auction.endsAt ? (
                <>{Math.max(0, Math.floor((new Date(auction.endsAt).getTime() - Date.now()) / 3600000))}h</>
              ) : (
                "-"
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Buyer Information */}
      <Card>
        <CardHeader>
          <CardTitle>Buyer Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-500">Name</label>
              <p className="font-medium text-gray-900">{auction.buyerName || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Email</label>
              <p className="font-medium text-gray-900">{auction.buyerEmail || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Phone</label>
              <p className="font-medium text-gray-900">{auction.buyerPhone || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Pre-Qualification</label>
              <Badge className="bg-green-100 text-green-800">
                {auction.preQualified ? "Pre-Qualified" : "Not Pre-Qualified"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Auction Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Auction Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-gray-500 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Starts At
              </label>
              <p className="font-medium text-gray-900">{auction.startsAt ? formatDate(auction.startsAt) : "N/A"}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Ends At
              </label>
              <p className="font-medium text-gray-900">{auction.endsAt ? formatDate(auction.endsAt) : "N/A"}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Duration
              </label>
              <p className="font-medium text-gray-900">
                {auction.startsAt && auction.endsAt
                  ? `${Math.round((new Date(auction.endsAt).getTime() - new Date(auction.startsAt).getTime()) / 3600000)} hours`
                  : "N/A"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vehicles in Shortlist */}
      <Card>
        <CardHeader>
          <CardTitle>Vehicles in Shortlist</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehicle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dealer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Offers</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {auction.vehicles && auction.vehicles.length > 0 ? (
                auction.vehicles.map((vehicle: any) => (
                  <tr key={vehicle.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{vehicle.title}</p>
                        <p className="text-sm text-gray-500">
                          {vehicle.year} {vehicle.make} {vehicle.model}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{vehicle.dealerName}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{formatCurrency(vehicle.price)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <Badge>{vehicle.offerCount || 0} offers</Badge>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    No vehicles in this auction
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Offers Received */}
      <Card>
        <CardHeader>
          <CardTitle>Offers Received</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dealer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehicle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cash OTD</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submitted</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {auction.offers && auction.offers.length > 0 ? (
                auction.offers.map((offer: any) => (
                  <tr key={offer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{offer.dealerName}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{offer.vehicleTitle}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-green-600">{formatCurrency(offer.cashOtd)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-500">{formatDate(offer.createdAt)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        className={
                          offer.status === "SELECTED"
                            ? "bg-green-100 text-green-800"
                            : offer.status === "REJECTED"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                        }
                      >
                        {offer.status}
                      </Badge>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No offers received yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
