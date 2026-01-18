"use client"

import { use } from "react"
import { ProtectedRoute } from "@/components/layout/protected-route"
import { PageHeader } from "@/components/dashboard/page-header"
import { DetailShell } from "@/components/dashboard/detail-shell"
import { KeyValueGrid } from "@/components/dashboard/key-value-grid"
import { ActivityTimeline } from "@/components/dashboard/activity-timeline"
import { StatusPill } from "@/components/dashboard/status-pill"
import { LoadingSkeleton } from "@/components/dashboard/loading-skeleton"
import { ErrorState } from "@/components/dashboard/error-state"
import { EmptyState } from "@/components/dashboard/empty-state"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Car, MessageSquare, FileText, DollarSign, Gavel } from "lucide-react"
import Link from "next/link"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function BuyerRequestDetailPage({
  params,
}: {
  params: Promise<{ requestId: string }>
}) {
  const { requestId } = use(params)
  const { data, error, isLoading, mutate } = useSWR(`/api/buyer/auctions/${requestId}`, fetcher)

  const request = data?.auction

  if (isLoading) {
    return (
      <ProtectedRoute allowedRoles={["BUYER"]}>
        <div className="space-y-6">
          <PageHeader title="Loading..." backHref="/buyer/requests" backLabel="Back to Requests" />
          <LoadingSkeleton variant="detail" />
        </div>
      </ProtectedRoute>
    )
  }

  if (error || !request) {
    return (
      <ProtectedRoute allowedRoles={["BUYER"]}>
        <div className="space-y-6">
          <PageHeader title="Request Not Found" backHref="/buyer/requests" backLabel="Back to Requests" />
          <ErrorState message="Failed to load request details" onRetry={() => mutate()} />
        </div>
      </ProtectedRoute>
    )
  }

  const vehicle = request.inventoryItem?.vehicle

  return (
    <ProtectedRoute allowedRoles={["BUYER"]}>
      <div className="space-y-6">
        <PageHeader
          title={`${vehicle?.year || ""} ${vehicle?.make || ""} ${vehicle?.model || ""}`}
          subtitle={`Request ID: ${requestId.slice(0, 8)}`}
          backHref="/buyer/requests"
          backLabel="Back to Requests"
          breadcrumbs={[
            { label: "Requests", href: "/buyer/requests" },
            { label: `${vehicle?.make || "Request"} ${vehicle?.model || ""}` },
          ]}
        />

        <DetailShell
          summary={{
            title: "Request Summary",
            content: (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-[#2D1B69]/10 flex items-center justify-center">
                    <Car className="h-6 w-6 text-[#2D1B69]" />
                  </div>
                  <div>
                    <p className="font-semibold">
                      {vehicle?.year} {vehicle?.make} {vehicle?.model}
                    </p>
                    <StatusPill status={request.status?.toLowerCase() || "pending"} />
                  </div>
                </div>
                <KeyValueGrid
                  columns={1}
                  items={[
                    { label: "Created", value: new Date(request.createdAt).toLocaleDateString() },
                    { label: "Offers Received", value: request.offers?.length || 0 },
                    { label: "Status", value: <StatusPill status={request.status?.toLowerCase() || "pending"} /> },
                  ]}
                />
              </div>
            ),
            actions: (
              <div className="space-y-2">
                <Button className="w-full bg-[#2D1B69] hover:bg-[#2D1B69]/90" asChild>
                  <Link href={`/buyer/auction/${requestId}/offers`}>View Offers</Link>
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  Cancel Request
                </Button>
              </div>
            ),
          }}
          tabs={[
            {
              id: "overview",
              label: "Overview",
              content: (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Vehicle Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <KeyValueGrid
                        items={[
                          { label: "Year", value: vehicle?.year },
                          { label: "Make", value: vehicle?.make },
                          { label: "Model", value: vehicle?.model },
                          { label: "Trim", value: vehicle?.trim || "—" },
                          { label: "Mileage", value: vehicle?.mileage?.toLocaleString() || "—" },
                          { label: "VIN", value: vehicle?.vin || "—" },
                        ]}
                      />
                    </CardContent>
                  </Card>
                </div>
              ),
            },
            {
              id: "offers",
              label: "Offers",
              badge: request.offers?.length || 0,
              content:
                request.offers?.length > 0 ? (
                  <div className="space-y-4">
                    {request.offers.map((offer: any) => (
                      <Card key={offer.id}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">{offer.dealer?.name || "Dealer"}</p>
                              <p className="text-2xl font-bold text-[#7ED321]">
                                ${(offer.cashOtd || 0).toLocaleString()}
                              </p>
                            </div>
                            <Button size="sm" asChild>
                              <Link href={`/buyer/offers/${offer.id}`}>View Offer</Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={<Gavel className="h-8 w-8 text-muted-foreground" />}
                    title="No offers yet"
                    description="Dealers are reviewing your request. You'll be notified when offers come in."
                  />
                ),
            },
            {
              id: "documents",
              label: "Documents",
              content: (
                <EmptyState
                  icon={<FileText className="h-8 w-8 text-muted-foreground" />}
                  title="No documents"
                  description="Documents related to this request will appear here."
                />
              ),
            },
            {
              id: "payments",
              label: "Payments",
              content: (
                <EmptyState
                  icon={<DollarSign className="h-8 w-8 text-muted-foreground" />}
                  title="No payments"
                  description="Payment information will appear here once you select a deal."
                />
              ),
            },
            {
              id: "messages",
              label: "Messages",
              content: (
                <EmptyState
                  icon={<MessageSquare className="h-8 w-8 text-muted-foreground" />}
                  title="No messages"
                  description="Messages from dealers will appear here."
                />
              ),
            },
            {
              id: "activity",
              label: "Activity",
              content: (
                <ActivityTimeline
                  items={[
                    {
                      id: "1",
                      title: "Request created",
                      description: "You submitted a request for this vehicle",
                      timestamp: new Date(request.createdAt).toLocaleDateString(),
                      type: "success",
                    },
                  ]}
                />
              ),
            },
          ]}
        />
      </div>
    </ProtectedRoute>
  )
}
