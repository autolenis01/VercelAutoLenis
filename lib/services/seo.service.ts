import { createAdminClient } from "@/lib/supabase/admin"

export interface SEOPageData {
  id: string
  pageKey: string
  title: string | null
  description: string | null
  keywords: string | null
  canonicalUrl: string | null
  ogTitle: string | null
  ogDescription: string | null
  ogImageUrl: string | null
  robotsRule: string
  indexable: boolean
  updatedAt: Date
}

export interface SEOSchema {
  id: string
  pageKey: string
  schemaType: string
  schemaJson: Record<string, any>
}

export interface SEOHealth {
  pageKey: string
  score: number
  issues: Array<{ type: string; message: string; severity: string }>
  lastScanAt: Date
}

export interface SEOKeywords {
  pageKey: string
  primaryKeyword: string | null
  secondaryKeywords: string[]
  targetDensity: number
  actualDensity: number
}

export class SEOService {
  private getSupabase() {
    return createAdminClient()
  }

  // Get SEO metadata for a page
  async getPageSEO(pageKey: string): Promise<SEOPageData | null> {
    const supabase = this.getSupabase()
    const { data, error } = await supabase
      .from("SeoPages")
      .select(
        "id, pageKey, title, description, keywords, canonicalUrl, ogTitle, ogDescription, ogImageUrl, robotsRule, indexable, updatedAt",
      )
      .eq("pageKey", pageKey)
      .maybeSingle()

    if (error) {
      console.error("[SEO] Error fetching page SEO:", error)
      return null
    }
    return data
  }

  // Update SEO metadata for a page
  async updatePageSEO(pageKey: string, data: Partial<SEOPageData>): Promise<SEOPageData | null> {
    const supabase = this.getSupabase()

    // Try to update first
    const { data: existing } = await supabase.from("SeoPages").select("id").eq("pageKey", pageKey).maybeSingle()

    if (existing) {
      const { data: updated, error } = await supabase
        .from("SeoPages")
        .update({ ...data, updatedAt: new Date().toISOString() })
        .eq("pageKey", pageKey)
        .select()
        .single()

      if (error) {
        console.error("[SEO] Error updating page SEO:", error)
        return null
      }
      return updated
    } else {
      const { data: created, error } = await supabase
        .from("SeoPages")
        .insert({ pageKey, ...data })
        .select()
        .single()

      if (error) {
        console.error("[SEO] Error creating page SEO:", error)
        return null
      }
      return created
    }
  }

  // Get all SEO pages
  async getAllPages(): Promise<SEOPageData[]> {
    const supabase = this.getSupabase()
    const { data, error } = await supabase
      .from("SeoPages")
      .select(
        "id, pageKey, title, description, keywords, canonicalUrl, ogTitle, ogDescription, ogImageUrl, robotsRule, indexable, updatedAt",
      )
      .order("pageKey", { ascending: true })

    if (error) {
      console.error("[SEO] Error fetching all pages:", error)
      return []
    }
    return data || []
  }

  // Get schema for a page
  async getPageSchema(pageKey: string): Promise<SEOSchema[]> {
    const supabase = this.getSupabase()
    const { data, error } = await supabase
      .from("SeoSchema")
      .select("id, pageKey, schemaType, schemaJson")
      .eq("pageKey", pageKey)

    if (error) {
      console.error("[SEO] Error fetching page schema:", error)
      return []
    }
    return data || []
  }

  // Update schema for a page
  async updatePageSchema(
    pageKey: string,
    schemaType: string,
    schemaJson: Record<string, any>,
  ): Promise<SEOSchema | null> {
    const supabase = this.getSupabase()

    const { data: existing } = await supabase
      .from("SeoSchema")
      .select("id")
      .eq("pageKey", pageKey)
      .eq("schemaType", schemaType)
      .maybeSingle()

    if (existing) {
      const { data: updated, error } = await supabase
        .from("SeoSchema")
        .update({ schemaJson, updatedAt: new Date().toISOString() })
        .eq("pageKey", pageKey)
        .eq("schemaType", schemaType)
        .select()
        .single()

      if (error) {
        console.error("[SEO] Error updating page schema:", error)
        return null
      }
      return updated
    } else {
      const { data: created, error } = await supabase
        .from("SeoSchema")
        .insert({ pageKey, schemaType, schemaJson })
        .select()
        .single()

      if (error) {
        console.error("[SEO] Error creating page schema:", error)
        return null
      }
      return created
    }
  }

  // Delete schema
  async deletePageSchema(id: string): Promise<void> {
    const supabase = this.getSupabase()
    const { error } = await supabase.from("SeoSchema").delete().eq("id", id)

    if (error) {
      console.error("[SEO] Error deleting page schema:", error)
    }
  }

  // Get SEO health score
  async getPageHealth(pageKey: string): Promise<SEOHealth | null> {
    const supabase = this.getSupabase()
    const { data, error } = await supabase
      .from("SeoHealth")
      .select("pageKey, score, issuesJson, lastScanAt")
      .eq("pageKey", pageKey)
      .maybeSingle()

    if (error) {
      console.error("[SEO] Error fetching page health:", error)
      return null
    }

    return data
      ? {
          pageKey: data.pageKey,
          score: data.score,
          issues: data.issuesJson as any,
          lastScanAt: new Date(data.lastScanAt),
        }
      : null
  }

  // Calculate and update SEO health score
  async calculateHealthScore(pageKey: string, pageContent?: string): Promise<SEOHealth | null> {
    const seoData = await this.getPageSEO(pageKey)
    const keywords = await this.getPageKeywords(pageKey)

    const issues: Array<{ type: string; message: string; severity: string }> = []
    let score = 100

    // Check title
    if (!seoData?.title) {
      issues.push({ type: "title", message: "Missing title tag", severity: "critical" })
      score -= 15
    } else if (seoData.title.length < 30 || seoData.title.length > 60) {
      issues.push({ type: "title", message: "Title length should be 30-60 characters", severity: "warning" })
      score -= 5
    }

    // Check description
    if (!seoData?.description) {
      issues.push({ type: "description", message: "Missing meta description", severity: "critical" })
      score -= 15
    } else if (seoData.description.length < 120 || seoData.description.length > 160) {
      issues.push({
        type: "description",
        message: "Description length should be 120-160 characters",
        severity: "warning",
      })
      score -= 5
    }

    // Check keywords
    if (!keywords?.primaryKeyword) {
      issues.push({ type: "keywords", message: "No primary keyword defined", severity: "warning" })
      score -= 10
    }

    // Check OG tags
    if (!seoData?.ogTitle) {
      issues.push({ type: "og", message: "Missing Open Graph title", severity: "warning" })
      score -= 5
    }
    if (!seoData?.ogDescription) {
      issues.push({ type: "og", message: "Missing Open Graph description", severity: "warning" })
      score -= 5
    }
    if (!seoData?.ogImageUrl) {
      issues.push({ type: "og", message: "Missing Open Graph image", severity: "warning" })
      score -= 5
    }

    // Check canonical URL
    if (!seoData?.canonicalUrl) {
      issues.push({ type: "canonical", message: "Missing canonical URL", severity: "warning" })
      score -= 5
    }

    // Update health record
    const supabase = this.getSupabase()
    const healthData = {
      score: Math.max(0, score),
      issuesJson: issues,
      lastScanAt: new Date().toISOString(),
    }

    const { data: existing } = await supabase.from("SeoHealth").select("id").eq("pageKey", pageKey).maybeSingle()

    let result
    if (existing) {
      const { data, error } = await supabase
        .from("SeoHealth")
        .update(healthData)
        .eq("pageKey", pageKey)
        .select()
        .single()

      if (error) {
        console.error("[SEO] Error updating health score:", error)
        return null
      }
      result = data
    } else {
      const { data, error } = await supabase
        .from("SeoHealth")
        .insert({ pageKey, ...healthData })
        .select()
        .single()

      if (error) {
        console.error("[SEO] Error creating health score:", error)
        return null
      }
      result = data
    }

    return {
      pageKey: result.pageKey,
      score: result.score,
      issues: result.issuesJson as any,
      lastScanAt: new Date(result.lastScanAt),
    }
  }

  // Get keywords for a page
  async getPageKeywords(pageKey: string): Promise<SEOKeywords | null> {
    const supabase = this.getSupabase()
    const { data, error } = await supabase
      .from("SeoKeywords")
      .select("pageKey, primaryKeyword, secondaryKeywords, targetDensity, actualDensity")
      .eq("pageKey", pageKey)
      .maybeSingle()

    if (error) {
      console.error("[SEO] Error fetching page keywords:", error)
      return null
    }

    return data
      ? {
          pageKey: data.pageKey,
          primaryKeyword: data.primaryKeyword,
          secondaryKeywords: (data.secondaryKeywords as string[]) || [],
          targetDensity: Number(data.targetDensity),
          actualDensity: Number(data.actualDensity),
        }
      : null
  }

  // Update keywords for a page
  async updatePageKeywords(pageKey: string, data: Partial<SEOKeywords>): Promise<SEOKeywords | null> {
    const supabase = this.getSupabase()

    const { data: existing } = await supabase.from("SeoKeywords").select("id").eq("pageKey", pageKey).maybeSingle()

    let result
    if (existing) {
      const { data: updated, error } = await supabase
        .from("SeoKeywords")
        .update({ ...data, updatedAt: new Date().toISOString() })
        .eq("pageKey", pageKey)
        .select()
        .single()

      if (error) {
        console.error("[SEO] Error updating page keywords:", error)
        return null
      }
      result = updated
    } else {
      const { data: created, error } = await supabase
        .from("SeoKeywords")
        .insert({ pageKey, ...data })
        .select()
        .single()

      if (error) {
        console.error("[SEO] Error creating page keywords:", error)
        return null
      }
      result = created
    }

    return {
      pageKey: result.pageKey,
      primaryKeyword: result.primaryKeyword,
      secondaryKeywords: (result.secondaryKeywords as string[]) || [],
      targetDensity: Number(result.targetDensity),
      actualDensity: Number(result.actualDensity),
    }
  }

  // Get SEO dashboard summary
  async getDashboardSummary() {
    const pages = await this.getAllPages()

    const supabase = this.getSupabase()
    const { data: healthRecords, error } = await supabase
      .from("SeoHealth")
      .select("pageKey, score, issuesJson, lastScanAt")

    if (error) {
      console.error("[SEO] Error fetching health records:", error)
    }

    const records = healthRecords || []
    const totalPages = pages.length
    const indexablePages = pages.filter((p) => p.indexable).length
    const avgScore = records.length > 0 ? records.reduce((sum, h) => sum + h.score, 0) / records.length : 0

    const criticalIssues = records.reduce((count, h) => {
      const issues = (h.issuesJson as any[]) || []
      return count + issues.filter((i) => i.severity === "critical").length
    }, 0)

    return {
      totalPages,
      indexablePages,
      avgScore: Math.round(avgScore),
      criticalIssues,
      pages: records.map((h) => ({
        pageKey: h.pageKey,
        score: h.score,
        lastScanAt: h.lastScanAt,
      })),
    }
  }

  // Generate sitemap data
  async generateSitemap() {
    const supabase = this.getSupabase()
    const { data: pages, error } = await supabase
      .from("SeoPages")
      .select("pageKey, canonicalUrl, updatedAt")
      .eq("indexable", true)

    if (error) {
      console.error("[SEO] Error generating sitemap:", error)
      // Return default pages if database query fails
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://autolenis.com"
      return [
        { loc: baseUrl, lastmod: new Date().toISOString().split("T")[0], changefreq: "weekly", priority: "1.0" },
        {
          loc: `${baseUrl}/about`,
          lastmod: new Date().toISOString().split("T")[0],
          changefreq: "monthly",
          priority: "0.8",
        },
        {
          loc: `${baseUrl}/contact`,
          lastmod: new Date().toISOString().split("T")[0],
          changefreq: "monthly",
          priority: "0.7",
        },
      ]
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://autolenis.com"

    if (!pages || pages.length === 0) {
      // Return default sitemap entries if no SEO pages configured
      return [
        { loc: baseUrl, lastmod: new Date().toISOString().split("T")[0], changefreq: "weekly", priority: "1.0" },
        {
          loc: `${baseUrl}/about`,
          lastmod: new Date().toISOString().split("T")[0],
          changefreq: "monthly",
          priority: "0.8",
        },
        {
          loc: `${baseUrl}/contact`,
          lastmod: new Date().toISOString().split("T")[0],
          changefreq: "monthly",
          priority: "0.7",
        },
      ]
    }

    const urls = pages.map((page) => ({
      loc: page.canonicalUrl || `${baseUrl}/${page.pageKey === "home" ? "" : page.pageKey}`,
      lastmod: new Date(page.updatedAt).toISOString().split("T")[0],
      changefreq: "weekly",
      priority: page.pageKey === "home" ? "1.0" : "0.8",
    }))

    return urls
  }

  // Generate robots.txt rules with graceful degradation
  async generateRobotsTxt() {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://autolenis.com"
    const isPreview = process.env.VERCEL_ENV === "preview"

    const rules = [
      "User-agent: *",
      isPreview ? "Disallow: /" : "Allow: /",
      "",
      "# Disallow admin and authenticated areas",
      "Disallow: /admin/",
      "Disallow: /buyer/",
      "Disallow: /dealer/",
      "Disallow: /affiliate/portal/",
      "Disallow: /api/",
      "",
      `Sitemap: ${baseUrl}/sitemap.xml`,
    ]

    return rules.join("\n")
  }

  // Get global SEO settings
  async getGlobalSettings() {
    try {
      const supabase = this.getSupabase()
      const { data, error } = await supabase
        .from("SeoSettings")
        .select("key, value")

      if (error) {
        console.error("[SEO] Error fetching global settings:", error)
        return this.getDefaultSettings()
      }

      const settings: Record<string, unknown> = {}
      for (const row of data || []) {
        settings[row.key] = row.value
      }
      return { ...this.getDefaultSettings(), ...settings }
    } catch {
      return this.getDefaultSettings()
    }
  }

  getDefaultSettings() {
    return {
      siteName: "AutoLenis",
      titleTemplate: "%s | AutoLenis",
      defaultDescription: "Get pre-qualified, compare dealer offers, and buy your next car with complete transparency.",
      defaultOgImage: "/og-image.png",
      canonicalBase: process.env.NEXT_PUBLIC_APP_URL || "https://autolenis.com",
      robotsDefault: "index,follow",
      googleVerification: "",
      bingVerification: "",
      twitterHandle: "",
      facebookHandle: "",
      organizationName: "AutoLenis",
      organizationLogo: "/logo.png",
      indexingEnabled: process.env.VERCEL_ENV === "production",
    }
  }

  // Update global SEO settings
  async updateGlobalSettings(key: string, value: unknown, adminEmail?: string) {
    const supabase = this.getSupabase()
    
    const { data: existing } = await supabase
      .from("SeoSettings")
      .select("id, value")
      .eq("key", key)
      .maybeSingle()

    const previousValue = existing?.value

    if (existing) {
      const { error } = await supabase
        .from("SeoSettings")
        .update({ value, updatedAt: new Date().toISOString() })
        .eq("key", key)

      if (error) {
        console.error("[SEO] Error updating setting:", error)
        return null
      }
    } else {
      const { error } = await supabase
        .from("SeoSettings")
        .insert({ key, value })

      if (error) {
        console.error("[SEO] Error creating setting:", error)
        return null
      }
    }

    // Log the change
    await this.logChange("settings", key, existing ? "update" : "create", adminEmail, previousValue, value)

    return { key, value }
  }

  // Get all redirects
  async getRedirects() {
    try {
      const supabase = this.getSupabase()
      const { data, error } = await supabase
        .from("SeoRedirect")
        .select("*")
        .eq("enabled", true)
        .order("createdAt", { ascending: false })

      if (error) {
        console.error("[SEO] Error fetching redirects:", error)
        return []
      }
      return data || []
    } catch {
      return []
    }
  }

  // Create or update redirect
  async upsertRedirect(redirect: {
    id?: string
    fromPath: string
    toPath: string
    statusCode?: number
    isWildcard?: boolean
    enabled?: boolean
  }, adminEmail?: string) {
    const supabase = this.getSupabase()

    // Validate no redirect loops
    if (redirect.fromPath === redirect.toPath) {
      throw new Error("Redirect loop detected: fromPath and toPath cannot be the same")
    }

    const data = {
      fromPath: redirect.fromPath,
      toPath: redirect.toPath,
      statusCode: redirect.statusCode || 301,
      isWildcard: redirect.isWildcard || false,
      enabled: redirect.enabled ?? true,
      updatedAt: new Date().toISOString(),
    }

    if (redirect.id) {
      const { data: existing } = await supabase
        .from("SeoRedirect")
        .select("*")
        .eq("id", redirect.id)
        .single()

      const { data: updated, error } = await supabase
        .from("SeoRedirect")
        .update(data)
        .eq("id", redirect.id)
        .select()
        .single()

      if (error) throw error

      await this.logChange("redirect", redirect.id, "update", adminEmail, existing, updated)
      return updated
    } else {
      const { data: created, error } = await supabase
        .from("SeoRedirect")
        .insert(data)
        .select()
        .single()

      if (error) throw error

      await this.logChange("redirect", created.id, "create", adminEmail, null, created)
      return created
    }
  }

  // Delete redirect
  async deleteRedirect(id: string, adminEmail?: string) {
    const supabase = this.getSupabase()

    const { data: existing } = await supabase
      .from("SeoRedirect")
      .select("*")
      .eq("id", id)
      .single()

    const { error } = await supabase
      .from("SeoRedirect")
      .delete()
      .eq("id", id)

    if (error) throw error

    await this.logChange("redirect", id, "delete", adminEmail, existing, null)
    return true
  }

  // Log SEO changes
  async logChange(
    entityType: string,
    entityId: string,
    action: string,
    adminEmail?: string,
    previousData?: unknown,
    newData?: unknown
  ) {
    try {
      const supabase = this.getSupabase()
      await supabase.from("SeoChangeLog").insert({
        entityType,
        entityId,
        action,
        adminEmail,
        previousData,
        newData,
      })
    } catch (error) {
      console.error("[SEO] Error logging change:", error)
    }
  }

  // Get change logs
  async getChangeLogs(limit = 50) {
    try {
      const supabase = this.getSupabase()
      const { data, error } = await supabase
        .from("SeoChangeLog")
        .select("*")
        .order("createdAt", { ascending: false })
        .limit(limit)

      if (error) throw error
      return data || []
    } catch {
      return []
    }
  }

  // Run SEO audit
  async runAudit() {
    const supabase = this.getSupabase()

    // Create audit run record
    const { data: auditRun, error: createError } = await supabase
      .from("SeoAuditRun")
      .insert({ status: "running" })
      .select()
      .single()

    if (createError) throw createError

    try {
      const pages = await this.getAllPages()
      const issues: Array<{ pageKey: string; type: string; message: string; severity: string }> = []
      let criticalCount = 0
      let warningCount = 0

      // Audit each page
      for (const page of pages) {
        // Check for missing title
        if (!page.title) {
          issues.push({ pageKey: page.pageKey, type: "title", message: "Missing page title", severity: "critical" })
          criticalCount++
        } else if (page.title.length < 30 || page.title.length > 60) {
          issues.push({ pageKey: page.pageKey, type: "title", message: "Title length should be 30-60 characters", severity: "warning" })
          warningCount++
        }

        // Check for missing description
        if (!page.description) {
          issues.push({ pageKey: page.pageKey, type: "description", message: "Missing meta description", severity: "critical" })
          criticalCount++
        } else if (page.description.length < 120 || page.description.length > 160) {
          issues.push({ pageKey: page.pageKey, type: "description", message: "Description length should be 120-160 characters", severity: "warning" })
          warningCount++
        }

        // Check for missing canonical
        if (!page.canonicalUrl) {
          issues.push({ pageKey: page.pageKey, type: "canonical", message: "Missing canonical URL", severity: "warning" })
          warningCount++
        }

        // Check OG tags
        if (!page.ogTitle) {
          issues.push({ pageKey: page.pageKey, type: "og", message: "Missing Open Graph title", severity: "warning" })
          warningCount++
        }
        if (!page.ogImageUrl) {
          issues.push({ pageKey: page.pageKey, type: "og", message: "Missing Open Graph image", severity: "warning" })
          warningCount++
        }
      }

      // Update audit run with results
      await supabase
        .from("SeoAuditRun")
        .update({
          status: "completed",
          totalPages: pages.length,
          issuesFound: issues.length,
          criticalCount,
          warningCount,
          resultsJson: issues,
          summary: `Audited ${pages.length} pages. Found ${criticalCount} critical and ${warningCount} warning issues.`,
          completedAt: new Date().toISOString(),
        })
        .eq("id", auditRun.id)

      return {
        id: auditRun.id,
        totalPages: pages.length,
        issuesFound: issues.length,
        criticalCount,
        warningCount,
        issues,
      }
    } catch (error) {
      await supabase
        .from("SeoAuditRun")
        .update({ status: "failed", completedAt: new Date().toISOString() })
        .eq("id", auditRun.id)
      throw error
    }
  }

  // Get latest audit results
  async getLatestAudit() {
    try {
      const supabase = this.getSupabase()
      const { data, error } = await supabase
        .from("SeoAuditRun")
        .select("*")
        .eq("status", "completed")
        .order("completedAt", { ascending: false })
        .limit(1)
        .maybeSingle()

      if (error) throw error
      return data
    } catch {
      return null
    }
  }
}

export const seoService = new SEOService()

export { SEOService as default }
export const SEOServiceInstance = seoService
