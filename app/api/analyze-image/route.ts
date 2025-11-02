import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

const GEMINI_API_KEY = process.env.GEMINI_API_KEY

export async function POST(request: NextRequest) {
  try {
    // Get the form data with image
    const formData = await request.formData()
    const imageFile = formData.get("image") as File
    const userId = formData.get("userId") as string

    if (!imageFile) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    if (!GEMINI_API_KEY) {
      return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 })
    }

    // Convert image to base64
    const buffer = await imageFile.arrayBuffer()
    const base64Image = Buffer.from(buffer).toString("base64")
    const mediaType = imageFile.type || "image/jpeg"

    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      cookies: {
        getAll() {
          return []
        },
        setAll() {},
      },
    })

    let userProfile = {
      skin_type: "combination",
      skin_concerns: ["acne", "sensitivity"],
    }

    // Only query database if userId is a valid UUID (authenticated user)
    const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)

    if (isValidUUID) {
      const { data: dbProfile, error: profileError } = await supabase
        .from("profiles")
        .select("skin_type, skin_concerns")
        .eq("id", userId)
        .single()

      if (dbProfile) {
        userProfile = dbProfile
      } else if (profileError) {
        console.log("[v0] Profile not found for user, using default profile:", profileError)
      }
    } else {
      console.log("[v0] Demo user detected, using default profile")
    }

    const geminiResponse = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are a skincare expert analyzing a product image. 
                
User's Skin Profile:
- Skin Type: ${userProfile.skin_type || "Unknown"}
- Skin Concerns: ${Array.isArray(userProfile.skin_concerns) ? userProfile.skin_concerns.join(", ") : "None"}

Please analyze this skincare product image and provide:
1. Product name and brand (if visible)
2. List of key ingredients you can identify from the label
3. Safety rating for this user (SAFE, CAUTION, or HARMFUL) based on their skin profile
4. Specific recommendation explaining WHY this product is suitable or not suitable for their skin
5. Any potential allergens or irritants to watch for
6. Suggested usage instructions

Format your response as JSON with these exact keys:
{
  "productName": "string",
  "brand": "string",
  "ingredients": ["string"],
  "safetyRating": "SAFE" | "CAUTION" | "HARMFUL",
  "recommendation": "string (detailed explanation)",
  "allergens": ["string"],
  "usageInstructions": "string"
}`,
                },
                {
                  inlineData: {
                    mimeType: mediaType,
                    data: base64Image,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          },
        }),
      },
    )

    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.json()
      console.error("[v0] Gemini API error:", errorData)
      return NextResponse.json({ error: "Failed to analyze image" }, { status: 500 })
    }

    const geminiData = await geminiResponse.json()

    // Extract the text response from Gemini
    const responseText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || ""

    // Parse JSON response from Gemini
    let analysisResult
    try {
      // Extract JSON from the response (it might have markdown formatting)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      analysisResult = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(responseText)
    } catch (parseError) {
      console.error("[v0] Error parsing Gemini response:", parseError)
      // If parsing fails, return the raw analysis
      analysisResult = {
        productName: "Unknown Product",
        brand: "Unknown",
        ingredients: [],
        safetyRating: "CAUTION",
        recommendation: responseText,
        allergens: [],
        usageInstructions: "Please consult product label for full instructions",
      }
    }

    const { error: saveError } = await supabase.from("chat_messages").insert({
      user_id: userId,
      message: `Image Analysis: ${analysisResult.productName}`,
      response: JSON.stringify(analysisResult),
      skin_type: userProfile.skin_type,
      product_ids: [],
    })

    if (saveError) {
      console.error("[v0] Error saving analysis:", saveError)
    }

    return NextResponse.json({
      success: true,
      analysis: analysisResult,
    })
  } catch (error) {
    console.error("[v0] Error processing image:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
