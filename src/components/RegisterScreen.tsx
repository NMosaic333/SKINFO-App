import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, User } from "lucide-react";

interface RegisterScreenProps {
  onNavigate: (screen: string) => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ onNavigate }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Account created successfully! You can now log in.");
    onNavigate("login");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-pink-100 overflow-hidden">
      {/* Decorative shapes */}
      <div className="absolute top-10 left-10 w-36 h-36 bg-pink-200 opacity-30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-pink-300 opacity-30 rounded-full blur-2xl"></div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white/90 backdrop-blur-md p-10 rounded-3xl shadow-lg border border-pink-100 w-full max-w-md"
      >
        <h2 className="text-3xl font-semibold text-center text-pink-600 mb-2">
          Create Your Account
        </h2>
        <p className="text-sm text-center text-gray-500 mb-8">
          Join our community and explore your personalized space.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-600 mb-1 text-sm">Full Name</label>
            <div className="flex items-center border border-pink-200 rounded-lg p-3 focus-within:ring-2 focus-within:ring-pink-400">
              <User className="text-pink-400 mr-2 w-5 h-5" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 bg-transparent focus:outline-none text-gray-700"
                placeholder="Your name"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-600 mb-1 text-sm">Email</label>
            <div className="flex items-center border border-pink-200 rounded-lg p-3 focus-within:ring-2 focus-within:ring-pink-400">
              <Mail className="text-pink-400 mr-2 w-5 h-5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-transparent focus:outline-none text-gray-700"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-600 mb-1 text-sm">Password</label>
            <div className="flex items-center border border-pink-200 rounded-lg p-3 focus-within:ring-2 focus-within:ring-pink-400">
              <Lock className="text-pink-400 mr-2 w-5 h-5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 bg-transparent focus:outline-none text-gray-700"
                placeholder="••••••••"
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-3 rounded-full text-lg font-medium shadow-md transition"
          >
            Create Account
          </motion.button>

          <p className="text-xs text-center text-gray-500 mt-3">
            By registering, you agree to our{" "}
            <span className="text-pink-600 hover:underline cursor-pointer">
              Terms & Privacy
            </span>
            .
          </p>

          <p className="text-sm text-center text-gray-600 mt-3">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => onNavigate("login")}
              className="text-pink-600 hover:underline"
            >
              Log in
            </button>
          </p>
        </form>
      </motion.div>
    </div>
  );
};
