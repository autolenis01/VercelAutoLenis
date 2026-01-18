"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/dashboard/page-header"
import { EmptyState } from "@/components/dashboard/empty-state"
import { LoadingSkeleton } from "@/components/dashboard/loading-skeleton"
import { ErrorState } from "@/components/dashboard/error-state"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { StatusPill } from "@/components/dashboard/status-pill"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Search, Eye, AlertCircle } from "lucide-react"
import useSWR from "swr"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

// Mock data for demonstration
const mockDocuments = []

export default function AdminDocumentsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("pending")
  
  // In a real app, this would fetch from /api/admin/documents
  const { data, error, isLoading } = useSWR("/api/admin/documents", fetcher, {
    fallbackData: { documents: mockDocuments }
  })

  const documents = data?.documents || []
  const filteredDocuments = documents.filter((doc: any) => {
    const matchesSearch = doc.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.uploaderName?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || doc.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const pendingCount = documents.filter((doc: any) => doc.status === "pending").length

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Document Review" subtitle="Review and approve documents" />
        <LoadingSkeleton variant="table" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Document Review" subtitle="Review and approve documents" />
        <ErrorState message="Failed to load documents" onRetry={() => window.location.reload()} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Document Review"
        subtitle={`Manage document review queue${pendingCount > 0 ? ` (${pendingCount} pending)` : ""}`}
        breadcrumb={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Documents" },
        ]}
      />

      {documents.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No documents awaiting review"
          description="Documents requiring review will appear here"
        />
      ) : (
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by document name or uploader..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              {filteredDocuments.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No documents found</p>
              ) : (
                filteredDocuments.map((document: any) => (
                  <div
                    key={document.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors gap-4"
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <FileText className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-medium truncate">{document.name}</h3>
                          <StatusPill status={document.status} />
                          {document.status === "pending" && (
                            <AlertCircle className="h-4 w-4 text-orange-500" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Uploaded by {document.uploaderName} • {document.type} • {formatDistanceToNow(new Date(document.uploadedAt), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                    <Link href={`/admin/documents/${document.id}`}>
                      <Button variant={document.status === "pending" ? "default" : "ghost"} size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        {document.status === "pending" ? "Review" : "View"}
                      </Button>
                    </Link>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
