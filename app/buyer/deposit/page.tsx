"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { DollarSign, CheckCircle2, ArrowLeft, CreditCard, Shield, Info } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"

export default function BuyerDepositPage() {
  const [depositStatus, setDepositStatus] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    checkDepositStatus()
  }, [])

  const checkDepositStatus = async () => {
    try {
      const response = await fetch("/api/buyer/deposit/status")
      const data = await response.json()
      
      if (data.success) {
        setDepositStatus(data.data)
      }
    } catch (error) {
      console.error("Error checking deposit status:", error)
    } finally {
      setLoading(false)
    }
  }

  const handlePayDeposit = async () => {
    setProcessing(true)
    try {
      const response = await fetch("/api/buyer/deposit/create-payment-intent", {
        method: "POST",
      })
      const data = await response.json()

      if (data.success && data.data?.checkoutUrl) {
        window.location.href = data.data.checkoutUrl
      } else {
        throw new Error(data.error || "Failed to initiate payment")
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Payment Error",
        description: error.message || "Failed to process payment. Please try again.",
      })
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Auction Deposit</h1>
            <p className="text-muted-foreground">Loading deposit status...</p>
          </div>
        </div>
      </div>
    )
  }

  const hasPaidDeposit = depositStatus?.hasPaid || false

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Auction Deposit</h1>
          <p className="text-muted-foreground">
            {hasPaidDeposit
              ? "Your deposit has been received"
              : "Pay your $99 deposit to start your auction"}
          </p>
        </div>
        <Link href="/buyer/shortlist">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Shortlist
          </Button>
        </Link>
      </div>

      {/* Status Card */}
      {hasPaidDeposit ? (
        <Card className="border-[#7ED321]">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#7ED321]/10 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-[#7ED321]" />
              </div>
              <div>
                <CardTitle>Deposit Received</CardTitle>
                <CardDescription>Your auction is ready to start</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Deposit Amount</div>
                <div className="text-2xl font-bold">$99.00</div>
              </div>
              <Badge className="bg-[#7ED321] text-white">Paid</Badge>
            </div>

            {depositStatus?.paidAt && (
              <div className="text-sm text-muted-foreground">
                Paid on {new Date(depositStatus.paidAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            )}

            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>What's Next?</AlertTitle>
              <AlertDescription>
                Your $99 deposit will be credited toward your final concierge fee when you complete your purchase.
                Return to your shortlist to start your auction.
              </AlertDescription>
            </Alert>

            <Link href="/buyer/shortlist" className="block">
              <Button className="w-full" size="lg">
                Return to Shortlist
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Payment Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#00D9FF]/10 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-[#00D9FF]" />
                </div>
                <div>
                  <CardTitle>Auction Deposit</CardTitle>
                  <CardDescription>Refundable if you don't receive offers</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-6 bg-gradient-to-br from-[#2D1B69] to-[#1E0F42] text-white rounded-lg text-center">
                <div className="text-sm text-white/70 mb-2">Deposit Amount</div>
                <div className="text-5xl font-bold mb-2">$99</div>
                <div className="text-sm text-white/70">One-time refundable deposit</div>
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={handlePayDeposit}
                disabled={processing}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                {processing ? "Processing..." : "Pay Deposit Now"}
              </Button>

              <div className="text-xs text-muted-foreground text-center">
                Secure payment powered by Stripe
              </div>
            </CardContent>
          </Card>

          {/* Information Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#7ED321]/10 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-[#7ED321]" />
                </div>
                <div>
                  <CardTitle>Why a Deposit?</CardTitle>
                  <CardDescription>Protecting your auction experience</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#7ED321] flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium mb-1">Ensures Serious Buyers</div>
                    <div className="text-sm text-muted-foreground">
                      Dealers know you're committed, resulting in better offers
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#7ED321] flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium mb-1">Fully Refundable</div>
                    <div className="text-sm text-muted-foreground">
                      If you don't receive offers, we refund your deposit in full
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#7ED321] flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium mb-1">Credited to Your Fee</div>
                    <div className="text-sm text-muted-foreground">
                      Your deposit counts toward the final concierge fee ($499 or $750)
                    </div>
                  </div>
                </div>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Example:</strong> If your final concierge fee is $499, you'll only pay $400 more
                  ($499 - $99 deposit = $400).
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Questions About the Deposit?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <div>
            <strong className="text-foreground">When is the deposit refunded?</strong>
            <p>If you don't receive any dealer offers, or if you choose not to proceed before selecting a winning offer.</p>
          </div>
          <div>
            <strong className="text-foreground">How is it credited?</strong>
            <p>The $99 deposit is automatically deducted from your concierge fee at checkout.</p>
          </div>
          <div>
            <strong className="text-foreground">Is it secure?</strong>
            <p>Yes. All payments are processed through Stripe with bank-level security and encryption.</p>
          </div>
          <div>
            <strong className="text-foreground">Need help?</strong>
            <p>
              Contact our support team at{" "}
              <Link href="/contact" className="text-[#00D9FF] hover:underline">
                support@autolenis.com
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
