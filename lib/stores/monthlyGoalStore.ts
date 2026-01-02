import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '../supabase/client'

export type MonthlyGoal = {
  id: string
  userId: string
  monthYear: string // Format: "2024-01"
  goalWorkouts: number
  completedWorkouts: number
  createdAt: Date
  updatedAt: Date
}

interface MonthlyGoalState {
  currentGoal: MonthlyGoal | null
  isLoading: boolean
  
  loadCurrentMonthGoal: () => Promise<void>
  setMonthlyGoal: (goalWorkouts: number) => Promise<void>
  incrementWorkoutCount: () => Promise<void>
}

// Helper to get current month in YYYY-MM format
const getCurrentMonthYear = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

export const useMonthlyGoalStore = create<MonthlyGoalState>()(
  persist(
    (set, get) => ({
      currentGoal: null,
      isLoading: false,
      
      loadCurrentMonthGoal: async () => {
        try {
          set({ isLoading: true })
          const { data: { user } } = await supabase.auth.getUser()
          if (!user) return
          
          const monthYear = getCurrentMonthYear()
          
          const { data, error } = await supabase
            .from('monthly_goals')
            .select('*')
            .eq('user_id', user.id)
            .eq('month_year', monthYear)
            .maybeSingle()
          
          if (error && error.code !== 'PGRST116') {
            console.error('Error loading monthly goal:', error)
            return
          }
          
          if (data) {
            set({
              currentGoal: {
                id: data.id,
                userId: data.user_id,
                monthYear: data.month_year,
                goalWorkouts: data.goal_workouts,
                completedWorkouts: data.completed_workouts,
                createdAt: new Date(data.created_at),
                updatedAt: new Date(data.updated_at)
              },
              isLoading: false
            })
          } else {
            // No goal for this month yet
            set({ currentGoal: null, isLoading: false })
          }
        } catch (error) {
          console.error('Error in loadCurrentMonthGoal:', error)
          set({ isLoading: false })
        }
      },
      
      setMonthlyGoal: async (goalWorkouts: number) => {
        try {
          const { data: { user } } = await supabase.auth.getUser()
          if (!user) return
          
          const monthYear = getCurrentMonthYear()
          
          // Upsert (insert or update)
          const { data, error } = await supabase
            .from('monthly_goals')
            .upsert({
              user_id: user.id,
              month_year: monthYear,
              goal_workouts: goalWorkouts,
              completed_workouts: 0 // Reset to 0 when setting new goal
            }, {
              onConflict: 'user_id,month_year'
            })
            .select()
            .single()
          
          if (error) {
            console.error('Error setting monthly goal:', error)
            return
          }
          
          if (data) {
            set({
              currentGoal: {
                id: data.id,
                userId: data.user_id,
                monthYear: data.month_year,
                goalWorkouts: data.goal_workouts,
                completedWorkouts: data.completed_workouts,
                createdAt: new Date(data.created_at),
                updatedAt: new Date(data.updated_at)
              }
            })
          }
        } catch (error) {
          console.error('Error in setMonthlyGoal:', error)
        }
      },
      
      incrementWorkoutCount: async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser()
          if (!user) return
          
          const monthYear = getCurrentMonthYear()
          const currentGoal = get().currentGoal
          
          // If no goal exists for this month, create a default one
          if (!currentGoal || currentGoal.monthYear !== monthYear) {
            await get().loadCurrentMonthGoal()
            return
          }
          
          const newCount = currentGoal.completedWorkouts + 1
          
          const { data, error } = await supabase
            .from('monthly_goals')
            .update({ 
              completed_workouts: newCount 
            })
            .eq('id', currentGoal.id)
            .select()
            .single()
          
          if (error) {
            console.error('Error incrementing workout count:', error)
            return
          }
          
          if (data) {
            set({
              currentGoal: {
                ...currentGoal,
                completedWorkouts: data.completed_workouts,
                updatedAt: new Date(data.updated_at)
              }
            })
          }
        } catch (error) {
          console.error('Error in incrementWorkoutCount:', error)
        }
      }
    }),
    {
      name: 'monthly-goal-storage'
    }
  )
)

