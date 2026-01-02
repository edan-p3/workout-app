"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Target, TrendingUp, Zap, Trophy, Edit2, Check, X, Flame } from "lucide-react"
import { useMonthlyGoalStore } from "@/lib/stores/monthlyGoalStore"
import { cn } from "@/lib/utils/cn"

export function MonthlyGoalCard() {
  const { currentGoal, isLoading, loadCurrentMonthGoal, setMonthlyGoal } = useMonthlyGoalStore()
  const [isEditing, setIsEditing] = useState(false)
  const [goalInput, setGoalInput] = useState('')
  const [showCelebration, setShowCelebration] = useState(false)

  useEffect(() => {
    loadCurrentMonthGoal()
  }, [])

  useEffect(() => {
    if (currentGoal && goalInput === '') {
      setGoalInput(currentGoal.goalWorkouts.toString())
    }
  }, [currentGoal])

  // Check for milestone achievements
  useEffect(() => {
    if (currentGoal && currentGoal.completedWorkouts > 0) {
      const progress = (currentGoal.completedWorkouts / currentGoal.goalWorkouts) * 100
      const milestones = [25, 50, 75, 100]
      
      // Check if we just hit a milestone
      if (milestones.includes(Math.floor(progress))) {
        setShowCelebration(true)
        setTimeout(() => setShowCelebration(false), 3000)
      }
    }
  }, [currentGoal?.completedWorkouts])

  const handleSaveGoal = async () => {
    const goal = parseInt(goalInput)
    if (goal > 0 && goal <= 100) {
      await setMonthlyGoal(goal)
      setIsEditing(false)
    }
  }

  if (isLoading) {
    return (
      <Card className="p-6 animate-pulse">
        <div className="h-32 bg-white/5 rounded-lg"></div>
      </Card>
    )
  }

  // No goal set yet
  if (!currentGoal) {
    return (
      <Card className="bg-gradient-to-br from-primary/10 to-blue-500/10 border-primary/20">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary/20 rounded-xl">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Monthly Goal</h3>
              <p className="text-xs text-text-muted">Set your workout target</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min="1"
              max="100"
              placeholder="e.g., 12"
              value={goalInput}
              onChange={(e) => setGoalInput(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={handleSaveGoal}
              disabled={!goalInput || parseInt(goalInput) <= 0}
              className="bg-primary hover:bg-primary/80"
            >
              Set Goal
            </Button>
          </div>
        </div>
      </Card>
    )
  }

  const progress = (currentGoal.completedWorkouts / currentGoal.goalWorkouts) * 100
  const remaining = Math.max(0, currentGoal.goalWorkouts - currentGoal.completedWorkouts)
  const isComplete = currentGoal.completedWorkouts >= currentGoal.goalWorkouts
  const isOverachieving = currentGoal.completedWorkouts > currentGoal.goalWorkouts

  // Get motivational message based on progress
  const getMessage = () => {
    if (isOverachieving) return "🔥 Crushing it! You've exceeded your goal!"
    if (isComplete) return "🎉 Goal achieved! You're unstoppable!"
    if (progress >= 75) return "💪 Almost there! Keep pushing!"
    if (progress >= 50) return "🚀 Halfway done! Keep it up!"
    if (progress >= 25) return "⚡ Great start! Stay consistent!"
    if (currentGoal.completedWorkouts > 0) return "👏 First workout done! You got this!"
    return "🎯 Time to start crushing your goal!"
  }

  // Get current month name
  const monthName = new Date().toLocaleString('default', { month: 'long' })

  return (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-300",
      isComplete 
        ? "bg-gradient-to-br from-success/10 to-green-500/10 border-success/30" 
        : "bg-gradient-to-br from-primary/10 to-blue-500/10 border-primary/20"
    )}>
      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-primary/20 to-success/20 flex items-center justify-center animate-in fade-in zoom-in duration-500">
          <div className="text-center">
            <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-2 animate-bounce" />
            <p className="text-xl font-bold text-white">Milestone Unlocked!</p>
          </div>
        </div>
      )}

      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-3 rounded-xl",
              isComplete ? "bg-success/20" : "bg-primary/20"
            )}>
              {isComplete ? (
                <Trophy className="w-6 h-6 text-success" />
              ) : (
                <Target className="w-6 h-6 text-primary" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{monthName} Goal</h3>
              <p className="text-xs text-text-muted">{getMessage()}</p>
            </div>
          </div>
          
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Edit2 className="w-4 h-4 text-text-muted hover:text-white" />
            </button>
          )}
        </div>

        {/* Edit Mode */}
        {isEditing ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min="1"
                max="100"
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value)}
                className="flex-1"
                placeholder="New goal"
              />
              <Button
                size="sm"
                onClick={handleSaveGoal}
                disabled={!goalInput || parseInt(goalInput) <= 0}
                className="bg-success hover:bg-success/80"
              >
                <Check className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setIsEditing(false)
                  setGoalInput(currentGoal.goalWorkouts.toString())
                }}
                className="hover:bg-error/10 text-error"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-6">
            {/* Circular Progress */}
            <div className="relative">
              <svg className="w-32 h-32 -rotate-90">
                {/* Background circle */}
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-white/10"
                />
                {/* Progress circle */}
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - Math.min(progress, 100) / 100)}`}
                  className={cn(
                    "transition-all duration-1000 ease-out",
                    isComplete ? "text-success" : "text-primary"
                  )}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-3xl font-bold text-white font-mono">
                  {currentGoal.completedWorkouts}
                </p>
                <p className="text-xs text-text-muted">
                  / {currentGoal.goalWorkouts}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex-1 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Progress</span>
                <span className={cn(
                  "text-lg font-bold font-mono",
                  isComplete ? "text-success" : "text-primary"
                )}>
                  {Math.min(Math.round(progress), 100)}%
                </span>
              </div>
              
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full transition-all duration-1000 ease-out rounded-full",
                    isComplete 
                      ? "bg-gradient-to-r from-success to-green-400" 
                      : "bg-gradient-to-r from-primary to-blue-400"
                  )}
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
              
              {!isComplete && remaining > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <Flame className="w-4 h-4 text-orange-400" />
                  <span className="text-text-secondary">
                    <span className="font-bold text-white">{remaining}</span> workout{remaining !== 1 ? 's' : ''} to go
                  </span>
                </div>
              )}
              
              {isOverachieving && (
                <div className="flex items-center gap-2 text-sm bg-success/20 px-3 py-1.5 rounded-lg">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-success font-medium">
                    +{currentGoal.completedWorkouts - currentGoal.goalWorkouts} bonus!
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}

