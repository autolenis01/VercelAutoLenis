"use client"

import { useState } from "react"
import { PageHeader } from "@/components/dashboard/page-header"
import { EmptyState } from "@/components/dashboard/empty-state"
import { StatusPill } from "@/components/dashboard/status-pill"
import { NotImplementedModal } from "@/components/dashboard/not-implemented-modal"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  FileText,
  Upload,
  Search,
  Download,
  Eye,
  Building2,
  FileCheck,
  Car,
} from "lucide-react"
import { useSearchParams, Suspense } from "next/navigation"
import Loading from "./loading"

// Mock document data
const mockDocuments = [
  {
    id: "1",
    name: "Dealer License",
    type: "license",
    status: "approved",
    uploadedAt: "2024-01-10",
    icon: Building2,
  },
  {
    id: "2",
    name: "Surety Bond",
    type: "compliance",
    status: "approved",
    uploadedAt: "2024-01-12",
    icon: FileCheck,
  },
]

export default function DealerDocumentsPage() {
  const [showUploadModal, setShowUploadModal] = useState(false)
  const documents = mockDocuments
  const searchParams = useSearchParams()

  return (
    <Suspense fallback={<Loading />}>
      <div className="space-y-6">
        <PageHeader
          title="Documents"
          subtitle="Manage your dealership documents"
          primaryAction={{
            label: "Upload Document",
            onClick: () => setShowUploadModal(true),
            icon: <Upload className="h-4 w-4 mr-2" />,
          }}
        />

        {/* Search */}
        <div className="flex gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search documents..." className="pl-9" />
          </div>
        </div>

        {/* Document Categories */}
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Documents</TabsTrigger>
            <TabsTrigger value="license">Licenses</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="deals">Deal Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            {documents.length === 0 ? (
              <EmptyState
                icon={<FileText className="h-8 w-8 text-muted-foreground" />}
                title="No documents uploaded"
                description="Upload your dealer license and compliance documents to get started."
                primaryCta={{ label: "Upload Document", onClick: () => setShowUploadModal(true) }}
              />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {documents.map((doc) => (
                  <Card key={doc.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg bg-[#2D1B69]/10 flex items-center justify-center flex-shrink-0">
                          <doc.icon className="h-6 w-6 text-[#2D1B69]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate">{doc.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                          </p>
                          <div className="mt-2">
                            <StatusPill status={doc.status} />
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="license" className="mt-6">
            <EmptyState
              icon={<Building2 className="h-8 w-8 text-muted-foreground" />}
              title="No license documents"
              description="Upload your dealer license for verification."
              primaryCta={{ label: "Upload License", onClick: () => setShowUploadModal(true) }}
            />
          </TabsContent>

          <TabsContent value="compliance" className="mt-6">
            <EmptyState
              icon={<FileCheck className="h-8 w-8 text-muted-foreground" />}
              title="No compliance documents"
              description="Upload surety bonds and other compliance documents."
              primaryCta={{ label: "Upload Document", onClick: () => setShowUploadModal(true) }}
            />
          </TabsContent>

          <TabsContent value="deals" className="mt-6">
            <EmptyState
              icon={<Car className="h-8 w-8 text-muted-foreground" />}
              title="No deal documents"
              description="Documents from completed deals will appear here."
            />
          </TabsContent>
        </Tabs>

        <NotImplementedModal
          open={showUploadModal}
          onOpenChange={setShowUploadModal}
          featureName="Document upload"
        />
      </div>
    </Suspense>
  )
}
