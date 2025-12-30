"use client"

import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card } from "@/components/ui/Card"
import { Dumbbell } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-bg-primary">
      <div className="w-full max-w-sm space-y-8 animate-in fade-in duration-500">
        
        <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-blue-500 shadow-lg mb-4">
                <Dumbbell className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-heading font-bold text-white">Welcome Back</h1>
            <p className="text-text-muted">Enter your credentials to continue</p>
        </div>

        <Card className="space-y-4 p-6 border-white/5 bg-bg-card/50 backdrop-blur">
            <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary ml-1">Email</label>
                <Input type="email" placeholder="you@example.com" />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary ml-1">Password</label>
                <Input type="password" placeholder="••••••••" />
            </div>
            
            <Button className="w-full mt-2">Sign In</Button>
        </Card>

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

