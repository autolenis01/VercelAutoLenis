"use client"

import { use, useState } from "react"
import { ProtectedRoute } from "@/components/layout/protected-route"
import { PageHeader } from "@/components/dashboard/page-header"
import { DetailShell } from "@/components/dashboard/detail-shell"
import { KeyValueGrid } from "@/components/dashboard/key-value-grid"
import { ActivityTimeline } from "@/components/dashboard/activity-timeline"
import { StatusPill } from "@/components/dashboard/status-pill"
import { LoadingSkeleton } from "@/components/dashboard/loading-skeleton"
import { ErrorState } from "@/components/dashboard/error-state"
import { EmptyState } from "@/components/dashboard/empty-state"
import { NotImplementedModal } from "@/components/dashboard/not-implemented-modal"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Building2, FileText, CheckCircle } from "lucide-react"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function BuyerOfferDetailPage({
  params,
}: {
  params: Promise<{ offerId: string }>
}) {
  const { offerId } = use(params)
  const [showModal, setShowModal] = useState(false)
  
  // Try to fetch from auctions and find the offer
  const { data, error, isLoading, mutate } = useSWR("/api/buyer/auctions", fetcher)

  // Find the offer in all auctions
  let offer: any = null
  let auction: any = null
  if (data?.auctions) {
    for (const auc of data.auctions) {
      const found = auc.offers?.find((o: any) => o.id === offerId)
      if (found) {
        offer = found
        auction = auc
        break
      }
    }
  }

  const vehicle = auction?.inventoryItem?.vehicle

  if (isLoading) {
    return (
      <ProtectedRoute allowedRoles={["BUYER"]}>
        <div className="space-y-6">
          <PageHeader title="Loading..." backHref="/buyer/offers" backLabel="Back to Offers" />
          <LoadingSkeleton variant="detail" />
        </div>
      </ProtectedRoute>
    )
  }

  if (error || !offer) {
    return (
      <ProtectedRoute allowedRoles={["BUYER"]}>
        <div className="space-y-6">
          <PageHeader title="Offer Not Found" backHref="/buyer/offers" backLabel="Back to Offers" />
          <ErrorState message="Failed to load offer details" onRetry={() => mutate()} />
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute allowedRoles={["BUYER"]}>
      <div className="space-y-6">
        <PageHeader
          title={`Offer from ${offer.dealer?.name || "Dealer"}`}
          subtitle={`${vehicle?.year || ""} ${vehicle?.make || ""} ${vehicle?.model || ""}`}
          backHref="/buyer/offers"
          backLabel="Back to Offers"
          breadcrumbs={[
            { label: "Offers", href: "/buyer/offers" },
            { label: offer.dealer?.name || "Offer Details" },
          ]}
        />

        <DetailShell
          summary={{
            title: "Offer Summary",
            content: (
              <div className="space-y-4">
                <div className="text-center p-4 bg-[#7ED321]/10 rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Price</p>
                  <p className="text-3xl font-bold text-[#7ED321]">
                    ${(offer.cashOtd || 0).toLocaleString()}
                  </p>
                </div>
                <KeyValueGrid
                  columns={1}
                  items={[
                    { label: "Status", value: <StatusPill status={offer.status?.toLowerCase() || "pending"} /> },
                    { label: "Dealer", value: offer.dealer?.name || "—" },
                    { label: "Received", value: new Date(offer.createdAt).toLocaleDateString() },
                  ]}
                />
              </div>
            ),
            actions: (
              <div className="space-y-2">
                <Button
                  className="w-full bg-[#7ED321] hover:bg-[#7ED321]/90"
                  onClick={() => setShowModal(true)}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Accept Offer
                </Button>
                <Button variant="outline" className="w-full bg-transparent" onClick={() => setShowModal(true)}>
                  Negotiate
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
                      <CardTitle className="text-base">Deal Terms</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <KeyValueGrid
                        items={[
                          { label: "Cash Price", value: `$${(offer.cashPrice || offer.cashOtd || 0).toLocaleString()}` },
                          { label: "Out-the-Door Price", value: `$${(offer.cashOtd || 0).toLocaleString()}` },
                          { label: "Monthly Payment", value: offer.monthlyPayment ? `$${offer.monthlyPayment.toLocaleString()}/mo` : "—" },
                          { label: "Term", value: offer.term ? `${offer.term} months` : "—" },
                        ]}
                      />
                    </CardContent>
                  </Card>
                </div>
              ),
            },
            {
              id: "dealer",
              label: "Dealer",
              content: (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      Dealer Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <KeyValueGrid
                      items={[
                        { label: "Name", value: offer.dealer?.name || "—" },
                        { label: "Location", value: offer.dealer?.city ? `${offer.dealer.city}, ${offer.dealer.state}` : "—" },
                        { label: "Rating", value: "4.8/5" },
                      ]}
                    />
                  </CardContent>
                </Card>
              ),
            },
            {
              id: "documents",
              label: "Documents",
              content: (
                <EmptyState
                  icon={<FileText className="h-8 w-8 text-muted-foreground" />}
                  title="No documents"
                  description="Documents related to this offer will appear here once you accept."
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
                      title: "Offer received",
                      description: `${offer.dealer?.name || "Dealer"} submitted an offer`,
                      timestamp: new Date(offer.createdAt).toLocaleDateString(),
                      type: "info",
                    },
                  ]}
                />
              ),
            },
          ]}
        />

        <NotImplementedModal
          open={showModal}
          onOpenChange={setShowModal}
          featureName="This action"
        />
      </div>
    </ProtectedRoute>
  )
}
