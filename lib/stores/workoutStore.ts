import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { calculateVolume } from '../utils/calculations'
import { supabase } from '../supabase/client'

export type Set = {
  id: string
  weight: number
  reps: number
  duration: number  // in minutes
  distance: number  // in miles or km
  calories: number  // calories burned
  completed: boolean
}

export type Exercise = {
  id: string
  name: string
  bodyPart?: string
  sets: Set[]
}

export type CompletedWorkout = {
  id: string
  name: string
  startTime: Date
  endTime: Date
  exercises: Exercise[]
  totalVolume: number
  durationMs: number
}

export type WorkoutState = {
  activeWorkout: {
    name: string
    startTime: Date | null
    exercises: Exercise[]
  } | null
  history: CompletedWorkout[]
  startWorkout: (name?: string) => void
  addExercise: (exercise: Omit<Exercise, 'sets'>) => void
  removeExercise: (exerciseId: string) => void
  addSet: (exerciseId: string) => void
  updateSet: (exerciseId: string, setId: string, updates: Partial<Set>) => void
  completeSet: (exerciseId: string, setId: string) => void
  finishWorkout: () => void
  resetWorkout: () => void
  updateHistoryWorkout: (workoutId: string, updatedWorkout: CompletedWorkout) => void
  deleteWorkout: (workoutId: string) => void
  loadWorkoutsFromDatabase: () => Promise<void>
}

export const useWorkoutStore = create<WorkoutState>()(
  persist(
    (set, get) => ({
      activeWorkout: null,
      history: [],
      startWorkout: (name = "Custom Workout") => set({
        activeWorkout: {
          name,
          startTime: new Date(),
          exercises: []
        }
      }),
      addExercise: (exercise) => set((state) => {
        if (!state.activeWorkout) return state
        return {
          activeWorkout: {
            ...state.activeWorkout,
            exercises: [
              ...state.activeWorkout.exercises,
              { ...exercise, sets: [{ id: crypto.randomUUID(), weight: 0, reps: 0, duration: 0, distance: 0, calories: 0, completed: false }] }
            ]
          }
        }
      }),
      removeExercise: (exerciseId) => set((state) => {
        if (!state.activeWorkout) return state
        return {
          activeWorkout: {
            ...state.activeWorkout,
            exercises: state.activeWorkout.exercises.filter(ex => ex.id !== exerciseId)
          }
        }
      }),
      addSet: (exerciseId) => set((state) => {
        if (!state.activeWorkout) return state
        return {
          activeWorkout: {
            ...state.activeWorkout,
            exercises: state.activeWorkout.exercises.map(ex => {
              if (ex.id !== exerciseId) return ex
              const previousSet = ex.sets[ex.sets.length - 1]
              return {
                ...ex,
                sets: [
                  ...ex.sets,
                  { 
                    id: crypto.randomUUID(), 
                    weight: previousSet ? previousSet.weight : 0, 
                    reps: previousSet ? previousSet.reps : 0,
                    duration: previousSet ? previousSet.duration : 0,
                    distance: previousSet ? previousSet.distance : 0,
                    calories: previousSet ? previousSet.calories : 0,
                    completed: false 
                  }
                ]
              }
            })
          }
        }
      }),
      updateSet: (exerciseId, setId, updates) => set((state) => {
        if (!state.activeWorkout) return state
        return {
          activeWorkout: {
            ...state.activeWorkout,
            exercises: state.activeWorkout.exercises.map(ex => {
              if (ex.id !== exerciseId) return ex
              return {
                ...ex,
                sets: ex.sets.map(s => s.id === setId ? { ...s, ...updates } : s)
              }
            })
          }
        }
      }),
      completeSet: (exerciseId, setId) => set((state) => {
        if (!state.activeWorkout) return state
         return {
          activeWorkout: {
            ...state.activeWorkout,
            exercises: state.activeWorkout.exercises.map(ex => {
              if (ex.id !== exerciseId) return ex
              return {
                ...ex,
                sets: ex.sets.map(s => s.id === setId ? { ...s, completed: !s.completed } : s)
              }
            })
          }
        }
      }),
      finishWorkout: () => set(async (state) => {
        if (!state.activeWorkout || !state.activeWorkout.startTime) return state
        
        const endTime = new Date()
        const durationMs = endTime.getTime() - new Date(state.activeWorkout.startTime).getTime()
        const totalVolume = state.activeWorkout.exercises.reduce((acc, ex) => acc + calculateVolume(ex.sets), 0)

        const completedWorkout: CompletedWorkout = {
            id: crypto.randomUUID(),
            name: state.activeWorkout.name,
            startTime: state.activeWorkout.startTime,
            endTime,
            durationMs,
            totalVolume,
            exercises: state.activeWorkout.exercises
        }

        // Save to Supabase
        try {
          const { data: { user } } = await supabase.auth.getUser()
          
          if (user) {
            // Create workout in database
            const { data: workout, error: workoutError } = await supabase
              .from('workouts')
              .insert({
                user_id: user.id,
                workout_date: new Date(state.activeWorkout.startTime).toISOString().split('T')[0],
                start_time: state.activeWorkout.startTime.toISOString(),
                end_time: endTime.toISOString(),
                is_completed: true,
                notes: state.activeWorkout.name
              })
              .select()
              .single()

            if (workoutError) {
              console.error('Error saving workout:', workoutError)
            } else if (workout) {
              // Save exercises and sets
              for (const exercise of state.activeWorkout.exercises) {
                const { data: dbExercise, error: exerciseError } = await supabase
                  .from('exercises')
                  .insert({
                    workout_id: workout.id,
                    exercise_type: exercise.bodyPart === 'Cardio' || exercise.bodyPart === 'Sports' ? 'cardio' : 'strength',
                    exercise_name: exercise.name,
                    order_index: state.activeWorkout.exercises.indexOf(exercise)
                  })
                  .select()
                  .single()

                if (!exerciseError && dbExercise) {
                  // Save sets
                  const setsToInsert = exercise.sets
                    .filter(set => set.completed)
                    .map((set, index) => ({
                      exercise_id: dbExercise.id,
                      set_number: index + 1,
                      weight: set.weight || null,
                      reps: set.reps || null,
                      duration_minutes: set.duration || null,
                      distance: set.distance || null,
                      calories: set.calories || null,
                      is_completed: true
                    }))

                  if (setsToInsert.length > 0) {
                    await supabase.from('exercise_sets').insert(setsToInsert)
                  }
                }
              }
            }
          }
        } catch (error) {
          console.error('Error saving workout to database:', error)
        }

        return {
            activeWorkout: null,
            history: [completedWorkout, ...state.history]
        }
      }), 
      resetWorkout: () => set({ activeWorkout: null }),
      updateHistoryWorkout: (workoutId, updatedWorkout) => set((state) => ({
        history: state.history.map(w => w.id === workoutId ? updatedWorkout : w)
      })),
      deleteWorkout: (workoutId) => set((state) => ({
        history: state.history.filter(w => w.id !== workoutId)
      })),
      loadWorkoutsFromDatabase: async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser()
          
          if (!user) return

          // Fetch workouts with exercises and sets
          const { data: workouts, error } = await supabase
            .from('workouts')
            .select(`
              *,
              exercises (
                *,
                exercise_sets (*)
              )
            `)
            .eq('user_id', user.id)
            .eq('is_completed', true)
            .order('start_time', { ascending: false })
            .limit(50)

          if (error) {
            console.error('Error loading workouts:', error)
            return
          }

          if (workouts) {
            const formattedWorkouts: CompletedWorkout[] = workouts.map((workout: any) => ({
              id: workout.id,
              name: workout.notes || 'Workout',
              startTime: new Date(workout.start_time),
              endTime: new Date(workout.end_time || workout.start_time),
              durationMs: new Date(workout.end_time || workout.start_time).getTime() - new Date(workout.start_time).getTime(),
              totalVolume: workout.exercises?.reduce((total: number, ex: any) => {
                return total + (ex.exercise_sets?.reduce((sum: number, set: any) => 
                  sum + ((set.weight || 0) * (set.reps || 0)), 0) || 0)
              }, 0) || 0,
              exercises: workout.exercises?.map((ex: any) => ({
                id: ex.id,
                name: ex.exercise_name,
                bodyPart: ex.exercise_type === 'cardio' ? 'Cardio' : undefined,
                sets: ex.exercise_sets?.map((set: any) => ({
                  id: set.id,
                  weight: set.weight || 0,
                  reps: set.reps || 0,
                  duration: set.duration_minutes || 0,
                  distance: set.distance || 0,
                  calories: set.calories || 0,
                  completed: set.is_completed
                })) || []
              })) || []
            }))

            set({ history: formattedWorkouts })
          }
        } catch (error) {
          console.error('Error in loadWorkoutsFromDatabase:', error)
        }
      },
    }),
    {
      name: 'workout-storage',
    }
  )
)
