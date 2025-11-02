import React, { useState } from 'react';
import { ArrowLeft, Star, AlertTriangle, CheckCircle, XCircle, ChevronDown, ChevronUp, Info, User, Heart, ShieldAlert } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import type { Product, Screen, Ingredient, SkinProfile } from '../App';

interface AnalysisScreenProps {
  product: Product | null;
  onNavigate: (screen: Screen) => void;
  skinProfile: SkinProfile | null;
}

function IngredientCard({ ingredient }: { ingredient: Ingredient }) {
  const [isOpen, setIsOpen] = useState(false);
  
  const getIcon = () => {
    switch (ingredient.safety) {
      case 'safe': return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'caution': return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'harmful': return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getBorderColor = () => {
    switch (ingredient.safety) {
      case 'safe': return 'border-green-200';
      case 'caution': return 'border-yellow-200';
      case 'harmful': return 'border-red-200';
    }
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className={`p-4 ${getBorderColor()}`}>
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getIcon()}
              <div className="text-left">
                <h4 className="text-sm">{ingredient.name}</h4>
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
            <p className="text-sm text-gray-600">{ingredient.description}</p>
            <div className="flex items-center space-x-2">
              <Info className="w-4 h-4 text-blue-500" />
              <span className="text-xs text-blue-600">
                {ingredient.safety === 'safe' && 'Generally safe for most skin types'}
                {ingredient.safety === 'caution' && 'May cause irritation in sensitive individuals'}
                {ingredient.safety === 'harmful' && 'Potentially harmful - consult dermatologist'}
              </span>
            </div>
          </div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

export function AnalysisScreen({ product, onNavigate, skinProfile }: AnalysisScreenProps) {
  if (!product) {
    return (
      <div className="p-6 flex flex-col items-center justify-center h-full space-y-4">
        <p className="text-gray-500">No product selected</p>
        <Button onClick={() => onNavigate('home')} variant="outline">
          Go Home
        </Button>
      </div>
    );
  }

  const getSafetyColor = () => {
    switch (product.safetyRating) {
      case 'safe': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'caution': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'harmful': return 'bg-red-50 text-red-700 border-red-200';
    }
  };

  const getSafetyIcon = () => {
    switch (product.safetyRating) {
      case 'safe': return <CheckCircle className="w-6 h-6 text-emerald-500" />;
      case 'caution': return <AlertTriangle className="w-6 h-6 text-amber-500" />;
      case 'harmful': return <XCircle className="w-6 h-6 text-red-500" />;
    }
  };

  const safeIngredients = product.ingredients.filter(i => i.safety === 'safe').length;
  const cautionIngredients = product.ingredients.filter(i => i.safety === 'caution').length;
  const harmfulIngredients = product.ingredients.filter(i => i.safety === 'harmful').length;

  // Personalized analysis based on skin profile
  const getPersonalizedRecommendation = () => {
    if (!skinProfile) return null;
    
    const concerns = [];
    const benefits = [];
    
    // Check for skin type compatibility
    if (skinProfile.skinType === 'sensitive' && product.allergens.length > 0) {
      concerns.push('This product contains potential allergens that may irritate sensitive skin');
    }
    
    if (skinProfile.skinType === 'oily' && product.name.toLowerCase().includes('oil')) {
      concerns.push('Oil-based products may be too heavy for oily skin types');
    }
    
    if (skinProfile.skinType === 'dry' && product.ingredients.some(i => i.name.toLowerCase().includes('hyaluronic'))) {
      benefits.push('Contains hyaluronic acid - excellent for dry skin hydration');
    }
    
    // Check for sensitivities
    const hasKnownSensitivities = skinProfile.sensitivities.some(sensitivity => 
      product.allergens.some(allergen => 
        allergen.toLowerCase().includes(sensitivity.toLowerCase()) ||
        sensitivity.toLowerCase().includes(allergen.toLowerCase())
      )
    );
    
    if (hasKnownSensitivities) {
      concerns.push('Contains ingredients you listed as sensitivities');
    }
    
    // Check for concern-specific ingredients
    if (skinProfile.concerns.includes('acne') && product.ingredients.some(i => 
      i.name.toLowerCase().includes('salicylic') || i.name.toLowerCase().includes('niacinamide')
    )) {
      benefits.push('Contains acne-fighting ingredients perfect for your skin concerns');
    }
    
    if (skinProfile.concerns.includes('aging') && product.ingredients.some(i => 
      i.name.toLowerCase().includes('vitamin c') || i.name.toLowerCase().includes('retinol')
    )) {
      benefits.push('Contains anti-aging ingredients that match your concerns');
    }
    
    return { concerns, benefits };
  };

  const personalizedAnalysis = getPersonalizedRecommendation();

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onNavigate('home')}
            className="rounded-full hover:bg-pink-50"
          >
            <ArrowLeft className="w-5 h-5 text-pink-600" />
          </Button>
          <h1 className="text-3xl bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
            Ingredient Analysis
          </h1>
        </div>
        <Button 
          onClick={() => onNavigate('comparison')}
          className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white"
        >
          Compare Products
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Product Info */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6 bg-white/70 border-pink-100">
            <div className="space-y-4">
              <ImageWithFallback
                src={product.image}
                alt={product.name}
                className="w-full h-48 rounded-xl object-cover"
              />
              <div className="space-y-2">
                <h2 className="text-xl">{product.name}</h2>
                <p className="text-gray-600">{product.brand}</p>
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm">{product.rating} ({product.reviews} reviews)</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Personalized Analysis */}
          {skinProfile && personalizedAnalysis && (
            <Card className="p-6 bg-gradient-to-r from-pink-50 to-rose-50 border-pink-200">
              <div className="flex items-center space-x-3 mb-4">
                <User className="w-6 h-6 text-pink-600" />
                <h3 className="text-lg text-pink-800">For Your Skin</h3>
              </div>
              
              {personalizedAnalysis.benefits.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Heart className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-800">Great for you:</span>
                  </div>
                  {personalizedAnalysis.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start space-x-2 mb-1">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                      <p className="text-sm text-green-700">{benefit}</p>
                    </div>
                  ))}
                </div>
              )}
              
              {personalizedAnalysis.concerns.length > 0 && (
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <ShieldAlert className="w-4 h-4 text-orange-600" />
                    <span className="text-sm text-orange-800">Consider:</span>
                  </div>
                  {personalizedAnalysis.concerns.map((concern, index) => (
                    <div key={index} className="flex items-start space-x-2 mb-1">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                      <p className="text-sm text-orange-700">{concern}</p>
                    </div>
                  ))}
                </div>
              )}
              
              {personalizedAnalysis.benefits.length === 0 && personalizedAnalysis.concerns.length === 0 && (
                <p className="text-sm text-pink-700">This product appears neutral for your skin profile.</p>
              )}
            </Card>
          )}

          {/* Safety Rating */}
          <Card className={`p-6 border-2 ${getSafetyColor()}`}>
            <div className="flex items-center space-x-3 mb-4">
              {getSafetyIcon()}
              <div>
                <h3 className="text-xl capitalize">{product.safetyRating} Rating</h3>
                <p className="text-sm opacity-75">
                  {product.safetyRating === 'safe' && 'This product is generally safe for most users'}
                  {product.safetyRating === 'caution' && 'Use with caution - contains potentially irritating ingredients'}
                  {product.safetyRating === 'harmful' && 'Not recommended - contains harmful ingredients'}
                </p>
              </div>
            </div>
            
            {/* Ingredient Summary */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-lg text-green-600">{safeIngredients}</span>
                </div>
                <p className="text-sm text-green-600">Safe</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-lg text-yellow-600">{cautionIngredients}</span>
                </div>
                <p className="text-sm text-yellow-600">Caution</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-lg text-red-600">{harmfulIngredients}</span>
                </div>
                <p className="text-sm text-red-600">Harmful</p>
              </div>
            </div>
          </Card>

          {/* Allergens */}
          {product.allergens.length > 0 && (
            <Card className="p-6 bg-yellow-50 border-yellow-200">
              <h3 className="text-lg mb-3 text-yellow-800">⚠️ Contains Allergens</h3>
              <div className="flex flex-wrap gap-2">
                {product.allergens.map((allergen) => (
                  <Badge key={allergen} variant="outline" className="text-yellow-700 border-yellow-300">
                    {allergen}
                  </Badge>
                ))}
              </div>
            </Card>
          )}

          {/* Suitable Skin Types */}
          <Card className="p-6 bg-pink-50 border-pink-200">
            <h3 className="text-lg mb-3 text-pink-800">✅ Suitable for</h3>
            <div className="flex flex-wrap gap-2">
              {product.skinTypes.map((type) => (
                <Badge key={type} variant="outline" className="text-pink-700 border-pink-300">
                  {type} skin
                </Badge>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column - Ingredients List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ingredients Header with Image */}
          <Card className="p-6 bg-gradient-to-r from-pink-50 to-rose-50 border-pink-200 overflow-hidden">
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div>
                <h2 className="text-2xl text-gray-800 mb-2">Ingredients Breakdown</h2>
                <p className="text-sm text-gray-600">
                  Detailed analysis of each ingredient and its effects on your skin
                </p>
              </div>
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1739981248829-ac9d4a6fecfa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxza2luY2FyZSUyMGluZ3JlZGllbnRzJTIwbmF0dXJhbHxlbnwxfHx8fDE3NjE1NjA3OTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Natural ingredients"
                className="w-full h-32 object-cover rounded-xl"
              />
            </div>
          </Card>
          
          <div>
            <div className="space-y-4">
              {product.ingredients.map((ingredient, index) => (
                <IngredientCard key={index} ingredient={ingredient} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
