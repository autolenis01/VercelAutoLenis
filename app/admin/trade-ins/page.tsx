"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Car, ChevronLeft, ChevronRight, AlertTriangle } from "lucide-react"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function AdminTradeInsPage() {
  const [page, setPage] = useState(1)

  const { data, error, isLoading } = useSWR(`/api/admin/trade-ins?page=${page}`, fetcher, {
    refreshInterval: 30000,
  })

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(cents / 100)
  }

  const conditionColors: Record<string, string> = {
    excellent: "bg-green-100 text-green-800",
    good: "bg-blue-100 text-blue-800",
    fair: "bg-yellow-100 text-yellow-800",
    poor: "bg-red-100 text-red-800",
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Trade-In Submissions</h1>
          <p className="text-gray-500">View buyer-provided trade-in information (unverified)</p>
        </div>
      </div>

      {/* Disclaimer */}
      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
            <div className="text-sm text-amber-800">
              <p className="font-medium">Important Notice</p>
              <p>
                All trade-in information displayed here is self-reported by buyers. AutoLenis does not appraise,
                inspect, verify, or evaluate any trade-in vehicles. This data is read-only for administrative oversight.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Car className="h-8 w-8 text-[#2D1B69]" />
              <div>
                <p className="text-2xl font-bold">{data?.data?.pagination?.total || 0}</p>
                <p className="text-sm text-gray-500">Total Submissions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">Loading trade-in submissions...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-red-500">Failed to load trade-in submissions</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Buyer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Has Trade?</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">VIN</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mileage</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Condition</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Owes?</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Est. Payoff</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Completed</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {data?.data?.tradeIns?.length > 0 ? (
                      data.data.tradeIns.map((tradeIn: any) => (
                        <tr key={tradeIn.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <p className="font-medium text-gray-900">{tradeIn.buyerName || "N/A"}</p>
                            <p className="text-xs text-gray-500">{tradeIn.buyerEmail}</p>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge className={tradeIn.hasTrade ? "bg-green-100 text-green-800" : "bg-gray-100"}>
                              {tradeIn.hasTrade ? "Yes" : "No"}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-gray-500">
                            {tradeIn.vin || "-"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {tradeIn.mileage ? tradeIn.mileage.toLocaleString() : "-"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {tradeIn.condition ? (
                              <Badge className={conditionColors[tradeIn.condition] || "bg-gray-100"}>
                                {tradeIn.condition.charAt(0).toUpperCase() + tradeIn.condition.slice(1)}
                              </Badge>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {tradeIn.hasLoan === true ? "Yes" : tradeIn.hasLoan === false ? "No" : "-"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {tradeIn.estimatedPayoffCents ? formatCurrency(tradeIn.estimatedPayoffCents) : "-"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge className={tradeIn.stepCompleted ? "bg-green-100 text-green-800" : "bg-yellow-100"}>
                              {tradeIn.stepCompleted ? "Yes" : "In Progress"}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(tradeIn.createdAt)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={9} className="px-6 py-8 text-center text-gray-500">
                          No trade-in submissions found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {data?.data?.pagination?.totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t">
                  <p className="text-sm text-gray-500">
                    Page {data.data.pagination.page} of {data.data.pagination.totalPages} ({data.data.pagination.total}{" "}
                    total)
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={page === 1}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page + 1)}
                      disabled={page >= data.data.pagination.totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
