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
const mockPayouts = []

export default function AdminPayoutsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("pending")

  // In a real app, this would fetch from /api/admin/payouts
  const { data, error, isLoading } = useSWR("/api/admin/payouts", fetcher, {
    fallbackData: { payouts: mockPayouts }
  })

  const payouts = data?.payouts || []
  const filteredPayouts = payouts.filter((payout: any) => {
    const matchesSearch = payout.affiliateName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         payout.affiliateEmail?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || payout.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const pendingCount = payouts.filter((p: any) => p.status === "pending").length
  const totalPending = payouts
    .filter((p: any) => p.status === "pending")
    .reduce((sum: number, p: any) => sum + p.amount, 0)

  const handleProcessPayout = async (payoutId: string) => {
    // In a real app, this would submit to /api/admin/payouts/${payoutId}/process
    console.log("Processing payout:", payoutId)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Affiliate Payouts" subtitle="Manage affiliate payouts" />
        <LoadingSkeleton variant="table" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Affiliate Payouts" subtitle="Manage affiliate payouts" />
        <ErrorState message="Failed to load payouts" onRetry={() => window.location.reload()} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Affiliate Payouts"
        subtitle={`Manage affiliate commission payouts${pendingCount > 0 ? ` (${pendingCount} pending)` : ""}`}
        breadcrumb={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Payments", href: "/admin/payments" },
          { label: "Payouts" },
        ]}
      />

      {pendingCount > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <AlertCircle className="h-8 w-8 text-orange-500 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-orange-900">Pending Payouts</h3>
                <p className="text-sm text-orange-700">
                  {pendingCount} payout{pendingCount !== 1 ? "s" : ""} totaling ${totalPending.toFixed(2)} waiting to be processed
                </p>
              </div>
              <Button variant="default">Process All</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {payouts.length === 0 ? (
        <EmptyState
          icon={DollarSign}
          title="No payout requests"
          description="Affiliate payout requests will appear here"
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Payout Requests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by affiliate name or email..."
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
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              {filteredPayouts.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No payouts found</p>
              ) : (
                filteredPayouts.map((payout: any) => (
                  <div
                    key={payout.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-semibold">${payout.amount.toFixed(2)}</h3>
                        <StatusPill status={payout.status} />
                        {payout.status === "pending" && (
                          <AlertCircle className="h-4 w-4 text-orange-500" />
                        )}
                        {payout.status === "completed" && (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                      <p className="text-sm font-medium text-foreground">
                        {payout.affiliateName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {payout.affiliateEmail}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Commission from {payout.dealsCount} deal{payout.dealsCount !== 1 ? "s" : ""}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Requested {formatDistanceToNow(new Date(payout.requestedAt), { addSuffix: true })}
                      </p>
                      {payout.paymentMethod && (
                        <p className="text-xs text-muted-foreground">
                          Payment method: {payout.paymentMethod}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {payout.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleProcessPayout(payout.id)}
                          >
                            Process Payout
                          </Button>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </>
                      )}
                      {payout.status === "completed" && (
                        <Button variant="outline" size="sm" disabled>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Completed
                        </Button>
                      )}
                      {payout.status === "processing" && (
                        <Button variant="outline" size="sm" disabled>
                          Processing...
                        </Button>
                      )}
                      {payout.status === "failed" && (
                        <Button variant="destructive" size="sm">
                          Retry
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
