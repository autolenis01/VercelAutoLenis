"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, Flag, StickyNote, Search, AlertTriangle, User, Building2, CheckCircle, Loader2 } from "lucide-react"

export default function AdminSupportPage() {
  const [impersonateType, setImpersonateType] = useState<"buyer" | "dealer">("buyer")
  const [impersonateId, setImpersonateId] = useState("")
  const [noteType, setNoteType] = useState<"buyer" | "dealer" | "deal">("buyer")
  const [noteEntityId, setNoteEntityId] = useState("")
  const [noteContent, setNoteContent] = useState("")
  const [isImpersonating, setIsImpersonating] = useState(false)
  const [isAddingNote, setIsAddingNote] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleImpersonate = async () => {
    if (!impersonateId.trim()) {
      setError("Please enter a user ID or email")
      return
    }

    setIsImpersonating(true)
    setError(null)

    try {
      // TODO: Implement impersonation API endpoint
      // Verify admin permissions and create read-only session
      
      setSuccess(`View-as mode activated for ${impersonateType}: ${impersonateId}`)
      
      // Clear after 3 seconds
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(err.message || "Failed to impersonate user")
    } finally {
      setIsImpersonating(false)
    }
  }

  const handleAddNote = async () => {
    if (!noteEntityId.trim() || !noteContent.trim()) {
      setError("Please enter both entity ID and note content")
      return
    }

    setIsAddingNote(true)
    setError(null)

    try {
      // TODO: Implement notes API endpoint
      // Call: POST /api/admin/support/notes
      
      setSuccess(`Note added to ${noteType} ${noteEntityId}`)
      setNoteContent("")
      setNoteEntityId("")
      
      // Clear after 3 seconds
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(err.message || "Failed to add note")
    } finally {
      setIsAddingNote(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Support Tools</h1>
        <p className="text-gray-500">Administrative tools for user support</p>
      </div>

      {/* Success/Error Messages */}
      {error && (
        <Alert className="bg-red-50 border-red-200">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Impersonation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-[#2D1B69]" />
              View As User
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-500">
              View the platform as a specific user to debug issues (read-only mode)
            </p>
            <div className="flex gap-3">
              <Select value={impersonateType} onValueChange={(v: "buyer" | "dealer") => setImpersonateType(v)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buyer">Buyer</SelectItem>
                  <SelectItem value="dealer">Dealer</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder={`Enter ${impersonateType} ID or email...`}
                value={impersonateId}
                onChange={(e) => setImpersonateId(e.target.value)}
                className="flex-1"
              />
            </div>
            <Button 
              onClick={handleImpersonate} 
              className="w-full bg-[#2D1B69] hover:bg-[#2D1B69]/90"
              disabled={isImpersonating || !impersonateId.trim()}
            >
              {isImpersonating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  View As {impersonateType === "buyer" ? "Buyer" : "Dealer"}
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Internal Notes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <StickyNote className="h-5 w-5 text-[#7ED321]" />
              Internal Notes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-500">
              Add internal notes to users, dealers, or deals (not visible to users)
            </p>
            <div className="flex gap-3">
              <Select value={noteType} onValueChange={(v: "buyer" | "dealer" | "deal") => setNoteType(v)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buyer">Buyer</SelectItem>
                  <SelectItem value="dealer">Dealer</SelectItem>
                  <SelectItem value="deal">Deal</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder={`Enter ${noteType} ID...`}
                value={noteEntityId}
                onChange={(e) => setNoteEntityId(e.target.value)}
                className="flex-1"
              />
            </div>
            <Textarea
              placeholder="Enter note content..."
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              rows={3}
            />
            <Button 
              onClick={handleAddNote} 
              className="w-full bg-[#7ED321] hover:bg-[#7ED321]/90 text-white"
              disabled={isAddingNote || !noteEntityId.trim() || !noteContent.trim()}
            >
              {isAddingNote ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <StickyNote className="h-4 w-4 mr-2" />
                  Add Note
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Flags & Risk Indicators */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flag className="h-5 w-5 text-red-500" />
              Flagged Entities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">
              Review flagged users, dealers, and deals for suspicious activity
            </p>
            <div className="space-y-3">
              <div className="p-3 border rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  <div>
                    <p className="font-medium text-sm">Suspicious Affiliate Activity</p>
                    <p className="text-xs text-gray-500">2 affiliates flagged</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Review
                </Button>
              </div>
              <div className="p-3 border rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="font-medium text-sm">Contract Issues</p>
                    <p className="text-xs text-gray-500">1 dealer with multiple failures</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Review
                </Button>
              </div>
              <div className="p-3 border rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="font-medium text-sm">Payment Disputes</p>
                    <p className="text-xs text-gray-500">0 pending disputes</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Review
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Search */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-[#00D9FF]" />
              Quick Search
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-500">Search across all entities by ID, email, or name</p>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input placeholder="Search by ID, email, name, VIN..." className="pl-10" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Button variant="outline" size="sm" className="justify-start bg-transparent">
                <User className="h-4 w-4 mr-2" />
                Buyers
              </Button>
              <Button variant="outline" size="sm" className="justify-start bg-transparent">
                <Building2 className="h-4 w-4 mr-2" />
                Dealers
              </Button>
              <Button variant="outline" size="sm" className="justify-start bg-transparent">
                <Flag className="h-4 w-4 mr-2" />
                Deals
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
