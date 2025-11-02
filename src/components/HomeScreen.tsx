import React from 'react';
import { Camera, Upload, Clock, Sparkles, Shield, Leaf, User, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import type { Product, Screen, SkinProfile } from '../App';
import logoImage from 'figma:asset/1d8b419d7b6966630d8cc63b320c1b9a7049db0b.png';

interface HomeScreenProps {
  onProductScanned: (product: Product) => void;
  onNavigate: (screen: Screen) => void;
  skinProfile: SkinProfile | null;
}

const mockProduct: Product = {
  id: '1',
  name: 'Vitamin C Brightening Serum',
  brand: 'Glow Botanics',
  image: 'https://images.unsplash.com/photo-1715750968540-841103c78d47?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxza2luY2FyZSUyMHNlcnVtJTIwZHJvcHBlcnxlbnwxfHx8fDE3NTk4MTA2NTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  ingredients: [
    { name: 'Vitamin C (L-Ascorbic Acid)', purpose: 'Antioxidant', safety: 'safe', description: 'Powerful antioxidant that brightens skin', concentration: '15%' },
    { name: 'Hyaluronic Acid', purpose: 'Hydrating', safety: 'safe', description: 'Attracts and retains moisture' },
    { name: 'Fragrance', purpose: 'Scent', safety: 'caution', description: 'May cause irritation in sensitive skin' }
  ],
  safetyRating: 'safe',
  rating: 4.5,
  reviews: 142,
  allergens: ['Fragrance'],
  skinTypes: ['Normal', 'Dry', 'Combination']
};

const recentScans = [
  { id: '1', name: 'Vitamin C Serum', brand: 'Glow Botanics', safety: 'safe', image: 'https://images.unsplash.com/photo-1715750968540-841103c78d47?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxza2luY2FyZSUyMHNlcnVtJTIwZHJvcHBlcnxlbnwxfHx8fDE3NTk4MTA2NTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
  { id: '2', name: 'Retinol Night Cream', brand: 'Pure Beauty', safety: 'caution', image: 'https://images.unsplash.com/photo-1686121522357-48dc9ea59281?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxza2luY2FyZSUyMGNvc21ldGljJTIwcHJvZHVjdCUyMGJvdHRsZXxlbnwxfHx8fDE3NTk4MTA2NTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
];

export function HomeScreen({ onProductScanned, onNavigate, skinProfile }: HomeScreenProps) {
  const handleScanProduct = () => {
    // Simulate scanning and finding a product
    onProductScanned(mockProduct);
    onNavigate('analysis');
  };

  const getSafetyColor = (safety: string) => {
    switch (safety) {
      case 'safe': return 'text-green-600 bg-green-50';
      case 'caution': return 'text-yellow-600 bg-yellow-50';
      case 'harmful': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-100 to-rose-100 p-8 md:p-12">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 rounded-3xl overflow-hidden">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1642383511822-b493c213faca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2Z0JTIwcGluayUyMHNraW5jYXJlJTIwYmFja2dyb3VuZHxlbnwxfHx8fDE3NjE2NTU5ODB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Background"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-pink-100/90 to-rose-100/90"></div>
        </div>
        
        <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
          <div className="text-center md:text-left space-y-6">
            <div className="flex justify-center md:justify-start mb-6">
              <img src={logoImage} alt="Skinfo Logo" className="h-16 w-auto" />
            </div>
            <h1 className="text-4xl md:text-5xl bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-4">
              Know Your Ingredients,
              <br />
              Love Your Skin
            </h1>
            <p className="text-xl text-gray-600">
              Scan any skincare product to get personalized ingredient analysis based on your unique skin profile
            </p>
          </div>
          <div className="hidden md:block">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1631050165423-3f29788b977b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxza2luY2FyZSUyMGJlYXV0eSUyMGxpZmVzdHlsZXxlbnwxfHx8fDE3NjE1NDQ3Nzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Skincare lifestyle"
              className="w-full h-80 object-cover rounded-2xl shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Skin Profile Status */}
      {!skinProfile ? (
        <Card className="p-6 bg-gradient-to-r from-pink-50 to-rose-50 border-pink-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-pink-600" />
              </div>
              <div>
                <h3 className="text-lg text-pink-800">Take Your Skin Quiz First</h3>
                <p className="text-pink-600">Get personalized product analysis based on your skin type and concerns</p>
              </div>
            </div>
            <Button 
              onClick={() => onNavigate('quiz')}
              className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white"
            >
              Start Quiz
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="p-6 bg-gradient-to-r from-pink-50 to-rose-50 border-pink-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-pink-600" />
              </div>
              <div>
                <h3 className="text-lg text-pink-800">Your Skin Profile</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge className="bg-pink-100 text-pink-700 border-pink-300 capitalize">
                    {skinProfile.skinType}
                  </Badge>
                  <Badge className="bg-rose-100 text-rose-700 border-rose-300">
                    {skinProfile.concerns.length} concerns
                  </Badge>
                </div>
              </div>
            </div>
            <Button 
              onClick={() => onNavigate('quiz')}
              variant="outline"
              className="border-pink-300 text-pink-700 hover:bg-pink-50"
            >
              Retake Quiz
            </Button>
          </div>
        </Card>
      )}

      {/* Main Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
        <Button 
          onClick={handleScanProduct}
          className="h-14 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-2xl flex items-center justify-center space-x-3 shadow-lg px-8"
        >
          <Camera className="w-6 h-6" />
          <span className="text-lg">Scan Product</span>
        </Button>
        
        <Button 
          variant="outline"
          className="h-14 border-2 border-pink-200 text-pink-700 rounded-2xl flex items-center justify-center space-x-3 hover:bg-pink-50 px-8"
        >
          <Upload className="w-5 h-5" />
          <span>Upload Image</span>
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <Card className="p-6 text-center bg-white/70 border-pink-100 hover:shadow-lg transition-shadow">
          <Shield className="w-8 h-8 mx-auto text-pink-500 mb-3" />
          <p className="text-sm text-gray-600 mb-1">Products Analyzed</p>
          <p className="text-2xl text-pink-600">1,247</p>
        </Card>
        <Card className="p-6 text-center bg-white/70 border-rose-100 hover:shadow-lg transition-shadow">
          <Sparkles className="w-8 h-8 mx-auto text-rose-500 mb-3" />
          <p className="text-sm text-gray-600 mb-1">Ingredients Database</p>
          <p className="text-2xl text-rose-600">8,432</p>
        </Card>
        <Card className="p-6 text-center bg-white/70 border-pink-100 hover:shadow-lg transition-shadow">
          <Clock className="w-8 h-8 mx-auto text-pink-500 mb-3" />
          <p className="text-sm text-gray-600 mb-1">Community Reviews</p>
          <p className="text-2xl text-pink-600">12,356</p>
        </Card>
      </div>

      {/* Recent Scans */}
      {recentScans.length > 0 && (
        <div className="max-w-4xl mx-auto space-y-4">
          <h3 className="text-2xl text-center bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">Recent Scans</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentScans.map((product) => (
              <Card key={product.id} className="p-4 bg-white/70 border-pink-100 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center space-x-4">
                  <ImageWithFallback
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="text-sm">{product.name}</h4>
                    <p className="text-xs text-gray-500">{product.brand}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs capitalize ${getSafetyColor(product.safety)}`}>
                    {product.safety}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Features Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
        <Card className="p-6 bg-white/70 border-pink-100 hover:shadow-lg transition-shadow overflow-hidden">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1609468826499-0ec9af2fc7f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHNraW5jYXJlJTIwcm91dGluZXxlbnwxfHx8fDE3NjE1Mzk5NDR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Instant Scanning"
            className="w-full h-40 object-cover rounded-xl mb-4"
          />
          <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mb-4 -mt-8 ml-4 relative z-10">
            <Camera className="w-6 h-6 text-pink-600" />
          </div>
          <h3 className="text-lg mb-2 text-pink-800">Instant Scanning</h3>
          <p className="text-gray-600 text-sm">Take a photo of any product label and get instant ingredient analysis</p>
        </Card>

        <Card className="p-6 bg-white/70 border-rose-100 hover:shadow-lg transition-shadow overflow-hidden">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1730240281256-3c22e803a51c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnbG93aW5nJTIwc2tpbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2MTY1NDYxMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Personalized Analysis"
            className="w-full h-40 object-cover rounded-xl mb-4"
          />
          <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mb-4 -mt-8 ml-4 relative z-10">
            <User className="w-6 h-6 text-rose-600" />
          </div>
          <h3 className="text-lg mb-2 text-rose-800">Personalized Analysis</h3>
          <p className="text-gray-600 text-sm">Get recommendations tailored to your specific skin type and concerns</p>
        </Card>

        <Card className="p-6 bg-white/70 border-pink-100 hover:shadow-lg transition-shadow overflow-hidden">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1760982686598-a86227371d53?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmFsJTIwaW5ncmVkaWVudHMlMjBib3RhbmljYWx8ZW58MXx8fHwxNzYxNTQ1MjY2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Safety First"
            className="w-full h-40 object-cover rounded-xl mb-4"
          />
          <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mb-4 -mt-8 ml-4 relative z-10">
            <Shield className="w-6 h-6 text-pink-600" />
          </div>
          <h3 className="text-lg mb-2 text-pink-800">Safety First</h3>
          <p className="text-gray-600 text-sm">Comprehensive safety ratings and allergen warnings for informed choices</p>
        </Card>
      </div>
    </div>
  );
}