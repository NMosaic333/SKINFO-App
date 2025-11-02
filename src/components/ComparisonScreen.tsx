import React, { useState } from 'react';
import { ArrowLeft, Plus, Star, CheckCircle, AlertTriangle, XCircle, X } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import type { Product, Screen } from '../App';

interface ComparisonScreenProps {
  products: Product[];
  onNavigate: (screen: Screen) => void;
}

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Vitamin C Brightening Serum',
    brand: 'Glow Botanics',
    image: 'https://images.unsplash.com/photo-1715750968540-841103c78d47?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxza2luY2FyZSUyMHNlcnVtJTIwZHJvcHBlcnxlbnwxfHx8fDE3NTk4MTA2NTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    ingredients: [
      { name: 'Vitamin C', purpose: 'Antioxidant', safety: 'safe', description: 'Brightens skin' },
      { name: 'Hyaluronic Acid', purpose: 'Hydrating', safety: 'safe', description: 'Retains moisture' },
      { name: 'Fragrance', purpose: 'Scent', safety: 'caution', description: 'May irritate sensitive skin' }
    ],
    safetyRating: 'safe',
    rating: 4.5,
    reviews: 142,
    allergens: ['Fragrance'],
    skinTypes: ['Normal', 'Dry', 'Combination']
  },
  {
    id: '2',
    name: 'Retinol Night Cream',
    brand: 'Pure Beauty',
    image: 'https://images.unsplash.com/photo-1686121522357-48dc9ea59281?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxza2luY2FyZSUyMGNvc21ldGljJTIwcHJvZHVjdCUyMGJvdHRsZXxlbnwxfHx8fDE3NTk4MTA2NTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    ingredients: [
      { name: 'Retinol', purpose: 'Anti-aging', safety: 'caution', description: 'May cause irritation initially' },
      { name: 'Niacinamide', purpose: 'Soothing', safety: 'safe', description: 'Reduces inflammation' },
      { name: 'Parabens', purpose: 'Preservative', safety: 'harmful', description: 'Endocrine disruptor' }
    ],
    safetyRating: 'caution',
    rating: 4.2,
    reviews: 98,
    allergens: ['Parabens'],
    skinTypes: ['Normal', 'Oily']
  }
];

export function ComparisonScreen({ products: propProducts, onNavigate }: ComparisonScreenProps) {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>(
    propProducts.length > 0 ? propProducts : mockProducts.slice(0, 2)
  );

  const addProduct = () => {
    if (selectedProducts.length < 2) {
      const availableProducts = mockProducts.filter(
        p => !selectedProducts.find(sp => sp.id === p.id)
      );
      if (availableProducts.length > 0) {
        setSelectedProducts([...selectedProducts, availableProducts[0]]);
      }
    }
  };

  const removeProduct = (productId: string) => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
  };

  const getSafetyIcon = (rating: string) => {
    switch (rating) {
      case 'safe': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'caution': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'harmful': return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getSafetyColor = (rating: string) => {
    switch (rating) {
      case 'safe': return 'text-green-600 bg-green-50';
      case 'caution': return 'text-yellow-600 bg-yellow-50';
      case 'harmful': return 'text-red-600 bg-red-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-100 to-rose-100 p-6 border-b border-pink-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onNavigate('home')}
              className="rounded-full hover:bg-white/50"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">Product Comparison</h1>
              <p className="text-sm text-gray-600">Compare products side-by-side to make better choices</p>
            </div>
          </div>
          {selectedProducts.length < 2 && (
            <Button size="sm" onClick={addProduct} className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white">
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          )}
        </div>
      </div>

      <div className="p-6">
        {selectedProducts.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-500 mb-4">No products to compare</p>
            <Button onClick={addProduct} className="bg-green-500 hover:bg-green-600">
              Add Product
            </Button>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Product Cards */}
            <div className="grid gap-4">
              {selectedProducts.map((product) => (
                <Card key={product.id} className="p-4 bg-white/70 relative">
                  {selectedProducts.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeProduct(product.id)}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                  <div className="flex space-x-4">
                    <ImageWithFallback
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                    <div className="flex-1 space-y-2">
                      <h3 className="text-sm">{product.name}</h3>
                      <p className="text-xs text-gray-600">{product.brand}</p>
                      <div className="flex items-center space-x-2">
                        <Star className="w-3 h-3 text-yellow-500" />
                        <span className="text-xs">{product.rating} ({product.reviews})</span>
                      </div>
                      <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${getSafetyColor(product.safetyRating)}`}>
                        {getSafetyIcon(product.safetyRating)}
                        <span className="capitalize">{product.safetyRating}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Comparison Details */}
            {selectedProducts.length === 2 && (
              <div className="space-y-6">
                {/* Safety Comparison */}
                <Card className="p-4 bg-white/70">
                  <h3 className="text-sm mb-4">Safety Comparison</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedProducts.map((product, index) => (
                      <div key={product.id} className="space-y-2">
                        <p className="text-xs text-gray-600">{product.name}</p>
                        <div className={`p-3 rounded-lg ${getSafetyColor(product.safetyRating)}`}>
                          <div className="flex items-center space-x-2">
                            {getSafetyIcon(product.safetyRating)}
                            <span className="text-sm capitalize">{product.safetyRating}</span>
                          </div>
                          <p className="text-xs mt-1">
                            {product.ingredients.filter(i => i.safety === 'safe').length} safe, {' '}
                            {product.ingredients.filter(i => i.safety === 'caution').length} caution, {' '}
                            {product.ingredients.filter(i => i.safety === 'harmful').length} harmful
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Allergens Comparison */}
                <Card className="p-4 bg-white/70">
                  <h3 className="text-sm mb-4">Allergens</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedProducts.map((product) => (
                      <div key={product.id} className="space-y-2">
                        <p className="text-xs text-gray-600">{product.name}</p>
                        <div className="space-y-1">
                          {product.allergens.length > 0 ? (
                            product.allergens.map((allergen) => (
                              <Badge key={allergen} variant="outline" className="text-xs mr-1">
                                {allergen}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-xs text-green-600">No known allergens</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Skin Type Compatibility */}
                <Card className="p-4 bg-white/70">
                  <h3 className="text-sm mb-4">Skin Type Compatibility</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedProducts.map((product) => (
                      <div key={product.id} className="space-y-2">
                        <p className="text-xs text-gray-600">{product.name}</p>
                        <div className="space-y-1">
                          {product.skinTypes.map((type) => (
                            <Badge key={type} variant="outline" className="text-xs mr-1 text-green-700 border-green-300">
                              {type}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Community Rating */}
                <Card className="p-4 bg-white/70">
                  <h3 className="text-sm mb-4">Community Rating</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedProducts.map((product) => (
                      <div key={product.id} className="text-center">
                        <p className="text-xs text-gray-600 mb-2">{product.name}</p>
                        <div className="flex items-center justify-center space-x-1">
                          <Star className="w-5 h-5 text-yellow-500" />
                          <span className="text-lg">{product.rating}</span>
                        </div>
                        <p className="text-xs text-gray-500">{product.reviews} reviews</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}