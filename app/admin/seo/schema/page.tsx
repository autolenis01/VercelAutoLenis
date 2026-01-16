"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, XCircle, Code, FileJson } from "lucide-react"

// Default schema template for homepage
const DEFAULT_SCHEMA = `{
  "@context": "https://schema.org",
  "@type": "FinancialService",
  "name": "AutoLenis",
  "description": "Revolutionary car buying platform connecting buyers and dealers",
  "url": "https://autolenis.com",
  "logo": "https://autolenis.com/logo.png",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+1-555-0123",
    "contactType": "Customer Service"
  },
  "sameAs": [
    "https://facebook.com/autolenis",
    "https://twitter.com/autolenis",
    "https://linkedin.com/company/autolenis"
  ]
}`

export default function SEOSchemaPage() {
  const [selectedPage, setSelectedPage] = useState("/")
  const [schemaCode, setSchemaCode] = useState(DEFAULT_SCHEMA)

  const pages = [
    { path: "/", title: "Home", hasSchema: true, validated: true },
    { path: "/how-it-works", title: "How It Works", hasSchema: true, validated: true },
    { path: "/pricing", title: "Pricing", hasSchema: true, validated: false },
    { path: "/dealer-application", title: "Dealer Application", hasSchema: false, validated: false },
    { path: "/faq", title: "FAQ", hasSchema: true, validated: true },
    { path: "/contact", title: "Contact", hasSchema: false, validated: false },
  ]

  const schemaTypes = [
    {
      type: "Organization",
      description: "Basic company information and contact details",
      recommended: ["/", "/contact"],
    },
    {
      type: "FinancialService",
      description: "Financial service offerings and details",
      recommended: ["/", "/pricing"],
    },
    {
      type: "FAQPage",
      description: "Frequently asked questions with answers",
      recommended: ["/faq"],
    },
    {
      type: "HowTo",
      description: "Step-by-step instructions or processes",
      recommended: ["/how-it-works"],
    },
    {
      type: "LocalBusiness",
      description: "Physical business location information",
      recommended: ["/contact"],
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Structured Data (Schema.org)</h1>
        <p className="text-gray-500">Add and validate JSON-LD structured data for rich search results</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pages with Schema</CardTitle>
            <FileJson className="h-4 w-4 text-[#2D1B69]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pages.filter((p) => p.hasSchema).length}/{pages.length}
            </div>
            <p className="text-xs text-gray-500">Structured data present</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Validated</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {pages.filter((p) => p.validated).length}
            </div>
            <p className="text-xs text-gray-500">Passing validation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Needs Attention</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {pages.filter((p) => !p.hasSchema || !p.validated).length}
            </div>
            <p className="text-xs text-gray-500">Pages requiring fixes</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="editor">
        <TabsList>
          <TabsTrigger value="editor">Schema Editor</TabsTrigger>
          <TabsTrigger value="pages">Page Status</TabsTrigger>
          <TabsTrigger value="types">Schema Types</TabsTrigger>
        </TabsList>

        {/* Editor Tab */}
        <TabsContent value="editor" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>JSON-LD Schema Editor</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Code className="h-4 w-4 mr-2" />
                    Validate
                  </Button>
                  <Button size="sm" className="bg-[#2D1B69] hover:bg-[#2D1B69]/90">
                    Save Schema
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Page</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D1B69]"
                  value={selectedPage}
                  onChange={(e) => setSelectedPage(e.target.value)}
                >
                  {pages.map((page) => (
                    <option key={page.path} value={page.path}>
                      {page.title} ({page.path})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">JSON-LD Schema</label>
                <Textarea
                  value={schemaCode}
                  onChange={(e) => setSchemaCode(e.target.value)}
                  className="font-mono text-sm h-96"
                  placeholder="Enter JSON-LD schema..."
                />
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-900">Schema Valid</p>
                    <p className="text-sm text-green-700">No errors found. Ready to publish.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pages Tab */}
        <TabsContent value="pages">
          <Card>
            <CardContent className="p-0">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Page</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Path</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Has Schema</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Validated</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {pages.map((page) => (
                    <tr key={page.path} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="font-medium text-gray-900">{page.title}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <code className="text-sm text-gray-600">{page.path}</code>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {page.hasSchema ? (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Yes
                          </Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-800">
                            <XCircle className="h-3 w-3 mr-1" />
                            No
                          </Badge>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {page.validated ? (
                          <Badge className="bg-green-100 text-green-800">Valid</Badge>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-800">Needs Review</Badge>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Button variant="ghost" size="sm" className="text-[#2D1B69]">
                          Edit Schema
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Types Tab */}
        <TabsContent value="types">
          <div className="grid gap-4">
            {schemaTypes.map((schema) => (
              <Card key={schema.type}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{schema.type}</CardTitle>
                      <p className="text-sm text-gray-500 mt-1">{schema.description}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Use Template
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Recommended for:</span>
                    <div className="flex flex-wrap gap-1">
                      {schema.recommended.map((path, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {path}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Resources */}
      <Card>
        <CardHeader>
          <CardTitle>Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <a
              href="https://schema.org"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-[#2D1B69] hover:underline"
            >
              → Schema.org Documentation
            </a>
            <a
              href="https://search.google.com/test/rich-results"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-[#2D1B69] hover:underline"
            >
              → Google Rich Results Test
            </a>
            <a
              href="https://validator.schema.org"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-[#2D1B69] hover:underline"
            >
              → Schema Markup Validator
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
