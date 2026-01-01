"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { TrendingUp, Dumbbell, Calendar, Trophy, Plus, ArrowRight, HelpCircle } from "lucide-react"
import { useWorkoutStore } from "@/lib/stores/workoutStore"

export default function DashboardPage() {
  const { history } = useWorkoutStore()
  const [isClient, setIsClient] = useState(false)
  const [showTooltip, setShowTooltip] = useState<string | null>(null)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return null

  // Calculate Stats
  const now = new Date()
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  
  const weeklyWorkouts = history.filter(w => new Date(w.endTime) > oneWeekAgo)
  const weeklyVolume = weeklyWorkouts.reduce((acc, w) => acc + w.totalVolume, 0)
  const weeklyDurationMs = weeklyWorkouts.reduce((acc, w) => acc + w.durationMs, 0)
  const weeklyDurationMinutes = Math.round(weeklyDurationMs / 1000 / 60)

  // Current Streak (Mock logic for now, real logic needs continuous dates)
  const currentStreak = weeklyWorkouts.length > 0 ? weeklyWorkouts.length : 0 

  const tooltips = {
    workouts: "Number of workout sessions completed in the last 7 days",
    volume: "Total weight lifted (weight × reps × sets) across all strength exercises",
    time: "Total minutes spent exercising across all workouts",
    weight: "Your current body weight and change since last measurement"
  }

  const InfoIcon = ({ type }: { type: keyof typeof tooltips }) => (
    <div className="relative inline-block">
      <button
        onClick={() => setShowTooltip(showTooltip === type ? null : type)}
        className="ml-1 text-text-muted hover:text-primary transition-colors"
      >
        <HelpCircle className="w-3 h-3" />
      </button>
      {showTooltip === type && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowTooltip(null)}
          />
          <div className="absolute left-0 top-full mt-1 z-50 w-48 p-2 bg-bg-card border border-primary/20 rounded-lg shadow-lg text-xs text-white animate-in fade-in zoom-in-95 duration-200">
            {tooltips[type]}
          </div>
        </>
      )}
    </div>
  ) 

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Hero / Streak */}
      <section className="text-center py-6">
        <p className="text-text-muted uppercase text-xs tracking-widest mb-2 font-medium">
          Weekly Activity
        </p>
        <div className="inline-flex items-baseline justify-center">
          <h1 className="text-8xl font-bold font-mono bg-gradient-to-r from-primary via-blue-500 to-primary bg-clip-text text-transparent animate-pulse-slow bg-[length:200%_auto]">
            {currentStreak}
          </h1>
          <span className="text-text-secondary ml-2 font-medium">workouts</span>
        </div>
      </section>

      {/* Weekly Summary */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-heading font-bold text-white">Weekly Summary</h2>
          <span className="text-xs text-text-muted">Last 7 Days</span>
        </div>
        <Card className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-text-muted text-xs uppercase flex items-center">
              Workouts
              <InfoIcon type="workouts" />
            </p>
            <p className="text-2xl font-mono font-bold">{weeklyWorkouts.length}<span className="text-text-muted text-sm font-normal"> sessions</span></p>
          </div>
          <div className="space-y-1">
            <p className="text-text-muted text-xs uppercase flex items-center">
              Volume
              <InfoIcon type="volume" />
            </p>
            <div className="flex items-center gap-1">
              <p className="text-2xl font-mono font-bold">{(weeklyVolume / 1000).toFixed(1)}k</p>
              <TrendingUp className="w-4 h-4 text-success" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-text-muted text-xs uppercase flex items-center">
              Time
              <InfoIcon type="time" />
            </p>
            <p className="text-2xl font-mono font-bold">{weeklyDurationMinutes}<span className="text-sm text-text-muted font-sans">m</span></p>
          </div>
          <Link href="/measurements" className="space-y-1 hover:opacity-80 transition-opacity">
            <p className="text-text-muted text-xs uppercase flex items-center">
              Weight
              <InfoIcon type="weight" />
            </p>
            <div className="flex items-center gap-1">
              <p className="text-2xl font-mono font-bold">185</p>
              <span className="text-xs text-success bg-success/10 px-1.5 py-0.5 rounded">-1.2</span>
            </div>
          </Link>
        </Card>
      </section>

      {/* Quick Actions (Replaced old Quick Start) */}
      <section>
        <h2 className="text-xl font-heading font-bold text-white mb-4">Actions</h2>
        <div className="grid grid-cols-1 gap-3">
             <Link href="/log">
                <Button className="w-full py-6 flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-full">
                            <Plus className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-left">
                            <p className="font-bold">Log Workout</p>
                            <p className="text-xs text-white/80">Start a new session</p>
                        </div>
                    </div>
                    <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0" />
                </Button>
             </Link>
        </div>
      </section>

      {/* Recent Activity */}
      <section>
        <h2 className="text-xl font-heading font-bold text-white mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-accent-blue" />
          Recent Activity
        </h2>
        
        {history.length === 0 ? (
            <div className="text-center py-8 bg-white/5 rounded-xl border border-dashed border-white/10">
                <p className="text-text-muted">No workouts yet. Go lift!</p>
            </div>
        ) : (
             <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
                {history.slice(0, 5).map((workout) => (
                    <Card key={workout.id} className="min-w-[160px] p-4 bg-gradient-to-br from-gray-900 to-gray-800 border-l-2 border-l-accent-blue">
                        <p className="text-xs text-text-muted mb-1">{new Date(workout.endTime).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric'})}</p>
                        <p className="text-lg font-bold text-white truncate max-w-[140px]">{workout.name}</p>
                        <p className="text-xs text-text-secondary mt-1">{workout.exercises.length} Exercises</p>
                    </Card>
                ))}
            </div>
        )}
      </section>
    </div>
  )
}
