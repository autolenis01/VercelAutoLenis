"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/dashboard/page-header"
import { EmptyState } from "@/components/dashboard/empty-state"
import { LoadingSkeleton } from "@/components/dashboard/loading-skeleton"
import { ErrorState } from "@/components/dashboard/error-state"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { StatusPill } from "@/components/dashboard/status-pill"
import { Users, Search, Eye, LayoutGrid, List } from "lucide-react"
import useSWR from "swr"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const mockLeads = []

export default function DealerLeadsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"list" | "card">("card")
  
  const { data, error, isLoading } = useSWR("/api/dealer/leads", fetcher, {
    fallbackData: { leads: mockLeads }
  })

  const leads = data?.leads || []
  const filteredLeads = leads.filter((lead: any) =>
    lead.buyerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.vehicleType?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Leads" subtitle="Buyer financing requests" />
        <LoadingSkeleton variant="cards" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Leads" subtitle="Buyer financing requests" />
        <ErrorState message="Failed to load leads" onRetry={() => window.location.reload()} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Buyer Leads"
        subtitle="New financing requests matching your criteria"
        breadcrumb={[
          { label: "Dashboard", href: "/dealer/dashboard" },
          { label: "Leads" },
        ]}
      />

      {leads.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No active leads yet"
          description="New financing requests matching your criteria will appear here"
          primaryCta={{
            label: "Update Lead Preferences",
            onClick: () => router.push("/dealer/settings"),
          }}
        />
      ) : (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by buyer name or vehicle type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === "card" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("card")}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {viewMode === "card" ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredLeads.length === 0 ? (
                  <div className="col-span-full">
                    <p className="text-sm text-muted-foreground text-center py-8">No leads found</p>
                  </div>
                ) : (
                  filteredLeads.map((lead: any) => (
                    <Card key={lead.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold">{lead.buyerName}</h3>
                            <p className="text-sm text-muted-foreground">{lead.vehicleType}</p>
                          </div>
                          <StatusPill status={lead.status} />
                        </div>
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Budget:</span>
                            <span className="font-semibold">${lead.maxBudget.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Credit Score:</span>
                            <span className="font-semibold">{lead.creditScore}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Received {formatDistanceToNow(new Date(lead.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                        <Link href={`/dealer/leads/${lead.id}`}>
                          <Button variant="outline" className="w-full" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredLeads.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">No leads found</p>
                ) : (
                  filteredLeads.map((lead: any) => (
                    <div
                      key={lead.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium truncate">{lead.buyerName}</h3>
                          <StatusPill status={lead.status} />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {lead.vehicleType} • Budget: ${lead.maxBudget.toLocaleString()} • Credit: {lead.creditScore}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Received {formatDistanceToNow(new Date(lead.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                      <Link href={`/dealer/leads/${lead.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </Link>
                    </div>
                  ))
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
