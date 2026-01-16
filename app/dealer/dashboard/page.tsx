"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Building2,
  Calendar,
  CheckCircle,
  Package,
  FileText,
  TrendingUp,
  DollarSign,
  Clock,
  ArrowRight,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function DealerDashboardPage() {
  const { data, error, isLoading } = useSWR("/api/dealer/dashboard", fetcher, {
    refreshInterval: 30000,
  })

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-muted rounded mb-2" />
          <div className="h-4 w-64 bg-muted rounded" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 w-24 bg-muted rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error || !data?.success) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-xl font-semibold mb-2">Failed to load dashboard</h2>
        <p className="text-muted-foreground">Please try refreshing the page</p>
      </div>
    )
  }

  const stats = data

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back to your dealer portal</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-[#7ED321]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Auctions</CardTitle>
            <Building2 className="h-4 w-4 text-[#7ED321]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.activeAuctions}</div>
            <p className="text-xs text-muted-foreground">Awaiting your bids</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#00D9FF]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed Deals</CardTitle>
            <CheckCircle className="h-4 w-4 text-[#00D9FF]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.completedDeals}</div>
            <p className="text-xs text-muted-foreground">Total sales</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#0066FF]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Inventory</CardTitle>
            <Package className="h-4 w-4 text-[#0066FF]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.inventory}</div>
            <p className="text-xs text-muted-foreground">Vehicles listed</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#2D1B69]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Contracts</CardTitle>
            <FileText className="h-4 w-4 text-[#2D1B69]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.pendingContracts}</div>
            <p className="text-xs text-muted-foreground">Need fixes</p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Performance */}
      {stats.monthlyStats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[#7ED321]" />
              Monthly Performance
            </CardTitle>
            <CardDescription>Your sales performance this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <DollarSign className="h-8 w-8 mx-auto mb-2 text-[#7ED321]" />
                <div className="text-2xl font-bold">${(stats.monthlyStats.revenue || 0).toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Revenue This Month</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 text-[#00D9FF]" />
                <div className="text-2xl font-bold">{stats.monthlyStats.thisMonthDeals}</div>
                <div className="text-sm text-muted-foreground">Deals Closed</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-[#0066FF]" />
                <div className="text-2xl font-bold">
                  {stats.monthlyStats.dealsChange > 0 ? "+" : ""}
                  {stats.monthlyStats.dealsChange.toFixed(0)}%
                </div>
                <div className="text-sm text-muted-foreground">vs Last Month</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-[#7ED321]" />
              View Auctions
            </CardTitle>
            <CardDescription>Check new auction invitations and submit offers</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full bg-[#2D1B69] hover:bg-[#2D1B69]/90">
              <Link href="/dealer/auctions">
                View Auctions
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-[#00D9FF]" />
              Manage Inventory
            </CardTitle>
            <CardDescription>Add, edit, or remove vehicles from your inventory</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full bg-[#2D1B69] hover:bg-[#2D1B69]/90">
              <Link href="/dealer/inventory">
                Manage Inventory
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-[#0066FF]" />
              Upcoming Pickups
            </CardTitle>
            <CardDescription>
              {stats.upcomingPickups} pickup{stats.upcomingPickups !== 1 ? "s" : ""} scheduled
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full bg-[#2D1B69] hover:bg-[#2D1B69]/90">
              <Link href="/dealer/pickups">
                View Pickups
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      {stats.recentActivity && stats.recentActivity.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentActivity.slice(0, 5).map((activity: any) => (
                <div key={activity.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        activity.status === "COMPLETED"
                          ? "bg-[#7ED321]"
                          : activity.status === "PENDING"
                            ? "bg-yellow-500"
                            : "bg-muted"
                      }`}
                    />
                    <div>
                      <div className="font-medium">
                        {activity.inventoryItem?.vehicle?.year} {activity.inventoryItem?.vehicle?.make}{" "}
                        {activity.inventoryItem?.vehicle?.model}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {activity.buyer?.profile?.firstName} {activity.buyer?.profile?.lastName}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">${(activity.cashOtd || 0).toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(activity.createdAt).toLocaleDateString()}
                    </div>
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
