"use client";

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
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "./ui/collapsible";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { getLastAnalysis, formatRecommendation, GeminiAnalysisData } from "../utils/gemini-analysis";
import { getIngredientDetails, IngredientInfo } from "../utils/ingredients";
import type { Product, Screen, Ingredient, SkinProfile } from "../App";

// ------------------- Ingredient Card -------------------
function IngredientCard({ ingredient }: { ingredient: Ingredient }) {
  const [isOpen, setIsOpen] = useState(false);
  const [dataset, setDataset] = useState<IngredientInfo>({
    name: "Unknown ingredient",
    short_description: "Detailed ingredient data not available yet.",
    what_does_it_do: "Information is loading or unavailable.",
  });

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await getIngredientDetails(ingredient.name);
        if (active && data) setDataset(data);
      } catch (err) {
        console.warn("Failed to fetch ingredient details:", err);
      }
    })();
    return () => {
      active = false;
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

  const safetyLabel = {
    safe: "Generally safe for most skin types",
    caution: "May cause irritation in sensitive individuals",
    harmful: "Potentially harmful — consult a dermatologist",
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className={`p-4 transition-all ${borders[ingredient.safety ?? "safe"]}`}>
        <CollapsibleTrigger asChild>
          <button className="w-full text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {icons[ingredient.safety ?? "safe"]}
                <div>
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
                {isOpen ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </div>
            </div>
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent className="mt-3 pl-8 space-y-2">
          <p className="text-sm text-gray-600">
            {dataset?.short_description || ingredient.description || "No description available."}
          </p>
          {dataset?.what_does_it_do && (
            <p className="text-sm text-gray-600 mt-2">{dataset.what_does_it_do}</p>
          )}
          {dataset?.url && (
            <p className="text-xs text-blue-600 mt-2">
              <a href={dataset.url} target="_blank" rel="noreferrer">
                Learn more about this ingredient
              </a>
            </p>
          )}
          <div className="flex items-center space-x-2">
            <Info className="w-4 h-4 text-blue-500" />
            <span className="text-xs text-blue-600">
              {safetyLabel[ingredient.safety ?? "safe"]}
            </span>
          </div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

// ------------------- Analysis Screen -------------------
interface AnalysisScreenProps {
  product?: Product | null;
  onNavigate: (screen: Screen) => void;
  skinProfile?: SkinProfile | null;
}

export function AnalysisScreen({ product, onNavigate, skinProfile }: AnalysisScreenProps) {
  const [analysisData, setAnalysisData] = useState<GeminiAnalysisData | null>(null);

  useEffect(() => {
    try {
      const data = getLastAnalysis();
      if (data) setAnalysisData(data);
    } catch (err) {
      console.error("Failed to load analysis:", err);
    }
  }, []);

  // Safe fallback product
  const displayedProduct = useMemo<Product>(
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

  const ingredients = Array.isArray(displayedProduct.ingredients)
    ? displayedProduct.ingredients
    : [];

  // Count safety categories
  const safeCount = ingredients.filter((i) => i.safety === "safe").length;
  const cautionCount = ingredients.filter((i) => i.safety === "caution").length;
  const harmfulCount = ingredients.filter((i) => i.safety === "harmful").length;

  const safetyMap = {
    safe: {
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
      icon: <CheckCircle className="w-6 h-6 text-emerald-500" />,
      desc: "This product is generally safe for most users.",
    },
    caution: {
      color: "bg-amber-50 text-amber-700 border-amber-200",
      icon: <AlertTriangle className="w-6 h-6 text-amber-500" />,
      desc: "Use with caution — may contain irritating ingredients.",
    },
    harmful: {
      color: "bg-red-50 text-red-700 border-red-200",
      icon: <XCircle className="w-6 h-6 text-red-500" />,
      desc: "Not recommended — contains harmful ingredients.",
    },
  };

  // Personalized recommendations
  const getPersonalizedRecommendation = (): { concerns: string[]; benefits: string[] } => {
    if (!skinProfile) return { concerns: [], benefits: [] };

    const concerns: string[] = [];
    const benefits: string[] = [];

    if (skinProfile.skinType === "sensitive" && displayedProduct.allergens?.length > 0)
      concerns.push("May irritate sensitive skin due to allergens.");

    if (skinProfile.skinType === "oily" && displayedProduct.name.toLowerCase().includes("oil"))
      concerns.push("Oil-based product might be heavy for oily skin.");

    if (
      skinProfile.skinType === "dry" &&
      ingredients.some((i) => i.name.toLowerCase().includes("hyaluronic"))
    )
      benefits.push("Contains hyaluronic acid — great for hydration.");

    const hasSensitivity = skinProfile.sensitivities?.some((s) =>
      displayedProduct.allergens?.some((a) =>
        a.toLowerCase().includes(s.toLowerCase())
      )
    );
    if (hasSensitivity) concerns.push("Contains potential sensitivities.");

    if (
      skinProfile?.concerns?.includes("acne") &&
      ingredients.some((i) =>
        ["salicylic", "niacinamide"].some((k) => i.name.toLowerCase().includes(k))
      )
    )
      benefits.push("Contains acne-fighting ingredients.");

    if (
      skinProfile?.concerns?.includes("aging") &&
      ingredients.some((i) =>
        ["vitamin c", "retinol"].some((k) => i.name.toLowerCase().includes(k))
      )
    )
      benefits.push("Contains anti-aging ingredients.");

    return { concerns, benefits };
  };

  const personalized = getPersonalizedRecommendation();

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onNavigate("home")}
            className="rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Button>
          <h1 className="text-2xl font-semibold text-gray-800">
            Ingredient Analysis
          </h1>
        </div>

        <Button
          onClick={() => onNavigate("comparison")}
          className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white px-4 py-2 text-sm rounded-lg shadow-sm transition-all"
        >
          Compare Products
        </Button>
      </div>

      {/* Recommendation Section */}
      {analysisData?.recommendation && (
        <Card className="p-6 rounded-xl bg-white border border-gray-100 shadow-sm mb-6">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            {/* Recommendation */}
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-gray-800">
                Recommended for you
              </h2>
              {formatRecommendation(analysisData.recommendation)
                .split("\n")
                .map((line, idx) => (
                  <p key={idx} className="text-gray-600 text-sm leading-relaxed">
                    {line}
                  </p>
                ))}
            </div>

            {/* Usage Instructions */}
            {analysisData.usageInstructions && (
              <div className="min-w-[220px] bg-gray-50 border border-gray-100 p-4 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-2 text-sm">
                  How to use
                </h4>
                <div className="text-xs space-y-1 text-gray-600">
                  {analysisData.usageInstructions.split("\n").map((line, idx) => (
                    <p key={idx}>{line}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Left Column */}
        <div className="space-y-5">
          {/* Product Info */}
          <Card className="p-5 bg-white/70 border-pink-100 shadow-sm rounded-xl">
            <ImageWithFallback
              src={displayedProduct.image}
              alt={displayedProduct.name}
              className="w-full h-40 md:h-48 rounded-lg object-cover mb-3"
            />
            <h2 className="text-lg font-medium">{displayedProduct.name}</h2>
            <p className="text-gray-600 text-sm">{displayedProduct.brand}</p>
            <div className="flex items-center space-x-2 mt-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-gray-700">
                {displayedProduct.rating} ({displayedProduct.reviews} reviews)
              </span>
            </div>
          </Card>

          {/* Personalized Analysis */}
          {skinProfile && (
            <Card className="p-5 bg-gradient-to-r from-pink-50 to-rose-50 border-pink-200 rounded-xl">
              <div className="flex items-center space-x-3 mb-3">
                <User className="w-5 h-5 text-pink-600" />
                <h3 className="text-base md:text-lg font-medium text-pink-800">
                  For Your Skin
                </h3>
              </div>

              {personalized.benefits.length > 0 && (
                <div className="space-y-1 mb-3">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-800 font-medium">
                      Great for you
                    </span>
                  </div>
                  {personalized.benefits.map((b, i) => (
                    <p key={i} className="text-sm text-green-700 ml-5">
                      • {b}
                    </p>
                  ))}
                </div>
              )}

              {personalized.concerns.length > 0 && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-orange-600" />
                    <span className="text-sm text-orange-800 font-medium">
                      Consider
                    </span>
                  </div>
                  {personalized.concerns.map((c, i) => (
                    <p key={i} className="text-sm text-orange-700 ml-5">
                      • {c}
                    </p>
                  ))}
                </div>
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
                  <span className="text-lg text-green-600">{safeCount}</span>
                </div>
                <p className="text-sm text-green-600">Safe</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-lg text-yellow-600">{cautionCount}</span>
                </div>
                <p className="text-sm text-yellow-600">Caution</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-lg text-red-600">{harmfulCount}</span>
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

          {/* Skin Types */}
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
                  Detailed analysis of each ingredient and its effects on your skin.
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
              ingredients.map((ing, idx) => <IngredientCard key={idx} ingredient={ing} />)
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
