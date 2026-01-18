"use client"

import { use } from "react"
import { PageHeader } from "@/components/dashboard/page-header"
import { KeyValueGrid } from "@/components/dashboard/key-value-grid"
import { StatusPill } from "@/components/dashboard/status-pill"
import { LoadingSkeleton } from "@/components/dashboard/loading-skeleton"
import { ErrorState } from "@/components/dashboard/error-state"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Receipt } from "lucide-react"
import useSWR from "swr"
import { format } from "date-fns"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function BuyerPaymentDetailPage({ params }: { params: Promise<{ paymentId: string }> }) {
  const { paymentId } = use(params)
  
  // In a real app, this would fetch from /api/buyer/payments/${paymentId}
  const { data, error, isLoading } = useSWR(`/api/buyer/payments/${paymentId}`, fetcher, {
    fallbackData: null
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Loading..." subtitle="Loading payment details" />
        <LoadingSkeleton variant="detail" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="space-y-6">
        <PageHeader title="Payment Not Found" subtitle="Unable to load payment" />
        <ErrorState message="Failed to load payment details" onRetry={() => window.location.reload()} />
      </div>
    )
  }

  // Mock data structure
  const payment = {
    id: paymentId,
    description: "Concierge Fee Payment",
    amount: 499,
    status: "paid" as const,
    date: new Date(),
    method: "Credit Card",
    last4: "4242",
    transactionId: "txn_" + paymentId.slice(0, 12),
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payment Receipt"
        subtitle={payment.description}
        primaryAction={
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        }
        breadcrumb={[
          { label: "Dashboard", href: "/buyer/dashboard" },
          { label: "Payments", href: "/buyer/payments" },
          { label: `Payment ${payment.id.slice(0, 8)}` },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Payment Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b">
              <span className="text-sm text-muted-foreground">Status</span>
              <StatusPill status={payment.status} />
            </div>
            <KeyValueGrid
              items={[
                { label: "Amount", value: `$${payment.amount.toLocaleString()}` },
                { label: "Date", value: format(payment.date, "MMMM d, yyyy") },
                { label: "Payment Method", value: `${payment.method} ending in ${payment.last4}` },
                { label: "Transaction ID", value: payment.transactionId },
                { label: "Description", value: payment.description },
              ]}
              columns={1}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Invoice Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${payment.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Processing Fee</span>
                <span>$0.00</span>
              </div>
            </div>
            <div className="pt-4 border-t">
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>${payment.amount.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            If you have questions about this payment, please contact our support team.
          </p>
          <Button variant="outline">Contact Support</Button>
        </CardContent>
      </Card>
    </div>
  )
}
