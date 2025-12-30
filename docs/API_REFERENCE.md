# Workout Tracker - API Reference

Complete reference for all database queries, functions, and subscriptions.

## Table of Contents

- [Workout Queries](#workout-queries)
- [Exercise Queries](#exercise-queries)
- [Set Queries](#set-queries)
- [Body Weight Queries](#body-weight-queries)
- [Gamification Queries](#gamification-queries)
- [Program Queries](#program-queries)
- [Exercise Library Queries](#exercise-library-queries)
- [Readiness Queries](#readiness-queries)
- [User Queries](#user-queries)
- [Database Functions](#database-functions)
- [Real-time Subscriptions](#real-time-subscriptions)

---

## Workout Queries

Import: `import { workoutQueries } from '@/lib/supabase/queries'`

### `getAllWorkouts(userId: string)`

Get all workouts for a user with full exercise and set details.

```typescript
const { data, error } = await workoutQueries.getAllWorkouts(userId)
```

**Returns**: Array of workouts with nested exercises and sets

---

### `getWorkoutById(workoutId: string)`

Get a specific workout with full details.

```typescript
const { data, error } = await workoutQueries.getWorkoutById(workoutId)
```

**Returns**: Single workout object

---

### `createWorkout(workout: WorkoutInsert)`

Create a new workout.

```typescript
const { data, error } = await workoutQueries.createWorkout({
  user_id: userId,
  workout_date: '2024-01-01',
  start_time: new Date().toISOString(),
})
```

**Returns**: Created workout object

---

### `updateWorkout(workoutId: string, updates: WorkoutUpdate)`

Update an existing workout.

```typescript
const { data, error } = await workoutQueries.updateWorkout(workoutId, {
  is_completed: true,
  end_time: new Date().toISOString(),
  notes: 'Great workout!',
})
```

**Returns**: Updated workout object

---

### `deleteWorkout(workoutId: string)`

Delete a workout (cascades to exercises and sets).

```typescript
const { error } = await workoutQueries.deleteWorkout(workoutId)
```

---

### `getWorkoutsInRange(userId: string, startDate: string, endDate: string)`

Get workouts within a date range.

```typescript
const { data, error } = await workoutQueries.getWorkoutsInRange(
  userId,
  '2024-01-01',
  '2024-01-31'
)
```

---

### `getRecentWorkouts(userId: string, limit?: number)`

Get recent completed workouts (default limit: 10).

```typescript
const { data, error } = await workoutQueries.getRecentWorkouts(userId, 5)
```

---

### `getActiveWorkout(userId: string)`

Get the current active (not completed) workout.

```typescript
const { data, error } = await workoutQueries.getActiveWorkout(userId)
```

---

## Exercise Queries

Import: `import { exerciseQueries } from '@/lib/supabase/queries'`

### `createExercise(exercise: ExerciseInsert)`

Add an exercise to a workout.

```typescript
const { data, error } = await exerciseQueries.createExercise({
  workout_id: workoutId,
  exercise_type: 'strength',
  exercise_name: 'Barbell Bench Press',
  target_sets: 4,
  target_reps_min: 8,
  target_reps_max: 12,
  order_index: 0,
})
```

---

### `updateExercise(exerciseId: string, updates: ExerciseUpdate)`

Update an exercise.

```typescript
const { data, error } = await exerciseQueries.updateExercise(exerciseId, {
  sets_completed: 4,
})
```

---

### `deleteExercise(exerciseId: string)`

Delete an exercise (cascades to sets).

```typescript
const { error } = await exerciseQueries.deleteExercise(exerciseId)
```

---

### `getExerciseHistory(userId: string, exerciseName: string, limit?: number)`

Get history for a specific exercise.

```typescript
const { data, error } = await exerciseQueries.getExerciseHistory(
  userId,
  'Barbell Bench Press',
  10
)
```

---

### `getExerciseWithSets(exerciseId: string)`

Get an exercise with all its sets.

```typescript
const { data, error } = await exerciseQueries.getExerciseWithSets(exerciseId)
```

---

## Set Queries

Import: `import { setQueries } from '@/lib/supabase/queries'`

### `createSet(set: SetInsert)`

Create a new set.

```typescript
const { data, error } = await setQueries.createSet({
  exercise_id: exerciseId,
  set_number: 1,
  reps: 10,
  weight: 135,
  is_completed: true,
  rpe: 7,
})
```

---

### `updateSet(setId: string, updates: SetUpdate)`

Update a set.

```typescript
const { data, error } = await setQueries.updateSet(setId, {
  reps: 12,
  weight: 140,
  is_completed: true,
})
```

---

### `deleteSet(setId: string)`

Delete a set.

```typescript
const { error } = await setQueries.deleteSet(setId)
```

---

### `getSetsForExercise(exerciseId: string)`

Get all sets for an exercise.

```typescript
const { data, error } = await setQueries.getSetsForExercise(exerciseId)
```

---

## Body Weight Queries

Import: `import { bodyWeightQueries } from '@/lib/supabase/queries'`

### `getAllWeightLogs(userId: string)`

Get all weight logs for a user.

```typescript
const { data, error } = await bodyWeightQueries.getAllWeightLogs(userId)
```

---

### `getWeightLogsInRange(userId: string, startDate: string, endDate: string)`

Get weight logs in a date range.

```typescript
const { data, error } = await bodyWeightQueries.getWeightLogsInRange(
  userId,
  '2024-01-01',
  '2024-01-31'
)
```

---

### `createWeightLog(log: WeightLogInsert)`

Create a weight log entry.

```typescript
const { data, error } = await bodyWeightQueries.createWeightLog({
  user_id: userId,
  weight: 185.5,
  log_date: '2024-01-01',
  notes: 'Morning weight',
})
```

---

### `updateWeightLog(logId: string, updates: WeightLogUpdate)`

Update a weight log.

```typescript
const { data, error } = await bodyWeightQueries.updateWeightLog(logId, {
  weight: 186.0,
})
```

---

### `deleteWeightLog(logId: string)`

Delete a weight log.

```typescript
const { error } = await bodyWeightQueries.deleteWeightLog(logId)
```

---

### `getLatestWeight(userId: string)`

Get the most recent weight entry.

```typescript
const { data, error } = await bodyWeightQueries.getLatestWeight(userId)
```

---

## Gamification Queries

Import: `import { gamificationQueries } from '@/lib/supabase/queries'`

### `getGamificationData(userId: string)`

Get gamification stats for a user.

```typescript
const { data, error } = await gamificationQueries.getGamificationData(userId)
// Returns: { total_points, current_streak, longest_streak, total_workouts, weekly_stats, ... }
```

---

### `getPersonalRecords(userId: string)`

Get all personal records for a user.

```typescript
const { data, error } = await gamificationQueries.getPersonalRecords(userId)
```

---

### `getRecentPRs(userId: string, limit?: number)`

Get recent personal records (default limit: 5).

```typescript
const { data, error } = await gamificationQueries.getRecentPRs(userId, 10)
```

---

### `getExercisePRs(userId: string, exerciseName: string)`

Get all PRs for a specific exercise.

```typescript
const { data, error } = await gamificationQueries.getExercisePRs(
  userId,
  'Barbell Bench Press'
)
// Returns: max_weight, max_volume, max_reps records
```

---

### `updateGamificationData(userId: string, updates: GamificationUpdate)`

Manually update gamification data (usually auto-updated by triggers).

```typescript
const { data, error } = await gamificationQueries.updateGamificationData(userId, {
  total_points: 1000,
})
```

---

## Program Queries

Import: `import { programQueries } from '@/lib/supabase/queries'`

### `getActiveProgram(userId: string)`

Get the user's active workout program.

```typescript
const { data, error } = await programQueries.getActiveProgram(userId)
```

---

### `getAllPrograms(userId: string)`

Get all programs for a user.

```typescript
const { data, error } = await programQueries.getAllPrograms(userId)
```

---

### `createProgram(program: ProgramInsert)`

Create a new workout program.

```typescript
const { data, error } = await programQueries.createProgram({
  user_id: userId,
  name: 'Push Pull Legs',
  description: '3-day split',
  is_active: true,
})
```

---

### `updateProgram(programId: string, updates: ProgramUpdate)`

Update a program.

```typescript
const { data, error } = await programQueries.updateProgram(programId, {
  name: 'Updated Program Name',
})
```

---

### `deleteProgram(programId: string)`

Delete a program (cascades to program days).

```typescript
const { error } = await programQueries.deleteProgram(programId)
```

---

### `setActiveProgram(userId: string, programId: string)`

Set a program as active (deactivates others).

```typescript
const { data, error } = await programQueries.setActiveProgram(userId, programId)
```

---

### `createProgramDay(programDay: ProgramDayInsert)`

Create a day in a program.

```typescript
const { data, error } = await programQueries.createProgramDay({
  program_id: programId,
  day_name: 'Push Day',
  day_order: 1,
  muscle_groups: ['Chest', 'Shoulders', 'Triceps'],
})
```

---

## Exercise Library Queries

Import: `import { exerciseLibraryQueries } from '@/lib/supabase/queries'`

### `searchExercises(searchTerm: string)`

Search exercises by name.

```typescript
const { data, error } = await exerciseLibraryQueries.searchExercises('bench')
```

---

### `getExercisesByMuscleGroup(muscleGroup: string)`

Get exercises for a muscle group.

```typescript
const { data, error } = await exerciseLibraryQueries.getExercisesByMuscleGroup('Chest')
```

---

### `getAllExercises()`

Get all exercises in the library.

```typescript
const { data, error } = await exerciseLibraryQueries.getAllExercises()
```

---

### `getExercisesByType(exerciseType: 'strength' | 'cardio')`

Get exercises by type.

```typescript
const { data, error } = await exerciseLibraryQueries.getExercisesByType('strength')
```

---

### `createCustomExercise(exercise: ExerciseLibraryInsert)`

Create a custom exercise.

```typescript
const { data, error } = await exerciseLibraryQueries.createCustomExercise({
  exercise_name: 'My Custom Exercise',
  exercise_type: 'strength',
  primary_muscle_groups: ['Chest'],
  is_custom: true,
  created_by: userId,
})
```

---

### `getUserCustomExercises(userId: string)`

Get user's custom exercises.

```typescript
const { data, error } = await exerciseLibraryQueries.getUserCustomExercises(userId)
```

---

## Readiness Queries

Import: `import { readinessQueries } from '@/lib/supabase/queries'`

### `getRecentReadiness(userId: string, limit?: number)`

Get recent readiness logs (default limit: 7).

```typescript
const { data, error } = await readinessQueries.getRecentReadiness(userId, 7)
```

---

### `createReadinessLog(log: ReadinessLogInsert)`

Create a readiness log.

```typescript
const { data, error } = await readinessQueries.createReadinessLog({
  user_id: userId,
  log_date: '2024-01-01',
  sleep_quality: 4,
  energy_level: 5,
  joint_comfort: 4,
  notes: 'Feeling great!',
})
// overall_readiness is auto-calculated
```

---

### `getReadinessForDate(userId: string, date: string)`

Get readiness log for a specific date.

```typescript
const { data, error } = await readinessQueries.getReadinessForDate(userId, '2024-01-01')
```

---

## User Queries

Import: `import { userQueries } from '@/lib/supabase/queries'`

### `getUserProfile(userId: string)`

Get user profile.

```typescript
const { data, error } = await userQueries.getUserProfile(userId)
```

---

### `updateUserProfile(userId: string, updates: UserUpdate)`

Update user profile.

```typescript
const { data, error } = await userQueries.updateUserProfile(userId, {
  email: 'newemail@example.com',
})
```

---

### `updateUserSettings(userId: string, settings: Record<string, any>)`

Update user settings.

```typescript
const { data, error } = await userQueries.updateUserSettings(userId, {
  default_rest_time: 120,
  weight_unit: 'kg',
  notifications_enabled: true,
})
```

---

## Database Functions

Import: `import { databaseFunctions } from '@/lib/supabase/queries'`

### `calculateExerciseVolume(exerciseId: string)`

Calculate total volume for an exercise.

```typescript
const { data, error } = await databaseFunctions.calculateExerciseVolume(exerciseId)
// Returns: sum of (weight * reps) for all completed non-warmup sets
```

---

### `calculateWorkoutVolume(workoutId: string)`

Calculate total volume for a workout.

```typescript
const { data, error } = await databaseFunctions.calculateWorkoutVolume(workoutId)
// Returns: sum of all exercise volumes in the workout
```

---

### `updateWorkoutStreak(userId: string)`

Manually recalculate workout streak.

```typescript
await databaseFunctions.updateWorkoutStreak(userId)
// Usually auto-called by triggers
```

---

### `createDefaultProgram(userId: string)`

Create a default Push/Pull/Legs program for a user.

```typescript
const { data, error } = await databaseFunctions.createDefaultProgram(userId)
// Returns: program_id
```

---

## Real-time Subscriptions

Import: `import { subscriptions } from '@/lib/supabase/subscriptions'`

### `subscribeToWorkouts(userId: string, callback: Function)`

Subscribe to workout changes.

```typescript
const channel = subscriptions.subscribeToWorkouts(userId, (payload) => {
  console.log('Event:', payload.eventType) // INSERT, UPDATE, DELETE
  console.log('New data:', payload.new)
  console.log('Old data:', payload.old)
})

// Cleanup
subscriptions.unsubscribe(channel)
```

---

### `subscribeToWorkout(workoutId: string, callback: Function)`

Subscribe to a specific workout.

```typescript
const channel = subscriptions.subscribeToWorkout(workoutId, (payload) => {
  // Handle workout updates
})
```

---

### `subscribeToExercises(workoutId: string, callback: Function)`

Subscribe to exercises in a workout.

```typescript
const channel = subscriptions.subscribeToExercises(workoutId, (payload) => {
  // Handle exercise changes
})
```

---

### `subscribeToExerciseSets(exerciseId: string, callback: Function)`

Subscribe to sets in an exercise.

```typescript
const channel = subscriptions.subscribeToExerciseSets(exerciseId, (payload) => {
  // Handle set changes
})
```

---

### `subscribeToGamification(userId: string, callback: Function)`

Subscribe to gamification updates.

```typescript
const channel = subscriptions.subscribeToGamification(userId, (payload) => {
  // Handle points, streaks, etc.
})
```

---

### `subscribeToPRs(userId: string, callback: Function)`

Subscribe to new personal records.

```typescript
const channel = subscriptions.subscribeToPRs(userId, (payload) => {
  console.log('New PR!', payload.new)
  // Show celebration UI
})
```

---

### `subscribeToBodyWeight(userId: string, callback: Function)`

Subscribe to body weight changes.

```typescript
const channel = subscriptions.subscribeToBodyWeight(userId, (payload) => {
  // Handle weight log changes
})
```

---

### `unsubscribe(channel: RealtimeChannel)`

Unsubscribe from a specific channel.

```typescript
subscriptions.unsubscribe(channel)
```

---

### `unsubscribeAll()`

Unsubscribe from all channels.

```typescript
subscriptions.unsubscribeAll()
```

---

## Error Handling

All queries return a standard Supabase response:

```typescript
const { data, error } = await workoutQueries.getAllWorkouts(userId)

if (error) {
  console.error('Error:', error.message)
  // Handle error
} else {
  console.log('Data:', data)
  // Use data
}
```

## Type Safety

All queries are fully typed using the generated `Database` type:

```typescript
import type { Database } from '@/lib/supabase/types'

type Workout = Database['public']['Tables']['workouts']['Row']
type WorkoutInsert = Database['public']['Tables']['workouts']['Insert']
type WorkoutUpdate = Database['public']['Tables']['workouts']['Update']
```

---

**For more details, see the [Backend README](../supabase/README.md)**

