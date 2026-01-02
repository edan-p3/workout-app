"use client"

import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Sparkles, Zap, Target, TrendingUp } from "lucide-react"

interface WelcomeScreenProps {
  onStartGuided: () => void
  onJumpIn: () => void
}

export function WelcomeScreen({ onStartGuided, onJumpIn }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-bg-primary">
      <div className="w-full max-w-4xl space-y-8 animate-in fade-in duration-500">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-blue-500 shadow-lg shadow-primary/30 mb-4">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
            Ready to Transform?
          </h1>
          <p className="text-xl text-text-muted max-w-2xl mx-auto">
            Choose your path: Get a personalized plan tailored to your goals, or dive right in and track your way.
          </p>
        </div>

        {/* CTAs */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Primary CTA - Guided Plan */}
          <Card 
            onClick={onStartGuided}
            className="p-8 cursor-pointer transition-all hover:scale-105 hover:border-primary bg-gradient-to-br from-bg-card to-primary/5 border-2 border-primary/50 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all" />
            
            <div className="relative z-10 space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20">
                <Target className="w-8 h-8 text-primary" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-bold text-white">Start Guided Plan</h3>
                  <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded-full font-medium">RECOMMENDED</span>
                </div>
                <p className="text-text-muted">
                  Answer a few questions and get a personalized workout program designed for your goals, experience, and schedule.
                </p>
              </div>

              <ul className="space-y-2">
                {[
                  "Tailored to your fitness level",
                  "Smart progression built-in",
                  "Adapts to your equipment",
                  "Weekly schedule included"
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-text-secondary">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button className="w-full bg-primary hover:bg-primary/80 text-white font-bold group-hover:scale-105 transition-transform">
                Get My Plan
                <Sparkles className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>

          {/* Secondary CTA - Manual Tracking */}
          <Card 
            onClick={onJumpIn}
            className="p-8 cursor-pointer transition-all hover:scale-105 hover:border-accent-blue bg-gradient-to-br from-bg-card to-bg-card/50 border border-white/10 group"
          >
            <div className="space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5">
                <Zap className="w-8 h-8 text-accent-blue" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white">Jump In</h3>
                <p className="text-text-muted">
                  Already know what you're doing? Start tracking your workouts right away with complete flexibility.
                </p>
              </div>

              <ul className="space-y-2">
                {[
                  "Track any workout instantly",
                  "Complete freedom",
                  "Pre-loaded templates available",
                  "Perfect for experienced lifters"
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-text-secondary">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-blue" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button variant="secondary" className="w-full group-hover:bg-white/10 transition-colors">
                Manual Tracking
                <TrendingUp className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>
        </div>

        {/* Footer Note */}
        <p className="text-center text-xs text-text-muted">
          Don't worry - you can always switch between guided and manual tracking later
        </p>
      </div>
    </div>
  )
}

