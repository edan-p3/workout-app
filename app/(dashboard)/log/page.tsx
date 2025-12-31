"use client"

import { useEffect, useState } from "react"
import { useWorkoutStore } from "@/lib/stores/workoutStore"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Plus, Timer, ChevronRight, CheckCircle2 } from "lucide-react"
import { SetLogger } from "@/components/workout/SetLogger"
import { calculateVolume } from "@/lib/utils/calculations"
import { cn } from "@/lib/utils/cn"
import { WorkoutStarter } from "@/components/workout/WorkoutStarter"
import { ExerciseSelector } from "@/components/workout/ExerciseSelector"
import { useRouter } from "next/navigation"

export default function LogWorkoutPage() {
  const router = useRouter()
  const { activeWorkout, startWorkout, addExercise, removeExercise, addSet, finishWorkout } = useWorkoutStore()
  const [isClient, setIsClient] = useState(false)
  const [showExerciseSelector, setShowExerciseSelector] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return null

  // 1. No active workout -> Show Starter Selection
  if (!activeWorkout) {
    return <WorkoutStarter onStart={(type) => startWorkout(type)} />
  }

  const totalVolume = activeWorkout.exercises.reduce((acc, ex) => acc + calculateVolume(ex.sets), 0)

  const handleFinish = () => {
    finishWorkout()
    router.push('/') // Redirect to stats/dashboard after finish
  }

  // 2. Active Workout View
  return (
    <>
        <div className="space-y-6 pb-24 animate-in slide-in-from-right-4 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between sticky top-0 bg-bg-primary/95 backdrop-blur z-40 py-2 border-b border-white/5">
            <div>
                <h1 className="text-xl font-heading font-bold text-white">{activeWorkout.name}</h1>
                <p className="text-xs text-text-muted">{activeWorkout.exercises.length} Exercises</p>
            </div>
            <div className="flex items-center gap-2 text-sm font-mono text-text-muted bg-white/5 px-2 py-1 rounded">
                <Timer className="w-4 h-4" />
                <span>Running...</span>
            </div>
        </div>

        {/* Exercises List */}
        <div className="space-y-4">
            {activeWorkout.exercises.length === 0 ? (
                <div className="text-center py-10 space-y-4 border-2 border-dashed border-white/5 rounded-2xl">
                    <p className="text-text-muted">No exercises added yet.</p>
                    <Button onClick={() => setShowExerciseSelector(true)}>Add First Exercise</Button>
                </div>
            ) : (
                activeWorkout.exercises.map((exercise) => (
                <Card key={exercise.id} className="p-4 space-y-4 bg-bg-card/50">
                    <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <h3 className="font-bold text-lg text-white">{exercise.name}</h3>
                        {exercise.bodyPart && (
                            <span className="text-[10px] uppercase tracking-wider text-text-muted bg-white/5 px-1.5 py-0.5 rounded">
                                {exercise.bodyPart}
                            </span>
                        )}
                    </div>
                    <button 
                      onClick={() => removeExercise(exercise.id)}
                      className="text-text-muted hover:text-error transition-colors text-xl leading-none px-2"
                      aria-label="Remove exercise"
                    >
                        &times;
                    </button>
                    </div>

                    <div className="space-y-2">
                    <div className="grid grid-cols-[2rem_1fr_1fr_2.5rem] gap-3 text-xs text-text-muted uppercase tracking-wider text-center px-1">
                        <span className="pt-2">Set</span>
                        <span className="pt-2">Lbs</span>
                        <span className="pt-2">Reps</span>
                        <span className="text-center pt-2"><CheckCircle2 className="w-4 h-4 mx-auto" /></span>
                    </div>
                    
                    {exercise.sets.map((set, index) => (
                        <SetLogger 
                            key={set.id} 
                            exerciseId={exercise.id} 
                            set={set} 
                            index={index} 
                        />
                    ))}
                    </div>

                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full text-xs text-text-muted hover:text-primary border-dashed border border-white/10 hover:bg-white/5"
                        onClick={() => addSet(exercise.id)}
                    >
                        <Plus className="w-3 h-3 mr-1" /> Add Set
                    </Button>
                </Card>
                ))
            )}
        </div>

        {/* Add Exercise Button */}
        {activeWorkout.exercises.length > 0 && (
            <Button 
                variant="secondary" 
                className="w-full py-4 border-dashed border-white/20"
                onClick={() => setShowExerciseSelector(true)}
            >
                <Plus className="w-5 h-5 mr-2" />
                Add Exercise
            </Button>
        )}

        {/* Bottom Sticky Bar */}
        <div className="fixed bottom-[calc(env(safe-area-inset-bottom)+4rem)] left-0 right-0 p-4 bg-bg-card/95 backdrop-blur border-t border-white/10 flex items-center justify-between max-w-md mx-auto z-40 shadow-xl">
            <div>
                <p className="text-[10px] text-text-muted uppercase tracking-wider">Total Volume</p>
                <p className="font-mono font-bold text-white text-lg">{totalVolume.toLocaleString()} <span className="text-sm text-text-muted font-sans font-normal">lbs</span></p>
            </div>
            <Button onClick={handleFinish} className="bg-success hover:bg-success/80 text-bg-primary font-bold px-6">
                Finish <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
        </div>
        </div>

        {/* Exercise Selector Modal */}
        {showExerciseSelector && (
            <ExerciseSelector 
                onSelect={(name, category) => {
                    addExercise({ 
                        id: crypto.randomUUID(), 
                        name, 
                        bodyPart: category 
                    })
                    setShowExerciseSelector(false)
                }}
                onCancel={() => setShowExerciseSelector(false)}
            />
        )}
    </>
  )
}
