"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, AlertTriangle, CheckCircle, XCircle, Info } from "lucide-react"
import Link from "next/link"

export default function SEOHealthPage() {
  // Mock data for SEO health scores
  const pages = [
    {
      path: "/",
      title: "Home",
      score: 92,
      issues: [],
      warnings: ["Missing H1 tag"],
    },
    {
      path: "/how-it-works",
      title: "How It Works",
      score: 88,
      issues: [],
      warnings: ["Meta description too long"],
    },
    {
      path: "/pricing",
      title: "Pricing",
      score: 95,
      issues: [],
      warnings: [],
    },
    {
      path: "/dealer-application",
      title: "Dealer Application",
      score: 75,
      issues: ["Missing meta description"],
      warnings: ["H1 too long", "No alt text on images"],
    },
    {
      path: "/faq",
      title: "FAQ",
      score: 85,
      issues: [],
      warnings: ["Meta description could be improved"],
    },
    {
      path: "/contact",
      title: "Contact",
      score: 90,
      issues: [],
      warnings: [],
    },
  ]

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 75) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBadge = (score: number) => {
    if (score >= 90) return "bg-green-100 text-green-800"
    if (score >= 75) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  const avgScore = Math.round(pages.reduce((sum, page) => sum + page.score, 0) / pages.length)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">SEO Health Dashboard</h1>
        <p className="text-gray-500">Monitor SEO scores and identify issues across your pages</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Avg Score</CardTitle>
            <Shield className="h-4 w-4 text-[#2D1B69]" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getScoreColor(avgScore)}`}>{avgScore}</div>
            <p className="text-xs text-gray-500">Across {pages.length} pages</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">High Scores</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pages.filter((p) => p.score >= 90).length}</div>
            <p className="text-xs text-gray-500">Pages scoring 90+</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Issues</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {pages.reduce((sum, p) => sum + p.issues.length, 0)}
            </div>
            <p className="text-xs text-gray-500">Critical issues found</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Warnings</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {pages.reduce((sum, p) => sum + p.warnings.length, 0)}
            </div>
            <p className="text-xs text-gray-500">Minor issues found</p>
          </CardContent>
        </Card>
      </div>

      {/* Pages Table */}
      <Card>
        <CardHeader>
          <CardTitle>Page Health Scores</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Page</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Path</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Issues</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Warnings</th>
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
                    <Badge className={getScoreBadge(page.score)}>{page.score}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    {page.issues.length > 0 ? (
                      <div className="flex flex-col gap-1">
                        {page.issues.map((issue, i) => (
                          <div key={i} className="flex items-center gap-1 text-sm text-red-600">
                            <XCircle className="h-3 w-3" />
                            <span>{issue}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">None</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {page.warnings.length > 0 ? (
                      <div className="flex flex-col gap-1">
                        {page.warnings.map((warning, i) => (
                          <div key={i} className="flex items-center gap-1 text-sm text-yellow-600">
                            <Info className="h-3 w-3" />
                            <span>{warning}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">None</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link href={`/admin/seo/pages?path=${page.path}`} className="text-[#2D1B69] hover:underline text-sm">
                      Edit Metadata
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Quick Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
              <span>Keep meta descriptions between 150-160 characters for optimal display</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
              <span>Use one H1 tag per page, containing your primary keyword</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
              <span>Add alt text to all images for better accessibility and SEO</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
              <span>Target scores of 90+ for best search engine performance</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
