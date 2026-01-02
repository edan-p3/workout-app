"use client"

import { useEffect, useState } from "react"
import { useWorkoutStore } from "@/lib/stores/workoutStore"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Plus, Timer, ChevronRight, CheckCircle2, ChevronDown, ChevronUp, Info, Music } from "lucide-react"
import { SetLogger } from "@/components/workout/SetLogger"
import { calculateVolume } from "@/lib/utils/calculations"
import { cn } from "@/lib/utils/cn"
import { WorkoutStarter } from "@/components/workout/WorkoutStarter"
import { ExerciseSelector } from "@/components/workout/ExerciseSelector"
import { useRouter } from "next/navigation"
import { getExerciseInstructions } from "@/lib/data/exerciseInstructions"

export default function LogWorkoutPage() {
  const router = useRouter()
  const { activeWorkout, startWorkout, addExercise, removeExercise, addSet, finishWorkout } = useWorkoutStore()
  const [isClient, setIsClient] = useState(false)
  const [showExerciseSelector, setShowExerciseSelector] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null)
  const [showMusicTip, setShowMusicTip] = useState(true)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    console.log('Log page - activeWorkout changed:', activeWorkout ? activeWorkout.name : 'null')
  }, [activeWorkout])

  if (!isClient) return null

  // 1. No active workout -> Show Starter Selection
  if (!activeWorkout) {
    return <WorkoutStarter onStart={(type) => startWorkout(type)} />
  }

  const totalVolume = activeWorkout.exercises.reduce((acc, ex) => acc + calculateVolume(ex.sets), 0)

  const handleFinish = async () => {
    setIsSaving(true)
    try {
      console.log('Finishing workout...')
      await finishWorkout() // Wait for the workout to save to database
      console.log('Workout finished, activeWorkout should be null now')
      console.log('Current activeWorkout:', useWorkoutStore.getState().activeWorkout)
      
      // Force a small delay to ensure state propagates
      await new Promise(resolve => setTimeout(resolve, 100))
      
      console.log('Redirecting to dashboard...')
      router.push('/') // Then redirect to stats/dashboard
    } catch (error) {
      console.error('Error finishing workout:', error)
      alert('Error saving workout. Please try again.')
      setIsSaving(false)
    }
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
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm font-mono text-text-muted bg-white/5 px-2 py-1 rounded">
                    <Timer className="w-4 h-4" />
                    <span>Running...</span>
                </div>
                <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                        if (confirm('Cancel this workout? All progress will be lost.')) {
                            useWorkoutStore.getState().resetWorkout()
                            router.push('/')
                        }
                    }}
                    className="text-error hover:bg-error/10"
                >
                    Cancel
                </Button>
            </div>
        </div>

        {/* Music Controls */}
        {showMusicTip && (
          <Card className="p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/30">
            <div className="flex items-start gap-3">
              <Music className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <h3 className="font-bold text-white text-sm">Workout Music 🎵</h3>
                <p className="text-xs text-text-secondary">
                  Open your music app and use your device controls to play, pause, skip tracks, and adjust volume during your workout.
                </p>
                <div className="flex gap-2">
                  <a 
                    href="spotify:" 
                    className="text-xs bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg font-medium transition-colors"
                  >
                    Open Spotify
                  </a>
                  <a 
                    href="music:" 
                    className="text-xs bg-primary hover:bg-primary/80 text-white px-3 py-1.5 rounded-lg font-medium transition-colors"
                  >
                    Open Apple Music
                  </a>
                  <button 
                    onClick={() => setShowMusicTip(false)}
                    className="text-xs text-text-muted hover:text-white ml-auto"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Exercises List */}
        <div className="space-y-4">
            {activeWorkout.exercises.length === 0 ? (
                <div className="text-center py-12 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                        <Plus className="w-8 h-8 text-primary" />
                    </div>
                    <p className="text-text-muted text-sm">No exercises added yet.</p>
                    <Button 
                        onClick={() => setShowExerciseSelector(true)}
                        className="mx-auto"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add First Exercise
                    </Button>
                </div>
            ) : (
                activeWorkout.exercises.map((exercise) => {
                  const instructions = getExerciseInstructions(exercise.name)
                  const isExpanded = expandedExercise === exercise.id
                  
                  return (
                <Card key={exercise.id} className="p-4 space-y-4 bg-bg-card/50">
                    <div className="flex items-center justify-between">
                    <div className="space-y-0.5 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-lg text-white">{exercise.name}</h3>
                          {instructions && (
                            <button
                              onClick={() => setExpandedExercise(isExpanded ? null : exercise.id)}
                              className="p-1 hover:bg-white/10 rounded transition-colors"
                            >
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4 text-primary" />
                              ) : (
                                <Info className="w-4 h-4 text-primary" />
                              )}
                            </button>
                          )}
                        </div>
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
                    {/* Dynamic column headers based on exercise type */}
                    {(() => {
                      const cardioMachines = ['treadmill', 'elliptical', 'cycling', 'rowing', 'stairmaster', 'bike']
                      const isCardioMachine = exercise.name && cardioMachines.some(machine => 
                        exercise.name.toLowerCase().includes(machine)
                      )
                      
                      if (isCardioMachine) {
                        return (
                          <div className="grid grid-cols-[2rem_1fr_1fr_1fr_2.5rem] gap-2 text-xs text-text-muted uppercase tracking-wider text-center px-1">
                            <span className="pt-2">Set</span>
                            <span className="pt-2">Distance</span>
                            <span className="pt-2">Time</span>
                            <span className="pt-2">Calories</span>
                            <span className="text-center pt-2"><CheckCircle2 className="w-4 h-4 mx-auto" /></span>
                          </div>
                        )
                      } else if (exercise.bodyPart && ['Cardio', 'Sports'].includes(exercise.bodyPart)) {
                        return (
                          <div className="grid grid-cols-[2rem_1fr_2.5rem] gap-3 text-xs text-text-muted uppercase tracking-wider text-center px-1">
                            <span className="pt-2">Set</span>
                            <span className="pt-2">Minutes</span>
                            <span className="text-center pt-2"><CheckCircle2 className="w-4 h-4 mx-auto" /></span>
                          </div>
                        )
                      } else {
                        return (
                          <div className="grid grid-cols-[2rem_1fr_1fr_2.5rem] gap-3 text-xs text-text-muted uppercase tracking-wider text-center px-1">
                            <span className="pt-2">Set</span>
                            <span className="pt-2">Lbs</span>
                            <span className="pt-2">Reps</span>
                            <span className="text-center pt-2"><CheckCircle2 className="w-4 h-4 mx-auto" /></span>
                          </div>
                        )
                      }
                    })()}
                    
                    {exercise.sets.map((set, index) => (
                        <SetLogger 
                            key={set.id} 
                            exerciseId={exercise.id} 
                            set={set} 
                            index={index}
                            exerciseCategory={exercise.bodyPart}
                            exerciseName={exercise.name}
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

                    {/* Form Instructions (Expandable) */}
                    {isExpanded && instructions && (
                      <div className="pt-2 space-y-2 animate-in slide-in-from-top-2 duration-200">
                        <div className="p-3 bg-black/30 rounded-lg space-y-2 border border-primary/20">
                          <p className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1">
                            <Info className="w-3 h-3" />
                            Proper Form:
                          </p>
                          <ul className="space-y-1.5">
                            {instructions.formCues.map((cue, i) => (
                              <li key={i} className="text-xs text-text-secondary flex items-start gap-2">
                                <span className="text-primary mt-0.5 font-bold">•</span>
                                <span>{cue}</span>
                              </li>
                            ))}
                          </ul>
                          {instructions.tips && (
                            <div className="pt-2 mt-2 border-t border-white/10">
                              <p className="text-xs font-bold text-yellow-400 mb-1">💡 Pro Tip:</p>
                              <p className="text-xs text-text-secondary italic">{instructions.tips}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                </Card>
                  )
                })
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
            <Button 
              onClick={handleFinish} 
              disabled={isSaving}
              className="bg-success hover:bg-success/80 text-bg-primary font-bold px-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isSaving ? 'Saving...' : 'Finish'} <ChevronRight className="w-4 h-4 ml-1" />
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
