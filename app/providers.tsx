"use client"

import { AuthProvider } from "@/app/context/AuthContext"
import { Analytics } from "@vercel/analytics/next"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <Analytics />
    </AuthProvider>
  )
}
