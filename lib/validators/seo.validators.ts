import { z } from "zod"

// SEO Page Metadata Schema
export const seoPageSchema = z.object({
  pageKey: z.string().min(1, "Page key is required"),
  title: z.string().min(1).max(60, "Title should be 1-60 characters").nullable().optional(),
  description: z.string().min(1).max(160, "Description should be 1-160 characters").nullable().optional(),
  keywords: z.string().nullable().optional(),
  canonicalUrl: z.string().url("Must be a valid URL").nullable().optional(),
  ogTitle: z.string().max(60, "OG title should be max 60 characters").nullable().optional(),
  ogDescription: z.string().max(160, "OG description should be max 160 characters").nullable().optional(),
  ogImageUrl: z.string().url("Must be a valid URL").nullable().optional(),
  robotsRule: z.enum(["index,follow", "noindex,nofollow", "index,nofollow", "noindex,follow"]).default("index,follow"),
  indexable: z.boolean().default(true),
})

export type SEOPageInput = z.infer<typeof seoPageSchema>

// SEO Schema (JSON-LD) Schema
export const seoSchemaSchema = z.object({
  pageKey: z.string().min(1, "Page key is required"),
  schemaType: z.string().min(1, "Schema type is required"),
  schemaJson: z.record(z.unknown()),
})

export type SEOSchemaInput = z.infer<typeof seoSchemaSchema>

// SEO Keywords Schema
export const seoKeywordsSchema = z.object({
  pageKey: z.string().min(1, "Page key is required"),
  primaryKeyword: z.string().nullable().optional(),
  secondaryKeywords: z.array(z.string()).default([]),
  targetDensity: z.number().min(0).max(100).default(2),
  actualDensity: z.number().min(0).max(100).default(0),
})

export type SEOKeywordsInput = z.infer<typeof seoKeywordsSchema>

// SEO Settings Schema
export const seoSettingsSchema = z.object({
  key: z.string().min(1, "Setting key is required"),
  value: z.unknown(),
})

export type SEOSettingsInput = z.infer<typeof seoSettingsSchema>

// SEO Redirect Schema
export const seoRedirectSchema = z.object({
  id: z.string().optional(),
  fromPath: z.string().min(1, "Source path is required").refine(
    (path) => path.startsWith("/"),
    "Path must start with /"
  ),
  toPath: z.string().min(1, "Destination path is required").refine(
    (path) => path.startsWith("/") || path.startsWith("http"),
    "Path must start with / or be a full URL"
  ),
  statusCode: z.enum(["301", "302", "307", "308"]).default("301").transform(Number),
  isWildcard: z.boolean().default(false),
  enabled: z.boolean().default(true),
})

export type SEORedirectInput = z.infer<typeof seoRedirectSchema>

// Validate redirect doesn't create loops
export function validateNoRedirectLoop(fromPath: string, toPath: string): boolean {
  // Simple check: paths shouldn't be the same
  if (fromPath === toPath) {
    return false
  }
  
  // For wildcards, check if toPath could match fromPath pattern
  if (fromPath.includes("*") && toPath.includes("*")) {
    return false
  }
  
  return true
}

// SEO Audit Schema (for triggering audits)
export const seoAuditSchema = z.object({
  pageKeys: z.array(z.string()).optional(),
})

export type SEOAuditInput = z.infer<typeof seoAuditSchema>
