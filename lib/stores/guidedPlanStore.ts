import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { GuidedPlan, GuidedPlanInput } from '@/types/guided-plan'
import { generateGuidedPlan } from '@/lib/guided/planGenerator'
import { supabase } from '@/lib/supabase/client'

interface GuidedPlanState {
  currentPlan: GuidedPlan | null
  hasCompletedOnboarding: boolean
  preferManualTracking: boolean
  
  setHasCompletedOnboarding: (completed: boolean) => void
  setPreferManualTracking: (prefer: boolean) => void
  createGuidedPlan: (input: GuidedPlanInput) => Promise<void>
  loadGuidedPlan: () => Promise<void>
  markWorkoutComplete: (dayIndex: number) => void
  updateWeek: (week: number) => void
}

export const useGuidedPlanStore = create<GuidedPlanState>()(
  persist(
    (set, get) => ({
      currentPlan: null,
      hasCompletedOnboarding: false,
      preferManualTracking: false,
      
      setHasCompletedOnboarding: (completed) => set({ hasCompletedOnboarding: completed }),
      
      setPreferManualTracking: (prefer) => set({ 
        preferManualTracking: prefer,
        hasCompletedOnboarding: true
      }),
      
      createGuidedPlan: async (input: GuidedPlanInput) => {
        try {
          const { data: { user } } = await supabase.auth.getUser()
          if (!user) return
          
          const plan = generateGuidedPlan(user.id, input)
          
          // Save to database (optional - for now just store in local state)
          // TODO: Add database table for guided_plans
          
          set({ 
            currentPlan: plan,
            hasCompletedOnboarding: true,
            preferManualTracking: false
          })
        } catch (error) {
          console.error('Error creating guided plan:', error)
        }
      },
      
      loadGuidedPlan: async () => {
        // TODO: Load from database
        // For now, it's loaded from localStorage via persist
      },
      
      markWorkoutComplete: (dayIndex: number) => {
        const plan = get().currentPlan
        if (!plan) return
        
        // TODO: Track completion in database
        console.log(`Workout ${dayIndex} completed`)
      },
      
      updateWeek: (week: number) => {
        set(state => {
          if (!state.currentPlan) return state
          return {
            currentPlan: {
              ...state.currentPlan,
              currentWeek: week
            }
          }
        })
      }
    }),
    {
      name: 'guided-plan-storage'
    }
  )
)

