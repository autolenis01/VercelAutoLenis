"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import useSWR from "swr"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Save, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function DealerInventoryEditPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const id = params.id as string

  const { data, error, isLoading } = useSWR(
    id ? `/api/dealer/inventory/${id}` : null,
    fetcher
  )

  const [formData, setFormData] = useState({
    stockNumber: "",
    price: "",
    cost: "",
    isAvailable: true,
    notes: "",
    // Vehicle fields
    vin: "",
    year: "",
    make: "",
    model: "",
    trim: "",
    bodyStyle: "",
    exteriorColor: "",
    interiorColor: "",
    mileage: "",
    transmission: "",
    drivetrain: "",
    engine: "",
    fuelType: "",
    msrp: "",
    condition: "",
  })

  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (data?.success && data.data) {
      const item = data.data
      const vehicle = item.vehicle || {}
      
      setFormData({
        stockNumber: item.stockNumber || "",
        price: item.price?.toString() || "",
        cost: item.cost?.toString() || "",
        isAvailable: item.isAvailable ?? true,
        notes: item.notes || "",
        vin: vehicle.vin || "",
        year: vehicle.year?.toString() || "",
        make: vehicle.make || "",
        model: vehicle.model || "",
        trim: vehicle.trim || "",
        bodyStyle: vehicle.bodyStyle || "",
        exteriorColor: vehicle.exteriorColor || "",
        interiorColor: vehicle.interiorColor || "",
        mileage: vehicle.mileage?.toString() || "",
        transmission: vehicle.transmission || "",
        drivetrain: vehicle.drivetrain || "",
        engine: vehicle.engine || "",
        fuelType: vehicle.fuelType || "",
        msrp: vehicle.msrp?.toString() || "",
        condition: vehicle.condition || "",
      })
    }
  }, [data])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const payload = {
        stockNumber: formData.stockNumber || undefined,
        price: formData.price ? parseFloat(formData.price) : undefined,
        cost: formData.cost ? parseFloat(formData.cost) : undefined,
        isAvailable: formData.isAvailable,
        notes: formData.notes || undefined,
        vehicle: {
          vin: formData.vin || undefined,
          year: formData.year ? parseInt(formData.year) : undefined,
          make: formData.make || undefined,
          model: formData.model || undefined,
          trim: formData.trim || undefined,
          bodyStyle: formData.bodyStyle || undefined,
          exteriorColor: formData.exteriorColor || undefined,
          interiorColor: formData.interiorColor || undefined,
          mileage: formData.mileage ? parseInt(formData.mileage) : undefined,
          transmission: formData.transmission || undefined,
          drivetrain: formData.drivetrain || undefined,
          engine: formData.engine || undefined,
          fuelType: formData.fuelType || undefined,
          msrp: formData.msrp ? parseFloat(formData.msrp) : undefined,
          condition: formData.condition || undefined,
        },
      }

      const response = await fetch(`/api/dealer/inventory/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Vehicle Updated",
          description: "Your inventory item has been updated successfully.",
        })
        router.push(`/dealer/inventory/${id}`)
      } else {
        throw new Error(result.error || "Failed to update vehicle")
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error.message || "Failed to update vehicle. Please try again.",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    router.push(`/dealer/inventory/${id}`)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-64" />
        </div>
      </div>
    )
  }

  if (error || !data?.success) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.push("/dealer/inventory")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Inventory
          </Button>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Vehicle</AlertTitle>
          <AlertDescription>
            {data?.error || "This vehicle could not be found or you don't have access to it."}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <Button variant="outline" size="sm" onClick={handleCancel}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
          <h1 className="text-3xl font-bold">Edit Vehicle</h1>
          <p className="text-muted-foreground">
            Update vehicle information and pricing
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Inventory Information */}
        <Card>
          <CardHeader>
            <CardTitle>Inventory Information</CardTitle>
            <CardDescription>Stock number, pricing, and availability</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stockNumber">Stock Number</Label>
                <Input
                  id="stockNumber"
                  value={formData.stockNumber}
                  onChange={(e) => setFormData({ ...formData, stockNumber: e.target.value })}
                  placeholder="e.g., A12345"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Asking Price *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="e.g., 25000"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cost">Cost (Optional)</Label>
                <Input
                  id="cost"
                  type="number"
                  step="0.01"
                  value={formData.cost}
                  onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                  placeholder="e.g., 22000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="msrp">MSRP (Optional)</Label>
                <Input
                  id="msrp"
                  type="number"
                  step="0.01"
                  value={formData.msrp}
                  onChange={(e) => setFormData({ ...formData, msrp: e.target.value })}
                  placeholder="e.g., 28000"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isAvailable"
                checked={formData.isAvailable}
                onCheckedChange={(checked) => setFormData({ ...formData, isAvailable: checked })}
              />
              <Label htmlFor="isAvailable">Available for Sale</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Internal notes about this vehicle"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Vehicle Details */}
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Details</CardTitle>
            <CardDescription>Basic vehicle information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vin">VIN</Label>
                <Input
                  id="vin"
                  value={formData.vin}
                  onChange={(e) => setFormData({ ...formData, vin: e.target.value })}
                  placeholder="17-character VIN"
                  maxLength={17}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">Year *</Label>
                <Input
                  id="year"
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  placeholder="e.g., 2024"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="make">Make *</Label>
                <Input
                  id="make"
                  value={formData.make}
                  onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                  placeholder="e.g., Toyota"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="model">Model *</Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  placeholder="e.g., Camry"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="trim">Trim</Label>
                <Input
                  id="trim"
                  value={formData.trim}
                  onChange={(e) => setFormData({ ...formData, trim: e.target.value })}
                  placeholder="e.g., XLE"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bodyStyle">Body Style</Label>
                <Input
                  id="bodyStyle"
                  value={formData.bodyStyle}
                  onChange={(e) => setFormData({ ...formData, bodyStyle: e.target.value })}
                  placeholder="e.g., Sedan"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mileage">Mileage</Label>
                <Input
                  id="mileage"
                  type="number"
                  value={formData.mileage}
                  onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                  placeholder="e.g., 25000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="condition">Condition</Label>
                <Input
                  id="condition"
                  value={formData.condition}
                  onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                  placeholder="e.g., New, Used, Certified"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="exteriorColor">Exterior Color</Label>
                <Input
                  id="exteriorColor"
                  value={formData.exteriorColor}
                  onChange={(e) => setFormData({ ...formData, exteriorColor: e.target.value })}
                  placeholder="e.g., Blue"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="interiorColor">Interior Color</Label>
                <Input
                  id="interiorColor"
                  value={formData.interiorColor}
                  onChange={(e) => setFormData({ ...formData, interiorColor: e.target.value })}
                  placeholder="e.g., Black"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="transmission">Transmission</Label>
                <Input
                  id="transmission"
                  value={formData.transmission}
                  onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
                  placeholder="e.g., Automatic"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="drivetrain">Drivetrain</Label>
                <Input
                  id="drivetrain"
                  value={formData.drivetrain}
                  onChange={(e) => setFormData({ ...formData, drivetrain: e.target.value })}
                  placeholder="e.g., FWD, AWD"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="engine">Engine</Label>
                <Input
                  id="engine"
                  value={formData.engine}
                  onChange={(e) => setFormData({ ...formData, engine: e.target.value })}
                  placeholder="e.g., 2.5L 4-Cylinder"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fuelType">Fuel Type</Label>
                <Input
                  id="fuelType"
                  value={formData.fuelType}
                  onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
                  placeholder="e.g., Gasoline"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4">
          <Button type="submit" size="lg" disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
          <Button type="button" variant="outline" size="lg" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
