"use client"

import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Calendar, Clock, TrendingUp, Sparkles, ChevronRight, Info } from "lucide-react"
import type { GuidedPlan } from "@/types/guided-plan"
import { cn } from "@/lib/utils/cn"

interface GuidedPlanViewProps {
  plan: GuidedPlan
  onStartWorkout: (dayIndex: number) => void
  onEditPlan: () => void
}

export function GuidedPlanView({ plan, onStartWorkout, onEditPlan }: GuidedPlanViewProps) {
  const today = new Date().getDay() // 0 = Sunday, 1 = Monday, etc.
  
  // Calculate current day in the plan (0-based index)
  const suggestedDayIndex = today === 0 ? 0 : Math.min(today - 1, plan.weeklySchedule.length - 1)
  
  return (
    <div className="space-y-6">
      {/* Plan Header */}
      <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <h2 className="text-2xl font-bold text-white">{plan.name}</h2>
            </div>
            <p className="text-text-muted text-sm mb-3">{plan.description}</p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-text-secondary">
                <Calendar className="w-4 h-4" />
                <span>Week {plan.currentWeek}</span>
              </div>
              <div className="flex items-center gap-1 text-text-secondary">
                <TrendingUp className="w-4 h-4" />
                <span className="capitalize">{plan.input.experienceLevel}</span>
              </div>
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={onEditPlan}
          >
            Edit Plan
          </Button>
        </div>

        {/* Progression Rules */}
        <div className="bg-white/5 rounded-lg p-4 mt-4">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <div className="text-xs space-y-1">
              <p className="text-white font-medium">Progression Rules:</p>
              <p className="text-text-muted">
                {plan.progressionRules.whenToProgress}. Add <span className="text-primary font-medium">{plan.progressionRules.strengthIncrease} lbs</span> or <span className="text-primary font-medium">{plan.progressionRules.repIncrease} rep</span> when ready.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Today's Suggested Workout */}
      <section>
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Today's Workout
        </h3>
        {plan.weeklySchedule[suggestedDayIndex] && (
          <Card className="p-5 border-l-4 border-l-primary hover:bg-white/5 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h4 className="text-lg font-bold text-white mb-1">
                  {plan.weeklySchedule[suggestedDayIndex].dayName}
                </h4>
                <p className="text-sm text-text-muted mb-2">
                  {plan.weeklySchedule[suggestedDayIndex].focus}
                </p>
                <div className="flex items-center gap-3 text-xs text-text-secondary">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {plan.weeklySchedule[suggestedDayIndex].duration} min
                  </span>
                  <span>•</span>
                  <span>{plan.weeklySchedule[suggestedDayIndex].exercises.length} exercises</span>
                </div>
              </div>
              <Button
                onClick={() => onStartWorkout(suggestedDayIndex)}
                className="bg-primary hover:bg-primary/80"
              >
                Start Now
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>

            {/* Exercise Preview */}
            <div className="space-y-2 mt-4 pt-4 border-t border-white/10">
              {plan.weeklySchedule[suggestedDayIndex].exercises.slice(0, 3).map((exercise, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <span className="text-text-secondary">{idx + 1}. {exercise.name}</span>
                  <span className="text-text-muted font-mono">
                    {exercise.sets} × {exercise.reps || `${exercise.duration}min`}
                  </span>
                </div>
              ))}
              {plan.weeklySchedule[suggestedDayIndex].exercises.length > 3 && (
                <p className="text-xs text-text-muted text-center pt-2">
                  +{plan.weeklySchedule[suggestedDayIndex].exercises.length - 3} more exercises
                </p>
              )}
            </div>
          </Card>
        )}
      </section>

      {/* Full Weekly Schedule */}
      <section>
        <h3 className="text-xl font-bold text-white mb-4">Weekly Schedule</h3>
        <div className="space-y-3">
          {plan.weeklySchedule.map((day, index) => (
            <Card
              key={index}
              className={cn(
                "p-4 cursor-pointer hover:bg-white/5 transition-colors",
                index === suggestedDayIndex && "border-l-4 border-l-primary"
              )}
              onClick={() => onStartWorkout(index)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-bold text-white mb-1">{day.dayName}</h4>
                  <p className="text-xs text-text-muted mb-2">{day.focus}</p>
                  <div className="flex items-center gap-3 text-xs text-text-secondary">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {day.duration} min
                    </span>
                    <span>•</span>
                    <span>{day.exercises.length} exercises</span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-text-muted" />
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}

