import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: Request) {
  try {
    // ✅ 1. Get token from Authorization header
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        { success: false, message: "No token provided" },
        { status: 401 }
      );
    }

    // ✅ 2. Validate token and get user info
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    // ✅ 3. Try fetching profile
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (existingProfile) {
      return NextResponse.json({ success: true, profile: existingProfile });
    }

    // ✅ 4. Create default profile if it doesn’t exist
    const { data: newProfile, error: insertError } = await supabase
      .from("profiles")
      .insert([
        {
          id: user.id,
          email: user.email,
          display_name: user.user_metadata?.name || user.email?.split("@")[0],
          skin_type: "normal",
          skin_concerns: ["dryness"],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (insertError) throw insertError;

    return NextResponse.json({ success: true, profile: newProfile });
  } catch (err: any) {
    console.error("Profile creation error:", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
