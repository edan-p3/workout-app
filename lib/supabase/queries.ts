import { supabase } from './client'
import type { Database } from './types'

type Tables = Database['public']['Tables']

// =====================================================
// WORKOUT QUERIES
// =====================================================

export const workoutQueries = {
  // Get all workouts for user
  async getAllWorkouts(userId: string) {
    return await supabase
      .from('workouts')
      .select(`
        *,
        program_days (*),
        exercises (
          *,
          exercise_sets (*)
        )
      `)
      .eq('user_id', userId)
      .order('workout_date', { ascending: false })
  },

  // Get workout by ID with full details
  async getWorkoutById(workoutId: string) {
    return await supabase
      .from('workouts')
      .select(`
        *,
        program_days (*),
        exercises (
          *,
          exercise_sets (*)
        )
      `)
      .eq('id', workoutId)
      .single()
  },

  // Create new workout
  async createWorkout(workout: Tables['workouts']['Insert']) {
    return await supabase
      .from('workouts')
      .insert(workout)
      .select()
      .single()
  },

  // Update workout
  async updateWorkout(workoutId: string, updates: Tables['workouts']['Update']) {
    return await supabase
      .from('workouts')
      .update(updates)
      .eq('id', workoutId)
      .select()
      .single()
  },

  // Delete workout
  async deleteWorkout(workoutId: string) {
    return await supabase
      .from('workouts')
      .delete()
      .eq('id', workoutId)
  },

  // Get workouts for date range
  async getWorkoutsInRange(userId: string, startDate: string, endDate: string) {
    return await supabase
      .from('workouts')
      .select(`
        *,
        program_days (day_name),
        exercises (id)
      `)
      .eq('user_id', userId)
      .gte('workout_date', startDate)
      .lte('workout_date', endDate)
      .order('workout_date', { ascending: false })
  },

  // Get recent workouts
  async getRecentWorkouts(userId: string, limit: number = 10) {
    return await supabase
      .from('workouts')
      .select(`
        *,
        program_days (day_name),
        exercises (
          id,
          exercise_name,
          exercise_type
        )
      `)
      .eq('user_id', userId)
      .eq('is_completed', true)
      .order('workout_date', { ascending: false })
      .limit(limit)
  },

  // Get active workout (not completed)
  async getActiveWorkout(userId: string) {
    return await supabase
      .from('workouts')
      .select(`
        *,
        program_days (*),
        exercises (
          *,
          exercise_sets (*)
        )
      `)
      .eq('user_id', userId)
      .eq('is_completed', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()
  },
}

// =====================================================
// EXERCISE QUERIES
// =====================================================

export const exerciseQueries = {
  // Add exercise to workout
  async createExercise(exercise: Tables['exercises']['Insert']) {
    return await supabase
      .from('exercises')
      .insert(exercise)
      .select()
      .single()
  },

  // Update exercise
  async updateExercise(exerciseId: string, updates: Tables['exercises']['Update']) {
    return await supabase
      .from('exercises')
      .update(updates)
      .eq('id', exerciseId)
      .select()
      .single()
  },

  // Delete exercise
  async deleteExercise(exerciseId: string) {
    return await supabase
      .from('exercises')
      .delete()
      .eq('id', exerciseId)
  },

  // Get exercise history
  async getExerciseHistory(userId: string, exerciseName: string, limit: number = 10) {
    return await supabase
      .from('exercises')
      .select(`
        *,
        exercise_sets (*),
        workouts!inner (
          user_id,
          workout_date,
          is_completed
        )
      `)
      .eq('workouts.user_id', userId)
      .eq('exercise_name', exerciseName)
      .eq('workouts.is_completed', true)
      .order('workouts.workout_date', { ascending: false })
      .limit(limit)
  },

  // Get exercise with sets
  async getExerciseWithSets(exerciseId: string) {
    return await supabase
      .from('exercises')
      .select(`
        *,
        exercise_sets (*)
      `)
      .eq('id', exerciseId)
      .single()
  },
}

// =====================================================
// EXERCISE SET QUERIES
// =====================================================

export const setQueries = {
  // Create set
  async createSet(set: Tables['exercise_sets']['Insert']) {
    return await supabase
      .from('exercise_sets')
      .insert(set)
      .select()
      .single()
  },

  // Update set
  async updateSet(setId: string, updates: Tables['exercise_sets']['Update']) {
    return await supabase
      .from('exercise_sets')
      .update(updates)
      .eq('id', setId)
      .select()
      .single()
  },

  // Delete set
  async deleteSet(setId: string) {
    return await supabase
      .from('exercise_sets')
      .delete()
      .eq('id', setId)
  },

  // Get sets for exercise
  async getSetsForExercise(exerciseId: string) {
    return await supabase
      .from('exercise_sets')
      .select('*')
      .eq('exercise_id', exerciseId)
      .order('set_number', { ascending: true })
  },
}

// =====================================================
// BODY WEIGHT QUERIES
// =====================================================

export const bodyWeightQueries = {
  // Get all weight logs
  async getAllWeightLogs(userId: string) {
    return await supabase
      .from('body_weight_logs')
      .select('*')
      .eq('user_id', userId)
      .order('log_date', { ascending: false })
  },

  // Get weight logs in range
  async getWeightLogsInRange(userId: string, startDate: string, endDate: string) {
    return await supabase
      .from('body_weight_logs')
      .select('*')
      .eq('user_id', userId)
      .gte('log_date', startDate)
      .lte('log_date', endDate)
      .order('log_date', { ascending: false })
  },

  // Create weight log
  async createWeightLog(log: Tables['body_weight_logs']['Insert']) {
    return await supabase
      .from('body_weight_logs')
      .insert(log)
      .select()
      .single()
  },

  // Update weight log
  async updateWeightLog(logId: string, updates: Tables['body_weight_logs']['Update']) {
    return await supabase
      .from('body_weight_logs')
      .update(updates)
      .eq('id', logId)
      .select()
      .single()
  },

  // Delete weight log
  async deleteWeightLog(logId: string) {
    return await supabase
      .from('body_weight_logs')
      .delete()
      .eq('id', logId)
  },

  // Get latest weight
  async getLatestWeight(userId: string) {
    return await supabase
      .from('body_weight_logs')
      .select('*')
      .eq('user_id', userId)
      .order('log_date', { ascending: false })
      .limit(1)
      .maybeSingle()
  },
}

// =====================================================
// GAMIFICATION QUERIES
// =====================================================

export const gamificationQueries = {
  // Get gamification data
  async getGamificationData(userId: string) {
    return await supabase
      .from('gamification_data')
      .select('*')
      .eq('user_id', userId)
      .single()
  },

  // Get personal records
  async getPersonalRecords(userId: string) {
    return await supabase
      .from('personal_records')
      .select('*')
      .eq('user_id', userId)
      .order('achieved_date', { ascending: false })
  },

  // Get recent PRs
  async getRecentPRs(userId: string, limit: number = 5) {
    return await supabase
      .from('personal_records')
      .select('*')
      .eq('user_id', userId)
      .order('achieved_date', { ascending: false })
      .limit(limit)
  },

  // Get PRs for specific exercise
  async getExercisePRs(userId: string, exerciseName: string) {
    return await supabase
      .from('personal_records')
      .select('*')
      .eq('user_id', userId)
      .eq('exercise_name', exerciseName)
      .order('record_type', { ascending: true })
  },

  // Update gamification data
  async updateGamificationData(userId: string, updates: Tables['gamification_data']['Update']) {
    return await supabase
      .from('gamification_data')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single()
  },
}

// =====================================================
// PROGRAM QUERIES
// =====================================================

export const programQueries = {
  // Get user's active program
  async getActiveProgram(userId: string) {
    return await supabase
      .from('workout_programs')
      .select(`
        *,
        program_days (*)
      `)
      .eq('user_id', userId)
      .eq('is_active', true)
      .maybeSingle()
  },

  // Get all programs
  async getAllPrograms(userId: string) {
    return await supabase
      .from('workout_programs')
      .select(`
        *,
        program_days (*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
  },

  // Create program
  async createProgram(program: Tables['workout_programs']['Insert']) {
    return await supabase
      .from('workout_programs')
      .insert(program)
      .select()
      .single()
  },

  // Update program
  async updateProgram(programId: string, updates: Tables['workout_programs']['Update']) {
    return await supabase
      .from('workout_programs')
      .update(updates)
      .eq('id', programId)
      .select()
      .single()
  },

  // Delete program
  async deleteProgram(programId: string) {
    return await supabase
      .from('workout_programs')
      .delete()
      .eq('id', programId)
  },

  // Set active program
  async setActiveProgram(userId: string, programId: string) {
    // First, deactivate all programs
    await supabase
      .from('workout_programs')
      .update({ is_active: false })
      .eq('user_id', userId)

    // Then activate the selected program
    return await supabase
      .from('workout_programs')
      .update({ is_active: true })
      .eq('id', programId)
      .select()
      .single()
  },

  // Create program day
  async createProgramDay(programDay: Tables['program_days']['Insert']) {
    return await supabase
      .from('program_days')
      .insert(programDay)
      .select()
      .single()
  },

  // Update program day
  async updateProgramDay(dayId: string, updates: Tables['program_days']['Update']) {
    return await supabase
      .from('program_days')
      .update(updates)
      .eq('id', dayId)
      .select()
      .single()
  },

  // Delete program day
  async deleteProgramDay(dayId: string) {
    return await supabase
      .from('program_days')
      .delete()
      .eq('id', dayId)
  },
}

// =====================================================
// EXERCISE LIBRARY QUERIES
// =====================================================

export const exerciseLibraryQueries = {
  // Search exercises
  async searchExercises(searchTerm: string) {
    return await supabase
      .from('exercise_library')
      .select('*')
      .textSearch('exercise_name', searchTerm)
      .limit(20)
  },

  // Get exercises by muscle group
  async getExercisesByMuscleGroup(muscleGroup: string) {
    return await supabase
      .from('exercise_library')
      .select('*')
      .contains('primary_muscle_groups', [muscleGroup])
      .order('exercise_name', { ascending: true })
  },

  // Get all exercises
  async getAllExercises() {
    return await supabase
      .from('exercise_library')
      .select('*')
      .order('exercise_name', { ascending: true })
  },

  // Get exercises by type
  async getExercisesByType(exerciseType: 'strength' | 'cardio') {
    return await supabase
      .from('exercise_library')
      .select('*')
      .eq('exercise_type', exerciseType)
      .order('exercise_name', { ascending: true })
  },

  // Create custom exercise
  async createCustomExercise(exercise: Tables['exercise_library']['Insert']) {
    return await supabase
      .from('exercise_library')
      .insert(exercise)
      .select()
      .single()
  },

  // Update custom exercise
  async updateCustomExercise(exerciseId: string, updates: Tables['exercise_library']['Update']) {
    return await supabase
      .from('exercise_library')
      .update(updates)
      .eq('id', exerciseId)
      .select()
      .single()
  },

  // Delete custom exercise
  async deleteCustomExercise(exerciseId: string) {
    return await supabase
      .from('exercise_library')
      .delete()
      .eq('id', exerciseId)
  },

  // Get user's custom exercises
  async getUserCustomExercises(userId: string) {
    return await supabase
      .from('exercise_library')
      .select('*')
      .eq('created_by', userId)
      .eq('is_custom', true)
      .order('exercise_name', { ascending: true })
  },
}

// =====================================================
// READINESS QUERIES
// =====================================================

export const readinessQueries = {
  // Get recent readiness logs
  async getRecentReadiness(userId: string, limit: number = 7) {
    return await supabase
      .from('readiness_logs')
      .select('*')
      .eq('user_id', userId)
      .order('log_date', { ascending: false })
      .limit(limit)
  },

  // Create readiness log
  async createReadinessLog(log: Tables['readiness_logs']['Insert']) {
    return await supabase
      .from('readiness_logs')
      .insert(log)
      .select()
      .single()
  },

  // Update readiness log
  async updateReadinessLog(logId: string, updates: Tables['readiness_logs']['Update']) {
    return await supabase
      .from('readiness_logs')
      .update(updates)
      .eq('id', logId)
      .select()
      .single()
  },

  // Delete readiness log
  async deleteReadinessLog(logId: string) {
    return await supabase
      .from('readiness_logs')
      .delete()
      .eq('id', logId)
  },

  // Get readiness for date
  async getReadinessForDate(userId: string, date: string) {
    return await supabase
      .from('readiness_logs')
      .select('*')
      .eq('user_id', userId)
      .eq('log_date', date)
      .maybeSingle()
  },
}

// =====================================================
// USER QUERIES
// =====================================================

export const userQueries = {
  // Get user profile
  async getUserProfile(userId: string) {
    return await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()
  },

  // Update user profile
  async updateUserProfile(userId: string, updates: Tables['users']['Update']) {
    return await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
  },

  // Update user settings
  async updateUserSettings(userId: string, settings: Record<string, any>) {
    return await supabase
      .from('users')
      .update({ settings })
      .eq('id', userId)
      .select()
      .single()
  },
}

// =====================================================
// DATABASE FUNCTIONS
// =====================================================

export const databaseFunctions = {
  // Calculate exercise volume
  async calculateExerciseVolume(exerciseId: string) {
    return await supabase.rpc('calculate_exercise_volume', {
      exercise_uuid: exerciseId,
    })
  },

  // Calculate workout volume
  async calculateWorkoutVolume(workoutId: string) {
    return await supabase.rpc('calculate_workout_volume', {
      workout_uuid: workoutId,
    })
  },

  // Update workout streak
  async updateWorkoutStreak(userId: string) {
    return await supabase.rpc('update_workout_streak', {
      user_uuid: userId,
    })
  },

  // Create default program
  async createDefaultProgram(userId: string) {
    return await supabase.rpc('create_default_program_for_user', {
      user_uuid: userId,
    })
  },
}

