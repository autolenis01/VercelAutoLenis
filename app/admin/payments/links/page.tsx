"use client"

import { useState } from "react"
import { PageHeader } from "@/components/dashboard/page-header"
import { LoadingSkeleton } from "@/components/dashboard/loading-skeleton"
import { ErrorState } from "@/components/dashboard/error-state"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { StatusPill } from "@/components/dashboard/status-pill"
import { Send, Link as LinkIcon, CheckCircle } from "lucide-react"
import useSWR from "swr"
import { formatDistanceToNow } from "date-fns"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

// Mock data for demonstration
const mockPaymentLinks = []

export default function AdminPaymentLinksPage() {
  const [recipientEmail, setRecipientEmail] = useState("")
  const [recipientName, setRecipientName] = useState("")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // In a real app, this would fetch from /api/admin/payment-links
  const { data, error, isLoading } = useSWR("/api/admin/payment-links", fetcher, {
    fallbackData: { paymentLinks: mockPaymentLinks }
  })

  const handleSendPaymentLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // In a real app, this would submit to /api/admin/payment-links
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log("Payment link sent:", { recipientEmail, recipientName, amount, description })
    
    // Reset form
    setRecipientEmail("")
    setRecipientName("")
    setAmount("")
    setDescription("")
    setIsSubmitting(false)
  }

  const paymentLinks = data?.paymentLinks || []

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Payment Links" subtitle="Send payment links to buyers" />
        <LoadingSkeleton variant="cards" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Payment Links" subtitle="Send payment links to buyers" />
        <ErrorState message="Failed to load payment links" onRetry={() => window.location.reload()} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payment Links"
        subtitle="Send payment links to buyers for deposits and payments"
        breadcrumb={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Payments", href: "/admin/payments" },
          { label: "Payment Links" },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Send Payment Link
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSendPaymentLink} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="recipientName">Recipient Name</Label>
                  <Input
                    id="recipientName"
                    placeholder="John Doe"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="recipientEmail">Recipient Email</Label>
                  <Input
                    id="recipientEmail"
                    type="email"
                    placeholder="john.doe@example.com"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Amount ($)</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="500.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Vehicle deposit for 2024 Toyota Camry..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  <Send className="h-4 w-4 mr-2" />
                  {isSubmitting ? "Sending..." : "Send Payment Link"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Payment Links</CardTitle>
            </CardHeader>
            <CardContent>
              {paymentLinks.length === 0 ? (
                <div className="text-center py-12">
                  <LinkIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No payment links sent yet</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Payment links you send will appear here
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {paymentLinks.map((link: any) => (
                    <div
                      key={link.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg gap-4"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-medium">${link.amount}</h3>
                          <StatusPill status={link.status} />
                          {link.status === "paid" && (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {link.recipientName} ({link.recipientEmail})
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Sent {formatDistanceToNow(new Date(link.sentAt), { addSuffix: true })}
                        </p>
                        {link.description && (
                          <p className="text-sm text-muted-foreground mt-1">{link.description}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Copy Link
                        </Button>
                        <Button variant="ghost" size="sm">
                          Resend
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
