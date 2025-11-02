import React, { useState } from "react";
import { RegisterScreen } from "./RegisterScreen";

interface LoginScreenProps {
  onNavigate: (screen: string) => void;
  onLogin: (user: { name: string; email: string }) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onNavigate, onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Normally you'd verify credentials here
    onLogin({ name: "User", email });
    alert("Login successful!");
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-gradient-to-br from-pink-50 via-white to-pink-100">
      <div className="bg-white p-10 rounded-3xl shadow-md w-full max-w-md border border-pink-100">
        <h2 className="text-3xl font-semibold text-center text-pink-600 mb-6">Welcome Back</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
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

          <p className="text-sm text-center text-gray-600 mt-3">
            Don’t have an account?{" "}
            <button
              type="button"
              onClick={() => onNavigate("register")}
              className="text-pink-600 hover:underline"
            >
              Register
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};
