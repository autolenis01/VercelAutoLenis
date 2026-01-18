"use client"

import { use } from "react"
import { PageHeader } from "@/components/dashboard/page-header"
import { DetailShell } from "@/components/dashboard/detail-shell"
import { KeyValueGrid } from "@/components/dashboard/key-value-grid"
import { ActivityTimeline, type TimelineItem } from "@/components/dashboard/activity-timeline"
import { StatusPill } from "@/components/dashboard/status-pill"
import { LoadingSkeleton } from "@/components/dashboard/loading-skeleton"
import { ErrorState } from "@/components/dashboard/error-state"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/dashboard/empty-state"
import { FileText, User, Activity } from "lucide-react"
import useSWR from "swr"
import { format } from "date-fns"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function DealerOfferDetailPage({ params }: { params: Promise<{ offerId: string }> }) {
  const { offerId } = use(params)
  
  const { data, error, isLoading } = useSWR(`/api/dealer/offers/${offerId}`, fetcher, {
    fallbackData: null
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Loading..." subtitle="Loading offer details" />
        <LoadingSkeleton variant="detail" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="space-y-6">
        <PageHeader title="Offer Not Found" subtitle="Unable to load offer" />
        <ErrorState message="Failed to load offer details" onRetry={() => window.location.reload()} />
      </div>
    )
  }

  const offer = {
    id: offerId,
    buyerName: "John Smith",
    vehicleType: "2024 Toyota Camry XLE",
    status: "pending" as const,
    monthlyPayment: 550,
    totalPrice: 38500,
    apr: 3.9,
    term: 60,
    downPayment: 7000,
    vehiclePrice: 35000,
    fees: 500,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const activityItems: TimelineItem[] = [
    {
      id: "1",
      title: "Offer submitted",
      description: `Offer sent to ${offer.buyerName}`,
      timestamp: new Date(),
      type: "success",
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title={offer.vehicleType}
        subtitle={`Offer for ${offer.buyerName}`}
        breadcrumb={[
          { label: "Dashboard", href: "/dealer/dashboard" },
          { label: "Offers", href: "/dealer/offers" },
          { label: offer.vehicleType },
        ]}
      />

      <DetailShell
        summaryTitle="Offer Summary"
        summary={
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <StatusPill status={offer.status} />
            </div>
            <KeyValueGrid
              items={[
                { label: "Offer ID", value: `#${offer.id.slice(0, 8).toUpperCase()}` },
                { label: "Monthly Payment", value: `$${offer.monthlyPayment}` },
                { label: "Total Price", value: `$${offer.totalPrice.toLocaleString()}` },
                { label: "APR", value: `${offer.apr}%` },
                { label: "Term", value: `${offer.term} months` },
                { label: "Submitted", value: format(offer.createdAt, "MMM d, yyyy") },
              ]}
              columns={1}
            />
            <div className="pt-4 space-y-2">
              <Button className="w-full">Modify Offer</Button>
              <Button variant="outline" className="w-full">Contact Buyer</Button>
              <Button variant="ghost" className="w-full text-destructive">Withdraw Offer</Button>
            </div>
          </div>
        }
        tabs={[
          {
            value: "overview",
            label: "Overview",
            content: (
              <Card>
                <CardHeader>
                  <CardTitle>Offer Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-3">Vehicle Details</h4>
                    <KeyValueGrid
                      items={[
                        { label: "Vehicle", value: offer.vehicleType },
                        { label: "Vehicle Price", value: `$${offer.vehiclePrice.toLocaleString()}` },
                        { label: "Fees", value: `$${offer.fees.toLocaleString()}` },
                        { label: "Total Price", value: `$${offer.totalPrice.toLocaleString()}` },
                      ]}
                      columns={2}
                    />
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">Financing Terms</h4>
                    <KeyValueGrid
                      items={[
                        { label: "Down Payment", value: `$${offer.downPayment.toLocaleString()}` },
                        { label: "Amount Financed", value: `$${(offer.totalPrice - offer.downPayment).toLocaleString()}` },
                        { label: "APR", value: `${offer.apr}%` },
                        { label: "Term", value: `${offer.term} months` },
                        { label: "Monthly Payment", value: `$${offer.monthlyPayment}` },
                      ]}
                      columns={2}
                    />
                  </div>
                </CardContent>
              </Card>
            ),
          },
          {
            value: "buyer",
            label: "Buyer",
            content: (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    {offer.buyerName}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Buyer information and contact details
                  </p>
                </CardContent>
              </Card>
            ),
          },
          {
            value: "documents",
            label: "Documents",
            content: (
              <EmptyState
                icon={FileText}
                title="No documents"
                description="Offer-related documents will appear here"
              />
            ),
          },
          {
            value: "activity",
            label: "Activity",
            content: (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Activity Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ActivityTimeline items={activityItems} />
                </CardContent>
              </Card>
            ),
          },
        ]}
      />
    </div>
  )
}
