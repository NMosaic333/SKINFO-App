"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

interface LoginScreenProps {
  onNavigate: (screen: string) => void;
  onLogin: (user: { name: string; email: string }) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onNavigate, onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter(); // ✅ next/navigation for redirect

  // 🔑 Email login
  async function handleEmailLogin(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error("Login error:", error.message);
      alert("Invalid email or password");
      return;
    }

    // ✅ Fetch user profile after login
    try {
      const res = await fetch("/api/user-profile");
      const profileData = await res.json();

      if (profileData.success) {
        onLogin({
          name: profileData.profile.display_name,
          email,
        });
        onNavigate('profile');
      } else {
        console.error("Profile fetch failed:", profileData);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  }

  // 🔐 Google login
  async function handleGoogleLogin() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/profile`, // ✅ redirect to profile after Google login
      },
    });
    if (error) console.error("Google login error:", error.message);
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-gradient-to-br from-pink-50 via-white to-pink-100">
      <div className="bg-white p-10 rounded-3xl shadow-md w-full max-w-md border border-pink-100">
        <h2 className="text-3xl font-semibold text-center text-pink-600 mb-6">Welcome Back</h2>

        {/* ✅ Email form login */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleEmailLogin(email, password);
          }}
          className="space-y-5"
        >
          <div>
            <label className="block text-gray-600 mb-1 text-sm">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1 text-sm">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-full text-lg font-medium transition"
          >
            Log In
          </button>
        </form>

        <div className="my-6 flex items-center">
          <div className="flex-grow h-px bg-pink-200"></div>
          <span className="px-3 text-gray-500 text-sm">OR</span>
          <div className="flex-grow h-px bg-pink-200"></div>
        </div>

        {/* ✅ Google login */}
        <div className="space-y-3">
          <button
            onClick={handleGoogleLogin}
            className="flex items-center justify-center w-full border border-gray-300 rounded-full py-3 text-gray-700 hover:bg-gray-50 transition"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5 mr-2"
            />
            Continue with Google
          </button>
        </div>

        <p className="text-sm text-center text-gray-600 mt-6">
          Don’t have an account?{" "}
          <button
            type="button"
            onClick={() => onNavigate("register")}
            className="text-pink-600 hover:underline"
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
};
