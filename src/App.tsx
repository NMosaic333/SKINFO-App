"use client"

import { useState } from "react"
import { HomeScreen } from "./components/HomeScreen"
import { AnalysisScreen } from "./components/AnalysisScreen"
import { ComparisonScreen } from "./components/ComparisonScreen"
import { ReviewsScreen } from "./components/ReviewsScreen"
import { ProfileScreen } from "./components/ProfileScreen"
import { QuizScreen } from "./components/QuizScreen"
import { BottomNavigation } from "./components/BottomNavigation"

export type Screen = "home" | "analysis" | "comparison" | "reviews" | "profile" | "quiz"

export interface Product {
  id: string
  name: string
  brand: string
  image: string
  ingredients: Ingredient[]
  safetyRating: "safe" | "caution" | "harmful"
  rating: number
  reviews: number
  allergens: string[]
  skinTypes: string[]
}

export interface Ingredient {
  name: string
  purpose: string
  safety: "safe" | "caution" | "harmful"
  description: string
  concentration?: string
}

export interface Review {
  id: string
  user: string
  rating: number
  comment: string
  skinType: string
  verified: boolean
  date: string
}

export interface SkinProfile {
  skinType: string
  concerns: string[]
  sensitivities: string[]
  age: string
  routine: string
  climate: string
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("home")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [comparisonProducts, setComparisonProducts] = useState<Product[]>([])
  const [skinProfile, setSkinProfile] = useState<SkinProfile | null>(null)

  const renderScreen = () => {
    switch (currentScreen) {
      case "home":
        return (
          <HomeScreen onProductScanned={setSelectedProduct} onNavigate={setCurrentScreen} skinProfile={skinProfile} />
        )
      case "analysis":
        return <AnalysisScreen product={selectedProduct} onNavigate={setCurrentScreen} skinProfile={skinProfile} />
      case "comparison":
        return <ComparisonScreen products={comparisonProducts} onNavigate={setCurrentScreen} />
      case "reviews":
        return <ReviewsScreen onNavigate={setCurrentScreen} />
      case "profile":
        return <ProfileScreen onNavigate={setCurrentScreen} />
      case "quiz":
        return <QuizScreen onNavigate={setCurrentScreen} onComplete={setSkinProfile} />
      default:
        return (
          <HomeScreen onProductScanned={setSelectedProduct} onNavigate={setCurrentScreen} skinProfile={skinProfile} />
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100">
      {/* Header Navigation */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-pink-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                SK INFO
              </div>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => setCurrentScreen("home")}
                className={`px-4 py-2 rounded-full transition-all ${
                  currentScreen === "home"
                    ? "bg-pink-100 text-pink-700"
                    : "text-gray-600 hover:text-pink-600 hover:bg-pink-50"
                }`}
              >
                Home
              </button>
              <button
                onClick={() => setCurrentScreen("analysis")}
                className={`px-4 py-2 rounded-full transition-all ${
                  currentScreen === "analysis"
                    ? "bg-pink-100 text-pink-700"
                    : "text-gray-600 hover:text-pink-600 hover:bg-pink-50"
                }`}
              >
                Analysis
              </button>
              <button
                onClick={() => setCurrentScreen("quiz")}
                className={`px-4 py-2 rounded-full transition-all ${
                  currentScreen === "quiz"
                    ? "bg-pink-100 text-pink-700"
                    : "text-gray-600 hover:text-pink-600 hover:bg-pink-50"
                }`}
              >
                Skin Quiz
              </button>
              <button
                onClick={() => setCurrentScreen("comparison")}
                className={`px-4 py-2 rounded-full transition-all ${
                  currentScreen === "comparison"
                    ? "bg-pink-100 text-pink-700"
                    : "text-gray-600 hover:text-pink-600 hover:bg-pink-50"
                }`}
              >
                Compare
              </button>
              <button
                onClick={() => setCurrentScreen("reviews")}
                className={`px-4 py-2 rounded-full transition-all ${
                  currentScreen === "reviews"
                    ? "bg-pink-100 text-pink-700"
                    : "text-gray-600 hover:text-pink-600 hover:bg-pink-50"
                }`}
              >
                Reviews
              </button>
              <button
                onClick={() => setCurrentScreen("profile")}
                className={`px-4 py-2 rounded-full transition-all ${
                  currentScreen === "profile"
                    ? "bg-pink-100 text-pink-700"
                    : "text-gray-600 hover:text-pink-600 hover:bg-pink-50"
                }`}
              >
                Profile
              </button>
            </nav>

            {/* Mobile menu button */}
            <button className="md:hidden p-2 rounded-lg bg-pink-100 text-pink-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">{renderScreen()}</main>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <BottomNavigation currentScreen={currentScreen} onNavigate={setCurrentScreen} />
      </div>
    </div>
  )
}
