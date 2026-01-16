"use client"

import { useState } from "react"

export default function AdminSettingsPage() {
  const [depositAmount, setDepositAmount] = useState("99")
  const [feeTierOne, setFeeTierOne] = useState("499")
  const [feeTierTwo, setFeeTierTwo] = useState("750")
  const [auctionDuration, setAuctionDuration] = useState("48")

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>

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

      <button className="px-6 py-3 bg-brand-purple text-white rounded-lg hover:bg-brand-purple/90">
        Save Settings
      </button>
    </div>
  )
}
