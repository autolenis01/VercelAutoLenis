"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle, AlertTriangle } from "lucide-react"

export default function AdminSettingsPage() {
  const [depositAmount, setDepositAmount] = useState("99")
  const [feeTierOne, setFeeTierOne] = useState("499")
  const [feeTierTwo, setFeeTierTwo] = useState("750")
  const [auctionDuration, setAuctionDuration] = useState("48")
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    setError(null)
    setSuccess(false)

    try {
      // Validate inputs
      const depositAmountNum = parseFloat(depositAmount)
      const feeTierOneNum = parseFloat(feeTierOne)
      const feeTierTwoNum = parseFloat(feeTierTwo)
      const auctionDurationNum = parseInt(auctionDuration)

      if (isNaN(depositAmountNum) || depositAmountNum < 0) {
        throw new Error("Deposit amount must be a positive number")
      }
      if (isNaN(feeTierOneNum) || feeTierOneNum < 0) {
        throw new Error("Tier 1 fee must be a positive number")
      }
      if (isNaN(feeTierTwoNum) || feeTierTwoNum < 0) {
        throw new Error("Tier 2 fee must be a positive number")
      }
      if (isNaN(auctionDurationNum) || auctionDurationNum < 1) {
        throw new Error("Auction duration must be at least 1 hour")
      }

      // TODO: Implement settings API endpoint
      // Call: PATCH /api/admin/settings with validated values

      // Simulate save
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      setError(err.message || "Failed to save settings")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>

      {/* Success/Error Messages */}
      {error && (
        <Alert className="bg-red-50 border-red-200">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">Settings saved successfully</AlertDescription>
        </Alert>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Payment Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deposit Amount</label>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">$</span>
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Concierge Fee (≤ $35k OTD)</label>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">$</span>
              <input
                type="number"
                value={feeTierOne}
                onChange={(e) => setFeeTierOne(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Concierge Fee (&gt; $35k OTD)</label>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">$</span>
              <input
                type="number"
                value={feeTierTwo}
                onChange={(e) => setFeeTierTwo(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Auction Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Default Auction Duration (hours)</label>
            <input
              type="number"
              value={auctionDuration}
              onChange={(e) => setAuctionDuration(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple"
            />
          </div>
        </div>
      </div>

      <Button 
        onClick={handleSave}
        disabled={isSaving}
        className="px-6 py-3 bg-brand-purple text-white rounded-lg hover:bg-brand-purple/90"
      >
        {isSaving ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Saving...
          </>
        ) : (
          "Save Settings"
        )}
      </Button>
    </div>
  )
}
