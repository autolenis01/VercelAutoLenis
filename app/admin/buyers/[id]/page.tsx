"use client"

import { use } from "react"
import Link from "next/link"
import useSWR from "swr"
import { BadgeCheck, FileText, UserRound } from "lucide-react"

import { ActivityTimeline } from "@/components/dashboard/activity-timeline"
import { DetailShell } from "@/components/dashboard/detail-shell"
import { EmptyState } from "@/components/dashboard/empty-state"
import { ErrorState } from "@/components/dashboard/error-state"
import { KeyValueGrid } from "@/components/dashboard/key-value-grid"
import { LoadingSkeleton } from "@/components/dashboard/loading-skeleton"
import { PageHeader } from "@/components/dashboard/page-header"
import { StatusPill } from "@/components/dashboard/status-pill"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type BuyerRecord = {
  id?: string
  firstName?: string
  lastName?: string
  name?: string
  email?: string
  phone?: string
  status?: string
  onboardingStep?: string
  createdAt?: string
  lastActive?: string
  requests?: { id: string; type?: string; status?: string; createdAt?: string }[]
  documents?: { id: string; name?: string; uploadedAt?: string }[]
  payments?: { id: string; amount?: number; status?: string; createdAt?: string }[]
  activity?: { id: string; title: string; description?: string; timestamp: string; type?: string }[]
}

const fetcher = async (url: string) => {
  const res = await fetch(url)
  const payload = await res.json().catch(() => ({}))
  return { payload, status: res.status }
}

const formatDate = (value?: string) => {
  if (!value) return "Not available"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "Not available"
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

const displayName = (buyer?: BuyerRecord) => {
  if (!buyer) return "Not available"
  if (buyer.name) return buyer.name
  if (buyer.firstName || buyer.lastName) return [buyer.firstName, buyer.lastName].filter(Boolean).join(" ")
  return "Not available"
}

export default function BuyerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data, error, isLoading, mutate } = useSWR(`/api/admin/buyers/${id}`, fetcher)

  const payload = (data?.payload as { buyer?: BuyerRecord }) || {}
  const buyer = payload.buyer || (payload as BuyerRecord | undefined)
  const statusCode = data?.status
  const unauthorized = statusCode === 401 || statusCode === 403

  const summary = buyer
    ? [
        { label: "ID", value: buyer.id || "Not available" },
        { label: "Full name", value: displayName(buyer) },
        { label: "Email", value: buyer.email || "Not available" },
        { label: "Phone", value: buyer.phone || "Not available" },
        {
          label: "Status",
          value: buyer.status ? (
            <StatusPill status={(buyer.status.toLowerCase() as any) || "pending"} />
          ) : (
            <Badge variant="outline">Not available</Badge>
          ),
        },
        { label: "Onboarding step", value: buyer.onboardingStep || "Not available" },
        { label: "Created", value: formatDate(buyer.createdAt) },
        { label: "Last active", value: formatDate(buyer.lastActive) },
      ]
    : []

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Buyer details"
          breadcrumb={[
            { label: "Admin", href: "/admin/dashboard" },
            { label: "Buyers", href: "/admin/buyers" },
            { label: "Loading" },
          ]}
        />
        <LoadingSkeleton variant="detail" />
      </div>
    )
  }

  if (unauthorized) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Buyer details"
          breadcrumb={[
            { label: "Admin", href: "/admin/dashboard" },
            { label: "Buyers", href: "/admin/buyers" },
            { label: "Access" },
          ]}
        />
        <ErrorState message="Admin access required. Please sign in with an admin account." onRetry={mutate} />
      </div>
    )
  }

  if (error || !buyer) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Buyer details"
          breadcrumb={[
            { label: "Admin", href: "/admin/dashboard" },
            { label: "Buyers", href: "/admin/buyers" },
            { label: "Not found" },
          ]}
        />
        <Card>
          <CardContent className="flex flex-col items-start gap-4 py-10">
            <div>
              <h3 className="text-xl font-semibold">Record not found</h3>
              <p className="text-muted-foreground">We couldn&apos;t find this buyer.</p>
            </div>
            <Button asChild>
              <Link href="/admin/buyers">Back to list</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const requests = buyer.requests || []
  const documents = buyer.documents || []
  const payments = buyer.payments || []
  const activity =
    ((buyer.activity || []).map((item) => {
      const timestamp = item.timestamp ? new Date(item.timestamp) : new Date()
      if (Number.isNaN(timestamp.getTime())) return null
      return {
        id: item.id,
        title: item.title,
        description: item.description,
        timestamp,
        type: (item.type as any) || "default",
      }
    }) as any[]).filter(Boolean) || []

  return (
    <div className="space-y-6">
      <PageHeader
        title={displayName(buyer)}
        subtitle={buyer.email || "Buyer details"}
        breadcrumb={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Buyers", href: "/admin/buyers" },
          { label: buyer.id || "Details" },
        ]}
        primaryAction={
          <Button variant="outline" asChild>
            <Link href="/admin/buyers">Back to list</Link>
          </Button>
        }
      />

      <DetailShell
        summaryTitle="Overview"
        summary={<KeyValueGrid items={summary} columns={1} />}
        defaultTab="overview"
        tabs={[
          {
            value: "overview",
            label: "Overview",
            content: (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserRound className="h-5 w-5" />
                    Profile & Contact
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2">
                  <KeyValueGrid
                    items={[
                      { label: "Full name", value: displayName(buyer) },
                      { label: "Email", value: buyer.email || "Not available" },
                      { label: "Phone", value: buyer.phone || "Not available" },
                      { label: "Status", value: buyer.status || "Not available" },
                      { label: "Onboarding step", value: buyer.onboardingStep || "Not available" },
                      { label: "Created", value: formatDate(buyer.createdAt) },
                    ]}
                    columns={2}
                  />
                </CardContent>
              </Card>
            ),
          },
          {
            value: "requests",
            label: "Requests",
            content: requests.length ? (
              <Card>
                <CardHeader>
                  <CardTitle>Requests</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {requests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-mono text-sm">{request.id}</TableCell>
                          <TableCell>{request.type || "Not available"}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="capitalize">
                              {request.status || "pending"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{formatDate(request.createdAt)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ) : (
              <EmptyState
                icon={FileText}
                title="No requests"
                description="This buyer has not submitted any requests."
              />
            ),
          },
          {
            value: "documents",
            label: "Documents",
            content: documents.length ? (
              <Card>
                <CardHeader>
                  <CardTitle>Documents ({documents.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between rounded-lg border px-4 py-3">
                      <div className="space-y-1">
                        <p className="font-medium">{doc.name || "Document"}</p>
                        <p className="text-sm text-muted-foreground">Uploaded {formatDate(doc.uploadedAt)}</p>
                      </div>
                      <Badge variant="outline">View</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ) : (
              <EmptyState
                icon={FileText}
                title="No documents"
                description="No documents have been uploaded for this buyer."
              />
            ),
          },
          {
            value: "payments",
            label: "Payments",
            content: payments.length ? (
              <Card>
                <CardHeader>
                  <CardTitle>Payments</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell className="font-mono text-sm">{payment.id}</TableCell>
                          <TableCell className="font-medium">
                            ${((payment.amount as number) || 0).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <StatusPill status={(payment.status?.toLowerCase() as any) || "pending"} />
                          </TableCell>
                          <TableCell className="text-muted-foreground">{formatDate(payment.createdAt)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ) : (
              <EmptyState icon={BadgeCheck} title="No payments" description="No payment records available." />
            ),
          },
          {
            value: "activity",
            label: "Activity",
            content: (
              <Card>
                <CardHeader>
                  <CardTitle>Activity timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <ActivityTimeline items={activity} />
                </CardContent>
              </Card>
            ),
          },
        ]}
      />
    </div>
  )
}
