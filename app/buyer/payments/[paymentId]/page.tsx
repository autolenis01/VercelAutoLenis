"use client"

import { use } from "react"
import { ProtectedRoute } from "@/components/layout/protected-route"
import { PageHeader } from "@/components/dashboard/page-header"
import { KeyValueGrid } from "@/components/dashboard/key-value-grid"
import { StatusPill } from "@/components/dashboard/status-pill"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Receipt, Download, Printer, CreditCard } from "lucide-react"

export default function BuyerPaymentDetailPage({
  params,
}: {
  params: Promise<{ paymentId: string }>
}) {
  const { paymentId } = use(params)

  // Mock payment data - in production this would fetch from API
  const payment = {
    id: paymentId,
    type: "DEPOSIT",
    amount: 9900,
    status: "COMPLETED",
    createdAt: "2024-01-15T10:30:00Z",
    method: "Credit Card",
    last4: "4242",
    description: "Refundable deposit for vehicle purchase",
  }

  return (
    <ProtectedRoute allowedRoles={["BUYER"]}>
      <div className="space-y-6">
        <PageHeader
          title="Payment Receipt"
          subtitle={`Transaction ID: ${paymentId.slice(0, 8)}`}
          backHref="/buyer/payments"
          backLabel="Back to Payments"
          secondaryActions={[
            {
              label: "Print",
              icon: <Printer className="h-4 w-4 mr-2" />,
              onClick: () => window.print(),
              variant: "outline",
            },
            {
              label: "Download",
              icon: <Download className="h-4 w-4 mr-2" />,
              onClick: () => {},
              variant: "outline",
            },
          ]}
        />

        <div className="max-w-2xl">
          <Card>
            <CardHeader className="text-center border-b">
              <div className="w-16 h-16 rounded-full bg-[#7ED321]/10 flex items-center justify-center mx-auto mb-4">
                <Receipt className="h-8 w-8 text-[#7ED321]" />
              </div>
              <CardTitle className="text-2xl">
                ${(payment.amount / 100).toLocaleString()}
              </CardTitle>
              <StatusPill status={payment.status.toLowerCase()} className="mt-2" />
            </CardHeader>

            <CardContent className="pt-6 space-y-6">
              <div>
                <h3 className="font-semibold mb-4">Transaction Details</h3>
                <KeyValueGrid
                  columns={2}
                  items={[
                    { label: "Transaction ID", value: paymentId.slice(0, 12) },
                    { label: "Date", value: new Date(payment.createdAt).toLocaleString() },
                    { label: "Type", value: payment.type === "DEPOSIT" ? "Refundable Deposit" : "Concierge Fee" },
                    { label: "Status", value: <StatusPill status={payment.status.toLowerCase()} /> },
                  ]}
                />
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-4">Payment Method</h3>
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{payment.method}</p>
                    <p className="text-sm text-muted-foreground">Ending in {payment.last4}</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-4">Description</h3>
                <p className="text-muted-foreground">{payment.description}</p>
              </div>

              {payment.type === "DEPOSIT" && payment.status === "COMPLETED" && (
                <>
                  <Separator />
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-800 mb-1">Refundable Deposit</h4>
                    <p className="text-sm text-yellow-700">
                      This deposit is fully refundable if you decide not to proceed with a vehicle
                      purchase. Contact support if you need assistance.
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
