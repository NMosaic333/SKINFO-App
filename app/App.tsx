"use client"

import { useState, useEffect } from "react"
import { HomeScreen } from "./components/HomeScreen"
import { AnalysisScreen } from "./components/AnalysisScreen"
import { ComparisonScreen } from "./components/ComparisonScreen"
import { ReviewsScreen } from "./components/ReviewsScreen"
import { ProfileScreen } from "./components/ProfileScreen"
import { QuizScreen } from "./components/QuizScreen"
import { BottomNavigation } from "./components/BottomNavigation"
import Footer from "./components/ui/footer"
import { LoginScreen } from "./components/LoginScreen"
import { RegisterScreen } from "./components/RegisterScreen"
import { supabase } from "@/lib/supabase";

export type Screen = "home" | "analysis" | "comparison" | "reviews" | "profile" | "quiz" | "login"

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
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

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
        return (
          <ProfileScreen
            onNavigate={setCurrentScreen}
            skinProfile={skinProfile}
            onUpdateProfile={setSkinProfile}
          />
        )
      case "quiz":
        return <QuizScreen onNavigate={setCurrentScreen} onComplete={setSkinProfile} />
      case "login":
        return <LoginScreen onNavigate={setCurrentScreen} onLogin={(user) => setUser(user)} />
      case "register":
        return <RegisterScreen 
        onNavigate={setCurrentScreen} 
        onRegister={(user) => {console.log("User registered:", user)
        setUser(user)
  }} />
      default:
        return (
          <HomeScreen onProductScanned={setSelectedProduct} onNavigate={setCurrentScreen} skinProfile={skinProfile} />
        )
    }
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      alert("Logged out successfully!");
      setCurrentScreen("home");
    } catch (error) {
      console.error("Logout error:", error);
      alert("Failed to log out.");
    }
  };

  // Navigate wrapper that offers to load the last analysis when user opens the Analysis screen
  const navigateTo = (screen: Screen) => {
    if (screen === 'analysis' && !selectedProduct) {
      try {
        // lazy-import to avoid circular issues
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { getLastAnalysis } = require('./utils/gemini-analysis') as typeof import('./utils/gemini-analysis')
        const last = getLastAnalysis()
        if (last && last.product) {
          const load = window.confirm('Load last analysis from this session?')
          if (load) {
            setSelectedProduct(last.product as Product)
          }
        }
      } catch (e) {
        // ignore
      }
    }

    setCurrentScreen(screen)
  }

  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        setUser({
          name: data.user.user_metadata?.name || "User",
          email: data.user.email || "",
        });
      } else {
        setUser(null);
      }
    };
    getSession();

    // Optional: Listen to auth changes (login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          name: session.user.user_metadata?.name || "User",
          email: session.user.email || "",
        });
      } else {
        setUser(null);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    async function fetchProfile() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const token = session?.access_token;

      if (!token) {
        console.warn("⚠️ No active session found");
        return;
      }

      const res = await fetch("/api/user-profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.error(`Failed to fetch: ${res.status}`);
        return;
      }

      const data = await res.json();
      if (data.profile) setSkinProfile(data.profile);
    }

    fetchProfile();
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100">
      {/* Header Navigation */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-pink-200 sticky top-0 z-50">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src="/assets/logo.png" alt="SKINFO Logo" className="h-20 w-20" />
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
              {user ? (
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-600 hover:text-pink-600 underline ml-2"
                >
                  Logout
                </button>
              </div>
            ) : <button
                onClick={() => setCurrentScreen("login")}
                className={`px-4 py-2 rounded-full transition-all ${
                  currentScreen === "login"
                    ? "bg-pink-100 text-pink-700"
                    : "text-gray-600 hover:text-pink-600 hover:bg-pink-50"
                }`}
              >
                Login
              </button>}
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

      <Footer />
    </div>
  )
}
