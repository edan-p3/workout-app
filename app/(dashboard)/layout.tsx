"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { BottomTabBar } from "@/components/layout/BottomTabBar"
import { supabase } from "@/lib/supabase/client"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push('/login')
      } else {
        setAuthenticated(true)
      }
      setLoading(false)
    }

    checkAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push('/login')
      } else {
        setAuthenticated(true)
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-bg-primary">
        <div className="text-text-muted">Loading...</div>
      </div>
    )
  }

  if (!authenticated) {
    return null
  }

  return (
    <div className="flex flex-col min-h-screen pb-24">
      <main className="flex-1 px-4 py-6 max-w-lg mx-auto w-full">
        {children}
      </main>
      <BottomTabBar />
    </div>
  );
}

