"use client"

import { useState } from "react"
import { PageHeader } from "@/components/dashboard/page-header"
import { KeyValueGrid } from "@/components/dashboard/key-value-grid"
import { StatusPill } from "@/components/dashboard/status-pill"
import { LoadingSkeleton } from "@/components/dashboard/loading-skeleton"
import { ErrorState } from "@/components/dashboard/error-state"
import { NotImplementedModal } from "@/components/dashboard/not-implemented-modal"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Building2, MapPin, Phone, Mail, Globe, Edit, Save } from "lucide-react"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function DealerProfilePage() {
  const [showModal, setShowModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const { data, error, isLoading, mutate } = useSWR("/api/dealer/profile", fetcher)

  const profile = data?.dealer

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Dealership Profile" subtitle="Manage your dealership information" />
        <LoadingSkeleton variant="detail" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Dealership Profile" subtitle="Manage your dealership information" />
        <ErrorState message="Failed to load profile" onRetry={() => mutate()} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dealership Profile"
        subtitle="Manage your dealership information"
        primaryAction={{
          label: isEditing ? "Save Changes" : "Edit Profile",
          onClick: () => {
            if (isEditing) {
              setShowModal(true)
            } else {
              setIsEditing(true)
            }
          },
          icon: isEditing ? <Save className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />,
        }}
      />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-[#2D1B69]/10 flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-10 w-10 text-[#2D1B69]" />
              </div>
              <h2 className="text-xl font-bold">{profile?.name || "Your Dealership"}</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {profile?.city}, {profile?.state}
              </p>
              <div className="mt-3">
                <StatusPill status={profile?.status?.toLowerCase() || "active"} />
              </div>
            </div>

            <Separator className="my-6" />

            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{profile?.address || "Address not set"}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{profile?.phone || "Phone not set"}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{profile?.email || "Email not set"}</span>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span>{profile?.website || "Website not set"}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Dealership Details</CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Dealership Name</Label>
                    <Input defaultValue={profile?.name || ""} />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input defaultValue={profile?.phone || ""} />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" defaultValue={profile?.email || ""} />
                  </div>
                  <div className="space-y-2">
                    <Label>Website</Label>
                    <Input defaultValue={profile?.website || ""} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Input defaultValue={profile?.address || ""} />
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>City</Label>
                    <Input defaultValue={profile?.city || ""} />
                  </div>
                  <div className="space-y-2">
                    <Label>State</Label>
                    <Input defaultValue={profile?.state || ""} />
                  </div>
                  <div className="space-y-2">
                    <Label>ZIP Code</Label>
                    <Input defaultValue={profile?.zipCode || ""} />
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsEditing(false)} className="bg-transparent">
                    Cancel
                  </Button>
                  <Button onClick={() => setShowModal(true)}>
                    Save Changes
                  </Button>
                </div>
              </div>
            ) : (
              <KeyValueGrid
                items={[
                  { label: "Dealership Name", value: profile?.name || "—" },
                  { label: "Phone", value: profile?.phone || "—" },
                  { label: "Email", value: profile?.email || "—" },
                  { label: "Website", value: profile?.website || "—" },
                  { label: "Address", value: profile?.address || "—" },
                  { label: "City", value: profile?.city || "—" },
                  { label: "State", value: profile?.state || "—" },
                  { label: "ZIP Code", value: profile?.zipCode || "—" },
                ]}
              />
            )}
          </CardContent>
        </Card>
      </div>

      <NotImplementedModal
        open={showModal}
        onOpenChange={setShowModal}
        featureName="Profile update"
      />
    </div>
  )
}
