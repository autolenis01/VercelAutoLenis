"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Trash2, TrendingUp } from "lucide-react"

export default function SEOKeywordsPage() {
  const [keywords, setKeywords] = useState([
    { id: "1", keyword: "car financing", volume: "12,000", difficulty: 65, pages: ["/", "/how-it-works"] },
    { id: "2", keyword: "auto loan", volume: "18,000", difficulty: 72, pages: ["/", "/pricing"] },
    { id: "3", keyword: "used car purchase", volume: "8,500", difficulty: 58, pages: ["/how-it-works"] },
    { id: "4", keyword: "dealer inventory", volume: "3,200", difficulty: 45, pages: ["/dealer-application"] },
    { id: "5", keyword: "car auction", volume: "5,600", difficulty: 52, pages: ["/how-it-works", "/pricing"] },
  ])

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty >= 70) return "bg-red-100 text-red-800"
    if (difficulty >= 50) return "bg-yellow-100 text-yellow-800"
    return "bg-green-100 text-green-800"
  }

  const getDifficultyLabel = (difficulty: number) => {
    if (difficulty >= 70) return "Hard"
    if (difficulty >= 50) return "Medium"
    return "Easy"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Keyword Management</h1>
          <p className="text-gray-500">Track and optimize keywords across your pages</p>
        </div>
        <Button className="bg-[#2D1B69] hover:bg-[#2D1B69]/90">
          <Plus className="h-4 w-4 mr-2" />
          Add Keyword
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Keywords</CardTitle>
            <Search className="h-4 w-4 text-[#2D1B69]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{keywords.length}</div>
            <p className="text-xs text-gray-500">Being tracked</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Volume</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47.3K</div>
            <p className="text-xs text-gray-500">Monthly searches</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Avg Difficulty</CardTitle>
            <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">58</div>
            <p className="text-xs text-gray-500">Across all keywords</p>
          </CardContent>
        </Card>
      </div>

      {/* Keywords Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Tracked Keywords</CardTitle>
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-gray-400" />
              <Input placeholder="Search keywords..." className="w-64" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Keyword</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Monthly Volume
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Difficulty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Target Pages</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {keywords.map((kw) => (
                <tr key={kw.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Search className="h-4 w-4 text-gray-400" />
                      <span className="font-medium text-gray-900">{kw.keyword}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">{kw.volume}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Badge className={getDifficultyColor(kw.difficulty)}>{getDifficultyLabel(kw.difficulty)}</Badge>
                      <span className="text-sm text-gray-500">{kw.difficulty}/100</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {kw.pages.map((page, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {page}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="text-[#2D1B69] hover:text-[#2D1B69]/80">
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Keyword Research Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• Focus on keywords with medium difficulty (40-60) for better ranking opportunities</p>
            <p>• Use long-tail keywords (3+ words) to capture specific search intent</p>
            <p>• Assign each keyword to 1-2 pages to avoid keyword cannibalization</p>
            <p>• Include keywords naturally in titles, headings, and meta descriptions</p>
            <p>• Monitor keyword performance monthly and adjust strategy as needed</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
