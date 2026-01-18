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
import { FileText, Building2, Activity } from "lucide-react"
import useSWR from "swr"
import { format } from "date-fns"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function BuyerOfferDetailPage({ params }: { params: Promise<{ offerId: string }> }) {
  const { offerId } = use(params)
  
  // In a real app, this would fetch from /api/buyer/offers/${offerId}
  const { data, error, isLoading } = useSWR(`/api/buyer/offers/${offerId}`, fetcher, {
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

  // Mock data structure
  const offer = {
    id: offerId,
    dealerName: "Premier Auto Sales",
    vehicleName: "2024 Toyota Camry XLE",
    status: "pending" as const,
    monthlyPayment: 450,
    totalPrice: 32500,
    apr: 4.5,
    term: 60,
    downPayment: 5000,
    createdAt: new Date(),
  }

  const activityItems: TimelineItem[] = [
    {
      id: "1",
      title: "Offer received",
      description: `${offer.dealerName} submitted an offer`,
      timestamp: new Date(),
      type: "success",
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title={offer.vehicleName}
        subtitle={`Offer from ${offer.dealerName}`}
        breadcrumb={[
          { label: "Dashboard", href: "/buyer/dashboard" },
          { label: "Offers", href: "/buyer/offers" },
          { label: offer.vehicleName },
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
                { label: "Monthly Payment", value: `$${offer.monthlyPayment}` },
                { label: "Total Price", value: `$${offer.totalPrice.toLocaleString()}` },
                { label: "APR", value: `${offer.apr}%` },
                { label: "Term", value: `${offer.term} months` },
                { label: "Down Payment", value: `$${offer.downPayment.toLocaleString()}` },
                { label: "Received", value: format(offer.createdAt, "MMM d, yyyy") },
              ]}
              columns={1}
            />
            <div className="pt-4 space-y-2">
              <Button className="w-full">Accept Offer</Button>
              <Button variant="outline" className="w-full">Counter Offer</Button>
              <Button variant="ghost" className="w-full text-destructive">Decline</Button>
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
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Vehicle Information</h4>
                    <p className="text-sm text-muted-foreground">
                      {offer.vehicleName} - Complete vehicle details and specifications
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Financing Terms</h4>
                    <p className="text-sm text-muted-foreground">
                      Detailed breakdown of financing terms and conditions
                    </p>
                  </div>
                </CardContent>
              </Card>
            ),
          },
          {
            value: "deal-terms",
            label: "Deal Terms",
            content: (
              <Card>
                <CardHeader>
                  <CardTitle>Deal Terms & Conditions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Complete financing terms, fees, and conditions will be displayed here.
                  </p>
                </CardContent>
              </Card>
            ),
          },
          {
            value: "dealer",
            label: "Dealer",
            content: (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    {offer.dealerName}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Dealer information, ratings, and contact details
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
