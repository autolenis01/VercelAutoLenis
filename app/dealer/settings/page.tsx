"use client"

import { useState, useEffect } from "react"
import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { Settings, Building2, Bell, Shield, AlertCircle } from "lucide-react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function DealerSettingsPage() {
  const { toast } = useToast()
  const { data, error, isLoading, mutate } = useSWR("/api/dealer/settings", fetcher)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    businessName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
  })
  const [notifications, setNotifications] = useState({
    auctionInvites: true,
    offerSelected: true,
    contractIssues: true,
    pickupReminders: true,
  })

  useEffect(() => {
    if (data?.settings) {
      setFormData({
        businessName: data.settings.businessName || "",
        phone: data.settings.phone || "",
        email: data.settings.email || "",
        address: data.settings.address || "",
        city: data.settings.city || "",
        state: data.settings.state || "",
        postalCode: data.settings.postalCode || "",
      })
    }
  }, [data])

  const handleSaveSettings = async () => {
    setSaving(true)
    try {
      const res = await fetch("/api/dealer/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!res.ok) throw new Error("Failed to save")

      toast({ title: "Settings saved successfully" })
      mutate()
    } catch {
      toast({ variant: "destructive", title: "Failed to save settings" })
    } finally {
      setSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-2xl space-y-6">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-muted rounded mb-2" />
          <div className="h-4 w-64 bg-muted rounded" />
        </div>
        {[1, 2].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 w-32 bg-muted rounded" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-10 bg-muted rounded" />
                <div className="h-10 bg-muted rounded" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-xl font-semibold mb-2">Failed to load settings</h2>
        <p className="text-muted-foreground">Please try refreshing the page</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Settings className="h-8 w-8 text-[#2D1B69]" />
          Dealer Settings
        </h1>
        <p className="text-muted-foreground mt-1">Manage your dealership account and preferences</p>
      </div>

      {/* Business Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-[#7ED321]" />
            Business Information
          </CardTitle>
          <CardDescription>Update your dealership details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="businessName">Business Name</Label>
            <Input
              id="businessName"
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              placeholder="ABC Auto Sales"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(555) 123-4567"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="contact@dealer.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="123 Main Street"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Los Angeles"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                placeholder="CA"
                maxLength={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postalCode">ZIP Code</Label>
              <Input
                id="postalCode"
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                placeholder="90001"
              />
            </div>
          </div>

          <Button onClick={handleSaveSettings} disabled={saving} className="w-full bg-[#2D1B69] hover:bg-[#2D1B69]/90">
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-[#00D9FF]" />
            Notification Preferences
          </CardTitle>
          <CardDescription>Choose what notifications you want to receive</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Auction Invitations</div>
              <div className="text-sm text-muted-foreground">Get notified when invited to new auctions</div>
            </div>
            <Switch
              checked={notifications.auctionInvites}
              onCheckedChange={(v) => setNotifications({ ...notifications, auctionInvites: v })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Offer Selected</div>
              <div className="text-sm text-muted-foreground">Get notified when your offer is selected</div>
            </div>
            <Switch
              checked={notifications.offerSelected}
              onCheckedChange={(v) => setNotifications({ ...notifications, offerSelected: v })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Contract Issues</div>
              <div className="text-sm text-muted-foreground">Get notified when contracts need revision</div>
            </div>
            <Switch
              checked={notifications.contractIssues}
              onCheckedChange={(v) => setNotifications({ ...notifications, contractIssues: v })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Pickup Reminders</div>
              <div className="text-sm text-muted-foreground">Get reminded about upcoming vehicle pickups</div>
            </div>
            <Switch
              checked={notifications.pickupReminders}
              onCheckedChange={(v) => setNotifications({ ...notifications, pickupReminders: v })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-[#0066FF]" />
            Security
          </CardTitle>
          <CardDescription>Manage your account security</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full bg-transparent">
            Change Password
          </Button>
          <Button variant="outline" className="w-full bg-transparent">
            Enable Two-Factor Authentication
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
