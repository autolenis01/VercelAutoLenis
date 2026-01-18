"use client"

import { useState, useEffect } from "react"
import { ProtectedRoute } from "@/components/layout/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Car, DollarSign, FileText, CreditCard, AlertCircle, CheckCircle2 } from "lucide-react"
import { FeePaymentModal } from "@/components/buyer/fee-payment-modal"

export default function BuyerDealPage() {
  const [deal, setDeal] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showFeeModal, setShowFeeModal] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    loadDeal()
  }, [])

  const loadDeal = async () => {
    try {
      const response = await fetch("/api/buyer/deal")
      const data = await response.json()

      if (data.success) {
        setDeal(data.data.deal)
      } else {
        // No active deal
        toast({
          title: "No active deal",
          description: "You need to select an offer from an auction first",
        })
        router.push("/buyer/dashboard")
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load deal information",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFinancingSelect = async (financingType: string) => {
    try {
      const response = await fetch("/api/buyer/deal/financing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dealId: deal.id, financingType }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error)
      }

      toast({
        title: "Financing selected",
        description: "Moving to fee payment",
      })

      setDeal(data.data.deal)
      setShowFeeModal(true)
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      })
    }
  }

  const handleFeePaymentComplete = () => {
    setShowFeeModal(false)
    loadDeal()
    toast({
      title: "Payment successful!",
      description: "Moving to insurance selection",
    })
    router.push("/buyer/insurance")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!deal) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>No Active Deal</CardTitle>
            <CardDescription>Select an offer from an auction to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/buyer/dashboard")}>Return to Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const vehicle = deal.auctionOffer?.auction?.shortlist?.items?.[0]?.inventoryItem?.vehicle
  const dealer = deal.auctionOffer?.dealer

  return (
    <ProtectedRoute allowedRoles={["BUYER"]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">My Deal</h1>
          <Badge className="text-lg px-4 py-2">{deal.status}</Badge>
        </div>

        {/* Vehicle & Dealer Summary */}
        <Card className="border-2 border-[#7ED321]">
          <CardHeader className="bg-gradient-to-r from-[#2D1B69] to-[#0066FF] text-white">
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              Your Selected Vehicle
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-2xl font-bold mb-4">
                  {vehicle?.year} {vehicle?.make} {vehicle?.model}
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Trim:</span>
                    <span className="font-medium">{vehicle?.trim}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Mileage:</span>
                    <span className="font-medium">{vehicle?.mileage?.toLocaleString()} miles</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Color:</span>
                    <span className="font-medium">{vehicle?.color || "Not specified"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">VIN:</span>
                    <span className="font-medium font-mono text-xs">{vehicle?.vin}</span>
                  </div>
                </div>
              </div>
              <div className="border-l pl-6">
                <h4 className="font-semibold mb-4">Dealer Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name:</span>
                    <span className="font-medium">{dealer?.businessName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location:</span>
                    <span className="font-medium">
                      {dealer?.city}, {dealer?.state}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Distance:</span>
                    <span className="font-medium">12 miles away</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Price Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Price Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-lg">
                <span className="text-muted-foreground">Vehicle Price</span>
                <span className="font-medium">${deal.cashOtd?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Taxes & Fees</span>
                <span className="font-medium">${deal.auctionOffer?.taxAmount?.toLocaleString() || "TBD"}</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-xl font-bold">
                <span>Total Out-the-Door</span>
                <span className="text-[#0066FF]">${deal.cashOtd?.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financing Options */}
        {deal.status === "SELECTED" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Select Financing Option
              </CardTitle>
              <CardDescription>Choose how you'd like to finance this purchase</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {deal.auctionOffer?.financingOptions?.map((option: any, index: number) => (
                <div key={index} className="border rounded-lg p-4 hover:border-[#0066FF] transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-lg">
                        {option.apr}% APR • {option.termMonths} months
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Down payment: ${option.downPayment?.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-[#0066FF]">${option.monthlyPayment}</div>
                      <div className="text-xs text-muted-foreground">per month</div>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleFinancingSelect(option.id || `option-${index}`)}
                    className="w-full bg-gradient-to-r from-[#7ED321] to-[#00D9FF]"
                  >
                    Select This Financing
                  </Button>
                </div>
              ))}

              {/* Cash Option */}
              <div className="border-2 border-dashed rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-lg">Pay Cash</h4>
                    <p className="text-sm text-muted-foreground">Finance through your bank or pay in full</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">${deal.cashOtd?.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">total</div>
                  </div>
                </div>
                <Button onClick={() => handleFinancingSelect("CASH")} variant="outline" className="w-full">
                  Pay Cash
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Next Steps */}
        {deal.status !== "SELECTED" && (
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <FileText className="h-5 w-5" />
                Next Steps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-blue-900">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-blue-600" />
                  <span>Financing selected</span>
                </div>
                <div className="flex items-center gap-3">
                  {deal.status === "FEE_PAID" || deal.status === "FEE_PENDING" ? (
                    <CheckCircle2 className="h-5 w-5 text-blue-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-blue-600" />
                  )}
                  <span>Complete concierge fee payment</span>
                </div>
                <div className="flex items-center gap-3">
                  {deal.status === "INSURANCE_COMPLETE" ? (
                    <CheckCircle2 className="h-5 w-5 text-blue-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-orange-600" />
                  )}
                  <span className="flex items-center gap-2">
                    Add insurance coverage
                    {deal.status !== "INSURANCE_COMPLETE" && (
                      <span className="text-xs bg-orange-600 text-white px-2 py-0.5 rounded-full">REQUIRED</span>
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-blue-600">
                  <div className="h-5 w-5 border-2 border-blue-400 rounded-full" />
                  <span>Review and sign contracts</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {showFeeModal && (
        <FeePaymentModal dealId={deal.id} onClose={() => setShowFeeModal(false)} onSuccess={handleFeePaymentComplete} />
      )}
    </ProtectedRoute>
  )
}
