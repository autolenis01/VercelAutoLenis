"use client"

import { useState } from "react"
import { PageHeader } from "@/components/dashboard/page-header"
import { EmptyState } from "@/components/dashboard/empty-state"
import { LoadingSkeleton } from "@/components/dashboard/loading-skeleton"
import { ErrorState } from "@/components/dashboard/error-state"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, Upload, Eye, Download } from "lucide-react"
import useSWR from "swr"
import { formatDistanceToNow } from "date-fns"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const mockDocuments = []

export default function DealerDocumentsPage() {
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  
  const { data, error, isLoading } = useSWR("/api/dealer/documents", fetcher, {
    fallbackData: { documents: mockDocuments }
  })

  const documents = data?.documents || []

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Documents" subtitle="Manage your documents" />
        <LoadingSkeleton variant="table" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Documents" subtitle="Manage your documents" />
        <ErrorState message="Failed to load documents" onRetry={() => window.location.reload()} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Document Center"
        subtitle="Upload and manage your business documents"
        primaryAction={
          <Button onClick={() => setUploadModalOpen(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
        }
        breadcrumb={[
          { label: "Dashboard", href: "/dealer/dashboard" },
          { label: "Documents" },
        ]}
      />

      {documents.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No documents"
          description="Uploaded documents will appear here"
          primaryCta={{
            label: "Upload Documents",
            onClick: () => setUploadModalOpen(true),
          }}
        />
      ) : (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-3">
              {documents.map((doc: any) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{doc.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {doc.type} • Uploaded {formatDistanceToNow(new Date(doc.uploadedAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
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
