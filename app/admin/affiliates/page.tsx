"use client"

import React from "react"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import Loading from "./loading"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Users, DollarSign, TrendingUp, CheckCircle, Clock, XCircle, ExternalLink, RefreshCw, Mail, Ban, UserCheck } from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils/format"
import { toast } from "sonner"

interface Affiliate {
  id: string
  userId: string
  status: string
  referralCode: string
  totalReferrals: number
  totalEarnings: number
  pendingEarnings: number
  paidEarnings: number
  createdAt: string
  user: {
    email: string
    firstName?: string
    lastName?: string
  } | null
  bankDetails?: {
    accountName?: string
    bankName?: string
  } | null
}

interface AffiliateStats {
  totalAffiliates: number
  activeAffiliates: number
  totalReferrals: number
  totalEarnings: number
  pendingPayouts: number
  paidPayouts: number
}

interface Payout {
  id: string
  affiliateId: string
  amount: number
  status: string
  requestedAt: string
  processedAt?: string
  transactionId?: string
  affiliate?: {
    user?: {
      email: string
      firstName?: string
      lastName?: string
    } | null
    referralCode: string
    bankDetails?: {
      accountName?: string
      bankName?: string
      accountNumber?: string
      routingNumber?: string
    } | null
  }
}

export default function AdminAffiliatesPage() {
  const searchParams = useSearchParams()
  const [affiliates, setAffiliates] = useState<Affiliate[]>([])
  const [stats, setStats] = useState<AffiliateStats | null>(null)
  const [pendingPayouts, setPendingPayouts] = useState<Payout[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [activeTab, setActiveTab] = useState("affiliates")

  // Dialog states
  const [selectedAffiliate, setSelectedAffiliate] = useState<Affiliate | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [suspendOpen, setSuspendOpen] = useState(false)
  const [suspendReason, setSuspendReason] = useState("")
  const [processingAction, setProcessingAction] = useState(false)

  // Payout dialog states
  const [selectedPayout, setSelectedPayout] = useState<Payout | null>(null)
  const [payoutDialogOpen, setPayoutDialogOpen] = useState(false)
  const [transactionId, setTransactionId] = useState("")

  const fetchAffiliates = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.append("search", searchTerm)
      if (statusFilter !== "all") params.append("status", statusFilter)

      const response = await fetch(`/api/admin/affiliates?${params}`)
      if (!response.ok) throw new Error("Failed to fetch affiliates")

      const data = await response.json()
      setAffiliates(data.affiliates || [])
      setStats(data.stats || null)
    } catch (error) {
      console.error("Error fetching affiliates:", error)
      toast.error("Failed to load affiliates")
    }
  }, [searchTerm, statusFilter])

  const fetchPendingPayouts = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/affiliates/payouts?status=PENDING")
      if (!response.ok) throw new Error("Failed to fetch payouts")

      const data = await response.json()
      setPendingPayouts(data.payouts || [])
    } catch (error) {
      console.error("Error fetching payouts:", error)
      toast.error("Failed to load pending payouts")
    }
  }, [])

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await Promise.all([fetchAffiliates(), fetchPendingPayouts()])
      setLoading(false)
    }
    loadData()
  }, [fetchAffiliates, fetchPendingPayouts])

  const handleStatusChange = async (affiliateId: string, newStatus: string, reason?: string) => {
    setProcessingAction(true)
    try {
      const response = await fetch(`/api/admin/affiliates/${affiliateId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, reason }),
      })

      if (!response.ok) throw new Error("Failed to update status")

      toast.success(`Affiliate status updated to ${newStatus}`)
      setSuspendOpen(false)
      setSuspendReason("")
      setSelectedAffiliate(null)
      await fetchAffiliates()
    } catch (error) {
      console.error("Error updating status:", error)
      toast.error("Failed to update affiliate status")
    } finally {
      setProcessingAction(false)
    }
  }

  const handleProcessPayout = async () => {
    if (!selectedPayout || !transactionId.trim()) {
      toast.error("Transaction ID is required")
      return
    }

    setProcessingAction(true)
    try {
      const response = await fetch(`/api/admin/affiliates/payouts/${selectedPayout.id}/process`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionId: transactionId.trim() }),
      })

      if (!response.ok) throw new Error("Failed to process payout")

      toast.success("Payout processed successfully")
      setPayoutDialogOpen(false)
      setTransactionId("")
      setSelectedPayout(null)
      await Promise.all([fetchAffiliates(), fetchPendingPayouts()])
    } catch (error) {
      console.error("Error processing payout:", error)
      toast.error("Failed to process payout")
    } finally {
      setProcessingAction(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ReactNode }> = {
      ACTIVE: { variant: "default", icon: <CheckCircle className="h-3 w-3 mr-1" /> },
      PENDING: { variant: "secondary", icon: <Clock className="h-3 w-3 mr-1" /> },
      SUSPENDED: { variant: "destructive", icon: <Ban className="h-3 w-3 mr-1" /> },
      INACTIVE: { variant: "outline", icon: <XCircle className="h-3 w-3 mr-1" /> },
    }
    const config = variants[status] || variants.PENDING
    return (
      <Badge variant={config.variant} className="flex items-center w-fit">
        {config.icon}
        {status}
      </Badge>
    )
  }

  const getPayoutStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      COMPLETED: "default",
      PENDING: "secondary",
      FAILED: "destructive",
      CANCELLED: "outline",
    }
    return <Badge variant={variants[status] || "secondary"}>{status}</Badge>
  }

  return (
    <Suspense fallback={<Loading />}>
      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Affiliate Management</h1>
              <p className="text-muted-foreground">Manage affiliates, track performance, and process payouts</p>
            </div>
            <Button onClick={() => Promise.all([fetchAffiliates(), fetchPendingPayouts()])} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Affiliates</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalAffiliates}</div>
                  <p className="text-xs text-muted-foreground">{stats.activeAffiliates} active</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalReferrals}</div>
                  <p className="text-xs text-muted-foreground">Successful conversions</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(stats.totalEarnings)}</div>
                  <p className="text-xs text-muted-foreground">All time</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Payouts</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(stats.pendingPayouts)}</div>
                  <p className="text-xs text-muted-foreground">{pendingPayouts.length} requests</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="affiliates">Affiliates</TabsTrigger>
              <TabsTrigger value="payouts" className="relative">
                Pending Payouts
                {pendingPayouts.length > 0 && (
                  <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                    {pendingPayouts.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="affiliates" className="space-y-4">
              {/* Filters */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by email or referral code..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="SUSPENDED">Suspended</SelectItem>
                        <SelectItem value="INACTIVE">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Affiliates Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Affiliates</CardTitle>
                  <CardDescription>
                    {affiliates.length} affiliate{affiliates.length !== 1 ? "s" : ""} found
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Affiliate</TableHead>
                        <TableHead>Referral Code</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Referrals</TableHead>
                        <TableHead className="text-right">Total Earnings</TableHead>
                        <TableHead className="text-right">Pending</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {affiliates.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                            No affiliates found
                          </TableCell>
                        </TableRow>
                      ) : (
                        affiliates.map((affiliate) => (
                          <TableRow key={affiliate.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">
                                  {affiliate.user?.firstName && affiliate.user?.lastName
                                    ? `${affiliate.user.firstName} ${affiliate.user.lastName}`
                                    : "N/A"}
                                </div>
                                <div className="text-sm text-muted-foreground">{affiliate.user?.email || "No email"}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <code className="px-2 py-1 bg-muted rounded text-sm">{affiliate.referralCode}</code>
                            </TableCell>
                            <TableCell>{getStatusBadge(affiliate.status)}</TableCell>
                            <TableCell className="text-right font-medium">{affiliate.totalReferrals}</TableCell>
                            <TableCell className="text-right font-medium">{formatCurrency(affiliate.totalEarnings)}</TableCell>
                            <TableCell className="text-right">
                              {affiliate.pendingEarnings > 0 ? (
                                <span className="text-amber-600 font-medium">{formatCurrency(affiliate.pendingEarnings)}</span>
                              ) : (
                                <span className="text-muted-foreground">$0.00</span>
                              )}
                            </TableCell>
                            <TableCell>{formatDate(affiliate.createdAt)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedAffiliate(affiliate)
                                    setDetailsOpen(true)
                                  }}
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                                {affiliate.status === "ACTIVE" ? (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedAffiliate(affiliate)
                                      setSuspendOpen(true)
                                    }}
                                  >
                                    <Ban className="h-4 w-4 text-destructive" />
                                  </Button>
                                ) : affiliate.status === "SUSPENDED" ? (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleStatusChange(affiliate.id, "ACTIVE")}
                                  >
                                    <UserCheck className="h-4 w-4 text-green-600" />
                                  </Button>
                                ) : null}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payouts" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Pending Payout Requests</CardTitle>
                  <CardDescription>Review and process affiliate payout requests</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Affiliate</TableHead>
                        <TableHead>Bank Details</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead>Requested</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingPayouts.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                            No pending payout requests
                          </TableCell>
                        </TableRow>
                      ) : (
                        pendingPayouts.map((payout) => (
                          <TableRow key={payout.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">
                                  {payout.affiliate?.user?.firstName && payout.affiliate?.user?.lastName
                                    ? `${payout.affiliate.user.firstName} ${payout.affiliate.user.lastName}`
                                    : "N/A"}
                                </div>
                                <div className="text-sm text-muted-foreground">{payout.affiliate?.user?.email || "No email"}</div>
                                <code className="text-xs text-muted-foreground">{payout.affiliate?.referralCode}</code>
                              </div>
                            </TableCell>
                            <TableCell>
                              {payout.affiliate?.bankDetails ? (
                                <div className="text-sm">
                                  <div>{payout.affiliate.bankDetails.bankName}</div>
                                  <div className="text-muted-foreground">{payout.affiliate.bankDetails.accountName}</div>
                                </div>
                              ) : (
                                <span className="text-muted-foreground">Not provided</span>
                              )}
                            </TableCell>
                            <TableCell className="text-right font-bold text-lg">{formatCurrency(payout.amount)}</TableCell>
                            <TableCell>{formatDate(payout.requestedAt)}</TableCell>
                            <TableCell>{getPayoutStatusBadge(payout.status)}</TableCell>
                            <TableCell className="text-right">
                              <Button
                                size="sm"
                                onClick={() => {
                                  setSelectedPayout(payout)
                                  setPayoutDialogOpen(true)
                                }}
                              >
                                Process
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Affiliate Details Dialog */}
          <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Affiliate Details</DialogTitle>
                <DialogDescription>View detailed information about this affiliate</DialogDescription>
              </DialogHeader>
              {selectedAffiliate && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">Name</Label>
                      <p className="font-medium">
                        {selectedAffiliate.user?.firstName && selectedAffiliate.user?.lastName
                          ? `${selectedAffiliate.user.firstName} ${selectedAffiliate.user.lastName}`
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Email</Label>
                      <p className="font-medium">{selectedAffiliate.user?.email || "N/A"}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Referral Code</Label>
                      <code className="px-2 py-1 bg-muted rounded">{selectedAffiliate.referralCode}</code>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Status</Label>
                      <div className="mt-1">{getStatusBadge(selectedAffiliate.status)}</div>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Total Referrals</Label>
                      <p className="font-medium">{selectedAffiliate.totalReferrals}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Joined</Label>
                      <p className="font-medium">{formatDate(selectedAffiliate.createdAt)}</p>
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2">Earnings Summary</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <p className="text-2xl font-bold">{formatCurrency(selectedAffiliate.totalEarnings)}</p>
                        <p className="text-xs text-muted-foreground">Total</p>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <p className="text-2xl font-bold text-amber-600">{formatCurrency(selectedAffiliate.pendingEarnings)}</p>
                        <p className="text-xs text-muted-foreground">Pending</p>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <p className="text-2xl font-bold text-green-600">{formatCurrency(selectedAffiliate.paidEarnings)}</p>
                        <p className="text-xs text-muted-foreground">Paid</p>
                      </div>
                    </div>
                  </div>
                  {selectedAffiliate.bankDetails && (
                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-2">Bank Details</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Bank:</span> {selectedAffiliate.bankDetails.bankName}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Account:</span> {selectedAffiliate.bankDetails.accountName}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setDetailsOpen(false)}>
                  Close
                </Button>
                {selectedAffiliate?.user?.email && (
                  <Button variant="secondary" asChild>
                    <a href={`mailto:${selectedAffiliate.user.email}`}>
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </a>
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Suspend Dialog */}
          <Dialog open={suspendOpen} onOpenChange={setSuspendOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Suspend Affiliate</DialogTitle>
                <DialogDescription>
                  This will suspend the affiliate and prevent them from earning commissions. Please provide a reason.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="reason">Suspension Reason</Label>
                  <Textarea
                    id="reason"
                    placeholder="Enter the reason for suspension..."
                    value={suspendReason}
                    onChange={(e) => setSuspendReason(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setSuspendOpen(false)} disabled={processingAction}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => selectedAffiliate && handleStatusChange(selectedAffiliate.id, "SUSPENDED", suspendReason)}
                  disabled={processingAction || !suspendReason.trim()}
                >
                  {processingAction ? "Suspending..." : "Suspend Affiliate"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Process Payout Dialog */}
          <Dialog open={payoutDialogOpen} onOpenChange={setPayoutDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Process Payout</DialogTitle>
                <DialogDescription>
                  Enter the transaction ID after completing the bank transfer to mark this payout as processed.
                </DialogDescription>
              </DialogHeader>
              {selectedPayout && (
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">
                          {selectedPayout.affiliate?.user?.firstName} {selectedPayout.affiliate?.user?.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">{selectedPayout.affiliate?.user?.email}</p>
                      </div>
                      <p className="text-2xl font-bold">{formatCurrency(selectedPayout.amount)}</p>
                    </div>
                  </div>
                  {selectedPayout.affiliate?.bankDetails && (
                    <div className="text-sm space-y-1">
                      <p><strong>Bank:</strong> {selectedPayout.affiliate.bankDetails.bankName}</p>
                      <p><strong>Account Name:</strong> {selectedPayout.affiliate.bankDetails.accountName}</p>
                      <p><strong>Account #:</strong> ****{selectedPayout.affiliate.bankDetails.accountNumber?.slice(-4)}</p>
                      <p><strong>Routing #:</strong> {selectedPayout.affiliate.bankDetails.routingNumber}</p>
                    </div>
                  )}
                  <div>
                    <Label htmlFor="transactionId">Transaction ID</Label>
                    <Input
                      id="transactionId"
                      placeholder="Enter bank transfer transaction ID"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                    />
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setPayoutDialogOpen(false)} disabled={processingAction}>
                  Cancel
                </Button>
                <Button onClick={handleProcessPayout} disabled={processingAction || !transactionId.trim()}>
                  {processingAction ? "Processing..." : "Mark as Paid"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </Suspense>
  )
}

function Loading() {
  return null
}
