"use client"

import { use } from "react"
import Link from "next/link"
import useSWR from "swr"
import { Archive, Building2, FileText, Gavel, Package, Users } from "lucide-react"

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

type InventoryItem = {
  id: string
  vehicle?: { year?: number; make?: string; model?: string }
  stockNumber?: string
  status?: string
  price?: number
  createdAt?: string
}

type Offer = { id: string; auctionId?: string; amount?: number; status?: string; createdAt?: string }
type Auction = { id: string; status?: string; offers?: number; createdAt?: string }

type DealerRecord = {
  id?: string
  name?: string
  businessName?: string
  email?: string
  phone?: string
  location?: string
  city?: string
  state?: string
  approvalStatus?: string
  status?: string
  createdAt?: string
  lastActive?: string
  inventory?: InventoryItem[]
  inventoryItems?: InventoryItem[]
  offers?: Offer[]
  auctions?: Auction[]
  documents?: { id: string; name?: string; uploadedAt?: string }[]
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

const dealerName = (dealer?: DealerRecord) => dealer?.businessName || dealer?.name || "Not available"

export default function DealerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data, error, isLoading, mutate } = useSWR(`/api/admin/dealers/${id}`, fetcher)

  const payload = (data?.payload as { dealer?: DealerRecord }) || {}
  const dealer = payload.dealer || (payload as DealerRecord | undefined)
  const statusCode = data?.status
  const unauthorized = statusCode === 401 || statusCode === 403

  const summary = dealer
    ? [
        { label: "ID", value: dealer.id || "Not available" },
        { label: "Company", value: dealerName(dealer) },
        { label: "Email", value: dealer.email || "Not available" },
        { label: "Phone", value: dealer.phone || "Not available" },
        {
          label: "Location",
          value: dealer.location || [dealer.city, dealer.state].filter(Boolean).join(", ") || "Not available",
        },
        {
          label: "Approval status",
          value: dealer.approvalStatus ? (
            <StatusPill status={(dealer.approvalStatus.toLowerCase() as any) || "pending"} />
          ) : (
            <Badge variant="outline">Not available</Badge>
          ),
        },
        { label: "Created", value: formatDate(dealer.createdAt) },
        { label: "Last active", value: formatDate(dealer.lastActive) },
      ]
    : []

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Dealer details"
          breadcrumb={[
            { label: "Admin", href: "/admin/dashboard" },
            { label: "Dealers", href: "/admin/dealers" },
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
          title="Dealer details"
          breadcrumb={[
            { label: "Admin", href: "/admin/dashboard" },
            { label: "Dealers", href: "/admin/dealers" },
            { label: "Access" },
          ]}
        />
        <ErrorState message="Admin access required. Please sign in with an admin account." onRetry={mutate} />
      </div>
    )
  }

  if (error || !dealer) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Dealer details"
          breadcrumb={[
            { label: "Admin", href: "/admin/dashboard" },
            { label: "Dealers", href: "/admin/dealers" },
            { label: "Not found" },
          ]}
        />
        <Card>
          <CardContent className="flex flex-col items-start gap-4 py-10">
            <div>
              <h3 className="text-xl font-semibold">Record not found</h3>
              <p className="text-muted-foreground">We couldn&apos;t find this dealer.</p>
            </div>
            <Button asChild>
              <Link href="/admin/dealers">Back to list</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const inventory = dealer.inventory || dealer.inventoryItems || []
  const offers = dealer.offers || []
  const auctions = dealer.auctions || []
  const documents = dealer.documents || []
  const activity =
    ((dealer.activity || []).map((item) => {
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
        title={dealerName(dealer)}
        subtitle={dealer.email || "Dealer details"}
        breadcrumb={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Dealers", href: "/admin/dealers" },
          { label: dealer.id || "Details" },
        ]}
        primaryAction={
          <Button variant="outline" asChild>
            <Link href="/admin/dealers">Back to list</Link>
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
                    <Building2 className="h-5 w-5" />
                    Company info
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2">
                  <KeyValueGrid
                    items={[
                      { label: "Company", value: dealerName(dealer) },
                      { label: "Email", value: dealer.email || "Not available" },
                      { label: "Phone", value: dealer.phone || "Not available" },
                      { label: "Location", value: dealer.location || [dealer.city, dealer.state].filter(Boolean).join(", ") || "Not available" },
                      { label: "Approval status", value: dealer.approvalStatus || "Not available" },
                      { label: "Created", value: formatDate(dealer.createdAt) },
                    ]}
                    columns={2}
                  />
                </CardContent>
              </Card>
            ),
          },
          {
            value: "inventory",
            label: "Inventory",
            content: inventory.length ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Inventory ({inventory.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Vehicle</TableHead>
                        <TableHead>Stock #</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {inventory.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            {item.vehicle
                              ? `${item.vehicle.year ?? ""} ${item.vehicle.make ?? ""} ${item.vehicle.model ?? ""}`.trim()
                              : "Not available"}
                          </TableCell>
                          <TableCell className="font-mono text-sm">{item.stockNumber || "Not available"}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="capitalize">
                              {item.status || "available"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{formatDate(item.createdAt)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ) : (
              <EmptyState
                icon={Package}
                title="No inventory"
                description="This dealer has not added any inventory yet."
              />
            ),
          },
          {
            value: "offers",
            label: "Auctions / Offers",
            content: auctions.length || offers.length ? (
              <div className="space-y-4">
                {auctions.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Gavel className="h-5 w-5" />
                        Auctions ({auctions.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Offers</TableHead>
                            <TableHead>Created</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {auctions.map((auction) => (
                            <TableRow key={auction.id}>
                              <TableCell className="font-mono text-sm">{auction.id}</TableCell>
                              <TableCell>
                                <Badge variant="secondary" className="capitalize">
                                  {auction.status || "Not available"}
                                </Badge>
                              </TableCell>
                              <TableCell>{auction.offers ?? 0}</TableCell>
                              <TableCell className="text-muted-foreground">{formatDate(auction.createdAt)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                )}

                {offers.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Offers ({offers.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Auction</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {offers.map((offer) => (
                            <TableRow key={offer.id}>
                              <TableCell className="font-mono text-sm">{offer.id}</TableCell>
                              <TableCell className="font-mono text-sm">{offer.auctionId || "Not available"}</TableCell>
                              <TableCell className="font-medium">${((offer.amount as number) || 0).toLocaleString()}</TableCell>
                              <TableCell>
                                <StatusPill status={(offer.status?.toLowerCase() as any) || "pending"} />
                              </TableCell>
                              <TableCell className="text-muted-foreground">{formatDate(offer.createdAt)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <EmptyState
                icon={Gavel}
                title="No offers yet"
                description="This dealer has not participated in auctions or offers yet."
              />
            ),
          },
          {
            value: "documents",
            label: "Documents",
            content: documents.length ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Documents ({documents.length})
                  </CardTitle>
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
                icon={Archive}
                title="No documents"
                description="No documents are available for this dealer."
              />
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
