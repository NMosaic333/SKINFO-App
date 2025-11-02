"use client"
import { Camera, Upload, Shield, User, Sparkles, CheckCircle } from "lucide-react"
import { useState, useRef } from "react"
import { Button } from "./ui/button"
import { Card } from "./ui/card"
import ScanMagnifier from "./ui/scan-magnifier"
import { analyzeProductImage } from "../utils/api-client"
import { useAuth } from "../hooks/useAuth"
import type { Product, Screen, SkinProfile } from "../App"

interface HomeScreenProps {
  onProductScanned: (product: Product) => void
  onNavigate: (screen: Screen) => void
  skinProfile: SkinProfile | null
}

export function HomeScreen({ onProductScanned, onNavigate, skinProfile }: HomeScreenProps) {
  const { userId } = useAuth()
  const [isScanning, setIsScanning] = useState(false)
  const [previewSrc, setPreviewSrc] = useState<string | null>(null)
  const [scanError, setScanError] = useState<string | null>(null)

  const cameraInputRef = useRef<HTMLInputElement>(null)
  const uploadInputRef = useRef<HTMLInputElement>(null)

  const processFile = async (file: File) => {
    if (!file || !userId) return
    setPreviewSrc(URL.createObjectURL(file))
    setIsScanning(true)
    try {
      const analysis = await analyzeProductImage(file, userId)
      const analyzedProduct: Product = {
        id: `p-${Date.now()}`,
        name: analysis.productName || "Unknown Product",
        brand: analysis.brand || "Unknown Brand",
        image: previewSrc!,
        ingredients: analysis.ingredients.map((n: string) => ({
          name: n,
          purpose: "Active ingredient",
          safety: "safe",
          description: "Detected ingredient from label",
        })),
        safetyRating: "safe",
        rating: 4,
        reviews: 0,
        allergens: analysis.allergens,
        skinTypes: skinProfile?.skinType ? [skinProfile.skinType] : [],
      }
      onProductScanned(analyzedProduct)
      onNavigate("analysis")
    } catch {
      setScanError("Failed to analyze image.")
    } finally {
      setIsScanning(false)
    }
  }

  const handleImageCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }

  return (
    <div className="relative min-h-screen flex flex-col text-gray-900">
      {/* ✨ Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-100 via-white to-rose-100 animate-gradient-slow z-0"></div>
      <div className="absolute -top-20 -left-20 w-[400px] h-[400px] bg-pink-300/30 blur-[120px] rounded-full animate-float-slow z-0"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-rose-200/40 blur-[140px] rounded-full animate-float-delayed z-0"></div>

      {/* HERO */}
      <section className="relative z-10 flex flex-col-reverse md:flex-row items-center justify-between max-w-7xl mx-auto w-full px-8 md:px-16 py-14">
        <div className="space-y-6 text-center md:text-left md:w-1/2">
          <h1 className="text-5xl font-extrabold tracking-tight leading-tight">
            Discover What’s{" "}
            <span className="bg-gradient-to-r from-rose-600 to-pink-400 bg-clip-text text-transparent">
              Inside
            </span>{" "}
            Your Skincare
          </h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto md:mx-0">
            AI-powered ingredient analysis for safer, smarter skincare choices.
          </p>
          <div className="flex justify-center md:justify-start gap-4 pt-4">
            <Button
              onClick={() => cameraInputRef.current?.click()}
              className="bg-gradient-to-r from-rose-500 to-pink-400 hover:from-rose-600 hover:to-pink-500 text-white font-semibold text-lg px-6 py-6 rounded-xl shadow-lg transition transform hover:scale-[1.05] animate-fade-in"
            >
              <Camera className="mr-2 h-5 w-5" />
              Scan Product
            </Button>
            <Button
              variant="outline"
              onClick={() => uploadInputRef.current?.click()}
              className="border-2 border-rose-300 text-rose-600 hover:bg-rose-50 font-semibold text-lg px-6 py-6 rounded-xl"
            >
              <Upload className="mr-2 h-5 w-5" />
              Upload Image
            </Button>
          </div>
        </div>

        <div className="md:w-1/2 flex justify-center mb-12 md:mb-0">
          <ScanMagnifier
            imageSrc="/src/assets/hero-image.png"
            magnifierSize={160}
            zoom={3}
            className="rounded-3xl w-[420px] h-[300px] shadow-2xl bg-white/50 backdrop-blur-xl border border-white/40"
          />
        </div>

        <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={handleImageCapture} className="hidden" />
        <input ref={uploadInputRef} type="file" accept="image/*" onChange={handleImageCapture} className="hidden" />
      </section>

      {/* FEATURES */}
      <section className="relative z-10 py-20 px-6 md:px-12 bg-white/70 backdrop-blur-xl border-y border-gray-100">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">
            The Future of Ingredient Transparency
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: <Camera className="text-rose-500 w-8 h-8 mx-auto" />,
                title: "Instant Scanning",
                desc: "Capture a label and get ingredient insights in seconds.",
              },
              {
                icon: <User className="text-rose-500 w-8 h-8 mx-auto" />,
                title: "Personalized Analysis",
                desc: "AI adapts recommendations to your unique skin type.",
              },
              {
                icon: <Shield className="text-rose-500 w-8 h-8 mx-auto" />,
                title: "Safety First",
                desc: "See what’s safe and what’s harmful before you apply.",
              },
            ].map((f) => (
              <Card key={f.title} className="p-8 bg-white/80 backdrop-blur-lg border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition">
                {f.icon}
                <h3 className="text-xl font-semibold mt-5 text-gray-900">{f.title}</h3>
                <p className="text-gray-600 mt-2">{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="relative z-10 py-24 bg-gradient-to-b from-white to-pink-50 text-center">
        <h2 className="text-3xl font-bold mb-8 text-gray-900">How It Works</h2>
        <div className="max-w-4xl mx-auto grid gap-10 md:grid-cols-3">
          {[
            { step: "1️⃣", title: "Scan", desc: "Upload or capture your skincare product." },
            { step: "2️⃣", title: "Analyze", desc: "Our AI identifies ingredients and their safety levels." },
            { step: "3️⃣", title: "Discover", desc: "Get detailed insights tailored to your skin type." },
          ].map((s) => (
            <div key={s.step} className="p-6 bg-white rounded-2xl shadow-sm border border-pink-100 hover:shadow-md transition">
              <div className="text-4xl mb-4">{s.step}</div>
              <h3 className="text-lg font-semibold">{s.title}</h3>
              <p className="text-gray-600">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TRUSTED BY */}
      <section className="relative z-10 py-16 bg-white border-y border-gray-100">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-500 uppercase text-sm tracking-wide mb-6">Trusted by beauty enthusiasts & professionals</p>
          <div className="flex justify-center flex-wrap gap-8 opacity-70">
            <img src="src/assets/loreal.png" alt="L'Oréal" className="h-10" />
            <img src="src/assets/theordinary.png" alt="The Ordinary" className="h-10" />
            <img src="src/assets/clinique.png" alt="Clinique" className="h-10" />
            <img src="src/assets/cerave.png" alt="CeraVe" className="h-10" />
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="relative z-10 py-20 bg-gradient-to-r from-pink-50 to-rose-100">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-10 text-gray-900">What Our Users Say</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { name: "Aisha K.", text: "I finally understand what’s in my skincare. This app is genius!" },
              { name: "Meera P.", text: "As someone with sensitive skin, the AI safety labels are life-saving." },
              { name: "Sana R.", text: "I compared my old moisturizer and switched to a safer one — instant glow!" },
            ].map((t) => (
              <Card key={t.name} className="p-6 bg-white shadow-sm rounded-2xl border border-pink-100">
                <p className="text-gray-700 italic">“{t.text}”</p>
                <p className="mt-4 font-semibold text-rose-600">— {t.name}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* DATA PRIVACY */}
      <section className="relative z-10 py-16 bg-white text-center border-y border-gray-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">Your Privacy, Our Priority</h2>
          <p className="text-gray-600 mb-6">
            We don’t store your images permanently. Every analysis is end-to-end encrypted and processed securely.
          </p>
          <div className="flex justify-center gap-3">
            <CheckCircle className="text-green-500" />
            <span className="text-sm text-gray-700">GDPR & ISO 27001 compliant</span>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-24 bg-gradient-to-br from-pink-600 to-rose-400 text-white text-center">
        <h2 className="text-4xl font-bold mb-4">Start Scanning Smarter</h2>
        <p className="text-pink-100 mb-8">Join thousands already using Skinfo to uncover what’s inside their products.</p>
        <Button
          onClick={() => onNavigate("quiz")}
          className="bg-white text-pink-600 font-semibold px-8 py-4 rounded-xl hover:bg-pink-50"
        >
          Take the Skin Quiz
        </Button>
      </section>
    </div>
  )
}
