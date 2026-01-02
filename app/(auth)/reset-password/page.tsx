"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card } from "@/components/ui/Card"
import { Dumbbell } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      setLoading(false)
      return
    }

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      })

      if (updateError) throw updateError

      setSuccess(true)
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } catch (err: any) {
      setError(err.message || "Failed to reset password")
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
                <h2 className="text-2xl font-bold text-white">Set New Password</h2>
                <p className="text-text-muted text-sm mt-1">Choose a strong password for your account</p>
            </div>
        </div>

        {success ? (
          <Card className="p-6 border-white/5 bg-bg-card/50 backdrop-blur text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Password Updated!</h3>
              <p className="text-text-muted text-sm">
                Your password has been successfully reset. Redirecting to login...
              </p>
            </div>
          </Card>
        ) : (
          <form onSubmit={handleResetPassword}>
            <Card className="space-y-4 p-6 border-white/5 bg-bg-card/50 backdrop-blur">
                {error && (
                  <div className="p-3 rounded-lg bg-error/10 border border-error/20 text-error text-sm">
                    {error}
                  </div>
                )}
                
                <div className="space-y-2">
                    <label className="text-sm font-medium text-text-secondary ml-1">New Password</label>
                    <Input 
                      type="password" 
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-text-secondary ml-1">Confirm Password</label>
                    <Input 
                      type="password" 
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                </div>
                
                <Button type="submit" className="w-full mt-2" disabled={loading}>
                  {loading ? "Updating..." : "Update Password"}
                </Button>
            </Card>
          </form>
        )}

        <p className="text-center text-sm text-text-muted">
            Remember your password?{" "}
            <a href="/login" className="text-primary hover:text-primary-hover font-semibold transition-colors">
                Back to Login
            </a>
        </p>
      </div>
    </div>
  )
}

