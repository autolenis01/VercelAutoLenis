"use client"

import { useState, useEffect } from "react"
import { ProtectedRoute } from "@/components/layout/protected-route"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { DollarSign, CheckCircle2, Calculator } from "lucide-react"

export default function DealFinancingPage() {
  const [deal, setDeal] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selecting, setSelecting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    loadDeal()
  }, [])

  const loadDeal = async () => {
    try {
      const response = await fetch("/api/buyer/deal")
      const data = await response.json()

      if (data.success && data.data.deal) {
        setDeal(data.data.deal)
      } else {
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

  const handleSelectFinancing = async (financingType: string) => {
    setSelecting(true)
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
        title: "Financing selected!",
        description: "Moving to fee payment",
      })

      router.push("/buyer/deal/fee")
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      })
    } finally {
      setSelecting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!deal) {
    return null
  }

  const financingOptions = deal.auctionOffer?.financingOptions || []

  return (
    <ProtectedRoute allowedRoles={["BUYER"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Select Financing</h1>
          <p className="text-muted-foreground">Choose how you'd like to finance your vehicle purchase</p>
        </div>

        {/* Current Status */}
        {deal.financingType && (
          <Card className="border-green-500 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
                <div>
                  <p className="font-semibold text-green-900">Financing Selected</p>
                  <p className="text-sm text-green-700">
                    You selected: {deal.financingType === "CASH" ? "Cash/Own Financing" : "Dealer Financing"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Vehicle Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Purchase Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-lg">
                <span className="text-muted-foreground">Out-the-Door Price</span>
                <span className="font-bold text-[#0066FF]">${deal.cashOtd?.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financing Options */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Available Options
          </h2>

          {financingOptions.map((option: any, index: number) => (
            <Card
              key={index}
              className="hover:border-[#0066FF] transition-colors cursor-pointer"
              onClick={() => !selecting && !deal.financingType && handleSelectFinancing(`option-${index}`)}
            >
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold">
                        {option.apr}% APR • {option.termMonths} months
                      </h3>
                      {index === 0 && <Badge className="bg-[#7ED321]">Recommended</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Down payment: ${option.downPayment?.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-[#0066FF]">${option.monthlyPayment}</p>
                    <p className="text-xs text-muted-foreground">per month</p>
                  </div>
                </div>
                {!deal.financingType && (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleSelectFinancing(`option-${index}`)
                    }}
                    disabled={selecting}
                    className="w-full bg-gradient-to-r from-[#7ED321] to-[#00D9FF]"
                  >
                    Select This Option
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}

          {/* Cash Option */}
          <Card className="border-2 border-dashed hover:border-[#0066FF] transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Pay Cash / Own Financing</h3>
                  <p className="text-sm text-muted-foreground">Use your own bank or pay in full</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">${deal.cashOtd?.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">total</p>
                </div>
              </div>
              {!deal.financingType && (
                <Button
                  onClick={() => handleSelectFinancing("CASH")}
                  disabled={selecting}
                  variant="outline"
                  className="w-full"
                >
                  Select Cash Option
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {deal.financingType && (
          <Button onClick={() => router.push("/buyer/deal/fee")} size="lg" className="w-full">
            Continue to Fee Payment
          </Button>
        )}
      </div>
    </ProtectedRoute>
  )
}
