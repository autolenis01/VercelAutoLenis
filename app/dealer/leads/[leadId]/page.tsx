"use client"

import { use, useState } from "react"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Car, User, FileText, MessageSquare, DollarSign, Send } from "lucide-react"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function DealerLeadDetailPage({
  params,
}: {
  params: Promise<{ leadId: string }>
}) {
  const { leadId } = use(params)
  const [showModal, setShowModal] = useState(false)
  const { data, error, isLoading, mutate } = useSWR(`/api/dealer/auctions/${leadId}`, fetcher)

  const lead = data?.auction

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Loading..." backHref="/dealer/leads" backLabel="Back to Leads" />
        <LoadingSkeleton variant="detail" />
      </div>
    )
  }

  if (error || !lead) {
    return (
      <div className="space-y-6">
        <PageHeader title="Lead Not Found" backHref="/dealer/leads" backLabel="Back to Leads" />
        <ErrorState message="Failed to load lead details" onRetry={() => mutate()} />
      </div>
    )
  }

  const vehicle = lead.inventoryItem?.vehicle

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${vehicle?.year || ""} ${vehicle?.make || ""} ${vehicle?.model || ""}`}
        subtitle={`Lead ID: ${leadId.slice(0, 8)}`}
        backHref="/dealer/leads"
        backLabel="Back to Leads"
        breadcrumbs={[
          { label: "Leads", href: "/dealer/leads" },
          { label: `${vehicle?.make || "Lead"} ${vehicle?.model || ""}` },
        ]}
      />

      <DetailShell
        summary={{
          title: "Lead Summary",
          content: (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-[#7ED321]/10 flex items-center justify-center">
                  <Car className="h-6 w-6 text-[#7ED321]" />
                </div>
                <div>
                  <p className="font-semibold">
                    {vehicle?.year} {vehicle?.make} {vehicle?.model}
                  </p>
                  <StatusPill status={lead.status?.toLowerCase() || "active"} />
                </div>
              </div>
              <KeyValueGrid
                columns={1}
                items={[
                  { label: "Received", value: new Date(lead.createdAt).toLocaleDateString() },
                  { label: "Auction Ends", value: lead.endsAt ? new Date(lead.endsAt).toLocaleString() : "—" },
                  { label: "Your Offers", value: lead.myOffers?.length || 0 },
                ]}
              />
            </div>
          ),
          actions: (
            <Button className="w-full bg-[#7ED321] hover:bg-[#7ED321]/90" onClick={() => setShowModal(true)}>
              <Send className="h-4 w-4 mr-2" />
              Submit Offer
            </Button>
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
                        { label: "VIN", value: vehicle?.vin?.slice(0, 11) + "..." || "—" },
                      ]}
                    />
                  </CardContent>
                </Card>
              </div>
            ),
          },
          {
            id: "submit-offer",
            label: "Submit Offer",
            content: (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Create Your Offer
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Cash Price (OTD)</Label>
                      <Input type="number" placeholder="Enter price" />
                    </div>
                    <div className="space-y-2">
                      <Label>Monthly Payment (Optional)</Label>
                      <Input type="number" placeholder="Enter payment" />
                    </div>
                  </div>
                  <Button className="w-full bg-[#7ED321] hover:bg-[#7ED321]/90" onClick={() => setShowModal(true)}>
                    Submit Offer
                  </Button>
                </CardContent>
              </Card>
            ),
          },
          {
            id: "buyer-docs",
            label: "Buyer Docs",
            content: (
              <EmptyState
                icon={<FileText className="h-8 w-8 text-muted-foreground" />}
                title="Documents not available"
                description="Buyer documents will be shared once the deal is accepted."
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
                description="Start a conversation with the buyer about this vehicle."
                primaryCta={{ label: "Send Message", onClick: () => setShowModal(true) }}
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
                    title: "Lead received",
                    description: "Buyer submitted a request for this vehicle",
                    timestamp: new Date(lead.createdAt).toLocaleDateString(),
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
  )
}
