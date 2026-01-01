"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Calendar, Clock, ArrowRight, X, Dumbbell, Timer, Flame, Edit2, Save, Trash2 } from "lucide-react"
import { useWorkoutStore } from "@/lib/stores/workoutStore"
import { calculateVolume, calculateTotalDuration, calculateTotalDistance, calculateTotalCalories } from "@/lib/utils/calculations"
import { cn } from "@/lib/utils/cn"
import Link from "next/link"

export default function HistoryPage() {
  const { history, updateHistoryWorkout, deleteWorkout } = useWorkoutStore()
  const [selectedWorkout, setSelectedWorkout] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedWorkout, setEditedWorkout] = useState<any>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const getWorkoutSummary = (workout: any) => {
    const totalVolume = workout.exercises.reduce((acc: number, ex: any) => acc + calculateVolume(ex.sets), 0)
    const totalDuration = workout.exercises.reduce((acc: number, ex: any) => acc + calculateTotalDuration(ex.sets), 0)
    const totalDistance = workout.exercises.reduce((acc: number, ex: any) => acc + calculateTotalDistance(ex.sets), 0)
    const totalCalories = workout.exercises.reduce((acc: number, ex: any) => acc + calculateTotalCalories(ex.sets), 0)

    return { totalVolume, totalDuration, totalDistance, totalCalories }
  }

  const handleEdit = () => {
    setEditedWorkout(JSON.parse(JSON.stringify(selectedWorkout))) // Deep clone
    setIsEditing(true)
  }

  const handleSave = () => {
    // Update the workout in history using the store function
    updateHistoryWorkout(editedWorkout.id, editedWorkout)
    setSelectedWorkout(editedWorkout)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedWorkout(null)
    setIsEditing(false)
  }

  const handleDelete = () => {
    if (selectedWorkout) {
      deleteWorkout(selectedWorkout.id)
      setSelectedWorkout(null)
      setShowDeleteConfirm(false)
    }
  }

  const updateSet = (exerciseId: string, setId: string, field: string, value: any) => {
    setEditedWorkout((prev: any) => ({
      ...prev,
      exercises: prev.exercises.map((ex: any) =>
        ex.id === exerciseId
          ? {
              ...ex,
              sets: ex.sets.map((s: any) =>
                s.id === setId ? { ...s, [field]: Number(value) || 0 } : s
              ),
            }
          : ex
      ),
    }))
  }

  const toggleSetComplete = (exerciseId: string, setId: string) => {
    setEditedWorkout((prev: any) => ({
      ...prev,
      exercises: prev.exercises.map((ex: any) =>
        ex.id === exerciseId
          ? {
              ...ex,
              sets: ex.sets.map((s: any) =>
                s.id === setId ? { ...s, completed: !s.completed } : s
              ),
            }
          : ex
      ),
    }))
  }

  const removeSet = (exerciseId: string, setId: string) => {
    setEditedWorkout((prev: any) => ({
      ...prev,
      exercises: prev.exercises.map((ex: any) =>
        ex.id === exerciseId
          ? {
              ...ex,
              sets: ex.sets.filter((s: any) => s.id !== setId),
            }
          : ex
      ),
    }))
  }

  const currentWorkout = isEditing ? editedWorkout : selectedWorkout

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h1 className="text-2xl font-heading font-bold text-white">History</h1>

      {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                <Calendar className="w-8 h-8 text-text-muted" />
            </div>
            <div>
                <h3 className="text-lg font-bold text-white">No history yet</h3>
                <p className="text-text-muted">Complete a workout to see it here.</p>
            </div>
            <Link href="/log">
                <Button variant="outline">Start Workout</Button>
            </Link>
          </div>
      ) : (
        <div className="space-y-4">
            {history.map((workout) => {
              const summary = getWorkoutSummary(workout)
              const hasVolume = summary.totalVolume > 0
              const hasDuration = summary.totalDuration > 0
              const hasDistance = summary.totalDistance > 0

              return (
                <Card 
                  key={workout.id} 
                  onClick={() => {
                    setSelectedWorkout(workout)
                    setIsEditing(false)
                  }}
                  className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer group"
                >
                    <div className="space-y-1">
                      <h3 className="font-bold text-white group-hover:text-primary transition-colors">{workout.name}</h3>
                      <div className="flex items-center text-xs text-text-muted gap-3">
                          <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(workout.endTime).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {Math.round(workout.durationMs / 1000 / 60)}m
                          </span>
                      </div>
                    </div>
                    
                    <div className="text-right flex items-center gap-4">
                        <div className="space-y-0.5">
                            {hasVolume && (
                              <div className="text-sm font-mono font-bold text-white flex items-center gap-1">
                                <Dumbbell className="w-3 h-3" />
                                {summary.totalVolume.toLocaleString()} lbs
                              </div>
                            )}
                            {hasDuration && (
                              <div className="text-sm font-mono font-bold text-white flex items-center gap-1">
                                <Timer className="w-3 h-3" />
                                {summary.totalDuration} min
                              </div>
                            )}
                            {hasDistance && (
                              <div className="text-sm font-mono font-bold text-white flex items-center gap-1">
                                🏃 {summary.totalDistance.toFixed(1)} mi
                              </div>
                            )}
                            <div className="text-xs text-text-muted">{workout.exercises.length} Exercises</div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                </Card>
              )
            })}
        </div>
      )}

      {/* Workout Detail/Edit Modal */}
      {currentWorkout && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl">
            <div className="sticky top-0 bg-bg-card/95 backdrop-blur p-4 border-b border-white/10 z-10">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h2 className="text-xl font-bold text-white">{currentWorkout.name}</h2>
                  <p className="text-sm text-text-muted">
                    {new Date(currentWorkout.endTime).toLocaleDateString()} • {Math.round(currentWorkout.durationMs / 1000 / 60)}m
                  </p>
                </div>
                <button onClick={() => {
                  setSelectedWorkout(null)
                  setIsEditing(false)
                  setEditedWorkout(null)
                }}>
                  <X className="w-6 h-6 text-text-muted hover:text-white" />
                </button>
              </div>
              
              <div className="flex gap-2">
                {!isEditing ? (
                  <>
                    <Button size="sm" onClick={handleEdit} className="flex-1">
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit Workout
                    </Button>
                    <Button 
                      size="sm" 
                      variant="secondary" 
                      onClick={() => setShowDeleteConfirm(true)} 
                      className="bg-error/20 hover:bg-error/30 text-error border-error/30"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button size="sm" onClick={handleSave} className="flex-1 bg-success hover:bg-success/80">
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button size="sm" variant="secondary" onClick={handleCancel} className="flex-1">
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </div>

            <div className="p-4 space-y-4">
              {currentWorkout.exercises.map((exercise: any) => {
                const cardioMachines = ['treadmill', 'elliptical', 'cycling', 'rowing', 'stairmaster', 'bike']
                const isCardioMachine = exercise.name && cardioMachines.some((machine: string) => 
                  exercise.name.toLowerCase().includes(machine)
                )
                const isTimeBased = exercise.bodyPart && ['Cardio', 'Sports'].includes(exercise.bodyPart)

                return (
                  <div key={exercise.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-white">{exercise.name}</h3>
                        {exercise.bodyPart && (
                          <span className="text-xs text-text-muted uppercase">{exercise.bodyPart}</span>
                        )}
                      </div>
                    </div>

                    {isEditing ? (
                      <div className="space-y-2">
                        {exercise.sets.map((set: any, idx: number) => (
                          <div key={set.id} className="bg-white/5 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-bold text-white">Set {idx + 1}</span>
                              <button
                                onClick={() => removeSet(exercise.id, set.id)}
                                className="text-error hover:text-error/80"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            
                            {isCardioMachine ? (
                              <div className="grid grid-cols-3 gap-2">
                                <div>
                                  <label className="text-xs text-text-muted">Distance (mi)</label>
                                  <Input
                                    type="number"
                                    step="0.1"
                                    value={set.distance || ''}
                                    onChange={(e) => updateSet(exercise.id, set.id, 'distance', e.target.value)}
                                    className="mt-1 text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="text-xs text-text-muted">Time (min)</label>
                                  <Input
                                    type="number"
                                    value={set.duration || ''}
                                    onChange={(e) => updateSet(exercise.id, set.id, 'duration', e.target.value)}
                                    className="mt-1 text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="text-xs text-text-muted">Calories</label>
                                  <Input
                                    type="number"
                                    value={set.calories || ''}
                                    onChange={(e) => updateSet(exercise.id, set.id, 'calories', e.target.value)}
                                    className="mt-1 text-sm"
                                  />
                                </div>
                              </div>
                            ) : isTimeBased ? (
                              <div>
                                <label className="text-xs text-text-muted">Duration (min)</label>
                                <Input
                                  type="number"
                                  value={set.duration || ''}
                                  onChange={(e) => updateSet(exercise.id, set.id, 'duration', e.target.value)}
                                  className="mt-1 text-sm"
                                />
                              </div>
                            ) : (
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="text-xs text-text-muted">Weight (lbs)</label>
                                  <Input
                                    type="number"
                                    value={set.weight || ''}
                                    onChange={(e) => updateSet(exercise.id, set.id, 'weight', e.target.value)}
                                    className="mt-1 text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="text-xs text-text-muted">Reps</label>
                                  <Input
                                    type="number"
                                    value={set.reps || ''}
                                    onChange={(e) => updateSet(exercise.id, set.id, 'reps', e.target.value)}
                                    className="mt-1 text-sm"
                                  />
                                </div>
                              </div>
                            )}
                            
                            <button
                              onClick={() => toggleSetComplete(exercise.id, set.id)}
                              className={cn(
                                "mt-2 w-full py-2 rounded-lg text-sm font-medium transition-colors",
                                set.completed
                                  ? "bg-success text-bg-primary"
                                  : "bg-white/10 text-text-muted"
                              )}
                            >
                              {set.completed ? "✓ Completed" : "Mark Complete"}
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {exercise.sets.filter((s: any) => s.completed).map((set: any, idx: number) => (
                          <div key={set.id} className="bg-white/5 rounded-lg p-3 text-sm">
                            <div className="flex items-center justify-between">
                              <span className="text-text-muted">Set {idx + 1}</span>
                              <div className="font-mono text-white">
                                {set.weight > 0 && set.reps > 0 && (
                                  <span>{set.weight} lbs × {set.reps} reps</span>
                                )}
                                {set.duration > 0 && !set.distance && (
                                  <span>{set.duration} min</span>
                                )}
                                {set.distance > 0 && (
                                  <span>{set.distance} mi • {set.duration} min{set.calories > 0 && ` • ${set.calories} cal`}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </Card>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <Card className="w-full max-w-sm p-6">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-error/20 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6 text-error" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Delete Workout?</h3>
                <p className="text-sm text-text-muted">
                  This will permanently delete "{selectedWorkout?.name}" from your history.
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
                  onClick={handleDelete}
                  className="flex-1 bg-error hover:bg-error/80"
                >
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
