"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { Save } from "lucide-react"

const settingsSchema = z.object({
  siteName: z.string().min(1, "Site name is required"),
  titleTemplate: z.string().min(1, "Title template is required"),
  defaultDescription: z.string().min(1, "Default description is required").max(160),
  defaultOgImage: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  canonicalBase: z.string().url("Must be a valid URL"),
  robotsDefault: z.enum(["index,follow", "noindex,nofollow", "index,nofollow", "noindex,follow"]),
})

type SettingsFormData = z.infer<typeof settingsSchema>

export function SettingsTab() {
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      robotsDefault: "index,follow",
    },
  })

  const robotsValue = watch("robotsDefault")

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/admin/seo/settings")
        if (!response.ok) throw new Error("Failed to fetch settings")
        const data = await response.json()
        
        if (data.settings) {
          Object.entries(data.settings).forEach(([key, value]) => {
            setValue(key as keyof SettingsFormData, value as string)
          })
        }
      } catch (error) {
        toast.error("Failed to load settings")
        console.error(error)
      } finally {
        setIsFetching(false)
      }
    }

    fetchSettings()
  }, [setValue])

  const onSubmit = async (data: SettingsFormData) => {
    setIsLoading(true)
    try {
      // Update each setting individually
      const settingsToUpdate = Object.entries(data)
      
      for (const [key, value] of settingsToUpdate) {
        const response = await fetch("/api/admin/seo/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key, value }),
        })

        if (!response.ok) {
          throw new Error(`Failed to update ${key}`)
        }
      }

      toast.success("Settings updated successfully")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update settings")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isFetching) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner className="w-8 h-8" />
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Global SEO Settings</CardTitle>
        <CardDescription>
          Configure default SEO settings that apply across the entire site
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="siteName">Site Name</Label>
            <Input
              id="siteName"
              {...register("siteName")}
              placeholder="My Awesome Site"
            />
            {errors.siteName && (
              <p className="text-sm text-destructive">{errors.siteName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="titleTemplate">Title Template</Label>
            <Input
              id="titleTemplate"
              {...register("titleTemplate")}
              placeholder="%s | Site Name"
            />
            <p className="text-xs text-muted-foreground">
              Use %s as placeholder for page title
            </p>
            {errors.titleTemplate && (
              <p className="text-sm text-destructive">{errors.titleTemplate.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="defaultDescription">Default Description</Label>
            <Input
              id="defaultDescription"
              {...register("defaultDescription")}
              placeholder="A brief description of your site"
            />
            {errors.defaultDescription && (
              <p className="text-sm text-destructive">{errors.defaultDescription.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="defaultOgImage">Default OG Image URL</Label>
            <Input
              id="defaultOgImage"
              {...register("defaultOgImage")}
              placeholder="https://example.com/og-image.jpg"
            />
            {errors.defaultOgImage && (
              <p className="text-sm text-destructive">{errors.defaultOgImage.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="canonicalBase">Canonical Base URL</Label>
            <Input
              id="canonicalBase"
              {...register("canonicalBase")}
              placeholder="https://example.com"
            />
            {errors.canonicalBase && (
              <p className="text-sm text-destructive">{errors.canonicalBase.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="robotsDefault">Default Robots Rule</Label>
            <Select
              value={robotsValue}
              onValueChange={(value) => setValue("robotsDefault", value as any)}
            >
              <SelectTrigger id="robotsDefault" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="index,follow">index,follow</SelectItem>
                <SelectItem value="noindex,nofollow">noindex,nofollow</SelectItem>
                <SelectItem value="index,nofollow">index,nofollow</SelectItem>
                <SelectItem value="noindex,follow">noindex,follow</SelectItem>
              </SelectContent>
            </Select>
            {errors.robotsDefault && (
              <p className="text-sm text-destructive">{errors.robotsDefault.message}</p>
            )}
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Spinner className="mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2" />
                Save Settings
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
