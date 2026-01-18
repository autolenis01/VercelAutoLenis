"use client"

import { use, useState } from "react"
import Link from "next/link"
import useSWR from "swr"
import { Activity, BadgeCheck, Clipboard, DollarSign, MousePointer, Users } from "lucide-react"

import { ActivityTimeline } from "@/components/dashboard/activity-timeline"
import { DetailShell } from "@/components/dashboard/detail-shell"
import { EmptyState } from "@/components/dashboard/empty-state"
import { ErrorState } from "@/components/dashboard/error-state"
import { KeyValueGrid } from "@/components/dashboard/key-value-grid"
import { LoadingSkeleton } from "@/components/dashboard/loading-skeleton"
import { PageHeader } from "@/components/dashboard/page-header"
import { StatusPill } from "@/components/dashboard/status-pill"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type Referral = { id: string; referredUser?: string; status?: string; createdAt?: string }
type Commission = { id: string; amount?: number; status?: string; type?: string; createdAt?: string }
type Payout = { id: string; amount?: number; status?: string; createdAt?: string }
type AffiliateRecord = {
  id?: string
  firstName?: string
  lastName?: string
  name?: string
  email?: string
  status?: string
  refCode?: string
  referralCode?: string
  referralLink?: string
  createdAt?: string
  lastActive?: string
  clicks?: number
  referrals?: number
  conversions?: number
  totalCommissions?: number
  metrics?: { clicks?: number; referrals?: number; conversions?: number; totalCommissions?: number }
  referralsList?: Referral[]
  commissions?: Commission[]
  payouts?: Payout[]
  activity?: { id: string; title: string; description?: string; timestamp: string; type?: string }[]
}

const fetcher = async (url: string) => {
  const res = await fetch(url)
  const payload = await res.json().catch(() => ({}))
  return { payload, status: res.status }
}

const formatDate = (value?: string) => {
  if (!value) return "Not available"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "Not available"
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

const affiliateName = (affiliate?: AffiliateRecord) => {
  if (!affiliate) return "Not available"
  if (affiliate.name) return affiliate.name
  if (affiliate.firstName || affiliate.lastName) return [affiliate.firstName, affiliate.lastName].filter(Boolean).join(" ")
  return "Not available"
}

export default function AffiliateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data, error, isLoading, mutate } = useSWR(`/api/admin/affiliates/${id}`, fetcher)
  const [copied, setCopied] = useState(false)

  const payload = (data?.payload as { affiliate?: AffiliateRecord }) || {}
  const affiliate = payload.affiliate || (payload as AffiliateRecord | undefined)
  const statusCode = data?.status
  const unauthorized = statusCode === 401 || statusCode === 403

  const summary = affiliate
    ? [
        { label: "ID", value: affiliate.id || "Not available" },
        { label: "Name", value: affiliateName(affiliate) },
        { label: "Email", value: affiliate.email || "Not available" },
        { label: "Referral code", value: affiliate.refCode || affiliate.referralCode || "Not available" },
        { label: "Status", value: affiliate.status || "Not available" },
        { label: "Created", value: formatDate(affiliate.createdAt) },
        { label: "Last active", value: formatDate(affiliate.lastActive) },
        {
          label: "Metrics",
          value: (
            <div className="space-y-1 text-sm">
              <div>Clicks: {affiliate.metrics?.clicks ?? affiliate.clicks ?? 0}</div>
              <div>Referrals: {affiliate.metrics?.referrals ?? affiliate.referrals ?? 0}</div>
              <div>Conversions: {affiliate.metrics?.conversions ?? affiliate.conversions ?? 0}</div>
              <div>
                Total commissions: $
                {Number(affiliate.metrics?.totalCommissions ?? affiliate.totalCommissions ?? 0).toLocaleString()}
              </div>
            </div>
          ),
        },
      ]
    : []

  const referralLink =
    affiliate?.referralLink ||
    (affiliate?.refCode || affiliate?.referralCode
      ? `https://autolenis.com/ref/${affiliate.refCode || affiliate.referralCode}`
      : undefined)

  const handleCopy = () => {
    if (!referralLink || typeof navigator === "undefined") return
    navigator.clipboard
      .writeText(referralLink)
      .then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      })
      .catch(() => setCopied(false))
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Affiliate details"
          breadcrumb={[
            { label: "Admin", href: "/admin/dashboard" },
            { label: "Affiliates", href: "/admin/affiliates" },
            { label: "Loading" },
          ]}
        />
        <LoadingSkeleton variant="detail" />
      </div>
    )
  }

  if (unauthorized) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Affiliate details"
          breadcrumb={[
            { label: "Admin", href: "/admin/dashboard" },
            { label: "Affiliates", href: "/admin/affiliates" },
            { label: "Access" },
          ]}
        />
        <ErrorState message="Admin access required. Please sign in with an admin account." onRetry={mutate} />
      </div>
    )
  }

  if (error || !affiliate) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Affiliate details"
          breadcrumb={[
            { label: "Admin", href: "/admin/dashboard" },
            { label: "Affiliates", href: "/admin/affiliates" },
            { label: "Not found" },
          ]}
        />
        <Card>
          <CardContent className="flex flex-col items-start gap-4 py-10">
            <div>
              <h3 className="text-xl font-semibold">Record not found</h3>
              <p className="text-muted-foreground">We couldn&apos;t find this affiliate.</p>
            </div>
            <Button asChild>
              <Link href="/admin/affiliates">Back to list</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const referrals = affiliate.referralsList || []
  const commissions = affiliate.commissions || []
  const payouts = affiliate.payouts || []
  const activity =
    ((affiliate.activity || []).map((item) => {
      const timestamp = item.timestamp ? new Date(item.timestamp) : new Date()
      if (Number.isNaN(timestamp.getTime())) return null
      return {
        id: item.id,
        title: item.title,
        description: item.description,
        timestamp,
        type: (item.type as any) || "default",
      }
    }) as any[]).filter(Boolean) || []

  return (
    <div className="space-y-6">
      <PageHeader
        title={affiliateName(affiliate)}
        subtitle={affiliate.email || "Affiliate details"}
        breadcrumb={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Affiliates", href: "/admin/affiliates" },
          { label: affiliate.id || "Details" },
        ]}
        primaryAction={
          <Button variant="outline" asChild>
            <Link href="/admin/affiliates">Back to list</Link>
          </Button>
        }
      />

      <DetailShell
        summaryTitle="Overview"
        summary={<KeyValueGrid items={summary} columns={1} />}
        defaultTab="overview"
        tabs={[
          {
            value: "overview",
            label: "Overview",
            content: (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Identity
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2">
                  <KeyValueGrid
                    items={[
                      { label: "Name", value: affiliateName(affiliate) },
                      { label: "Email", value: affiliate.email || "Not available" },
                      { label: "Status", value: affiliate.status || "Not available" },
                      { label: "Referral code", value: affiliate.refCode || affiliate.referralCode || "Not available" },
                      {
                        label: "Referral link",
                        value: referralLink ? (
                          <div className="flex items-center gap-2">
                            <span className="truncate text-sm">{referralLink}</span>
                            <Button size="sm" variant="ghost" onClick={handleCopy}>
                              <Clipboard className="mr-1 h-4 w-4" />
                              {copied ? "Copied" : "Copy"}
                            </Button>
                          </div>
                        ) : (
                          "Not available"
                        ),
                      },
                      { label: "Created", value: formatDate(affiliate.createdAt) },
                    ]}
                    columns={2}
                  />
                </CardContent>
              </Card>
            ),
          },
          {
            value: "referrals",
            label: "Referrals",
            content: referrals.length ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MousePointer className="h-5 w-5" />
                    Referrals ({referrals.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {referrals.map((referral) => (
                        <TableRow key={referral.id}>
                          <TableCell className="font-mono text-sm">{referral.id}</TableCell>
                          <TableCell>{referral.referredUser || "Not available"}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="capitalize">
                              {referral.status || "pending"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{formatDate(referral.createdAt)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ) : (
              <EmptyState icon={MousePointer} title="No referrals" description="No referrals recorded for this affiliate." />
            ),
          },
          {
            value: "commissions",
            label: "Commissions",
            content: commissions.length ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Commissions ({commissions.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {commissions.map((commission) => (
                        <TableRow key={commission.id}>
                          <TableCell className="font-mono text-sm">{commission.id}</TableCell>
                          <TableCell>{commission.type || "Referral"}</TableCell>
                          <TableCell className="font-medium">
                            ${Number(commission.amount ?? 0).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <StatusPill status={(commission.status?.toLowerCase() as any) || "pending"} />
                          </TableCell>
                          <TableCell className="text-muted-foreground">{formatDate(commission.createdAt)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ) : (
              <EmptyState icon={DollarSign} title="No commissions" description="No commissions recorded for this affiliate." />
            ),
          },
          {
            value: "payouts",
            label: "Payouts",
            content: payouts.length ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BadgeCheck className="h-5 w-5" />
                    Payouts ({payouts.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payouts.map((payout) => (
                        <TableRow key={payout.id}>
                          <TableCell className="font-mono text-sm">{payout.id}</TableCell>
                          <TableCell className="font-medium">
                            ${Number(payout.amount ?? 0).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <StatusPill status={(payout.status?.toLowerCase() as any) || "pending"} />
                          </TableCell>
                          <TableCell className="text-muted-foreground">{formatDate(payout.createdAt)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ) : (
              <EmptyState icon={BadgeCheck} title="No payouts" description="No payouts have been issued yet." />
            ),
          },
          {
            value: "activity",
            label: "Activity",
            content: (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Activity timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ActivityTimeline items={activity} />
                </CardContent>
              </Card>
            ),
          },
        ]}
      />
    </div>
  )
}
