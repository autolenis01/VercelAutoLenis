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
import { FileText, Search, Plus, Eye } from "lucide-react"
import useSWR from "swr"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

// Mock data for demonstration
const mockRequests = []

export default function BuyerRequestsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  
  // In a real app, this would fetch from /api/buyer/requests
  const { data, error, isLoading } = useSWR("/api/buyer/requests", fetcher, {
    fallbackData: { requests: mockRequests }
  })

  const requests = data?.requests || []
  const filteredRequests = requests.filter((req: any) =>
    req.title?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Financing Requests" subtitle="Manage your financing requests" />
        <LoadingSkeleton variant="table" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Financing Requests" subtitle="Manage your financing requests" />
        <ErrorState message="Failed to load financing requests" onRetry={() => window.location.reload()} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Financing Requests"
        subtitle="Track and manage your financing requests"
        primaryAction={
          <Button onClick={() => router.push("/buyer/prequal")}>
            <Plus className="h-4 w-4 mr-2" />
            New Request
          </Button>
        }
        breadcrumb={[
          { label: "Dashboard", href: "/buyer/dashboard" },
          { label: "Requests" },
        ]}
      />

      {requests.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No financing requests yet"
          description="Start a request to get matched with dealers and receive competitive offers"
          primaryCta={{
            label: "Start a Request",
            onClick: () => router.push("/buyer/prequal"),
          }}
        />
      ) : (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search requests..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-3">
              {filteredRequests.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No requests found</p>
              ) : (
                filteredRequests.map((request: any) => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium truncate">{request.title}</h3>
                        <StatusPill status={request.status} />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {request.vehicleType} • Created {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                    <Link href={`/buyer/requests/${request.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </Link>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
