"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase"; // make sure you’ve set this up

interface AuthContextType {
  user: any;
  userId: string | null;
  loading: boolean;
  setUser: React.Dispatch<React.SetStateAction<any>>;
  setUserId: React.Dispatch<React.SetStateAction<string | null>>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🔹 Check current session on mount
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) console.error("Error fetching session:", error);

      if (data?.session?.user) {
        setUser(data.session.user);
        setUserId(data.session.user.id);
      } else {
        setUser(null);
        setUserId(null);
      }
      setLoading(false);
    };

    getSession();

    // 🔹 Listen for login/logout changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        setUserId(session.user.id);
      } else {
        setUser(null);
        setUserId(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, userId, loading, setUser, setUserId }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
