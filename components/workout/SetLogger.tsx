"use client"

import { Check, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils/cn"
import { Input } from "@/components/ui/Input"
import { useWorkoutStore, type Set } from "@/lib/stores/workoutStore"

interface SetLoggerProps {
  exerciseId: string
  set: Set
  index: number
  exerciseCategory?: string
}

export function SetLogger({ exerciseId, set, index, exerciseCategory }: SetLoggerProps) {
  const updateSet = useWorkoutStore(state => state.updateSet)
  const completeSet = useWorkoutStore(state => state.completeSet)

  // Check if this is a time-based exercise (Cardio, Pilates, Yoga, HIIT)
  const isTimeBased = exerciseCategory && ['Cardio', 'Sports'].includes(exerciseCategory)

  if (isTimeBased) {
    // Duration-based UI for cardio/sports
    return (
      <div className={cn(
        "grid grid-cols-[auto_1fr_auto] gap-3 items-center py-2",
        set.completed && "opacity-50"
      )}>
        <div className="w-8 text-center text-text-muted font-mono text-sm">
          {index + 1}
        </div>
        
        <div className="relative">
          <Input
            type="number"
            value={set.duration || ''}
            placeholder="0"
            onChange={(e) => updateSet(exerciseId, set.id, { duration: Number(e.target.value) })}
            className="text-center font-mono h-10 bg-bg-card border-none ring-1 ring-white/5 focus:ring-primary text-primary"
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-text-muted pointer-events-none">
            min
          </span>
        </div>

        <button
          onClick={() => completeSet(exerciseId, set.id)}
          className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center transition-all",
            set.completed 
              ? "bg-success text-bg-primary" 
              : "bg-bg-card text-text-muted hover:bg-white/5"
          )}
        >
          <Check className="w-5 h-5" />
        </button>
      </div>
    )
  }

  // Standard weight/reps UI for strength training
  return (
    <div className={cn(
      "grid grid-cols-[auto_1fr_1fr_auto] gap-3 items-center py-2",
      set.completed && "opacity-50"
    )}>
      <div className="w-8 text-center text-text-muted font-mono text-sm">
        {index + 1}
      </div>
      
      <div className="relative">
        <Input
          type="number"
          value={set.weight || ''}
          placeholder="0"
          onChange={(e) => updateSet(exerciseId, set.id, { weight: Number(e.target.value) })}
          className="text-center font-mono h-10 bg-bg-card border-none ring-1 ring-white/5 focus:ring-primary text-primary"
        />
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-text-muted pointer-events-none">
          lbs
        </span>
      </div>

      <div className="relative">
        <Input
          type="number"
          value={set.reps || ''}
          placeholder="0"
          onChange={(e) => updateSet(exerciseId, set.id, { reps: Number(e.target.value) })}
          className="text-center font-mono h-10 bg-bg-card border-none ring-1 ring-white/5 focus:ring-primary text-primary"
        />
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-text-muted pointer-events-none">
          reps
        </span>
      </div>

      <button
        onClick={() => completeSet(exerciseId, set.id)}
        className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center transition-all",
          set.completed 
            ? "bg-success text-bg-primary" 
            : "bg-bg-card text-text-muted hover:bg-white/5"
        )}
      >
        <Check className="w-5 h-5" />
      </button>
    </div>
  )
}

