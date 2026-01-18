"use client"

import { use, useState } from "react"
import { PageHeader } from "@/components/dashboard/page-header"
import { KeyValueGrid } from "@/components/dashboard/key-value-grid"
import { LoadingSkeleton } from "@/components/dashboard/loading-skeleton"
import { ErrorState } from "@/components/dashboard/error-state"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { FileText, CheckCircle, XCircle, Download, Eye } from "lucide-react"
import useSWR from "swr"
import { format } from "date-fns"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function AdminDocumentReviewPage({ params }: { params: Promise<{ documentId: string }> }) {
  const { documentId } = use(params)
  const [reviewNotes, setReviewNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // In a real app, this would fetch from /api/admin/documents/${documentId}
  const { data, error, isLoading } = useSWR(`/api/admin/documents/${documentId}`, fetcher, {
    fallbackData: null
  })

  const handleReview = async (approved: boolean) => {
    setIsSubmitting(true)
    // In a real app, this would submit to /api/admin/documents/${documentId}/review
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log("Review submitted:", { documentId, approved, notes: reviewNotes })
    setIsSubmitting(false)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Loading..." subtitle="Loading document details" />
        <LoadingSkeleton variant="detail" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="space-y-6">
        <PageHeader title="Document Not Found" subtitle="Unable to load document" />
        <ErrorState message="Failed to load document details" onRetry={() => window.location.reload()} />
      </div>
    )
  }

  // Mock data structure
  const document = {
    id: documentId,
    name: "Driver License - Front.pdf",
    type: "Driver License",
    status: "pending" as const,
    uploaderName: "John Doe",
    uploaderId: "buyer123",
    uploadedAt: new Date(),
    fileSize: "1.2 MB",
    mimeType: "application/pdf",
    relatedTo: "Financing Request #ABC123",
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={document.name}
        subtitle="Document Review"
        breadcrumb={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Documents", href: "/admin/documents" },
          { label: document.name },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Document Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-[8.5/11] bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center space-y-4">
                  <FileText className="h-16 w-16 mx-auto text-muted-foreground" />
                  <p className="text-muted-foreground">Document preview would appear here</p>
                  <div className="flex gap-2 justify-center">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Full Screen
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Review Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Add notes about this document review..."
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                rows={4}
              />
              <p className="text-sm text-muted-foreground">
                These notes will be visible to the uploader and other admins.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Document Details</CardTitle>
            </CardHeader>
            <CardContent>
              <KeyValueGrid
                items={[
                  { label: "Document ID", value: `#${document.id.slice(0, 8).toUpperCase()}` },
                  { label: "Type", value: document.type },
                  { label: "Status", value: document.status },
                  { label: "File Size", value: document.fileSize },
                  { label: "Format", value: document.mimeType },
                  { label: "Uploaded", value: format(document.uploadedAt, "MMM d, yyyy 'at' p") },
                ]}
                columns={1}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Uploader Information</CardTitle>
            </CardHeader>
            <CardContent>
              <KeyValueGrid
                items={[
                  { label: "Name", value: document.uploaderName },
                  { label: "User ID", value: `#${document.uploaderId.slice(0, 8).toUpperCase()}` },
                  { label: "Related To", value: document.relatedTo },
                ]}
                columns={1}
              />
              <div className="mt-4">
                <Button variant="outline" className="w-full" size="sm">
                  View User Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          {document.status === "pending" && (
            <Card>
              <CardHeader>
                <CardTitle>Review Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  className="w-full" 
                  onClick={() => handleReview(true)}
                  disabled={isSubmitting}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve Document
                </Button>
                <Button 
                  variant="destructive" 
                  className="w-full"
                  onClick={() => handleReview(false)}
                  disabled={isSubmitting}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject Document
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
