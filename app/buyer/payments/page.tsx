"use client"

import { useState } from "react"
import { PageHeader } from "@/components/dashboard/page-header"
import { EmptyState } from "@/components/dashboard/empty-state"
import { LoadingSkeleton } from "@/components/dashboard/loading-skeleton"
import { ErrorState } from "@/components/dashboard/error-state"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { StatusPill } from "@/components/dashboard/status-pill"
import { DollarSign, Search, Eye } from "lucide-react"
import useSWR from "swr"
import Link from "next/link"
import { format } from "date-fns"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

// Mock data for demonstration
const mockPayments = []

export default function BuyerPaymentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  
  // In a real app, this would fetch from /api/buyer/payments
  const { data, error, isLoading } = useSWR("/api/buyer/payments", fetcher, {
    fallbackData: { payments: mockPayments }
  })

  const payments = data?.payments || []
  const filteredPayments = payments.filter((payment: any) =>
    payment.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Payments" subtitle="View your payment history" />
        <LoadingSkeleton variant="table" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Payments" subtitle="View your payment history" />
        <ErrorState message="Failed to load payments" onRetry={() => window.location.reload()} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payment History"
        subtitle="Track all your payments and transactions"
        breadcrumb={[
          { label: "Dashboard", href: "/buyer/dashboard" },
          { label: "Payments" },
        ]}
      />

      {payments.length === 0 ? (
        <EmptyState
          icon={DollarSign}
          title="No payments yet"
          description="Your payment history will appear here once you start making payments"
        />
      ) : (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search payments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-3">
              {filteredPayments.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No payments found</p>
              ) : (
                filteredPayments.map((payment: any) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium truncate">{payment.description}</h3>
                        <StatusPill status={payment.status} />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(payment.date), "MMM d, yyyy")} • ${payment.amount.toLocaleString()}
                      </p>
                    </div>
                    <Link href={`/buyer/payments/${payment.id}`}>
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
