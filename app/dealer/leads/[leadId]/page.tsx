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
import { FileText, MessageSquare, Activity, User, Send } from "lucide-react"
import useSWR from "swr"
import { format } from "date-fns"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function DealerLeadDetailPage({ params }: { params: Promise<{ leadId: string }> }) {
  const { leadId } = use(params)
  
  const { data, error, isLoading } = useSWR(`/api/dealer/leads/${leadId}`, fetcher, {
    fallbackData: null
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Loading..." subtitle="Loading lead details" />
        <LoadingSkeleton variant="detail" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="space-y-6">
        <PageHeader title="Lead Not Found" subtitle="Unable to load lead" />
        <ErrorState message="Failed to load lead details" onRetry={() => window.location.reload()} />
      </div>
    )
  }

  const lead = {
    id: leadId,
    buyerName: "John Smith",
    vehicleType: "SUV",
    status: "active" as const,
    maxBudget: 45000,
    creditScore: 720,
    downPayment: 8000,
    preferredTerm: 60,
    employmentStatus: "Full-time",
    annualIncome: 85000,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const activityItems: TimelineItem[] = [
    {
      id: "1",
      title: "Lead received",
      description: `New financing request from ${lead.buyerName}`,
      timestamp: new Date(),
      type: "success",
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title={lead.buyerName}
        subtitle={`${lead.vehicleType} Financing Request`}
        breadcrumb={[
          { label: "Dashboard", href: "/dealer/dashboard" },
          { label: "Leads", href: "/dealer/leads" },
          { label: lead.buyerName },
        ]}
      />

      <DetailShell
        summaryTitle="Lead Summary"
        summary={
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <StatusPill status={lead.status} />
            </div>
            <KeyValueGrid
              items={[
                { label: "Lead ID", value: `#${lead.id.slice(0, 8).toUpperCase()}` },
                { label: "Vehicle Type", value: lead.vehicleType },
                { label: "Max Budget", value: `$${lead.maxBudget.toLocaleString()}` },
                { label: "Credit Score", value: lead.creditScore.toString() },
                { label: "Down Payment", value: `$${lead.downPayment.toLocaleString()}` },
                { label: "Received", value: format(lead.createdAt, "MMM d, yyyy") },
              ]}
              columns={1}
            />
            <div className="pt-4 space-y-2">
              <Button className="w-full">Submit Offer</Button>
              <Button variant="outline" className="w-full">
                <MessageSquare className="h-4 w-4 mr-2" />
                Message Buyer
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
                  <CardTitle>Lead Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-3">Buyer Information</h4>
                    <KeyValueGrid
                      items={[
                        { label: "Name", value: lead.buyerName },
                        { label: "Employment", value: lead.employmentStatus },
                        { label: "Annual Income", value: `$${lead.annualIncome.toLocaleString()}` },
                      ]}
                      columns={2}
                    />
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">Financing Requirements</h4>
                    <KeyValueGrid
                      items={[
                        { label: "Vehicle Type", value: lead.vehicleType },
                        { label: "Max Budget", value: `$${lead.maxBudget.toLocaleString()}` },
                        { label: "Preferred Term", value: `${lead.preferredTerm} months` },
                        { label: "Down Payment", value: `$${lead.downPayment.toLocaleString()}` },
                      ]}
                      columns={2}
                    />
                  </div>
                </CardContent>
              </Card>
            ),
          },
          {
            value: "submit-offer",
            label: "Submit Offer",
            content: (
              <Card>
                <CardHeader>
                  <CardTitle>Create Offer</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Submit a competitive offer for this financing request
                  </p>
                  <Button>
                    <Send className="h-4 w-4 mr-2" />
                    Create Offer
                  </Button>
                </CardContent>
              </Card>
            ),
          },
          {
            value: "buyer-docs",
            label: "Buyer Docs",
            content: (
              <EmptyState
                icon={FileText}
                title="No documents"
                description="Buyer documents will appear here once submitted"
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
                description="Start a conversation with the buyer"
                primaryCta={{
                  label: "Send Message",
                  onClick: () => {},
                }}
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
