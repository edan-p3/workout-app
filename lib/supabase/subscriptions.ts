import { supabase } from './client'
import { RealtimeChannel } from '@supabase/supabase-js'

// =====================================================
// REAL-TIME SUBSCRIPTIONS
// =====================================================

export const subscriptions = {
  // Subscribe to workout updates
  subscribeToWorkouts(
    userId: string,
    callback: (payload: any) => void
  ): RealtimeChannel {
    return supabase
      .channel('workouts-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'workouts',
          filter: `user_id=eq.${userId}`,
        },
        callback
      )
      .subscribe()
  },

  // Subscribe to specific workout
  subscribeToWorkout(
    workoutId: string,
    callback: (payload: any) => void
  ): RealtimeChannel {
    return supabase
      .channel(`workout-${workoutId}-channel`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'workouts',
          filter: `id=eq.${workoutId}`,
        },
        callback
      )
      .subscribe()
  },

  // Subscribe to exercises in a workout
  subscribeToExercises(
    workoutId: string,
    callback: (payload: any) => void
  ): RealtimeChannel {
    return supabase
      .channel(`exercises-${workoutId}-channel`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'exercises',
          filter: `workout_id=eq.${workoutId}`,
        },
        callback
      )
      .subscribe()
  },

  // Subscribe to exercise sets
  subscribeToExerciseSets(
    exerciseId: string,
    callback: (payload: any) => void
  ): RealtimeChannel {
    return supabase
      .channel(`sets-${exerciseId}-channel`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'exercise_sets',
          filter: `exercise_id=eq.${exerciseId}`,
        },
        callback
      )
      .subscribe()
  },

  // Subscribe to gamification updates
  subscribeToGamification(
    userId: string,
    callback: (payload: any) => void
  ): RealtimeChannel {
    return supabase
      .channel('gamification-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'gamification_data',
          filter: `user_id=eq.${userId}`,
        },
        callback
      )
      .subscribe()
  },

  // Subscribe to personal records
  subscribeToPRs(
    userId: string,
    callback: (payload: any) => void
  ): RealtimeChannel {
    return supabase
      .channel('prs-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'personal_records',
          filter: `user_id=eq.${userId}`,
        },
        callback
      )
      .subscribe()
  },

  // Subscribe to body weight logs
  subscribeToBodyWeight(
    userId: string,
    callback: (payload: any) => void
  ): RealtimeChannel {
    return supabase
      .channel('body-weight-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'body_weight_logs',
          filter: `user_id=eq.${userId}`,
        },
        callback
      )
      .subscribe()
  },

  // Subscribe to readiness logs
  subscribeToReadiness(
    userId: string,
    callback: (payload: any) => void
  ): RealtimeChannel {
    return supabase
      .channel('readiness-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'readiness_logs',
          filter: `user_id=eq.${userId}`,
        },
        callback
      )
      .subscribe()
  },

  // Subscribe to workout programs
  subscribeToPrograms(
    userId: string,
    callback: (payload: any) => void
  ): RealtimeChannel {
    return supabase
      .channel('programs-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'workout_programs',
          filter: `user_id=eq.${userId}`,
        },
        callback
      )
      .subscribe()
  },

  // Unsubscribe from channel
  unsubscribe(channel: RealtimeChannel) {
    supabase.removeChannel(channel)
  },

  // Unsubscribe from all channels
  unsubscribeAll() {
    supabase.removeAllChannels()
  },
}

// =====================================================
// SUBSCRIPTION HOOKS (for React components)
// =====================================================

export type SubscriptionCallback = (payload: any) => void

export interface UseSubscriptionOptions {
  userId?: string
  workoutId?: string
  exerciseId?: string
  onInsert?: SubscriptionCallback
  onUpdate?: SubscriptionCallback
  onDelete?: SubscriptionCallback
  onChange?: SubscriptionCallback
}

// Helper to create a subscription with lifecycle management
export const createSubscription = (
  channelName: string,
  table: string,
  filter: string,
  callback: SubscriptionCallback
): RealtimeChannel => {
  return supabase
    .channel(channelName)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table,
        filter,
      },
      callback
    )
    .subscribe()
}

