"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // ✅ Get the current session from local storage
    const fetchSession = async () => {
      const { data, error } = await supabase.auth.getSession()
      if (error) console.error("Session error:", error)
      setUser(data.session?.user ?? null)
      setIsLoading(false)
    }

    fetchSession()

    // ✅ Listen for login/logout state changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  return { user, isLoading }
}
