"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/dashboard/page-header"
import { EmptyState } from "@/components/dashboard/empty-state"
import { LoadingSkeleton } from "@/components/dashboard/loading-skeleton"
import { ErrorState } from "@/components/dashboard/error-state"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { StatusPill } from "@/components/dashboard/status-pill"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { HandCoins, Search, Eye } from "lucide-react"
import useSWR from "swr"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

// Mock data for demonstration
const mockOffers = []

export default function AdminOffersPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  
  // In a real app, this would fetch from /api/admin/offers
  const { data, error, isLoading } = useSWR("/api/admin/offers", fetcher, {
    fallbackData: { offers: mockOffers }
  })

  const offers = data?.offers || []
  const filteredOffers = offers.filter((offer: any) => {
    const matchesSearch = offer.dealerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         offer.vehicleName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         offer.buyerName?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || offer.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Offers" subtitle="All dealer offers" />
        <LoadingSkeleton variant="cards" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Offers" subtitle="All dealer offers" />
        <ErrorState message="Failed to load offers" onRetry={() => window.location.reload()} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Offers"
        subtitle="Manage all dealer offers across the platform"
        breadcrumb={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Offers" },
        ]}
      />

      {offers.length === 0 ? (
        <EmptyState
          icon={HandCoins}
          title="No offers yet"
          description="Dealer offers will appear here"
        />
      ) : (
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by dealer, vehicle, or buyer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="declined">Declined</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredOffers.length === 0 ? (
                <div className="col-span-full">
                  <p className="text-sm text-muted-foreground text-center py-8">No offers found</p>
                </div>
              ) : (
                filteredOffers.map((offer: any) => (
                  <Card key={offer.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold truncate">{offer.dealerName}</h3>
                          <p className="text-sm text-muted-foreground truncate">{offer.vehicleName}</p>
                          <p className="text-xs text-muted-foreground">Buyer: {offer.buyerName}</p>
                        </div>
                        <StatusPill status={offer.status} />
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Monthly Payment:</span>
                          <span className="font-semibold">${offer.monthlyPayment}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Total Price:</span>
                          <span className="font-semibold">${offer.totalPrice.toLocaleString()}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Received {formatDistanceToNow(new Date(offer.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                      <Link href={`/admin/offers/${offer.id}`}>
                        <Button variant="outline" className="w-full" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
