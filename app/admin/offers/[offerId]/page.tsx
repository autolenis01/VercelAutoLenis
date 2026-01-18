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
import { FileText, Building2, User, Activity, CheckCircle, XCircle, DollarSign } from "lucide-react"
import useSWR from "swr"
import { format } from "date-fns"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function AdminOfferDetailPage({ params }: { params: Promise<{ offerId: string }> }) {
  const { offerId } = use(params)
  
  // In a real app, this would fetch from /api/admin/offers/${offerId}
  const { data, error, isLoading } = useSWR(`/api/admin/offers/${offerId}`, fetcher, {
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
    dealerId: "dealer123",
    buyerName: "John Doe",
    buyerId: "buyer456",
    vehicleName: "2024 Toyota Camry XLE",
    status: "pending" as const,
    monthlyPayment: 450,
    totalPrice: 32500,
    apr: 4.5,
    term: 60,
    downPayment: 5000,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  }

  const activityItems: TimelineItem[] = [
    {
      id: "1",
      title: "Offer submitted",
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
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Offers", href: "/admin/offers" },
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
                { label: "Offer ID", value: `#${offer.id.slice(0, 8).toUpperCase()}` },
                { label: "Monthly Payment", value: `$${offer.monthlyPayment}` },
                { label: "Total Price", value: `$${offer.totalPrice.toLocaleString()}` },
                { label: "APR", value: `${offer.apr}%` },
                { label: "Term", value: `${offer.term} months` },
                { label: "Down Payment", value: `$${offer.downPayment.toLocaleString()}` },
              ]}
              columns={1}
            />
            <div className="pt-4 space-y-2">
              <Button className="w-full">
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve Offer
              </Button>
              <Button variant="outline" className="w-full">
                Flag for Review
              </Button>
              <Button variant="ghost" className="w-full text-destructive">
                <XCircle className="h-4 w-4 mr-2" />
                Reject Offer
              </Button>
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
                    <h4 className="font-medium mb-3">Vehicle Information</h4>
                    <KeyValueGrid
                      items={[
                        { label: "Vehicle", value: offer.vehicleName },
                        { label: "Total Price", value: `$${offer.totalPrice.toLocaleString()}` },
                      ]}
                      columns={2}
                    />
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">Financing Terms</h4>
                    <KeyValueGrid
                      items={[
                        { label: "Monthly Payment", value: `$${offer.monthlyPayment}` },
                        { label: "APR", value: `${offer.apr}%` },
                        { label: "Term", value: `${offer.term} months` },
                        { label: "Down Payment", value: `$${offer.downPayment.toLocaleString()}` },
                      ]}
                      columns={2}
                    />
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">Timeline</h4>
                    <KeyValueGrid
                      items={[
                        { label: "Created", value: format(offer.createdAt, "PPP 'at' p") },
                        { label: "Expires", value: format(offer.expiresAt, "PPP 'at' p") },
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
                    Buyer Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <KeyValueGrid
                    items={[
                      { label: "Name", value: offer.buyerName },
                      { label: "Buyer ID", value: `#${offer.buyerId.slice(0, 8).toUpperCase()}` },
                    ]}
                    columns={1}
                  />
                  <div className="mt-4">
                    <Button variant="outline" className="w-full">
                      View Buyer Profile
                    </Button>
                  </div>
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
                    Dealer Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <KeyValueGrid
                    items={[
                      { label: "Name", value: offer.dealerName },
                      { label: "Dealer ID", value: `#${offer.dealerId.slice(0, 8).toUpperCase()}` },
                    ]}
                    columns={1}
                  />
                  <div className="mt-4">
                    <Button variant="outline" className="w-full">
                      View Dealer Profile
                    </Button>
                  </div>
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
            value: "payments",
            label: "Payments",
            content: (
              <EmptyState
                icon={DollarSign}
                title="No payments"
                description="Payment history for this offer will appear here"
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
