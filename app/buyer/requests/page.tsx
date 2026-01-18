"use client"

import { ProtectedRoute } from "@/components/layout/protected-route"
import { PageHeader } from "@/components/dashboard/page-header"
import { EmptyState } from "@/components/dashboard/empty-state"
import { LoadingSkeleton } from "@/components/dashboard/loading-skeleton"
import { ErrorState } from "@/components/dashboard/error-state"
import { StatusPill } from "@/components/dashboard/status-pill"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FileText, Plus, Search, Car, Calendar, ArrowRight } from "lucide-react"
import Link from "next/link"
import useSWR from "swr"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const Loading = () => null

export default function BuyerRequestsPage() {
  const searchParams = useSearchParams()
  const { data, error, isLoading, mutate } = useSWR("/api/buyer/auctions", fetcher)

  const requests = data?.auctions || []

  return (
    <ProtectedRoute allowedRoles={["BUYER"]}>
      <Suspense fallback={<Loading />}>
        <div className="space-y-6">
          <PageHeader
            title="My Requests"
            subtitle="Track your vehicle requests and auction status"
            primaryAction={{
              label: "New Request",
              href: "/buyer/search",
              icon: <Plus className="h-4 w-4 mr-2" />,
            }}
          />

          {/* Search */}
          <div className="flex gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search requests..." className="pl-9" />
            </div>
          </div>

          {/* Content */}
          {isLoading ? (
            <LoadingSkeleton variant="cards" count={3} />
          ) : error ? (
            <ErrorState message="Failed to load requests" onRetry={() => mutate()} />
          ) : requests.length === 0 ? (
            <EmptyState
              icon={<FileText className="h-8 w-8 text-muted-foreground" />}
              title="No requests yet"
              description="Start your car buying journey by searching for vehicles and creating a request for dealers to bid on."
              primaryCta={{ label: "Search Vehicles", href: "/buyer/search" }}
              secondaryCta={{ label: "Get Pre-Qualified", href: "/buyer/prequal" }}
            />
          ) : (
            <div className="grid gap-4">
              {requests.map((request: any) => (
                <Card key={request.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg bg-[#2D1B69]/10 flex items-center justify-center flex-shrink-0">
                          <Car className="h-6 w-6 text-[#2D1B69]" />
                        </div>
                        <div>
                          <h3 className="font-semibold">
                            {request.inventoryItem?.vehicle?.year} {request.inventoryItem?.vehicle?.make}{" "}
                            {request.inventoryItem?.vehicle?.model}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Request ID: {request.id.slice(0, 8)}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <StatusPill status={request.status?.toLowerCase() || "pending"} />
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(request.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {request.offerCount || 0} offers
                        </span>
                        <Button variant="outline" size="sm" asChild className="bg-transparent">
                          <Link href={`/buyer/requests/${request.id}`}>
                            View Details
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Suspense>
    </ProtectedRoute>
  )
}
