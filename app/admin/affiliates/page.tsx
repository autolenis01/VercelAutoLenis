"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import useSWR from "swr"
import { ArrowLeft, BadgePercent, ChevronLeft, ChevronRight, Eye, Filter, Search } from "lucide-react"

import { EmptyState } from "@/components/dashboard/empty-state"
import { ErrorState } from "@/components/dashboard/error-state"
import { LoadingSkeleton } from "@/components/dashboard/loading-skeleton"
import { PageHeader } from "@/components/dashboard/page-header"
import { StatusPill } from "@/components/dashboard/status-pill"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type AffiliateRecord = {
  id?: string
  name?: string
  firstName?: string
  lastName?: string
  email?: string
  refCode?: string
  referralCode?: string
  clicks?: number
  referrals?: number
  commissions?: number
  totalCommissions?: number
  status?: string
  createdAt?: string
}

type AffiliatesResponse = {
  affiliates?: AffiliateRecord[]
  data?: AffiliateRecord[]
  total?: number
  totalPages?: number
  page?: number
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

const affiliateName = (affiliate: AffiliateRecord) => {
  if (affiliate.name) return affiliate.name
  if (affiliate.firstName || affiliate.lastName) {
    return [affiliate.firstName, affiliate.lastName].filter(Boolean).join(" ")
  }
  return "Not available"
}

export default function AdminAffiliatesPage() {
  const [search, setSearch] = useState("")
  const [submittedSearch, setSubmittedSearch] = useState("")
  const [status, setStatus] = useState("all")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const query = useMemo(() => {
    const params = new URLSearchParams()
    params.set("page", page.toString())
    params.set("pageSize", pageSize.toString())
    if (submittedSearch) params.set("q", submittedSearch)
    if (status !== "all") params.set("status", status)
    return params.toString()
  }, [page, pageSize, status, submittedSearch])

  const { data, error, isLoading, mutate } = useSWR(`/api/admin/affiliates?${query}`, fetcher, {
    revalidateOnFocus: false,
  })

  const payload: AffiliatesResponse = (data?.payload as AffiliatesResponse) || {}
  const statusCode = data?.status
  const affiliates = payload.affiliates || payload.data || []
  const totalPages = payload.totalPages || Math.max(1, Math.ceil((payload.total || affiliates.length || 1) / pageSize))
  const currentPage = payload.page || page
  const totalCount = payload.total ?? affiliates.length ?? 0

  const handleSearch = () => {
    setSubmittedSearch(search.trim())
    setPage(1)
    void mutate()
  }

  const unauthorized = statusCode === 401 || statusCode === 403

  return (
    <div className="space-y-6">
      <PageHeader
        title="Affiliates"
        subtitle="Track affiliate performance and payouts"
        breadcrumb={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Affiliates" },
        ]}
        primaryAction={
          <Button variant="outline" asChild>
            <Link href="/admin/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to dashboard
            </Link>
          </Button>
        }
      />

      <Card className="border-muted">
        <CardHeader className="space-y-1">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Search className="h-4 w-4 text-muted-foreground" />
            Search & Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-[1fr_220px_160px_auto]">
          <Input
            placeholder="Search affiliates by name, email, or code"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && handleSearch()}
            className="h-11"
          />
          <Select
            value={status}
            onValueChange={(value) => {
              setStatus(value)
              setPage(1)
            }}
          >
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={String(pageSize)}
            onValueChange={(value) => {
              setPageSize(Number(value))
              setPage(1)
            }}
          >
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Page size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 per page</SelectItem>
              <SelectItem value="25">25 per page</SelectItem>
              <SelectItem value="50">50 per page</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button onClick={handleSearch} className="h-11 w-full md:w-auto">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
            <Button
              variant="outline"
              className="h-11 w-full md:w-auto"
              onClick={() => {
                setSearch("")
                setSubmittedSearch("")
                setStatus("all")
                setPage(1)
              }}
            >
              <Filter className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-muted shadow-sm">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6">
              <LoadingSkeleton variant="table" />
            </div>
          ) : unauthorized ? (
            <div className="p-8">
              <ErrorState message="Admin access required. Please sign in with an admin account." onRetry={mutate} />
            </div>
          ) : error ? (
            <div className="p-8">
              <ErrorState onRetry={mutate} />
            </div>
          ) : affiliates.length === 0 ? (
            <div className="p-6">
              <EmptyState
                icon={BadgePercent}
                title="No affiliates yet"
                description="Create an affiliate to start tracking referrals and payouts."
                primaryCta={{ label: "Create Affiliate", onClick: () => void 0 }}
              />
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[180px]">Affiliate</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Clicks</TableHead>
                    <TableHead>Referrals</TableHead>
                    <TableHead>Commissions</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {affiliates.map((affiliate) => {
                    const code = affiliate.refCode || affiliate.referralCode || "Not available"
                    const statusLabel = affiliate.status || "pending"
                    const normalizedStatus = statusLabel.toLowerCase()
                    const statusPill =
                      normalizedStatus === "active"
                        ? "active"
                        : normalizedStatus === "pending"
                          ? "pending"
                          : normalizedStatus === "suspended"
                            ? "cancelled"
                            : null
                    return (
                      <TableRow key={affiliate.id || affiliateName(affiliate)}>
                        <TableCell className="font-medium">{affiliateName(affiliate)}</TableCell>
                        <TableCell className="font-mono text-sm">{code}</TableCell>
                        <TableCell className="text-muted-foreground">{affiliate.clicks ?? 0}</TableCell>
                        <TableCell className="text-muted-foreground">{affiliate.referrals ?? 0}</TableCell>
                        <TableCell className="font-medium">
                          ${(affiliate.totalCommissions ?? affiliate.commissions ?? 0).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {statusPill ? (
                            <StatusPill status={statusPill as any} />
                          ) : (
                            <Badge variant="secondary" className="capitalize">
                              {statusLabel}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/admin/affiliates/${affiliate.id || ""}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>

              <div className="flex flex-col gap-3 border-t px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages} • {totalCount} total affiliates
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage <= 1}
                  >
                    <ChevronLeft className="mr-1 h-4 w-4" />
                    Prev
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage >= totalPages}
                  >
                    Next
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
