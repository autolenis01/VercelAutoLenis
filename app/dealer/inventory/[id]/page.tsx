"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import {
  ArrowLeft,
  Car,
  Edit,
  Trash2,
  AlertCircle,
  Package,
  DollarSign,
  Calendar,
  Gauge,
  Palette,
  Fuel,
  Cog,
} from "lucide-react"
import Link from "next/link"

interface InventoryItem {
  id: string
  price: number
  stockNumber: string
  status: string
  createdAt: string
  updatedAt: string
  vehicle: {
    vin: string
    make: string
    model: string
    year: number
    trim?: string
    bodyStyle?: string
    mileage?: number
    exteriorColor?: string
    interiorColor?: string
    engine?: string
    transmission?: string
    drivetrain?: string
    fuelType?: string
    isNew?: boolean
    locationCity?: string
    locationState?: string
  }
}

export default function InventoryDetailPage() {
  const params = useParams()
  const inventoryId = params.id as string
  const router = useRouter()
  const { toast } = useToast()

  const [item, setItem] = useState<InventoryItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    loadInventoryItem()
  }, [inventoryId])

  const loadInventoryItem = async () => {
    try {
      // Fetch from the main inventory list and find the specific item
      const res = await fetch("/api/dealer/inventory")
      const data = await res.json()

      if (data.success) {
        const foundItem = data.inventory.find((i: any) => i.id === inventoryId)
        if (foundItem) {
          setItem(foundItem)
        } else {
          throw new Error("Vehicle not found")
        }
      } else {
        throw new Error(data.error || "Failed to load vehicle")
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to load vehicle details",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to remove this vehicle from inventory?")) return

    setDeleting(true)
    try {
      const res = await fetch(`/api/dealer/inventory/${inventoryId}`, {
        method: "DELETE",
      })

      if (res.ok) {
        toast({ title: "Vehicle removed from inventory" })
        router.push("/dealer/inventory")
      } else {
        throw new Error("Failed to delete")
      }
    } catch {
      toast({ variant: "destructive", title: "Failed to remove vehicle" })
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-muted rounded mb-2" />
          <div className="h-4 w-64 bg-muted rounded" />
        </div>
        <Card className="animate-pulse">
          <CardContent className="p-12">
            <div className="h-48 bg-muted rounded" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <h2 className="text-xl font-semibold mb-2">Vehicle not found</h2>
          <p className="text-muted-foreground mb-4">This vehicle may have been removed from inventory</p>
          <Button asChild variant="outline">
            <Link href="/dealer/inventory">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Inventory
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  const vehicle = item.vehicle

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dealer/inventory">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Car className="h-8 w-8 text-[#2D1B69]" />
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h1>
            <p className="text-muted-foreground">{vehicle.trim}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/dealer/inventory/${inventoryId}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
            <Trash2 className="h-4 w-4 mr-2" />
            {deleting ? "Removing..." : "Remove"}
          </Button>
        </div>
      </div>

      {/* Status Badge */}
      <div className="flex gap-2">
        <Badge
          className={
            item.status === "AVAILABLE"
              ? "bg-[#7ED321]/10 text-[#7ED321] hover:bg-[#7ED321]/20"
              : item.status === "PENDING"
                ? "bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20"
                : "bg-muted text-muted-foreground"
          }
        >
          {item.status}
        </Badge>
        {item.stockNumber && (
          <Badge variant="outline">
            <Package className="h-3 w-3 mr-1" />
            Stock #{item.stockNumber}
          </Badge>
        )}
      </div>

      {/* Pricing */}
      <Card className="border-l-4 border-l-[#7ED321]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-[#7ED321]" />
            Pricing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-[#7ED321]">${(item.price || 0).toLocaleString()}</div>
          <p className="text-sm text-muted-foreground mt-1">Listed price</p>
        </CardContent>
      </Card>

      {/* Vehicle Details */}
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Details</CardTitle>
          <CardDescription>Detailed information about this vehicle</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Car className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Make & Model</div>
                  <div className="text-base font-semibold">
                    {vehicle.make} {vehicle.model}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Year</div>
                  <div className="text-base font-semibold">{vehicle.year}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Gauge className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Mileage</div>
                  <div className="text-base font-semibold">
                    {vehicle.mileage != null ? `${vehicle.mileage.toLocaleString()} miles` : "N/A"}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-5 w-5 text-muted-foreground mt-0.5 font-mono font-bold">VIN</div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">VIN</div>
                  <div className="text-base font-mono">{vehicle.vin || "N/A"}</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Palette className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Exterior Color</div>
                  <div className="text-base font-semibold">{vehicle.exteriorColor || "Not specified"}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Palette className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Interior Color</div>
                  <div className="text-base font-semibold">{vehicle.interiorColor || "Not specified"}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Cog className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Transmission</div>
                  <div className="text-base font-semibold">{vehicle.transmission || "Not specified"}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Fuel className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Fuel Type</div>
                  <div className="text-base font-semibold">{vehicle.fuelType || "Not specified"}</div>
                </div>
              </div>
            </div>
          </div>

          {vehicle.trim && (
            <div className="mt-6 pt-6 border-t">
              <div className="text-sm font-medium text-muted-foreground mb-1">Trim Level</div>
              <div className="text-base font-semibold">{vehicle.trim}</div>
            </div>
          )}

          {(vehicle.engine || vehicle.drivetrain) && (
            <div className="mt-4 pt-4 border-t grid md:grid-cols-2 gap-4">
              {vehicle.engine && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Engine</div>
                  <div className="text-base">{vehicle.engine}</div>
                </div>
              )}
              {vehicle.drivetrain && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Drivetrain</div>
                  <div className="text-base">{vehicle.drivetrain}</div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Location */}
      {(vehicle.locationCity || vehicle.locationState) && (
        <Card>
          <CardHeader>
            <CardTitle>Location</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-base">
              {vehicle.locationCity}
              {vehicle.locationCity && vehicle.locationState && ", "}
              {vehicle.locationState}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Metadata */}
      <Card>
        <CardHeader>
          <CardTitle>Listing Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground mb-1">Added to Inventory</div>
              <div className="font-medium">{new Date(item.createdAt).toLocaleDateString()}</div>
            </div>
            <div>
              <div className="text-muted-foreground mb-1">Last Updated</div>
              <div className="font-medium">{new Date(item.updatedAt).toLocaleDateString()}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
