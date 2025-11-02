import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, options)
              })
            } catch (error) {
              console.error("[v0] Cookie setting error:", error)
            }
          },
        },
      },
    )

    // Try to get authenticated user
    const { data: authData } = await supabase.auth.getUser()
    const user = authData?.user

    // If no authenticated user, return default demo profile
    if (!user) {
      console.log("[v0] No authenticated user, returning demo profile")
      return NextResponse.json({
        success: true,
        profile: {
          id: "demo-user",
          display_name: "Demo User",
          skin_type: "combination",
          skin_concerns: ["acne", "sensitivity"],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        isDemo: true,
      })
    }

    // Try to fetch existing profile
    let { data: profile, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

    // If profile doesn't exist, create one with default values
    if (error && error.code === "PGRST116") {
      console.log("[v0] Profile not found, creating new profile for user:", user.id)
      const { data: newProfile, error: createError } = await supabase
        .from("profiles")
        .insert({
          id: user.id,
          email: user.email,
          display_name: user.user_metadata?.name || "User",
          skin_type: "normal",
          skin_concerns: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (createError) {
        console.error("[v0] Error creating profile:", createError)
        return NextResponse.json({ error: "Failed to create profile" }, { status: 500 })
      }
      profile = newProfile
    } else if (error) {
      console.error("[v0] Error fetching profile:", error)
      return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      profile,
      isDemo: false,
    })
  } catch (error) {
    console.error("[v0] Error in profile endpoint:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, options)
              })
            } catch (error) {
              console.error("[v0] Cookie setting error:", error)
            }
          },
        },
      },
    )

    const { data } = await supabase.auth.getUser()
    const user = data?.user

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { display_name, skin_type, skin_concerns } = body

    const { data: profile, error } = await supabase
      .from("profiles")
      .update({
        display_name,
        skin_type,
        skin_concerns,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)
      .select()
      .single()

    if (error) {
      console.error("[v0] Error updating profile:", error)
      return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      profile,
    })
  } catch (error) {
    console.error("[v0] Error in profile update endpoint:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
