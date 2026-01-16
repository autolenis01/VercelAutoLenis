// Common Zod validators for API requests
// Ensures type safety and validation across all routes

import { z } from "zod"

// Pagination
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
})

// Search
export const searchSchema = z.object({
  query: z.string().min(1).max(200),
})

// ID validation
export const uuidSchema = z.string().uuid("Invalid ID format")

// Date range
export const dateRangeSchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
})

// Status filter
export const statusSchema = z.object({
  status: z.enum(["ACTIVE", "INACTIVE", "PENDING", "COMPLETED", "CANCELLED"]).optional(),
})

// Sorting
export const sortSchema = z.object({
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
})

// Common query parameters
export const queryParamsSchema = paginationSchema
  .merge(searchSchema.partial())
  .merge(dateRangeSchema)
  .merge(statusSchema)
  .merge(sortSchema)
