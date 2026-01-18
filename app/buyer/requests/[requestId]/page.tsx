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
import { FileText, HandCoins, MessageSquare, DollarSign, Activity } from "lucide-react"
import useSWR from "swr"
import { format } from "date-fns"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function BuyerRequestDetailPage({ params }: { params: Promise<{ requestId: string }> }) {
  const { requestId } = use(params)
  
  // In a real app, this would fetch from /api/buyer/requests/${requestId}
  const { data, error, isLoading } = useSWR(`/api/buyer/requests/${requestId}`, fetcher, {
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
    vehicleType: "Sedan",
    maxBudget: "$35,000",
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const activityItems: TimelineItem[] = [
    {
      id: "1",
      title: "Request created",
      description: "Your financing request was submitted",
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
          { label: "Dashboard", href: "/buyer/dashboard" },
          { label: "Requests", href: "/buyer/requests" },
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
                { label: "Vehicle Type", value: request.vehicleType },
                { label: "Max Budget", value: request.maxBudget },
                { label: "Created", value: format(request.createdAt, "MMM d, yyyy") },
                { label: "Last Updated", value: format(request.updatedAt, "MMM d, yyyy") },
              ]}
              columns={1}
            />
            <div className="pt-4 space-y-2">
              <Button className="w-full">Edit Request</Button>
              <Button variant="outline" className="w-full">Cancel Request</Button>
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
                  <p className="text-muted-foreground">
                    Complete request information and requirements will be displayed here.
                  </p>
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
                description="Dealers will submit offers for this request soon"
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
                description="Upload required documents to support this request"
                primaryCta={{
                  label: "Upload Documents",
                  onClick: () => {},
                }}
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
            value: "messages",
            label: "Messages",
            content: (
              <EmptyState
                icon={MessageSquare}
                title="No messages"
                description="Messages related to this request will appear here"
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
