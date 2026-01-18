"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/dashboard/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Building2, Mail, Phone, MapPin, FileText, Globe } from "lucide-react"
import { LoadingSkeleton } from "@/components/dashboard/loading-skeleton"

export default function DealerProfilePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const response = await fetch("/api/dealer/profile")
      const data = await response.json()

      if (data.success) {
        setProfile(data.data.profile)
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load profile",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch("/api/dealer/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error)
      }

      toast({
        title: "Profile updated",
        description: "Your profile has been saved successfully",
      })
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Dealer Profile" subtitle="Manage your business information" />
        <LoadingSkeleton variant="detail" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dealer Profile"
        subtitle="Manage your business information and preferences"
        breadcrumb={[
          { label: "Dashboard", href: "/dealer/dashboard" },
          { label: "Profile" },
        ]}
      />

      <form onSubmit={handleSave}>
        <Card>
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
            <CardDescription>Update your dealership details and contact information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="businessName">
                <Building2 className="h-4 w-4 inline mr-2" />
                Business Name
              </Label>
              <Input
                id="businessName"
                value={profile?.businessName || ""}
                onChange={(e) => setProfile({ ...profile, businessName: e.target.value })}
                placeholder="Your Dealership Name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="licenseNumber">
                <FileText className="h-4 w-4 inline mr-2" />
                Dealer License Number
              </Label>
              <Input
                id="licenseNumber"
                value={profile?.licenseNumber || ""}
                onChange={(e) => setProfile({ ...profile, licenseNumber: e.target.value })}
                placeholder="DL-123456"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">
                  <Mail className="h-4 w-4 inline mr-2" />
                  Business Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={profile?.user?.email || ""}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">Email cannot be changed</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">
                  <Phone className="h-4 w-4 inline mr-2" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={profile?.phone || ""}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  placeholder="(555) 123-4567"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">
                <Globe className="h-4 w-4 inline mr-2" />
                Website (Optional)
              </Label>
              <Input
                id="website"
                type="url"
                value={profile?.website || ""}
                onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                placeholder="https://www.yourdealership.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">
                <MapPin className="h-4 w-4 inline mr-2" />
                Street Address
              </Label>
              <Input
                id="address"
                value={profile?.address || ""}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                placeholder="123 Main Street"
                required
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={profile?.city || ""}
                  onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                  placeholder="Los Angeles"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={profile?.state || ""}
                  onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                  maxLength={2}
                  placeholder="CA"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  id="zipCode"
                  value={profile?.zipCode || ""}
                  onChange={(e) => setProfile({ ...profile, zipCode: e.target.value })}
                  maxLength={5}
                  placeholder="90001"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Business Description (Optional)</Label>
              <Textarea
                id="description"
                value={profile?.description || ""}
                onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                placeholder="Tell buyers about your dealership..."
                rows={4}
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={loadProfile}>
                Reset
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
