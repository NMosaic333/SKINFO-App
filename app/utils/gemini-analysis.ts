export interface GeminiAnalysisData {
  product: any
  recommendation: string
  usageInstructions: string
}

/**
 * Retrieve the last Gemini analysis from session storage
 * @returns Analysis data or null if not found
 */
export function getLastAnalysis(): GeminiAnalysisData | null {
  try {
    const stored = sessionStorage.getItem("lastAnalysis")
    return stored ? JSON.parse(stored) : null
  } catch (error) {
    console.error("[v0] Error retrieving analysis:", error)
    return null
  }
}

/**
 * Clear the stored analysis
 */
export function clearLastAnalysis(): void {
  sessionStorage.removeItem("lastAnalysis")
}

/**
 * Format the recommendation text for display
 * @param recommendation Raw recommendation from Gemini
 * @returns Formatted recommendation with line breaks
 */
export function formatRecommendation(recommendation: string): string {
  return recommendation
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join("\n")
}
