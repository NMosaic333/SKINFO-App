import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q") || ""
    const skinType = searchParams.get("skinType")

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return []
          },
          setAll() {},
        },
      },
    )

    let productQuery = supabase.from("products").select("*")

    if (query) {
      productQuery = productQuery.or(`name.ilike.%${query}%,brand.ilike.%${query}%,ingredients.cs.{${query}}`)
    }

    if (skinType) {
      productQuery = productQuery.contains("skinTypes", [skinType])
    }

    const { data: products, error } = await productQuery.limit(20)

    if (error) {
      console.error("[v0] Error searching products:", error)
      return NextResponse.json({ error: "Failed to search products" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      products: products || [],
      count: products?.length || 0,
    })
  } catch (error) {
    console.error("[v0] Error in search endpoint:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
