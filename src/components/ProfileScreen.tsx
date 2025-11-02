import React, { useState } from 'react';
import { ArrowLeft, User, Settings, Bell, Shield, Heart, Star, ChevronRight, Edit } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ImageWithFallback } from './figma/ImageWithFallback';
import type { Screen } from '../App';

interface ProfileScreenProps {
  onNavigate: (screen: Screen) => void;
}

export function ProfileScreen({ onNavigate }: ProfileScreenProps) {
  const [skinType, setSkinType] = useState('combination');
  const [concerns, setConcerns] = useState(['acne', 'aging']);
  const [allergies, setAllergies] = useState(['fragrance', 'parabens']);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const skinTypeOptions = [
    { value: 'oily', label: 'Oily' },
    { value: 'dry', label: 'Dry' },
    { value: 'combination', label: 'Combination' },
    { value: 'sensitive', label: 'Sensitive' },
    { value: 'normal', label: 'Normal' }
  ];

  const concernOptions = [
    'acne', 'aging', 'hyperpigmentation', 'dryness', 'sensitivity', 'large-pores', 'dullness'
  ];

  const allergenOptions = [
    'fragrance', 'parabens', 'sulfates', 'alcohol', 'retinol', 'salicylic-acid', 'glycolic-acid'
  ];

  const favoriteProducts = [
    { name: 'Vitamin C Serum', brand: 'Glow Botanics', rating: 5 },
    { name: 'Hyaluronic Acid', brand: 'Pure Beauty', rating: 4 },
    { name: 'Niacinamide 10%', brand: 'Skin Solutions', rating: 5 }
  ];

  const toggleConcern = (concern: string) => {
    setConcerns(prev => 
      prev.includes(concern) 
        ? prev.filter(c => c !== concern)
        : [...prev, concern]
    );
  };

  const toggleAllergy = (allergy: string) => {
    setAllergies(prev => 
      prev.includes(allergy) 
        ? prev.filter(a => a !== allergy)
        : [...prev, allergy]
    );
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
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
            Profile & Settings
          </h1>
        </div>
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-pink-50">
          <Settings className="w-5 h-5 text-pink-600" />
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Profile Info */}
          <Card className="p-8 bg-white/70 border-pink-100">
            <div className="flex items-center space-x-6">
              <Avatar className="w-20 h-20">
                <AvatarFallback className="bg-gradient-to-br from-pink-100 to-rose-100 text-pink-700 text-2xl">
                  S
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-xl mb-1">Sarah Johnson</h2>
                <p className="text-gray-600 mb-3">skincare_enthusiast@email.com</p>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-pink-50 text-pink-700 border-pink-200">
                    Pro Member
                  </Badge>
                  <Badge className="bg-rose-50 text-rose-700 border-rose-200">
                    125 Reviews
                  </Badge>
                </div>
              </div>
              <Button variant="outline" size="sm" className="border-pink-200 text-pink-600 hover:bg-pink-50">
                <Edit className="w-4 h-4" />
              </Button>
            </div>
          </Card>

          {/* Skin Profile */}
          <Card className="p-0 bg-white/70 border-pink-100 overflow-hidden">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1680063122329-69ef93b72c53?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxza2luY2FyZSUyMHJvdXRpbmUlMjBwcm9kdWN0c3xlbnwxfHx8fDE3NjE2MzgxMTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Skin profile"
              className="w-full h-32 object-cover"
            />
            <div className="p-8">
              <h3 className="text-xl mb-6">Skin Profile</h3>
              
              <div className="space-y-6">
                {/* Skin Type */}
                <div>
                  <label className="text-sm mb-3 block text-gray-700">Skin Type</label>
                  <Select value={skinType} onValueChange={setSkinType}>
                    <SelectTrigger className="border-pink-200 focus:border-pink-400">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {skinTypeOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Skin Concerns */}
                <div>
                  <label className="text-sm mb-3 block text-gray-700">Skin Concerns</label>
                  <div className="flex flex-wrap gap-2">
                    {concernOptions.map(concern => (
                      <Badge
                        key={concern}
                        variant={concerns.includes(concern) ? "default" : "outline"}
                        className={`cursor-pointer ${
                          concerns.includes(concern) 
                            ? 'bg-pink-500 text-white hover:bg-pink-600' 
                            : 'text-gray-600 hover:bg-pink-50 border-pink-200'
                        }`}
                        onClick={() => toggleConcern(concern)}
                      >
                        {concern.replace('-', ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Known Allergies */}
                <div>
                  <label className="text-sm mb-3 block text-gray-700">Known Allergies/Sensitivities</label>
                  <div className="flex flex-wrap gap-2">
                    {allergenOptions.map(allergy => (
                      <Badge
                        key={allergy}
                        variant={allergies.includes(allergy) ? "destructive" : "outline"}
                        className={`cursor-pointer ${
                          allergies.includes(allergy) 
                            ? 'bg-red-500 text-white hover:bg-red-600' 
                            : 'text-gray-600 hover:bg-red-50 border-red-200'
                        }`}
                        onClick={() => toggleAllergy(allergy)}
                      >
                        {allergy.replace('-', ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">

          {/* Favorite Products */}
          <Card className="p-0 bg-white/70 border-pink-100 overflow-hidden">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1755196712073-a536f713aa45?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWF1dHklMjBwcm9kdWN0cyUyMHNoZWxmfGVufDF8fHx8MTc2MTY1NDYxMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Favorite products"
              className="w-full h-40 object-cover"
            />
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl">Favorite Products</h3>
                <Heart className="w-6 h-6 text-pink-500" />
              </div>
              
              <div className="space-y-4">
                {favoriteProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-pink-50 rounded-xl border border-pink-100">
                    <div>
                      <h4 className="text-sm text-gray-800">{product.name}</h4>
                      <p className="text-xs text-gray-600">{product.brand}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: product.rating }, (_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Settings */}
          <Card className="p-8 bg-white/70 border-pink-100">
            <h3 className="text-xl mb-6">Settings</h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Bell className="w-5 h-5 text-pink-400" />
                  <div>
                    <p className="text-sm text-gray-800">Push Notifications</p>
                    <p className="text-xs text-gray-500">Get alerts for new product analyses</p>
                  </div>
                </div>
                <Switch checked={notifications} onCheckedChange={setNotifications} />
              </div>

              <div className="flex items-center justify-between cursor-pointer hover:bg-pink-50 -mx-4 px-4 py-2 rounded-lg transition-colors">
                <div className="flex items-center space-x-4">
                  <Shield className="w-5 h-5 text-pink-400" />
                  <div>
                    <p className="text-sm text-gray-800">Data Privacy</p>
                    <p className="text-xs text-gray-500">Manage your data preferences</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>

              <div className="flex items-center justify-between cursor-pointer hover:bg-pink-50 -mx-4 px-4 py-2 rounded-lg transition-colors">
                <div className="flex items-center space-x-4">
                  <User className="w-5 h-5 text-pink-400" />
                  <div>
                    <p className="text-sm text-gray-800">Account Settings</p>
                    <p className="text-xs text-gray-500">Update email, password</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </Card>

          {/* App Info */}
          <Card className="p-6 bg-gradient-to-r from-pink-50 to-rose-50 border-pink-100 text-center">
            <p className="text-sm text-pink-700 mb-1">SKINFO v1.2.0</p>
            <p className="text-xs text-pink-600">Making skincare safer, one ingredient at a time</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
