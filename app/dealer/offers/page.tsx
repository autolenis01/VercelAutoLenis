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
import { HandCoins, Search, Eye } from "lucide-react"
import useSWR from "swr"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const mockOffers = []

export default function DealerOffersPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  
  const { data, error, isLoading } = useSWR("/api/dealer/offers", fetcher, {
    fallbackData: { offers: mockOffers }
  })

  const offers = data?.offers || []
  const filteredOffers = offers.filter((offer: any) =>
    offer.buyerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    offer.vehicleType?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Offers" subtitle="Your submitted offers" />
        <LoadingSkeleton variant="cards" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Offers" subtitle="Your submitted offers" />
        <ErrorState message="Failed to load offers" onRetry={() => window.location.reload()} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Offers"
        subtitle="Track your submitted financing offers"
        breadcrumb={[
          { label: "Dashboard", href: "/dealer/dashboard" },
          { label: "Offers" },
        ]}
      />

      {offers.length === 0 ? (
        <EmptyState
          icon={HandCoins}
          title="No offers submitted"
          description="Create an offer from an active lead to get started"
          primaryCta={{
            label: "View Leads",
            onClick: () => router.push("/dealer/leads"),
          }}
        />
      ) : (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by buyer name or vehicle..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
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
                        <div>
                          <h3 className="font-semibold">{offer.buyerName}</h3>
                          <p className="text-sm text-muted-foreground">{offer.vehicleType}</p>
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
                          Submitted {formatDistanceToNow(new Date(offer.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                      <Link href={`/dealer/offers/${offer.id}`}>
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
