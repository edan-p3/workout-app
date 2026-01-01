"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { TrendingUp, Dumbbell, Calendar, Trophy, Plus, ArrowRight, HelpCircle, X, Clock, Timer, Trash2, Zap, Target, ChevronDown, ChevronUp, Info } from "lucide-react"
import { useWorkoutStore } from "@/lib/stores/workoutStore"
import { useWeightStore } from "@/lib/stores/weightStore"
import { calculateVolume, calculateTotalDuration, calculateTotalDistance, calculateTotalCalories } from "@/lib/utils/calculations"
import { WORKOUT_TEMPLATES, type WorkoutTemplate } from "@/lib/data/workoutTemplates"
import { getExerciseInstructions } from "@/lib/data/exerciseInstructions"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const router = useRouter()
  const { history, deleteWorkout, loadWorkoutsFromDatabase, startWorkout, addExercise } = useWorkoutStore()
  const { getLatestWeight, entries } = useWeightStore()
  const [isClient, setIsClient] = useState(false)
  const [showTooltip, setShowTooltip] = useState<string | null>(null)
  const [selectedWorkout, setSelectedWorkout] = useState<any>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<WorkoutTemplate | null>(null)
  const [showAllTemplates, setShowAllTemplates] = useState(false)
  const [expandedExercise, setExpandedExercise] = useState<number | null>(null)
  const [selectedDifficulty, setSelectedDifficulty] = useState<WorkoutTemplate['difficulty'] | null>(null)

  useEffect(() => {
    setIsClient(true)
    // Load workouts from database
    loadWorkoutsFromDatabase()
  }, [])

  if (!isClient) return null

  const handleDelete = () => {
    if (selectedWorkout) {
      deleteWorkout(selectedWorkout.id)
      setSelectedWorkout(null)
      setShowDeleteConfirm(false)
    }
  }

  const handleStartTemplate = (template: WorkoutTemplate) => {
    // Start workout with template name
    startWorkout(template.name)
    
    // Add all exercises from the template
    template.exercises.forEach((exercise) => {
      addExercise({
        id: crypto.randomUUID(),
        name: exercise.name,
        bodyPart: undefined
      })
    })
    
    // Navigate to log page
    router.push('/log')
  }

  const getDifficultyColor = (difficulty: WorkoutTemplate['difficulty']) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-400 bg-green-400/10'
      case 'Intermediate': return 'text-yellow-400 bg-yellow-400/10'
      case 'Advanced': return 'text-red-400 bg-red-400/10'
    }
  }

  // Calculate Stats
  const now = new Date()
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  
  const weeklyWorkouts = history.filter(w => new Date(w.endTime) > oneWeekAgo)
  const weeklyVolume = weeklyWorkouts.reduce((acc, w) => acc + w.totalVolume, 0)
  const weeklyDurationMs = weeklyWorkouts.reduce((acc, w) => acc + w.durationMs, 0)
  const weeklyDurationMinutes = Math.round(weeklyDurationMs / 1000 / 60)

  // Current Streak (Mock logic for now, real logic needs continuous dates)
  const currentStreak = weeklyWorkouts.length > 0 ? weeklyWorkouts.length : 0 
  
  // Get current weight
  const currentWeight = getLatestWeight()
  
  // Calculate weight change (comparing latest to second latest)
  const weightChange = entries.length >= 2 
    ? (entries[0].weight - entries[1].weight).toFixed(1)
    : null 

  const tooltips = {
    workouts: "Number of workout sessions completed in the last 7 days",
    volume: "Total weight lifted (weight × reps × sets) across all strength exercises",
    time: "Total minutes spent exercising across all workouts",
    weight: "Your current body weight and change since last measurement"
  }

  const InfoIcon = ({ type, align = "left" }: { type: keyof typeof tooltips, align?: "left" | "right" }) => (
    <div className="relative inline-block">
      <button
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setShowTooltip(showTooltip === type ? null : type)
        }}
        className="ml-1 text-text-muted hover:text-primary transition-colors"
        aria-label="More information"
      >
        <HelpCircle className="w-3 h-3" />
      </button>
      {showTooltip === type && (
        <>
          <div 
            className="fixed inset-0 z-[70]" 
            onClick={() => setShowTooltip(null)}
          />
          <div className={`absolute ${align === "right" ? "right-0" : "left-0"} top-full mt-2 z-[80] w-56 px-4 py-3 bg-white rounded-xl shadow-2xl text-xs text-primary font-medium leading-relaxed animate-in fade-in zoom-in-95 duration-200 opacity-100`}>
            <div className={`absolute -top-1.5 ${align === "right" ? "right-4" : "left-4"} w-3 h-3 bg-white rotate-45`}></div>
            {tooltips[type]}
          </div>
        </>
      )}
    </div>
  ) 

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Brand Header */}
      <div className="text-center pt-2">
        <h1 className="text-3xl font-heading font-bold bg-gradient-to-r from-primary via-blue-500 to-primary bg-clip-text text-transparent">
          Rep It!
        </h1>
        <p className="text-text-muted text-xs uppercase tracking-widest mt-1">Every Rep Counts</p>
      </div>

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
        <Card className="grid grid-cols-2 gap-x-4 gap-y-6 md:px-16">
          <div className="space-y-1 w-full pl-12">
            <p className="text-text-muted text-xs uppercase flex items-center">
              Workouts
              <InfoIcon type="workouts" />
            </p>
            <p className="text-2xl font-mono font-bold">{weeklyWorkouts.length}<span className="text-text-muted text-sm font-normal"> sessions</span></p>
          </div>
          <div className="space-y-1 w-full pl-6">
            <p className="text-text-muted text-xs uppercase flex items-center">
              Volume
              <InfoIcon type="volume" align="right" />
            </p>
            <div className="flex items-center gap-1">
              <p className="text-2xl font-mono font-bold">{(weeklyVolume / 1000).toFixed(1)}k</p>
              <TrendingUp className="w-4 h-4 text-success" />
            </div>
          </div>
          <div className="space-y-1 w-full pl-12">
            <p className="text-text-muted text-xs uppercase flex items-center">
              Time
              <InfoIcon type="time" />
            </p>
            <p className="text-2xl font-mono font-bold">{weeklyDurationMinutes}<span className="text-sm text-text-muted font-sans">m</span></p>
          </div>
          <div className="space-y-1 w-full pl-6">
            <p className="text-text-muted text-xs uppercase flex items-center">
              Weight
              <InfoIcon type="weight" align="right" />
            </p>
            <Link href="/measurements" className="block hover:opacity-80 transition-opacity">
              <div className="flex items-center gap-1">
                <p className="text-2xl font-mono font-bold">{currentWeight || '--'}</p>
                {weightChange && (
                  <span className={`text-xs ${parseFloat(weightChange) < 0 ? 'text-success bg-success/10' : 'text-warning bg-warning/10'} px-1.5 py-0.5 rounded`}>
                    {parseFloat(weightChange) > 0 ? '+' : ''}{weightChange}
                  </span>
                )}
              </div>
            </Link>
          </div>
        </Card>
      </section>

      {/* Quick Actions (Replaced old Quick Start) */}
      <section>
        <h2 className="text-xl font-heading font-bold text-white mb-4">Actions</h2>
        <div className="grid grid-cols-2 gap-3">
             <Link href="/log">
                <Button className="w-full py-6 flex flex-col items-center justify-center gap-2 group">
                    <div className="p-2 bg-white/20 rounded-full">
                        <Plus className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-center">
                        <p className="font-bold text-sm">Log Workout</p>
                        <p className="text-xs text-white/80">Start a session</p>
                    </div>
                </Button>
             </Link>
             <Link href="/leaderboard">
                <Button variant="outline" className="w-full py-6 flex flex-col items-center justify-center gap-2 group border-yellow-400/30 hover:border-yellow-400 hover:bg-yellow-400/10">
                    <div className="p-2 bg-yellow-400/20 rounded-full">
                        <Trophy className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div className="text-center">
                        <p className="font-bold text-sm text-white">Leaderboard</p>
                        <p className="text-xs text-text-muted">See rankings</p>
                    </div>
                </Button>
             </Link>
        </div>
      </section>

      {/* Workout Templates */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-heading font-bold text-white flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-primary" />
            Workout Programs
          </h2>
          <Zap className="w-5 h-5 text-primary" />
        </div>
        <p className="text-text-muted text-sm mb-4">Your personal trainer, anytime 💪</p>
        
        {/* Difficulty Selector or Workouts */}
        {!selectedDifficulty ? (
          /* Difficulty Selection Screen */
          <div className="space-y-3">
            <p className="text-xs text-text-muted text-center mb-4">Choose your fitness level to see tailored workouts</p>
            
            <Card 
              onClick={() => setSelectedDifficulty('Beginner')}
              className="p-5 hover:border-green-400/50 transition-all cursor-pointer group bg-gradient-to-r from-green-500/5 to-green-500/10"
            >
              <div className="flex items-start gap-3">
                <div className="text-3xl">🌱</div>
                <div className="flex-1">
                  <h3 className="font-bold text-white text-lg mb-1 group-hover:text-green-400 transition-colors">Beginner</h3>
                  <p className="text-xs text-text-secondary mb-2">New to working out or returning after a break. Focus on learning proper form and building a foundation.</p>
                  <p className="text-xs text-green-400 font-medium">{WORKOUT_TEMPLATES.filter(t => t.difficulty === 'Beginner').length} workouts available</p>
                </div>
                <ArrowRight className="w-5 h-5 text-text-muted group-hover:text-green-400 transition-colors" />
              </div>
            </Card>
            
            <Card 
              onClick={() => setSelectedDifficulty('Intermediate')}
              className="p-5 hover:border-yellow-400/50 transition-all cursor-pointer group bg-gradient-to-r from-yellow-500/5 to-yellow-500/10"
            >
              <div className="flex items-start gap-3">
                <div className="text-3xl">💪</div>
                <div className="flex-1">
                  <h3 className="font-bold text-white text-lg mb-1 group-hover:text-yellow-400 transition-colors">Intermediate</h3>
                  <p className="text-xs text-text-secondary mb-2">Comfortable with basics. Ready for more volume, varied exercises, and progressive overload.</p>
                  <p className="text-xs text-yellow-400 font-medium">{WORKOUT_TEMPLATES.filter(t => t.difficulty === 'Intermediate').length} workouts available</p>
                </div>
                <ArrowRight className="w-5 h-5 text-text-muted group-hover:text-yellow-400 transition-colors" />
              </div>
            </Card>
            
            <Card 
              onClick={() => setSelectedDifficulty('Advanced')}
              className="p-5 hover:border-red-400/50 transition-all cursor-pointer group bg-gradient-to-r from-red-500/5 to-red-500/10"
            >
              <div className="flex items-start gap-3">
                <div className="text-3xl">🔥</div>
                <div className="flex-1">
                  <h3 className="font-bold text-white text-lg mb-1 group-hover:text-red-400 transition-colors">Advanced</h3>
                  <p className="text-xs text-text-secondary mb-2">Experienced lifter. High volume, intensity, and complex programming for serious athletes.</p>
                  <p className="text-xs text-red-400 font-medium">{WORKOUT_TEMPLATES.filter(t => t.difficulty === 'Advanced').length} workouts available</p>
                </div>
                <ArrowRight className="w-5 h-5 text-text-muted group-hover:text-red-400 transition-colors" />
              </div>
            </Card>
          </div>
        ) : (
          /* Show Workouts for Selected Difficulty */
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-3">
              <button 
                onClick={() => setSelectedDifficulty(null)}
                className="text-xs text-primary hover:text-primary/80 flex items-center gap-1"
              >
                ← Change Level
              </button>
              <div className="flex items-center gap-2">
                {selectedDifficulty === 'Beginner' && <span className="text-lg">🌱</span>}
                {selectedDifficulty === 'Intermediate' && <span className="text-lg">💪</span>}
                {selectedDifficulty === 'Advanced' && <span className="text-lg">🔥</span>}
                <span className={`text-xs px-2 py-1 rounded ${getDifficultyColor(selectedDifficulty)}`}>
                  {selectedDifficulty}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {WORKOUT_TEMPLATES.filter(t => t.difficulty === selectedDifficulty).map((template) => (
                <Card 
                  key={template.id}
                  onClick={() => setSelectedTemplate(template)}
                  className="p-4 hover:border-primary/50 transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-white group-hover:text-primary transition-colors mb-1">{template.name}</h3>
                      <p className="text-xs text-text-muted mb-2">{template.description}</p>
                      <div className="flex items-center gap-3 text-xs text-text-secondary">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {template.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Target className="w-3 h-3" />
                          {template.exercises.length} exercises
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-text-muted group-hover:text-primary transition-colors" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
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
                    <Card 
                      key={workout.id} 
                      onClick={() => setSelectedWorkout(workout)}
                      className="min-w-[160px] p-4 bg-gradient-to-br from-gray-900 to-gray-800 border-l-2 border-l-accent-blue cursor-pointer hover:border-l-primary transition-all hover:scale-105 active:scale-95"
                    >
                        <p className="text-xs text-text-muted mb-1">{new Date(workout.endTime).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric'})}</p>
                        <p className="text-lg font-bold text-white truncate max-w-[140px]">{workout.name}</p>
                        <p className="text-xs text-text-secondary mt-1">{workout.exercises.length} Exercises</p>
                    </Card>
                ))}
            </div>
        )}
      </section>

      {/* Workout Detail Modal */}
      {selectedWorkout && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <Card className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl">
            <div className="sticky top-0 bg-bg-card backdrop-blur-sm p-4 border-b border-white/10 z-10">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedWorkout.name}</h2>
                  <p className="text-sm text-text-muted flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    {new Date(selectedWorkout.endTime).toLocaleDateString()}
                    <Clock className="w-3 h-3 ml-2" />
                    {Math.round(selectedWorkout.durationMs / 1000 / 60)}m
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setShowDeleteConfirm(true)} 
                    className="p-2 hover:bg-error/20 text-error rounded-lg transition-colors"
                    aria-label="Delete workout"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <button onClick={() => setSelectedWorkout(null)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <X className="w-6 h-6 text-text-muted hover:text-white" />
                  </button>
                </div>
              </div>
              
              {/* Workout Summary */}
              <div className="grid grid-cols-3 gap-2 mt-3">
                {(() => {
                  const totalVolume = selectedWorkout.exercises.reduce((acc: number, ex: any) => 
                    acc + ex.sets.filter((s: any) => s.completed).reduce((sum: number, set: any) => 
                      sum + (set.weight || 0) * (set.reps || 0), 0
                    ), 0
                  )
                  const totalDuration = selectedWorkout.exercises.reduce((acc: number, ex: any) =>
                    acc + ex.sets.filter((s: any) => s.completed).reduce((sum: number, set: any) =>
                      sum + (set.duration || 0), 0
                    ), 0
                  )
                  const totalDistance = selectedWorkout.exercises.reduce((acc: number, ex: any) =>
                    acc + ex.sets.filter((s: any) => s.completed).reduce((sum: number, set: any) =>
                      sum + (set.distance || 0), 0
                    ), 0
                  )

                  return (
                    <>
                      {totalVolume > 0 && (
                        <div className="bg-white/5 rounded-lg p-2">
                          <p className="text-xs text-text-muted">Volume</p>
                          <p className="text-sm font-mono font-bold text-white">{totalVolume.toLocaleString()} lbs</p>
                        </div>
                      )}
                      {totalDuration > 0 && (
                        <div className="bg-white/5 rounded-lg p-2">
                          <p className="text-xs text-text-muted">Duration</p>
                          <p className="text-sm font-mono font-bold text-white">{totalDuration} min</p>
                        </div>
                      )}
                      {totalDistance > 0 && (
                        <div className="bg-white/5 rounded-lg p-2">
                          <p className="text-xs text-text-muted">Distance</p>
                          <p className="text-sm font-mono font-bold text-white">{totalDistance.toFixed(1)} mi</p>
                        </div>
                      )}
                    </>
                  )
                })()}
              </div>
            </div>

            <div className="p-4 space-y-4 pb-6">
              {selectedWorkout.exercises.map((exercise: any) => {
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
                  </div>
                )
              })}
            </div>
          </Card>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4 animate-in fade-in duration-200">
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

      {/* Workout Template Detail Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <Card className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl">
            <div className="sticky top-0 bg-bg-card backdrop-blur-sm p-6 border-b border-white/10 z-10">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-2xl font-bold text-white">{selectedTemplate.name}</h2>
                    <span className={`text-xs px-2 py-1 rounded ${getDifficultyColor(selectedTemplate.difficulty)}`}>
                      {selectedTemplate.difficulty}
                    </span>
                  </div>
                  <p className="text-text-muted mb-3">{selectedTemplate.description}</p>
                  <div className="flex items-center gap-4 text-sm text-text-secondary">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {selectedTemplate.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Target className="w-4 h-4" />
                      {selectedTemplate.exercises.length} exercises
                    </span>
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
                      {selectedTemplate.category}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedTemplate(null)} 
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-text-muted hover:text-white" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-3">
              <h3 className="text-lg font-bold text-white mb-3">Exercise Plan</h3>
              {selectedTemplate.exercises.map((exercise, index) => {
                const instructions = getExerciseInstructions(exercise.name)
                const isExpanded = expandedExercise === index
                
                return (
                  <div 
                    key={index}
                    className="bg-white/5 rounded-lg overflow-hidden"
                  >
                    <div 
                      className="flex items-center justify-between p-3 hover:bg-white/10 transition-colors cursor-pointer"
                      onClick={() => setExpandedExercise(isExpanded ? null : index)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-white">{exercise.name}</p>
                          <p className="text-xs text-text-muted">
                            {exercise.sets} sets 
                            {exercise.reps && ` × ${exercise.reps} reps`}
                            {exercise.duration && ` × ${exercise.duration} min`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {instructions && (
                          <Info className="w-4 h-4 text-primary" />
                        )}
                        {instructions && (isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-text-muted" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-text-muted" />
                        ))}
                      </div>
                    </div>
                    
                    {isExpanded && instructions && (
                      <div className="px-3 pb-3 space-y-3 animate-in slide-in-from-top-2 duration-200">
                        <div className="p-3 bg-black/20 rounded-lg space-y-2">
                          <p className="text-xs font-bold text-primary uppercase tracking-wider">Proper Form:</p>
                          <ul className="space-y-1.5">
                            {instructions.formCues.map((cue, i) => (
                              <li key={i} className="text-xs text-text-secondary flex items-start gap-2">
                                <span className="text-primary mt-0.5">•</span>
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
                  </div>
                )
              })}
            </div>

            <div className="sticky bottom-0 bg-bg-card backdrop-blur-sm p-6 border-t border-white/10">
              <Button 
                onClick={() => handleStartTemplate(selectedTemplate)}
                className="w-full bg-gradient-to-r from-primary to-blue-500 hover:opacity-90 text-white font-bold py-4"
              >
                <Zap className="w-5 h-5 mr-2" />
                Start This Workout
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
