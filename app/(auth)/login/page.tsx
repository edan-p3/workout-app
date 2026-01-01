"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card } from "@/components/ui/Card"
import { Dumbbell } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    // Check if already logged in
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.push('/')
      }
    }
    checkAuth()
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) throw authError

      // Redirect to dashboard on success
      router.push("/")
      router.refresh()
    } catch (err: any) {
      setError(err.message || "Failed to sign in")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-bg-primary">
      <div className="w-full max-w-sm space-y-8 animate-in fade-in duration-500">
        
        <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-blue-500 shadow-lg shadow-primary/30 mb-4">
                <Dumbbell className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-heading font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                Rep It!
            </h1>
            <p className="text-text-secondary text-sm font-medium">Every Rep Counts</p>
            <div className="pt-4">
                <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
                <p className="text-text-muted text-sm mt-1">Enter your credentials to continue</p>
            </div>
        </div>

        <form onSubmit={handleLogin}>
          <Card className="space-y-4 p-6 border-white/5 bg-bg-card/50 backdrop-blur">
              {error && (
                <div className="p-3 rounded-lg bg-error/10 border border-error/20 text-error text-sm">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                  <label className="text-sm font-medium text-text-secondary ml-1">Email</label>
                  <Input 
                    type="email" 
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
              </div>
              <div className="space-y-2">
                  <label className="text-sm font-medium text-text-secondary ml-1">Password</label>
                  <Input 
                    type="password" 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
              </div>
              
              <Button type="submit" className="w-full mt-2" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>
          </Card>
        </form>

        <p className="text-center text-sm text-text-muted">
            Don't have an account?{" "}
            <Link href="/signup" className="text-primary hover:text-primary-hover font-semibold transition-colors">
                Sign up
            </Link>
        </p>
      </div>
    </div>
  )
}

