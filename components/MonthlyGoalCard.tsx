"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Target, TrendingUp, Zap, Trophy, Edit2, Check, X, Flame, MoreVertical, RotateCcw, Trash2, HelpCircle } from "lucide-react"
import { useMonthlyGoalStore } from "@/lib/stores/monthlyGoalStore"
import { cn } from "@/lib/utils/cn"

export function MonthlyGoalCard() {
  const { currentGoal, isLoading, loadCurrentMonthGoal, setMonthlyGoal, resetProgress, deleteGoal } = useMonthlyGoalStore()
  const [isEditing, setIsEditing] = useState(false)
  const [goalInput, setGoalInput] = useState('')
  const [showCelebration, setShowCelebration] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [showOptions, setShowOptions] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  useEffect(() => {
    setIsClient(true)
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

  if (!isClient || isLoading) {
    return (
      <Card className="p-6">
        <div className="h-32 bg-white/5 rounded-lg animate-pulse"></div>
      </Card>
    )
  }

  // Get current month name
  const monthName = new Date().toLocaleString('default', { month: 'long' })

  // No goal set yet
  if (!currentGoal) {
    return (
      <Card className="bg-gradient-to-br from-primary/10 to-blue-500/10 border-primary/20">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary/20 rounded-xl">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">Monthly Goal</h3>
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowTooltip(!showTooltip)
                    }}
                    className="p-0.5 hover:bg-white/10 rounded transition-colors"
                  >
                    <HelpCircle className="w-4 h-4 text-text-muted hover:text-white" />
                  </button>
                  {showTooltip && (
                    <>
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setShowTooltip(false)}
                      />
                      <div className="absolute left-0 top-full mt-2 w-64 p-3 bg-white rounded-xl shadow-2xl z-20 text-left">
                        <p className="text-xs text-primary font-medium leading-relaxed">
                          Set a monthly goal to track workouts completed in <span className="font-bold">{monthName}</span> (from the 1st to the last day). Your progress updates automatically each time you finish a workout.
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
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
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">{monthName} Goal</h3>
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowTooltip(!showTooltip)
                    }}
                    className="p-0.5 hover:bg-white/10 rounded transition-colors"
                  >
                    <HelpCircle className="w-4 h-4 text-text-muted hover:text-white" />
                  </button>
                  {showTooltip && (
                    <>
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setShowTooltip(false)}
                      />
                      <div className="absolute left-0 top-full mt-2 w-64 p-3 bg-white rounded-xl shadow-2xl z-20 text-left">
                        <p className="text-xs text-primary font-medium leading-relaxed">
                          Your monthly goal tracks workouts completed in <span className="font-bold">{monthName}</span> (from the 1st to the last day). The "Weekly Activity" above shows your last 7 days, which may include workouts from the previous month.
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <p className="text-xs text-text-muted">{getMessage()}</p>
            </div>
          </div>
          
          {!isEditing && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                title="Edit goal"
              >
                <Edit2 className="w-4 h-4 text-text-muted hover:text-white" />
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowOptions(!showOptions)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  title="More options"
                >
                  <MoreVertical className="w-4 h-4 text-text-muted hover:text-white" />
                </button>
                
                {showOptions && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setShowOptions(false)}
                    />
                    <div className="absolute right-0 top-full mt-1 w-48 bg-bg-card border border-white/10 rounded-lg shadow-xl z-20 overflow-hidden">
                      <button
                        onClick={() => {
                          setShowOptions(false)
                          setShowResetConfirm(true)
                        }}
                        className="w-full flex items-center gap-2 px-4 py-3 text-sm text-white hover:bg-white/10 transition-colors"
                      >
                        <RotateCcw className="w-4 h-4 text-blue-400" />
                        <span>Reset Progress</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowOptions(false)
                          setShowDeleteConfirm(true)
                        }}
                        className="w-full flex items-center gap-2 px-4 py-3 text-sm text-error hover:bg-error/10 transition-colors border-t border-white/10"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete Goal</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
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
      
      {/* Reset Progress Confirmation */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <Card className="w-full max-w-sm p-6">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-blue-400/20 flex items-center justify-center mx-auto">
                <RotateCcw className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Reset Progress?</h3>
                <p className="text-sm text-text-muted">
                  This will set your completed workouts back to 0 for this month. Your goal will remain at {currentGoal?.goalWorkouts}.
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="secondary" 
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={async () => {
                    await resetProgress()
                    setShowResetConfirm(false)
                  }}
                  className="flex-1 bg-blue-500 hover:bg-blue-500/80"
                >
                  Reset
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
      
      {/* Delete Goal Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <Card className="w-full max-w-sm p-6">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-error/20 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6 text-error" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Delete Goal?</h3>
                <p className="text-sm text-text-muted">
                  This will permanently delete your {monthName} goal. You can create a new one anytime.
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="secondary" 
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={async () => {
                    await deleteGoal()
                    setShowDeleteConfirm(false)
                  }}
                  className="flex-1 bg-error hover:bg-error/80"
                >
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </Card>
  )
}

