import React, { useState, useEffect, useMemo } from "react";
import {
  ArrowLeft,
  Star,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Info,
  User,
  Heart,
  ShieldAlert,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { getLastAnalysis, formatRecommendation } from "../utils/gemini-analysis";
import { getIngredientDetails, IngredientInfo } from "../utils/ingredients";
import type { GeminiAnalysisData } from "../utils/gemini-analysis";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import type { Product, Screen, Ingredient, SkinProfile } from "../App";

// --- Ingredient Card ---
function IngredientCard({ ingredient }: { ingredient: Ingredient }) {
  const [isOpen, setIsOpen] = useState(false);
  const [dataset, setDataset] = useState<IngredientInfo>({
    name: "Unknown ingredient",
    short_description: "Detailed ingredient data not available yet.",
    what_does_it_do: "Information is loading or unavailable.",
  });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const det = await getIngredientDetails(ingredient.name);
        if (mounted && det) setDataset(det);
      } catch {
        // silently ignore
      }
    })();
    return () => {
      mounted = false;
    };
  }, [ingredient.name]);

  const icons = {
    safe: <CheckCircle className="w-5 h-5 text-emerald-500" />,
    caution: <AlertTriangle className="w-5 h-5 text-amber-500" />,
    harmful: <XCircle className="w-5 h-5 text-red-500" />,
  };

  const borders = {
    safe: "border-green-200",
    caution: "border-yellow-200",
    harmful: "border-red-200",
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className={`p-4 ${borders[ingredient.safety ?? "safe"]}`}>
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {icons[ingredient.safety ?? "safe"]}
              <div className="text-left">
                <h4 className="text-sm font-medium">{ingredient.name}</h4>
                <p className="text-xs text-gray-500">{ingredient.purpose}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {ingredient.concentration && (
                <Badge variant="outline" className="text-xs">
                  {ingredient.concentration}
                </Badge>
              )}
              {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent className="mt-3">
          <div className="pl-8 space-y-2">
            <p className="text-sm text-gray-600">
              {dataset?.short_description || ingredient.description}
            </p>
            {dataset?.what_does_it_do && (
              <p className="text-sm text-gray-600 mt-2">{dataset.what_does_it_do}</p>
            )}
            {dataset?.url && (
              <p className="text-xs text-blue-600 mt-2">
                <a href={dataset.url} target="_blank" rel="noreferrer">
                  More on this ingredient
                </a>
              </p>
            )}
            <div className="flex items-center space-x-2">
              <Info className="w-4 h-4 text-blue-500" />
              <span className="text-xs text-blue-600">
                {ingredient.safety === "safe" && "Generally safe for most skin types"}
                {ingredient.safety === "caution" &&
                  "May cause irritation in sensitive individuals"}
                {ingredient.safety === "harmful" &&
                  "Potentially harmful - consult a dermatologist"}
              </span>
            </div>
          </div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

// --- Main Component ---
export function AnalysisScreen({
  product,
  onNavigate,
  skinProfile,
}: AnalysisScreenProps) {
  const [analysisData, setAnalysisData] = useState<GeminiAnalysisData | null>(null);

  useEffect(() => {
    try {
      const data = getLastAnalysis();
      if (data) setAnalysisData(data);
    } catch {
      // ignore storage errors
    }
  }, []);

  // ✅ Safe fallback product
  const displayedProduct: Product = useMemo(
    () =>
      product ??
      (analysisData?.product as Product) ?? {
        name: "Sample Product",
        brand: "Default Brand",
        image: "/assets/hero-product.png",
        ingredients: [],
        safetyRating: "safe",
        rating: 0,
        reviews: 0,
        allergens: [],
        skinTypes: ["normal"],
      },
    [product, analysisData]
  );

  // ✅ Avoid undefined filter errors
  const ingredients = Array.isArray(displayedProduct.ingredients)
    ? displayedProduct.ingredients
    : [];

  const safeIngredients = ingredients.filter((i) => i.safety === "safe").length;
  const cautionIngredients = ingredients.filter((i) => i.safety === "caution").length;
  const harmfulIngredients = ingredients.filter((i) => i.safety === "harmful").length;

  const safetyMap = {
    SAFE: {
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
      icon: <CheckCircle className="w-6 h-6 text-emerald-500" />,
      desc: "This product is generally safe for most users",
    },
    CAUTION: {
      color: "bg-amber-50 text-amber-700 border-amber-200",
      icon: <AlertTriangle className="w-6 h-6 text-amber-500" />,
      desc: "Use with caution - may contain irritating ingredients",
    },
    HARMFUL: {
      color: "bg-red-50 text-red-700 border-red-200",
      icon: <XCircle className="w-6 h-6 text-red-500" />,
      desc: "Not recommended - contains harmful ingredients",
    },
  };

  const getPersonalizedRecommendation = (): { concerns: string[]; benefits: string[] } => {
    if (!skinProfile)
      return { concerns: [], benefits: [] };

    const concerns: string[] = [];
    const benefits: string[] = [];

    if (skinProfile.skinType === "sensitive" && displayedProduct.allergens?.length > 0)
      concerns.push("May irritate sensitive skin due to allergens");

    if (
      skinProfile.skinType === "oily" &&
      displayedProduct.name.toLowerCase().includes("oil")
    )
      concerns.push("Oil-based product might be heavy for oily skin");

    if (
      skinProfile.skinType === "dry" &&
      ingredients.some((i) => i.name.toLowerCase().includes("hyaluronic"))
    )
      benefits.push("Contains hyaluronic acid — great for hydration");

    const hasSensitivity = skinProfile.sensitivities?.some((s) =>
      displayedProduct.allergens?.some((a) =>
        a.toLowerCase().includes(s.toLowerCase())
      )
    );
    if (hasSensitivity) concerns.push("Contains potential sensitivities");

    if (
      skinProfile.concerns.includes("acne") &&
      ingredients.some((i) =>
        ["salicylic", "niacinamide"].some((k) => i.name.toLowerCase().includes(k))
      )
    )
      benefits.push("Contains acne-fighting ingredients");

    if (
      skinProfile.concerns.includes("aging") &&
      ingredients.some((i) =>
        ["vitamin c", "retinol"].some((k) => i.name.toLowerCase().includes(k))
      )
    )
      benefits.push("Contains anti-aging ingredients");

    return { concerns, benefits };
  };

  const personalized = getPersonalizedRecommendation();

  useEffect(() => {
    try {
      const data = getLastAnalysis();
      console.log("🔍 Analysis data from storage:", data); // 👈 Add this
      if (data) setAnalysisData(data);
    } catch (err) {
      console.error("Failed to load analysis:", err);
    }
  }, []);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onNavigate("home")}
            className="rounded-full hover:bg-pink-50"
          >
            <ArrowLeft className="w-5 h-5 text-pink-600" />
          </Button>
          <h1 className="text-3xl bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
            Ingredient Analysis
          </h1>
        </div>
        <Button
          onClick={() => onNavigate("comparison")}
          className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white"
        >
          Compare Products
        </Button>
      </div>

      {/* Recommendation */}
      {analysisData?.recommendation && (
        <Card className="p-8 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-3">
                Recommended for you
              </h2>
              {formatRecommendation(analysisData.recommendation)
                .split("\n")
                .map((line, idx) => (
                  <p key={idx} className="text-base md:text-lg leading-relaxed text-white/90">
                    {line}
                  </p>
                ))}
            </div>

            {analysisData.usageInstructions && (
              <div className="min-w-[220px] bg-white/10 p-4 rounded-lg">
                <h4 className="font-semibold text-white">How to use:</h4>
                <div className="mt-2 text-white/90 text-sm space-y-1">
                  {analysisData.usageInstructions.split("\n").map((line, idx) => (
                    <p key={idx}>{line}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6 bg-white/70 border-pink-100">
            <ImageWithFallback
              src={displayedProduct.image}
              alt={displayedProduct.name}
              className="w-full h-48 rounded-xl object-cover mb-4"
            />
            <h2 className="text-xl">{displayedProduct.name}</h2>
            <p className="text-gray-600">{displayedProduct.brand}</p>
            <div className="flex items-center space-x-2 mt-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-sm">
                {displayedProduct.rating} ({displayedProduct.reviews} reviews)
              </span>
            </div>
          </Card>

          {/* Personalized Analysis */}
          {skinProfile && (
            <Card className="p-6 bg-gradient-to-r from-pink-50 to-rose-50 border-pink-200">
              <div className="flex items-center space-x-3 mb-4">
                <User className="w-6 h-6 text-pink-600" />
                <h3 className="text-lg text-pink-800">For Your Skin</h3>
              </div>

              {personalized.benefits.length > 0 && (
                <>
                  <div className="flex items-center space-x-2 mb-2">
                    <Heart className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-800">Great for you:</span>
                  </div>
                  {personalized.benefits.map((b, i) => (
                    <p key={i} className="text-sm text-green-700 ml-4">• {b}</p>
                  ))}
                </>
              )}

              {personalized.concerns.length > 0 && (
                <>
                  <div className="flex items-center space-x-2 mt-4 mb-2">
                    <ShieldAlert className="w-4 h-4 text-orange-600" />
                    <span className="text-sm text-orange-800">Consider:</span>
                  </div>
                  {personalized.concerns.map((c, i) => (
                    <p key={i} className="text-sm text-orange-700 ml-4">• {c}</p>
                  ))}
                </>
              )}

              {personalized.benefits.length === 0 &&
                personalized.concerns.length === 0 && (
                  <p className="text-sm text-pink-700">
                    This product appears neutral for your skin profile.
                  </p>
                )}
            </Card>
          )}

          {/* Safety Rating */}
          <Card className={`p-6 border-2 ${safetyMap[displayedProduct.safetyRating].color}`}>
            <div className="flex items-center space-x-3 mb-4">
              {safetyMap[displayedProduct.safetyRating].icon}
              <div>
                <h3 className="text-xl capitalize">
                  {displayedProduct.safetyRating} Rating
                </h3>
                <p className="text-sm opacity-75">
                  {safetyMap[displayedProduct.safetyRating].desc}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6 text-center">
              <div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-lg text-green-600">{safeIngredients}</span>
                </div>
                <p className="text-sm text-green-600">Safe</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-lg text-yellow-600">{cautionIngredients}</span>
                </div>
                <p className="text-sm text-yellow-600">Caution</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-lg text-red-600">{harmfulIngredients}</span>
                </div>
                <p className="text-sm text-red-600">Harmful</p>
              </div>
            </div>
          </Card>

          {/* Allergens */}
          {displayedProduct.allergens?.length > 0 && (
            <Card className="p-6 bg-yellow-50 border-yellow-200">
              <h3 className="text-lg mb-3 text-yellow-800">⚠️ Contains Allergens</h3>
              <div className="flex flex-wrap gap-2">
                {displayedProduct.allergens.map((a) => (
                  <Badge key={a} variant="outline" className="text-yellow-700 border-yellow-300">
                    {a}
                  </Badge>
                ))}
              </div>
            </Card>
          )}

          {/* Suitable Skin Types */}
          <Card className="p-6 bg-pink-50 border-pink-200">
            <h3 className="text-lg mb-3 text-pink-800">✅ Suitable for</h3>
            <div className="flex flex-wrap gap-2">
              {displayedProduct.skinTypes?.map((t) => (
                <Badge key={t} variant="outline" className="text-pink-700 border-pink-300">
                  {t} skin
                </Badge>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column - Ingredients */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 bg-gradient-to-r from-pink-50 to-rose-50 border-pink-200">
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div>
                <h2 className="text-2xl text-gray-800 mb-2">Ingredients Breakdown</h2>
                <p className="text-sm text-gray-600">
                  Detailed analysis of each ingredient and its effects on your skin
                </p>
              </div>
              <ImageWithFallback
                src="/assets/ingredients-bg.jpg"
                alt="Natural ingredients"
                className="w-full h-32 object-cover rounded-xl"
              />
            </div>
          </Card>

          <div className="space-y-4">
            {ingredients.length > 0 ? (
              ingredients.map((ing, i) => <IngredientCard key={i} ingredient={ing} />)
            ) : (
              <p className="text-gray-500 text-sm text-center py-8">
                No ingredient data available for this product.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
