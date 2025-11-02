"use client"

import { useEffect, useState } from "react"

export function useAuth() {
  const [userId, setUserId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Try to get user from Supabase auth
        // In a real app with Supabase, this would fetch the actual user
        // For now, generate a consistent demo user ID
        const storedId = localStorage.getItem("userId")
        if (storedId) {
          setUserId(storedId)
        } else {
          // Generate a demo user ID for testing
          const demoId = `demo-user-${Date.now()}`
          localStorage.setItem("userId", demoId)
          setUserId(demoId)
        }
      } catch (error) {
        console.error("[v0] Error fetching user:", error)
        // Use demo user if error
        const demoId = `demo-user-${Date.now()}`
        setUserId(demoId)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [])

  return { userId, isLoading }
}
