"use client"

export const dynamic = "force-dynamic"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Building2, DollarSign, AlertCircle, CheckCircle, Clock, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function PayoutSettingsPage() {
  const { toast } = useToast()
  const { data, isLoading, mutate } = useSWR("/api/affiliate/payouts", fetcher, {
    refreshInterval: 30000,
  })

  const [payoutMethod, setPayoutMethod] = useState("bank")
  const [requesting, setRequesting] = useState(false)
  const [bankDetails, setBankDetails] = useState({
    accountHolder: "",
    accountType: "checking",
    routingNumber: "",
    accountNumber: "",
  })
  const [paypalEmail, setPaypalEmail] = useState("")

  const handleRequestPayout = async () => {
    if (!data?.availableBalance || data.availableBalance < (data?.minimumPayout || 50)) {
      toast({
        variant: "destructive",
        title: "Insufficient balance",
        description: `Minimum payout is $${data?.minimumPayout || 50}`,
      })
      return
    }

    setRequesting(true)
    try {
      const response = await fetch("/api/affiliate/payouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method: payoutMethod.toUpperCase(),
          details: payoutMethod === "bank" ? bankDetails : { email: paypalEmail },
        }),
      })

      const result = await response.json()
      if (result.error) {
        throw new Error(result.error)
      }

      toast({
        title: "Payout requested",
        description: "Your payout has been submitted for processing.",
      })
      mutate()
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Payout failed",
        description: error.message,
      })
    } finally {
      setRequesting(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return (
          <Badge className="bg-green-500">
            <CheckCircle className="h-3 w-3 mr-1" /> Completed
          </Badge>
        )
      case "PROCESSING":
        return (
          <Badge className="bg-amber-500">
            <Clock className="h-3 w-3 mr-1" /> Processing
          </Badge>
        )
      case "PENDING":
        return (
          <Badge variant="outline">
            <Clock className="h-3 w-3 mr-1" /> Pending
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const { payouts = [], stats = {}, availableBalance = 0, minimumPayout = 50 } = data || {}

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Payout Settings</h1>
        <p className="text-muted-foreground mt-1">Configure how you receive your commission payouts</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="border-[#7ED321]/20 bg-gradient-to-br from-[#7ED321]/5 to-[#7ED321]/10">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-[#7ED321]">${availableBalance.toFixed(2)}</div>
            <p className="text-sm text-muted-foreground">Available for Payout</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">${minimumPayout}</div>
            <p className="text-sm text-muted-foreground">Minimum Payout</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">${(stats.completed || 0).toFixed(2)}</div>
            <p className="text-sm text-muted-foreground">Total Paid Out</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payout Method</CardTitle>
          <CardDescription>Choose how you'd like to receive your commissions</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={payoutMethod} onValueChange={setPayoutMethod} className="space-y-4">
            <div className="flex items-center space-x-4 p-4 border rounded-lg">
              <RadioGroupItem value="bank" id="bank" />
              <Label htmlFor="bank" className="flex items-center gap-3 cursor-pointer flex-1">
                <Building2 className="h-5 w-5" />
                <div>
                  <p className="font-semibold">Bank Transfer (ACH)</p>
                  <p className="text-sm text-muted-foreground">Direct deposit to your bank account</p>
                </div>
              </Label>
            </div>
            <div className="flex items-center space-x-4 p-4 border rounded-lg">
              <RadioGroupItem value="paypal" id="paypal" />
              <Label htmlFor="paypal" className="flex items-center gap-3 cursor-pointer flex-1">
                <CreditCard className="h-5 w-5" />
                <div>
                  <p className="font-semibold">PayPal</p>
                  <p className="text-sm text-muted-foreground">Transfer to your PayPal account</p>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {payoutMethod === "bank" && (
        <Card>
          <CardHeader>
            <CardTitle>Bank Account Details</CardTitle>
            <CardDescription>Enter your bank account information for direct deposits</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Account Holder Name</Label>
                <Input
                  placeholder="John Smith"
                  className="mt-1"
                  value={bankDetails.accountHolder}
                  onChange={(e) => setBankDetails({ ...bankDetails, accountHolder: e.target.value })}
                />
              </div>
              <div>
                <Label>Account Type</Label>
                <Input
                  placeholder="Checking"
                  className="mt-1"
                  value={bankDetails.accountType}
                  onChange={(e) => setBankDetails({ ...bankDetails, accountType: e.target.value })}
                />
              </div>
              <div>
                <Label>Routing Number</Label>
                <Input
                  placeholder="123456789"
                  className="mt-1"
                  value={bankDetails.routingNumber}
                  onChange={(e) => setBankDetails({ ...bankDetails, routingNumber: e.target.value })}
                />
              </div>
              <div>
                <Label>Account Number</Label>
                <Input
                  placeholder="••••••••1234"
                  type="password"
                  className="mt-1"
                  value={bankDetails.accountNumber}
                  onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                />
              </div>
            </div>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Your bank information is encrypted and securely stored. We will never share your financial details.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      {payoutMethod === "paypal" && (
        <Card>
          <CardHeader>
            <CardTitle>PayPal Details</CardTitle>
            <CardDescription>Enter your PayPal email address</CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <Label>PayPal Email</Label>
              <Input
                type="email"
                placeholder="your@email.com"
                className="mt-1"
                value={paypalEmail}
                onChange={(e) => setPaypalEmail(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Request Payout</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <p className="font-medium">Available Balance</p>
              <p className="text-sm text-muted-foreground">Minimum payout: ${minimumPayout}</p>
            </div>
            <p className="text-2xl font-bold text-[#7ED321]">${availableBalance.toFixed(2)}</p>
          </div>
          <Button
            className="w-full bg-[#2D1B69] hover:bg-[#2D1B69]/90"
            disabled={availableBalance < minimumPayout || requesting}
            onClick={handleRequestPayout}
          >
            {requesting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <DollarSign className="h-4 w-4 mr-2" />
                Request Payout (${availableBalance.toFixed(2)})
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Payout History */}
      {payouts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Payout History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {payouts.map((payout: any) => (
                <div key={payout.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-semibold">{payout.method} Transfer</p>
                    <p className="text-sm text-muted-foreground">
                      Requested {new Date(payout.createdAt).toLocaleDateString()}
                      {payout.paidAt && ` • Completed ${new Date(payout.paidAt).toLocaleDateString()}`}
                    </p>
                    {payout.transactionId && (
                      <p className="text-xs text-muted-foreground font-mono">{payout.transactionId}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    {getStatusBadge(payout.status)}
                    <span className="text-lg font-bold">${payout.amount.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
