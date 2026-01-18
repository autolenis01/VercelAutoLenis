"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, FileText, Clock, CheckCircle, XCircle, Eye, RefreshCw, Download, AlertTriangle } from "lucide-react"
import { formatDate } from "@/lib/utils/format"
import { PageHeader } from "@/components/dashboard/page-header"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import Loading from "./loading"

interface Document {
  id: string
  type: string
  status: string
  fileName: string
  fileUrl?: string
  dealId?: string
  buyerId?: string
  dealerId?: string
  createdAt: string
  updatedAt: string
  buyer?: {
    firstName: string
    lastName: string
  }
  dealer?: {
    dealershipName: string
  }
}

export default function AdminDocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const searchParams = useSearchParams()

  useEffect(() => {
    fetchDocuments()
  }, [typeFilter, statusFilter, searchParams])

  async function fetchDocuments() {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (typeFilter !== "all") params.set("type", typeFilter)
      if (statusFilter !== "all") params.set("status", statusFilter)
      if (search) params.set("search", search)
      
      const res = await fetch(`/api/admin/documents?${params}`)
      if (!res.ok) throw new Error("Failed to fetch documents")
      const data = await res.json()
      setDocuments(data.documents || [])
    } catch (err) {
      console.error("Error fetching documents:", err)
    } finally {
      setLoading(false)
    }
  }

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    UPLOADED: "bg-blue-100 text-blue-800",
    VERIFIED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
    SIGNED: "bg-green-100 text-green-800",
    EXPIRED: "bg-gray-100 text-gray-800",
  }

  const typeLabels: Record<string, string> = {
    CONTRACT: "Contract",
    INSURANCE: "Insurance",
    ID_VERIFICATION: "ID Verification",
    PROOF_OF_INCOME: "Proof of Income",
    PREQUAL_LETTER: "Prequal Letter",
    BILL_OF_SALE: "Bill of Sale",
    TITLE: "Title",
    OTHER: "Other",
  }

  const stats = {
    total: documents.length,
    pending: documents.filter((d) => d.status === "PENDING" || d.status === "UPLOADED").length,
    verified: documents.filter((d) => d.status === "VERIFIED" || d.status === "SIGNED").length,
    rejected: documents.filter((d) => d.status === "REJECTED").length,
  }

  return (
    <Suspense fallback={<Loading />}>
      <div className="p-6 space-y-6">
        <PageHeader
          title="Documents"
          description="Review and manage all uploaded documents"
        />

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Documents</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending Review</p>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Verified</p>
                  <p className="text-2xl font-bold">{stats.verified}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Rejected</p>
                  <p className="text-2xl font-bold">{stats.rejected}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by file name or user..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && fetchDocuments()}
                  className="pl-10"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="CONTRACT">Contracts</SelectItem>
                  <SelectItem value="INSURANCE">Insurance</SelectItem>
                  <SelectItem value="ID_VERIFICATION">ID Verification</SelectItem>
                  <SelectItem value="PROOF_OF_INCOME">Proof of Income</SelectItem>
                  <SelectItem value="BILL_OF_SALE">Bill of Sale</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="UPLOADED">Uploaded</SelectItem>
                  <SelectItem value="VERIFIED">Verified</SelectItem>
                  <SelectItem value="SIGNED">Signed</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={fetchDocuments} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 text-center">
                <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                <p className="text-muted-foreground">Loading documents...</p>
              </div>
            ) : documents.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No documents found
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>File Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Uploaded</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium truncate max-w-[200px]">
                            {doc.fileName}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {typeLabels[doc.type] || doc.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {doc.buyer ? (
                          <span>{doc.buyer.firstName} {doc.buyer.lastName}</span>
                        ) : doc.dealer ? (
                          <span>{doc.dealer.dealershipName}</span>
                        ) : (
                          <span className="text-muted-foreground">Unknown</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[doc.status] || "bg-gray-100"}>
                          {doc.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(doc.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {doc.fileUrl && (
                            <Button variant="ghost" size="sm" asChild>
                              <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                                <Download className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/admin/documents/${doc.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </Suspense>
  )
}
