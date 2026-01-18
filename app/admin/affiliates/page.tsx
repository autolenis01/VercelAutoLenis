"use client"

import { useState } from "react"
import useSWR from "swr"

export const dynamic = "force-dynamic"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface Affiliate {
  id: string
  name: string
  email: string
  refCode: string
  clicks: number
  referrals: number
  totalEarnings: number
  pendingEarnings: number
  createdAt: string
}

export default function AdminAffiliatesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const { data, isLoading } = useSWR(
    `/api/admin/affiliates${searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : ""}`,
    fetcher,
    { refreshInterval: 30000 }
  )

  const affiliates: Affiliate[] = data?.affiliates || []
  const totalEarnings = affiliates.reduce((sum, a) => sum + (a.totalEarnings || 0), 0)
  const totalPending = affiliates.reduce((sum, a) => sum + (a.pendingEarnings || 0), 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Affiliate Management</h1>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search affiliates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple"
          />
          <button className="px-4 py-2 bg-brand-purple text-white rounded-lg hover:bg-brand-purple/90">
            Process All Payouts
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-500 mb-1">Total Affiliates</p>
          <p className="text-3xl font-bold text-gray-900">{affiliates.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-500 mb-1">Total Earnings Paid</p>
          <p className="text-3xl font-bold text-gray-900">${totalEarnings.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-500 mb-1">Pending Payouts</p>
          <p className="text-3xl font-bold text-gray-900">${totalPending.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Loading affiliates...</div>
        ) : affiliates.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No affiliates found</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Affiliate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ref Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clicks</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Referrals</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Earned
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pending
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {affiliates.map((affiliate) => (
                <tr key={affiliate.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{affiliate.name}</div>
                      <div className="text-sm text-gray-500">{affiliate.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">{affiliate.refCode}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{affiliate.clicks}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{affiliate.referrals}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    ${(affiliate.totalEarnings || 0).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                    ${(affiliate.pendingEarnings || 0).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    <button className="text-green-600 hover:text-green-800">Pay Out</button>
                    <button className="text-brand-purple hover:text-brand-purple/80">View Tree</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
