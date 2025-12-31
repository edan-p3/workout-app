import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { calculateVolume } from '../utils/calculations'

export type Set = {
  id: string
  weight: number
  reps: number
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
              { ...exercise, sets: [{ id: crypto.randomUUID(), weight: 0, reps: 0, completed: false }] }
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
      finishWorkout: () => set((state) => {
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

        return {
            activeWorkout: null,
            history: [completedWorkout, ...state.history]
        }
      }), 
      resetWorkout: () => set({ activeWorkout: null }),
    }),
    {
      name: 'workout-storage',
    }
  )
)
