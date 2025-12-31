"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card } from "@/components/ui/Card"
import { Dumbbell } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

export default function SignupPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState("")
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

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      if (authError) throw authError

      if (authData.user) {
        // Create user profile with default settings
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            email: authData.user.email!,
            settings: {
              units: 'lbs',
              restTimer: 90,
              theme: 'dark',
              full_name: fullName,
            },
          })

        if (profileError) throw profileError

        // Initialize gamification data
        const { error: gamificationError } = await supabase
          .from('gamification_data')
          .insert({
            user_id: authData.user.id,
            total_points: 0,
            current_streak: 0,
            longest_streak: 0,
            total_workouts: 0,
          })

        if (gamificationError) throw gamificationError

        // Redirect to dashboard
        router.push("/")
        router.refresh()
      }
    } catch (err: any) {
      setError(err.message || "Failed to create account")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-bg-primary">
      <div className="w-full max-w-sm space-y-8 animate-in fade-in duration-500">
        
        <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-blue-500 shadow-lg mb-4">
                <Dumbbell className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-heading font-bold text-white">Create Account</h1>
            <p className="text-text-muted">Start your fitness journey today</p>
        </div>

        <form onSubmit={handleSignup}>
          <Card className="space-y-4 p-6 border-white/5 bg-bg-card/50 backdrop-blur">
              {error && (
                <div className="p-3 rounded-lg bg-error/10 border border-error/20 text-error text-sm">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                  <label className="text-sm font-medium text-text-secondary ml-1">Full Name</label>
                  <Input 
                    type="text" 
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
              </div>
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
                    minLength={6}
                  />
              </div>
              
              <Button type="submit" className="w-full mt-2" disabled={loading}>
                {loading ? "Creating account..." : "Sign Up"}
              </Button>
          </Card>
        </form>

        <p className="text-center text-sm text-text-muted">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:text-primary-hover font-semibold transition-colors">
                Sign in
            </Link>
        </p>
      </div>
    </div>
  )
}

