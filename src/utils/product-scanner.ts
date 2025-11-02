import type { Product } from "../App"

// Mock product database - in real app, would come from backend/database
const mockProductDatabase: Record<string, Product> = {
  "vitamin-c-serum": {
    id: "1",
    name: "Vitamin C Brightening Serum",
    brand: "Glow Botanics",
    image:
      "https://images.unsplash.com/photo-1715750968540-841103c78d47?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxza2luY2FyZSUyMHNlcnVtJTIwZHJvcHBlcnxlbnwxfHx8fDE3NTk4MTA2NTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ingredients: [
      {
        name: "Vitamin C (L-Ascorbic Acid)",
        purpose: "Antioxidant",
        safety: "safe",
        description: "Powerful antioxidant that brightens skin",
        concentration: "15%",
      },
      { name: "Hyaluronic Acid", purpose: "Hydrating", safety: "safe", description: "Attracts and retains moisture" },
      { name: "Fragrance", purpose: "Scent", safety: "caution", description: "May cause irritation in sensitive skin" },
    ],
    safetyRating: "safe",
    rating: 4.5,
    reviews: 142,
    allergens: ["Fragrance"],
    skinTypes: ["Normal", "Dry", "Combination"],
  },
  "retinol-night-cream": {
    id: "2",
    name: "Retinol Night Cream",
    brand: "Pure Beauty",
    image:
      "https://images.unsplash.com/photo-1686121522357-48dc9ea59281?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxza2luY2FyZSUyMGNvc21ldGljJTIwcHJvZHVjdCUyMGJvdHRsZXxlbnwxfHx8fDE3NTk4MTA2NTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ingredients: [
      {
        name: "Retinol",
        purpose: "Anti-aging",
        safety: "caution",
        description: "Increases cell turnover, can cause sensitivity",
        concentration: "0.5%",
      },
      {
        name: "Shea Butter",
        purpose: "Moisturizing",
        safety: "safe",
        description: "Rich natural moisturizer",
      },
      { name: "Peptides", purpose: "Firming", safety: "safe", description: "Support skin elasticity" },
    ],
    safetyRating: "caution",
    rating: 4.3,
    reviews: 98,
    allergens: [],
    skinTypes: ["Normal", "Dry", "Mature"],
  },
  "hyaluronic-moisturizer": {
    id: "3",
    name: "Deep Hydration Moisturizer",
    brand: "Aqua Pure",
    image:
      "https://images.unsplash.com/photo-1753355241-9b37e2caf45f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2lzdHVyaXplciUyMGphciUyMGJlYXV0eXxlbnwxfHx8fDE3NjE2NzY4Njl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ingredients: [
      {
        name: "Hyaluronic Acid",
        purpose: "Hydration",
        safety: "safe",
        description: "Holds up to 1000x its weight in water",
        concentration: "2%",
      },
      { name: "Glycerin", purpose: "Humectant", safety: "safe", description: "Attracts moisture to skin" },
      { name: "Niacinamide", purpose: "Skin barrier", safety: "safe", description: "Strengthens skin barrier" },
    ],
    safetyRating: "safe",
    rating: 4.7,
    reviews: 256,
    allergens: [],
    skinTypes: ["All skin types"],
  },
}

// Simulate OCR reading of product label
export function simulateOCR(imageData: string): string[] {
  console.log("[v0] Processing image with OCR simulation")
  // In a real app, this would send to Google Cloud Vision or similar
  // For now, we extract keywords and return ingredient-like text
  const keywords = ["vitamin c", "retinol", "hyaluronic", "moisturizer", "serum", "night cream", "fragrance", "alcohol"]
  // Randomly return 2-3 detected keywords
  const detected = keywords.sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * 2) + 2)
  return detected
}

// Match detected text to a product in database
export function findProductByOCR(detectedText: string[]): Product | null {
  console.log("[v0] Matching detected text to products:", detectedText)
  // Try to match against product keys
  for (const [key, product] of Object.entries(mockProductDatabase)) {
    const keyWords = key.split("-")
    const matchCount = detectedText.filter((text) => keyWords.some((kw) => text.toLowerCase().includes(kw))).length
    if (matchCount > 0) {
      return product
    }
  }

  // If no match, return a random product
  const products = Object.values(mockProductDatabase)
  return products[Math.floor(Math.random() * products.length)]
}

// Get all available products
export function getAllProducts(): Product[] {
  return Object.values(mockProductDatabase)
}
