"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ProtectedRoute } from "@/components/layout/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Shield, Upload, CheckCircle2, Star } from "lucide-react"

export default function BuyerInsurancePage() {
  const [deal, setDeal] = useState<any>(null)
  const [quotes, setQuotes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOption, setSelectedOption] = useState<"quotes" | "upload">("quotes")
  const [selectedQuote, setSelectedQuote] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      // Load current deal
      const dealRes = await fetch("/api/buyer/deal")
      const dealData = await dealRes.json()

      if (dealData.success) {
        setDeal(dealData.data.deal)

        // Load insurance quotes
        const quotesRes = await fetch(`/api/insurance/quotes/${dealData.data.deal.id}`)
        const quotesData = await quotesRes.json()

        if (quotesData.success) {
          setQuotes(quotesData.data.quotes)
        }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load insurance information",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSelectQuote = async () => {
    if (!selectedQuote) return

    try {
      const response = await fetch("/api/insurance/select", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quoteId: selectedQuote }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error)
      }

      toast({
        title: "Insurance selected!",
        description: "Moving to contract review",
      })

      router.push("/buyer/contracts")
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      })
    }
  }

  const handleUploadProof = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setUploading(true)

    try {
      const formData = new FormData(e.currentTarget)
      formData.append("dealId", deal.id)

      const response = await fetch("/api/insurance/policy/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error)
      }

      toast({
        title: "Insurance proof uploaded!",
        description: "Moving to contract review",
      })

      router.push("/buyer/contracts")
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      })
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <ProtectedRoute allowedRoles={["BUYER"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Insurance Coverage Required</h1>
          <p className="text-muted-foreground">
            Insurance is legally required to complete your vehicle purchase. Choose from our partner quotes or upload
            proof of existing coverage.
          </p>
        </div>

        <Card className="border-orange-500 border-2 bg-orange-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-orange-600" />
              <CardTitle className="text-orange-900">Required Before Purchase</CardTitle>
            </div>
            <CardDescription className="text-orange-700">
              You cannot finalize your deal or schedule pickup without valid insurance coverage. This protects both you
              and the dealer.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Option Selection */}
        <Card>
          <CardHeader>
            <CardTitle>How would you like to add insurance?</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={selectedOption} onValueChange={(value: any) => setSelectedOption(value)}>
              <div className="flex items-center space-x-2 mb-3">
                <RadioGroupItem value="quotes" id="quotes" />
                <Label htmlFor="quotes" className="cursor-pointer">
                  Get quotes from AutoLenis partners (recommended)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="upload" id="upload" />
                <Label htmlFor="upload" className="cursor-pointer">
                  I already have insurance - Upload proof
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Quotes Option */}
        {selectedOption === "quotes" && (
          <div className="space-y-4">
            {quotes.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Loading insurance quotes...</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              quotes.map((quote) => (
                <Card
                  key={quote.id}
                  className={`cursor-pointer transition-all ${
                    selectedQuote === quote.id
                      ? "border-[#0066FF] border-2 bg-blue-50"
                      : "hover:border-muted-foreground"
                  }`}
                  onClick={() => setSelectedQuote(quote.id)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{quote.carrier}</CardTitle>
                        <CardDescription>{quote.coverageType} Coverage</CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-[#0066FF]">${quote.monthlyPremium}</div>
                        <div className="text-xs text-muted-foreground">per month</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < quote.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">{quote.rating}/5 rating</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Deductible:</span>
                        <span className="ml-2 font-medium">${quote.deductible}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Annual:</span>
                        <span className="ml-2 font-medium">${quote.monthlyPremium * 12}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}

            <Button
              size="lg"
              className="w-full bg-gradient-to-r from-[#7ED321] to-[#00D9FF]"
              disabled={!selectedQuote}
              onClick={handleSelectQuote}
            >
              <CheckCircle2 className="h-5 w-5 mr-2" />
              Select This Insurance
            </Button>
          </div>
        )}

        {/* Upload Option */}
        {selectedOption === "upload" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Proof of Insurance
              </CardTitle>
              <CardDescription>Upload your existing insurance policy documents</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUploadProof} className="space-y-4">
                <div>
                  <Label htmlFor="carrier">Insurance Carrier</Label>
                  <Input id="carrier" name="carrier" placeholder="e.g., State Farm" required />
                </div>
                <div>
                  <Label htmlFor="policyNumber">Policy Number</Label>
                  <Input id="policyNumber" name="policyNumber" placeholder="Enter policy number" required />
                </div>
                <div>
                  <Label htmlFor="document">Insurance Document (PDF)</Label>
                  <Input id="document" name="document" type="file" accept=".pdf" required />
                  <p className="text-xs text-muted-foreground mt-1">
                    Upload your insurance declaration page or policy document
                  </p>
                </div>
                <Button type="submit" size="lg" className="w-full" disabled={uploading}>
                  {uploading ? "Uploading..." : "Upload & Continue"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </ProtectedRoute>
  )
}
