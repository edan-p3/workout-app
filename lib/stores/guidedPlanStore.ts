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
          
          // Save to database
          const { data, error } = await supabase
            .from('guided_plans')
            .insert({
              user_id: user.id,
              name: plan.name,
              description: plan.description,
              plan_data: {
                input: plan.input,
                weeklySchedule: plan.weeklySchedule,
                progressionRules: plan.progressionRules
              },
              current_week: plan.currentWeek,
              is_active: true
            })
            .select()
            .single()
          
          if (error) {
            console.error('Error saving plan to database:', error)
            // Still save locally even if database fails
          } else if (data) {
            // Update plan with database ID
            plan.id = data.id
          }
          
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
        try {
          const { data: { user } } = await supabase.auth.getUser()
          if (!user) return
          
          // Load active plan from database
          const { data, error } = await supabase
            .from('guided_plans')
            .select('*')
            .eq('user_id', user.id)
            .eq('is_active', true)
            .order('created_at', { ascending: false })
            .limit(1)
          
          // Error handling - ignore "no rows" error (PGRST116)
          if (error && error.code !== 'PGRST116') {
            console.error('Error loading plan from database:', error)
            return
          }
          
          // If no data or empty array, user doesn't have a plan yet
          if (!data || data.length === 0) {
            console.log('No guided plan found for user')
            set({ currentPlan: null })
            return
          }
          
          // Get the first plan from the array
          const planData = data[0]
          
          if (planData && planData.plan_data) {
            // Reconstruct the plan from database
            const plan: GuidedPlan = {
              id: planData.id,
              userId: user.id,
              name: planData.name,
              description: planData.description || '',
              weeklySchedule: planData.plan_data.weeklySchedule,
              currentWeek: planData.current_week,
              startedAt: new Date(planData.started_at),
              input: planData.plan_data.input,
              progressionRules: planData.plan_data.progressionRules
            }
            
            console.log('Guided plan loaded successfully:', plan.name)
            set({ currentPlan: plan })
          }
        } catch (error) {
          console.error('Error loading guided plan:', error)
        }
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

