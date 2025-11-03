"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
  ArrowLeft, Settings, Bell, Shield, Heart, Star, ChevronRight,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import type { Screen, SkinProfile } from "../App";

interface ProfileScreenProps {
  onNavigate: (screen: Screen) => void;
}

export function ProfileScreen({ onNavigate }: ProfileScreenProps) {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState(true);
  // Skin type, concerns, and allergy options
  const skinTypeOptions = [
    { value: "dry", label: "Dry" },
    { value: "oily", label: "Oily" },
    { value: "combination", label: "Combination" },
    { value: "normal", label: "Normal" },
    { value: "sensitive", label: "Sensitive" },
  ];

  const concernOptions = [
    "acne",
    "dark-spots",
    "wrinkles",
    "dullness",
    "redness",
    "clogged-pores",
    "uneven-texture",
  ];

  const allergenOptions = [
    "fragrance",
    "alcohol",
    "parabens",
    "silicones",
    "sulfates",
    "essential-oils",
  ];

  // Functions for toggling concerns & allergies
  function toggleConcern(c: string) {
    setProfile((prev: any) => {
      if (!prev) return prev;
      const updatedConcerns = prev.concerns.includes(c)
        ? prev.concerns.filter((x: string) => x !== c)
        : [...prev.concerns, c];
      updateProfile({ concerns: updatedConcerns });
      return { ...prev, concerns: updatedConcerns };
    });
  }

  function toggleAllergy(a: string) {
    setProfile((prev: any) => {
      if (!prev) return prev;
      const updatedAllergies = prev.sensitivities.includes(a)
        ? prev.sensitivities.filter((x: string) => x !== a)
        : [...prev.sensitivities, a];
      updateProfile({ sensitivities: updatedAllergies });
      return { ...prev, sensitivities: updatedAllergies };
    });
  }

  // Example favorites (you can later fetch this dynamically)
  const favoriteProducts = [
    { name: "Hydrating Gel Cleanser", brand: "CeraVe", rating: 5 },
    { name: "Niacinamide Serum 10%", brand: "The Ordinary", rating: 4 },
    { name: "Sunscreen SPF 50+", brand: "La Shield", rating: 5 },
  ];


  useEffect(() => {
    async function fetchProfile() {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const token = sessionData?.session?.access_token;

        if (!token) {
          console.warn("⚠️ No active session found");
          setLoading(false);
          return;
        }

        const res = await fetch("/api/user-profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);

        const data = await res.json();
        const p = data.profile;

        setProfile({
          name: p.display_name || "User",
          email: p.email || "No email",
          skinType: p.skin_type || "",
          concerns: p.skin_concerns || [],
          sensitivities: p.sensitivities || [],
          age: p.age || "",
          routine: p.routine || "",
          climate: p.climate || "",
        });
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  async function updateProfile(updated: Partial<SkinProfile>) {
    if (!profile) return;
    const newProfile = { ...profile, ...updated };
    setProfile(newProfile);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;
      if (!token) return;

      await fetch("/api/user-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          display_name: newProfile.name,
          email: newProfile.email,
          skin_type: newProfile.skinType,
          skin_concerns: newProfile.concerns,
          sensitivities: newProfile.sensitivities,
        }),
      });
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  }

  if (loading) return <div className="text-center text-pink-600 mt-20">Loading profile...</div>;
  if (!profile) return <div className="text-center text-pink-600 mt-20">No profile found</div>;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
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
          <Card className="p-8 bg-white/70 border-pink-100">
            <div className="flex items-center space-x-6">
              <Avatar className="w-20 h-20">
                <AvatarFallback className="bg-gradient-to-br from-pink-100 to-rose-100 text-pink-700 text-2xl">
                  {profile.name[0]?.toUpperCase() ?? "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-xl mb-1">{profile.name}</h2>
                <p className="text-gray-600 mb-3">{profile.email}</p>
                <Badge className="bg-pink-50 text-pink-700 border-pink-200">Pro Member</Badge>
              </div>
            </div>
          </Card>

          {/* (rest of your cards remain unchanged) */}
          {/* Skin Profile */}
          <Card className="p-0 bg-white/70 border-pink-100 overflow-hidden">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1680063122329-69ef93b72c53?auto=format&fit=crop&w=1080&q=80"
              alt="Skin profile"
              className="w-full h-32 object-cover"
            />
            <div className="p-8">
              <h3 className="text-xl mb-6">Skin Profile</h3>

              {/* Skin Type */}
              <div className="mb-6">
                <label className="text-sm mb-3 block text-gray-700">Skin Type</label>
                <Select value={profile?.skinType} onValueChange={(v) => updateProfile({ skinType: v })}>
                  <SelectTrigger className="border-pink-200 focus:border-pink-400">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {skinTypeOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Concerns */}
              <div className="mb-6">
                <label className="text-sm mb-3 block text-gray-700">Skin Concerns</label>
                <div className="flex flex-wrap gap-2">
                  {concernOptions.map((c) => (
                    <Badge
                      key={c}
                      variant={profile?.concerns.includes(c) ? "default" : "outline"}
                      className={`cursor-pointer ${
                        profile?.concerns.includes(c)
                          ? "bg-pink-500 text-white hover:bg-pink-600"
                          : "text-gray-600 hover:bg-pink-50 border-pink-200"
                      }`}
                      onClick={() => toggleConcern(c)}
                    >
                      {c.replace("-", " ")}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Allergies */}
              <div>
                <label className="text-sm mb-3 block text-gray-700">Allergies/Sensitivities</label>
                <div className="flex flex-wrap gap-2">
                  {allergenOptions.map((a) => (
                    <Badge
                      key={a}
                      variant={profile?.sensitivities.includes(a) ? "destructive" : "outline"}
                      className={`cursor-pointer ${
                        profile?.sensitivities.includes(a)
                          ? "bg-red-500 text-white hover:bg-red-600"
                          : "text-gray-600 hover:bg-red-50 border-red-200"
                      }`}
                      onClick={() => toggleAllergy(a)}
                    >
                      {a.replace("-", " ")}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Favorites */}
          <Card className="p-0 bg-white/70 border-pink-100 overflow-hidden">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1755196712073-a536f713aa45?auto=format&fit=crop&w=1080&q=80"
              alt="Favorite products"
              className="w-full h-40 object-cover"
            />
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl">Favorite Products</h3>
                <Heart className="w-6 h-6 text-pink-500" />
              </div>
              {favoriteProducts.map((p, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 bg-pink-50 rounded-xl border border-pink-100 mb-2"
                >
                  <div>
                    <h4 className="text-sm text-gray-800">{p.name}</h4>
                    <p className="text-xs text-gray-600">{p.brand}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: p.rating }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 text-yellow-500 fill-current" />
                    ))}
                  </div>
                </div>
              ))}
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
