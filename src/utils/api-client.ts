export interface AnalysisResult {
  productName: string
  brand: string
  ingredients: string[]
  safetyRating: "SAFE" | "CAUTION" | "HARMFUL"
  recommendation: string
  allergens: string[]
  usageInstructions: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

/**
 * Analyze a skincare product image using Gemini AI
 * @param image - The image file to analyze
 * @param userId - The user's ID for fetching their skin profile
 * @returns Analysis result with product info and recommendations
 */
export async function analyzeProductImage(image: File, userId: string): Promise<AnalysisResult> {
  const formData = new FormData()
  formData.append("image", image)
  formData.append("userId", userId)

  const response = await fetch("/api/analyze-image", {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to analyze image")
  }

  const result = await response.json()
  return result.analysis
}

/**
 * Search products in the database
 * @param query - Search query string
 * @param skinType - Optional filter by skin type
 * @returns Array of matching products
 */
export async function searchProducts(query: string, skinType?: string) {
  const params = new URLSearchParams()
  if (query) params.append("q", query)
  if (skinType) params.append("skinType", skinType)

  const response = await fetch(`/api/products/search?${params.toString()}`)

  if (!response.ok) {
    throw new Error("Failed to search products")
  }

  const result = await response.json()
  return result.products
}

/**
 * Get current user's profile
 * @returns User's skin type and concerns
 */
export async function getUserProfile() {
  const response = await fetch("/api/user-profile")

  if (!response.ok) {
    throw new Error("Failed to fetch user profile")
  }

  const result = await response.json()
  return result.profile
}

/**
 * Update user's profile
 * @param displayName - User's display name
 * @param skinType - User's skin type
 * @param skinConcerns - Array of skin concerns
 * @returns Updated profile
 */
export async function updateUserProfile(displayName: string, skinType: string, skinConcerns: string[]) {
  const response = await fetch("/api/user-profile", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      display_name: displayName,
      skin_type: skinType,
      skin_concerns: skinConcerns,
    }),
  })

  if (!response.ok) {
    throw new Error("Failed to update profile")
  }

  const result = await response.json()
  return result.profile
}
