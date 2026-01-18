"use client"

import { useState } from "react"
import { PageHeader } from "@/components/dashboard/page-header"
import { LoadingSkeleton } from "@/components/dashboard/loading-skeleton"
import { ErrorState } from "@/components/dashboard/error-state"
import { EmptyState } from "@/components/dashboard/empty-state"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { StatusPill } from "@/components/dashboard/status-pill"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DollarSign, Search, CheckCircle, AlertCircle } from "lucide-react"
import useSWR from "swr"
import { formatDistanceToNow } from "date-fns"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

// Mock data for demonstration
const mockRefunds = []

export default function AdminRefundsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("pending")

  // In a real app, this would fetch from /api/admin/refunds
  const { data, error, isLoading } = useSWR("/api/admin/refunds", fetcher, {
    fallbackData: { refunds: mockRefunds }
  })

  const refunds = data?.refunds || []
  const filteredRefunds = refunds.filter((refund: any) => {
    const matchesSearch = refund.buyerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         refund.transactionId?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || refund.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const pendingCount = refunds.filter((r: any) => r.status === "pending").length

  const handleProcessRefund = async (refundId: string) => {
    // In a real app, this would submit to /api/admin/refunds/${refundId}/process
    console.log("Processing refund:", refundId)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Refunds" subtitle="Manage refund requests" />
        <LoadingSkeleton variant="table" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Refunds" subtitle="Manage refund requests" />
        <ErrorState message="Failed to load refunds" onRetry={() => window.location.reload()} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Refund Center"
        subtitle={`Manage refund requests${pendingCount > 0 ? ` (${pendingCount} pending)` : ""}`}
        breadcrumb={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Payments", href: "/admin/payments" },
          { label: "Refunds" },
        ]}
      />

      {refunds.length === 0 ? (
        <EmptyState
          icon={DollarSign}
          title="No refund requests"
          description="Refund requests will appear here"
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Refund Requests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by buyer name or transaction ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              {filteredRefunds.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No refunds found</p>
              ) : (
                filteredRefunds.map((refund: any) => (
                  <div
                    key={refund.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-semibold">${refund.amount}</h3>
                        <StatusPill status={refund.status} />
                        {refund.status === "pending" && (
                          <AlertCircle className="h-4 w-4 text-orange-500" />
                        )}
                        {refund.status === "completed" && (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {refund.buyerName} • Transaction #{refund.transactionId.slice(0, 8).toUpperCase()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Requested {formatDistanceToNow(new Date(refund.requestedAt), { addSuffix: true })}
                      </p>
                      {refund.reason && (
                        <p className="text-sm text-muted-foreground mt-1 italic">
                          Reason: {refund.reason}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {refund.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleProcessRefund(refund.id)}
                          >
                            Process Refund
                          </Button>
                          <Button variant="ghost" size="sm">
                            Reject
                          </Button>
                        </>
                      )}
                      {refund.status === "completed" && (
                        <Button variant="outline" size="sm" disabled>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Completed
                        </Button>
                      )}
                      {refund.status === "processing" && (
                        <Button variant="outline" size="sm" disabled>
                          Processing...
                        </Button>
                      )}
                    </div>
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
