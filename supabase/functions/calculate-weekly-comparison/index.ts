import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface WeeklyComparison {
  current_week: {
    total_volume: number
    workout_count: number
    cardio_minutes: number
  }
  previous_week: {
    total_volume: number
    workout_count: number
    cardio_minutes: number
  }
  changes: {
    volume_delta: number
    volume_change_type: 'increase' | 'decrease' | 'maintained'
    workout_frequency_delta: number
    cardio_delta: number
  }
}

serve(async (req) => {
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get user from JWT
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const today = new Date()
    const currentWeekStart = new Date(today)
    currentWeekStart.setDate(today.getDate() - today.getDay())
    currentWeekStart.setHours(0, 0, 0, 0)
    
    const previousWeekStart = new Date(currentWeekStart)
    previousWeekStart.setDate(previousWeekStart.getDate() - 7)

    // Fetch current week data
    const { data: currentWeekWorkouts, error: currentWeekError } = await supabaseClient
      .from('workouts')
      .select(`
        *,
        exercises (
          *,
          exercise_sets (*)
        )
      `)
      .eq('user_id', user.id)
      .gte('workout_date', currentWeekStart.toISOString().split('T')[0])
      .eq('is_completed', true)

    if (currentWeekError) {
      throw currentWeekError
    }

    // Fetch previous week data
    const { data: previousWeekWorkouts, error: previousWeekError } = await supabaseClient
      .from('workouts')
      .select(`
        *,
        exercises (
          *,
          exercise_sets (*)
        )
      `)
      .eq('user_id', user.id)
      .gte('workout_date', previousWeekStart.toISOString().split('T')[0])
      .lt('workout_date', currentWeekStart.toISOString().split('T')[0])
      .eq('is_completed', true)

    if (previousWeekError) {
      throw previousWeekError
    }

    // Calculate volumes and stats
    const calculateStats = (workouts: any[]) => {
      let totalVolume = 0
      let cardioMinutes = 0

      workouts?.forEach((workout) => {
        workout.exercises?.forEach((exercise: any) => {
          if (exercise.exercise_type === 'strength') {
            exercise.exercise_sets?.forEach((set: any) => {
              if (set.is_completed && !set.is_warmup) {
                totalVolume += set.weight * set.reps
              }
            })
          } else if (exercise.exercise_type === 'cardio') {
            cardioMinutes += exercise.duration_minutes || 0
          }
        })
      })

      return {
        total_volume: totalVolume,
        workout_count: workouts?.length || 0,
        cardio_minutes: cardioMinutes,
      }
    }

    const currentStats = calculateStats(currentWeekWorkouts || [])
    const previousStats = calculateStats(previousWeekWorkouts || [])

    const volumeDelta =
      previousStats.total_volume > 0
        ? ((currentStats.total_volume - previousStats.total_volume) /
            previousStats.total_volume) *
          100
        : currentStats.total_volume > 0 ? 100 : 0

    const comparison: WeeklyComparison = {
      current_week: currentStats,
      previous_week: previousStats,
      changes: {
        volume_delta: Math.round(volumeDelta * 100) / 100,
        volume_change_type:
          volumeDelta > 5 ? 'increase' : volumeDelta < -5 ? 'decrease' : 'maintained',
        workout_frequency_delta:
          currentStats.workout_count - previousStats.workout_count,
        cardio_delta: currentStats.cardio_minutes - previousStats.cardio_minutes,
      },
    }

    return new Response(JSON.stringify(comparison), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: err instanceof Error ? err.message : 'Unknown error' 
      }), 
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
})

