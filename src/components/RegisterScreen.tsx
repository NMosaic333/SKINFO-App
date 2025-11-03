"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface RegisterScreenProps {
  onNavigate: (screen: string) => void;
  onRegister: (user: { name: string; email: string }) => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ onNavigate, onRegister }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });

    if (error) {
      console.error(error);
      alert("Registration failed. Try again.");
      return;
    }

    // ✅ Create default profile entry in your Supabase table
    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch("/api/profile", {
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    });

    const profileData = await res.json();

    if (profileData.success) {
      onRegister({ name: name || profileData.profile.display_name, email });
    } else {
      alert("Registered, but could not load profile.");
    }
  }

  async function handleGoogleRegister() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) console.error(error);
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-gradient-to-br from-pink-50 via-white to-pink-100">
      <div className="bg-white p-10 rounded-3xl shadow-md w-full max-w-md border border-pink-100">
        <h2 className="text-3xl font-semibold text-center text-pink-600 mb-6">Create an Account</h2>

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-gray-600 mb-1 text-sm">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none"
              placeholder="Sarah Johnson"
            />
          </div>

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
            Register
          </button>
        </form>

        <div className="my-6 flex items-center">
          <div className="flex-grow h-px bg-pink-200"></div>
          <span className="px-3 text-gray-500 text-sm">OR</span>
          <div className="flex-grow h-px bg-pink-200"></div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleGoogleRegister}
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
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => onNavigate("login")}
            className="text-pink-600 hover:underline"
          >
            Log In
          </button>
        </p>
      </div>
    </div>
  );
};
