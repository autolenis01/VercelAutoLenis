import { type NextRequest, NextResponse } from "next/server"
import { getSessionUser } from "@/lib/auth-server"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const user = await getSessionUser()
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get("search") || undefined
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const skip = (page - 1) * limit

    const supabase = await createClient()

    let query = supabase
      .from("User")
      .select("id, email, first_name, last_name, phone, role, email_verified, createdAt", { count: "exact" })

    if (search) {
      query = query.or(`email.ilike.%${search}%,first_name.ilike.%${search}%,last_name.ilike.%${search}%`)
    }

    const { data: users, error, count } = await query
      .order("createdAt", { ascending: false })
      .range(skip, skip + limit - 1)

    if (error) {
      console.error("[Admin Users Error]", error)
      return NextResponse.json({ error: "Failed to load users" }, { status: 500 })
    }

    return NextResponse.json({
      users: (users || []).map((u: any) => ({
        id: u.id,
        name: `${u.first_name || ""} ${u.last_name || ""}`.trim() || u.email?.split("@")[0] || "Unknown",
        email: u.email,
        role: u.role || "BUYER",
        verified: u.email_verified || false,
        createdAt: u.createdAt ? new Date(u.createdAt).toISOString().split("T")[0] : "",
      })),
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error) {
    console.error("[Admin Users Error]", error)
    return NextResponse.json({ error: "Failed to load users" }, { status: 500 })
  }
}
