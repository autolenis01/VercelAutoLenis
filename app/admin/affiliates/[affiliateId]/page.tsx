"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, User, DollarSign, Users, MousePointer, Calendar, ExternalLink, Copy, CheckCircle } from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils/format"

interface AffiliateDetail {
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
    firstName: string | null
    lastName: string | null
  } | null
  bankDetails: {
    bankName?: string
    accountNumber?: string
    routingNumber?: string
    paypalEmail?: string
  } | null
}

interface Referral {
  id: string
  status: string
  createdAt: string
  buyer?: {
    firstName: string
    lastName: string
  }
}

interface Commission {
  id: string
  amount: number
  status: string
  type: string
  createdAt: string
}

export default function AdminAffiliateDetailPage() {
  const params = useParams()
  const router = useRouter()
  const affiliateId = params.affiliateId as string
  
  const [affiliate, setAffiliate] = useState<AffiliateDetail | null>(null)
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [commissions, setCommissions] = useState<Commission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)

  useEffect(() => {
    fetchAffiliateDetail()
  }, [affiliateId])

  async function fetchAffiliateDetail() {
    try {
      setLoading(true)
      const res = await fetch(`/api/admin/affiliates/${affiliateId}`)
      if (!res.ok) throw new Error("Failed to fetch affiliate")
      const data = await res.json()
      setAffiliate(data.affiliate)
      setReferrals(data.referrals || [])
      setCommissions(data.commissions || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleStatusChange(newStatus: string) {
    try {
      setUpdatingStatus(true)
      const res = await fetch(`/api/admin/affiliates/${affiliateId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) throw new Error("Failed to update status")
      setAffiliate((prev) => prev ? { ...prev, status: newStatus } : null)
    } catch (err: any) {
      alert(err.message)
    } finally {
      setUpdatingStatus(false)
    }
  }

  function copyReferralLink() {
    if (affiliate?.referralCode) {
      navigator.clipboard.writeText(`${window.location.origin}/ref/${affiliate.referralCode}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-muted rounded" />
          <div className="h-64 bg-muted rounded" />
        </div>
      </div>
    )
  }

  if (error || !affiliate) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-destructive">{error || "Affiliate not found"}</p>
            <Button variant="outline" onClick={() => router.back()} className="mt-4">
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const statusColors: Record<string, string> = {
    ACTIVE: "bg-green-100 text-green-800",
    INACTIVE: "bg-gray-100 text-gray-800",
    SUSPENDED: "bg-red-100 text-red-800",
    PENDING: "bg-yellow-100 text-yellow-800",
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/affiliates">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {affiliate.user?.firstName || affiliate.user?.lastName
                ? `${affiliate.user.firstName || ""} ${affiliate.user.lastName || ""}`.trim()
                : "Affiliate"}
            </h1>
            <p className="text-muted-foreground">{affiliate.user?.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Select
            value={affiliate.status}
            onValueChange={handleStatusChange}
            disabled={updatingStatus}
          >
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="INACTIVE">Inactive</SelectItem>
              <SelectItem value="SUSPENDED">Suspended</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
            </SelectContent>
          </Select>
          <Badge className={statusColors[affiliate.status] || "bg-gray-100"}>
            {affiliate.status}
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Referrals</p>
                <p className="text-2xl font-bold">{affiliate.totalReferrals}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Earnings</p>
                <p className="text-2xl font-bold">{formatCurrency(affiliate.totalEarnings)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Earnings</p>
                <p className="text-2xl font-bold">{formatCurrency(affiliate.pendingEarnings)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Paid Earnings</p>
                <p className="text-2xl font-bold">{formatCurrency(affiliate.paidEarnings)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Referral Link */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Referral Link</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <code className="flex-1 px-3 py-2 bg-muted rounded text-sm">
              {`${typeof window !== "undefined" ? window.location.origin : ""}/ref/${affiliate.referralCode}`}
            </code>
            <Button variant="outline" size="sm" onClick={copyReferralLink}>
              {copied ? <CheckCircle className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="referrals">
        <TabsList>
          <TabsTrigger value="referrals">Referrals ({referrals.length})</TabsTrigger>
          <TabsTrigger value="commissions">Commissions ({commissions.length})</TabsTrigger>
          <TabsTrigger value="bank">Bank Details</TabsTrigger>
        </TabsList>

        <TabsContent value="referrals" className="mt-4">
          <Card>
            <CardContent className="p-0">
              {referrals.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  No referrals yet
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Buyer</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {referrals.map((ref) => (
                      <TableRow key={ref.id}>
                        <TableCell>
                          {ref.buyer ? `${ref.buyer.firstName} ${ref.buyer.lastName}` : "Unknown"}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{ref.status}</Badge>
                        </TableCell>
                        <TableCell>{formatDate(ref.createdAt)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="commissions" className="mt-4">
          <Card>
            <CardContent className="p-0">
              {commissions.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  No commissions yet
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {commissions.map((comm) => (
                      <TableRow key={comm.id}>
                        <TableCell>{comm.type}</TableCell>
                        <TableCell>{formatCurrency(comm.amount)}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{comm.status}</Badge>
                        </TableCell>
                        <TableCell>{formatDate(comm.createdAt)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bank" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Payment Information</CardTitle>
              <CardDescription>Bank details for affiliate payouts</CardDescription>
            </CardHeader>
            <CardContent>
              {affiliate.bankDetails ? (
                <div className="grid grid-cols-2 gap-4">
                  {affiliate.bankDetails.bankName && (
                    <div>
                      <p className="text-sm text-muted-foreground">Bank Name</p>
                      <p className="font-medium">{affiliate.bankDetails.bankName}</p>
                    </div>
                  )}
                  {affiliate.bankDetails.accountNumber && (
                    <div>
                      <p className="text-sm text-muted-foreground">Account Number</p>
                      <p className="font-medium">****{affiliate.bankDetails.accountNumber.slice(-4)}</p>
                    </div>
                  )}
                  {affiliate.bankDetails.routingNumber && (
                    <div>
                      <p className="text-sm text-muted-foreground">Routing Number</p>
                      <p className="font-medium">{affiliate.bankDetails.routingNumber}</p>
                    </div>
                  )}
                  {affiliate.bankDetails.paypalEmail && (
                    <div>
                      <p className="text-sm text-muted-foreground">PayPal Email</p>
                      <p className="font-medium">{affiliate.bankDetails.paypalEmail}</p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground">No bank details on file</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Meta Info */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Joined {formatDate(affiliate.createdAt)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
