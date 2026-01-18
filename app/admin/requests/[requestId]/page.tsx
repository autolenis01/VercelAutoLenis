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
import { FileText, HandCoins, User, Building2, DollarSign, Activity, CheckCircle, XCircle } from "lucide-react"
import useSWR from "swr"
import { format } from "date-fns"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function AdminRequestDetailPage({ params }: { params: Promise<{ requestId: string }> }) {
  const { requestId } = use(params)
  
  // In a real app, this would fetch from /api/admin/requests/${requestId}
  const { data, error, isLoading } = useSWR(`/api/admin/requests/${requestId}`, fetcher, {
    fallbackData: null
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Loading..." subtitle="Loading request details" />
        <LoadingSkeleton variant="detail" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="space-y-6">
        <PageHeader title="Request Not Found" subtitle="Unable to load request" />
        <ErrorState message="Failed to load request details" onRetry={() => window.location.reload()} />
      </div>
    )
  }

  // Mock data structure
  const request = {
    id: requestId,
    title: "2024 Toyota Camry Financing",
    status: "pending" as const,
    buyerName: "John Doe",
    buyerEmail: "john.doe@example.com",
    vehicleType: "Sedan",
    maxBudget: "$35,000",
    creditScore: "Good (700-749)",
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const activityItems: TimelineItem[] = [
    {
      id: "1",
      title: "Request created",
      description: "Buyer submitted financing request",
      timestamp: new Date(),
      type: "success",
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title={request.title}
        subtitle="Financing Request Details"
        breadcrumb={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Requests", href: "/admin/requests" },
          { label: request.title },
        ]}
      />

      <DetailShell
        summaryTitle="Request Summary"
        summary={
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <StatusPill status={request.status} />
            </div>
            <KeyValueGrid
              items={[
                { label: "Request ID", value: `#${request.id.slice(0, 8).toUpperCase()}` },
                { label: "Buyer", value: request.buyerName },
                { label: "Vehicle Type", value: request.vehicleType },
                { label: "Max Budget", value: request.maxBudget },
                { label: "Credit Score", value: request.creditScore },
                { label: "Created", value: format(request.createdAt, "MMM d, yyyy") },
              ]}
              columns={1}
            />
            <div className="pt-4 space-y-2">
              <Button className="w-full">
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve Request
              </Button>
              <Button variant="outline" className="w-full">
                Flag for Review
              </Button>
              <Button variant="ghost" className="w-full text-destructive">
                <XCircle className="h-4 w-4 mr-2" />
                Reject Request
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
                  <CardTitle>Request Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <KeyValueGrid
                    items={[
                      { label: "Request ID", value: `#${request.id.slice(0, 8).toUpperCase()}` },
                      { label: "Status", value: request.status },
                      { label: "Vehicle Type", value: request.vehicleType },
                      { label: "Max Budget", value: request.maxBudget },
                      { label: "Credit Score", value: request.creditScore },
                      { label: "Created At", value: format(request.createdAt, "PPP 'at' p") },
                      { label: "Last Updated", value: format(request.updatedAt, "PPP 'at' p") },
                    ]}
                    columns={2}
                  />
                </CardContent>
              </Card>
            ),
          },
          {
            value: "offers",
            label: "Offers",
            content: (
              <EmptyState
                icon={HandCoins}
                title="No offers yet"
                description="Dealer offers for this request will appear here"
              />
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
                      { label: "Name", value: request.buyerName },
                      { label: "Email", value: request.buyerEmail },
                      { label: "Credit Score", value: request.creditScore },
                    ]}
                    columns={1}
                  />
                </CardContent>
              </Card>
            ),
          },
          {
            value: "dealer",
            label: "Dealer",
            content: (
              <EmptyState
                icon={Building2}
                title="No dealer assigned"
                description="Dealer information will appear here once offers are submitted"
              />
            ),
          },
          {
            value: "documents",
            label: "Documents",
            content: (
              <EmptyState
                icon={FileText}
                title="No documents"
                description="Request-related documents will appear here"
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
                description="Payment history for this request will appear here"
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
