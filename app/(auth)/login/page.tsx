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
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [resetSent, setResetSent] = useState(false)

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

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (resetError) throw resetError

      setResetSent(true)
    } catch (err: any) {
      setError(err.message || "Failed to send reset email")
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
                <h2 className="text-2xl font-bold text-white">
                  {showForgotPassword ? "Reset Password" : "Welcome Back"}
                </h2>
                <p className="text-text-muted text-sm mt-1">
                  {showForgotPassword 
                    ? "Enter your email to receive a reset link" 
                    : "Enter your credentials to continue"}
                </p>
            </div>
        </div>

        {resetSent ? (
          <Card className="p-6 border-white/5 bg-bg-card/50 backdrop-blur text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Check Your Email</h3>
              <p className="text-text-muted text-sm">
                We've sent a password reset link to <span className="text-white font-medium">{email}</span>
              </p>
            </div>
            <Button 
              onClick={() => {
                setShowForgotPassword(false)
                setResetSent(false)
                setEmail("")
              }}
              variant="secondary"
              className="w-full"
            >
              Back to Login
            </Button>
          </Card>
        ) : (
          <form onSubmit={showForgotPassword ? handlePasswordReset : handleLogin}>
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
                
                {!showForgotPassword && (
                  <div className="space-y-2">
                      <label className="text-sm font-medium text-text-secondary ml-1">Password</label>
                      <Input 
                        type="password" 
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => setShowForgotPassword(true)}
                          className="text-xs text-primary hover:text-primary-hover transition-colors"
                        >
                          Forgot password?
                        </button>
                      </div>
                  </div>
                )}
                
                <Button type="submit" className="w-full mt-2" disabled={loading}>
                  {loading 
                    ? (showForgotPassword ? "Sending..." : "Signing in...") 
                    : (showForgotPassword ? "Send Reset Link" : "Sign In")}
                </Button>

                {showForgotPassword && (
                  <Button 
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setShowForgotPassword(false)
                      setError("")
                    }}
                    className="w-full"
                  >
                    Back to Login
                  </Button>
                )}
            </Card>
          </form>
        )}

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

