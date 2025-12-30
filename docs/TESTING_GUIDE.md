# Backend Testing Guide

Comprehensive testing guide for the Workout Tracker Supabase backend.

## Table of Contents

- [Setup Testing Environment](#setup-testing-environment)
- [Database Schema Tests](#database-schema-tests)
- [RLS Policy Tests](#rls-policy-tests)
- [Trigger Tests](#trigger-tests)
- [Function Tests](#function-tests)
- [Query Tests](#query-tests)
- [Real-time Tests](#real-time-tests)
- [Edge Function Tests](#edge-function-tests)
- [Integration Tests](#integration-tests)

---

## Setup Testing Environment

### 1. Start Local Supabase

```bash
supabase start
```

### 2. Create Test User

```sql
-- In Supabase Studio SQL Editor or via API
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'test@example.com',
  crypt('testpassword', gen_salt('bf')),
  now()
);
```

### 3. Set Test Context

```sql
-- Set the current user for testing
SET request.jwt.claims.sub = '00000000-0000-0000-0000-000000000001';
```

---

## Database Schema Tests

### Test Table Creation

```sql
-- Verify all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Expected tables:
-- body_weight_logs
-- exercise_library
-- exercise_sets
-- exercises
-- gamification_data
-- personal_records
-- program_days
-- readiness_logs
-- users
-- workout_programs
-- workouts
```

### Test Constraints

```sql
-- Test unique constraint on body_weight_logs
INSERT INTO body_weight_logs (user_id, weight, log_date)
VALUES ('00000000-0000-0000-0000-000000000001', 180, '2024-01-01');

-- This should fail (duplicate date)
INSERT INTO body_weight_logs (user_id, weight, log_date)
VALUES ('00000000-0000-0000-0000-000000000001', 181, '2024-01-01');
-- Expected: ERROR: duplicate key value violates unique constraint
```

### Test Foreign Keys

```sql
-- This should fail (invalid user_id)
INSERT INTO workouts (user_id, workout_date)
VALUES ('99999999-9999-9999-9999-999999999999', CURRENT_DATE);
-- Expected: ERROR: insert or update on table "workouts" violates foreign key constraint
```

### Test Check Constraints

```sql
-- This should fail (RPE out of range)
INSERT INTO exercise_sets (exercise_id, set_number, reps, weight, rpe)
VALUES ('some-uuid', 1, 10, 135, 11);
-- Expected: ERROR: new row violates check constraint
```

---

## RLS Policy Tests

### Test User Isolation

```sql
-- Create two test users
SET request.jwt.claims.sub = '00000000-0000-0000-0000-000000000001';

INSERT INTO workouts (user_id, workout_date)
VALUES ('00000000-0000-0000-0000-000000000001', CURRENT_DATE)
RETURNING id;

-- Switch to different user
SET request.jwt.claims.sub = '00000000-0000-0000-0000-000000000002';

-- Try to access first user's workout
SELECT * FROM workouts 
WHERE user_id = '00000000-0000-0000-0000-000000000001';
-- Expected: Empty result (RLS blocks access)
```

### Test Workout Programs Policy

```sql
-- As user 1
SET request.jwt.claims.sub = '00000000-0000-0000-0000-000000000001';

INSERT INTO workout_programs (user_id, name)
VALUES ('00000000-0000-0000-0000-000000000001', 'My Program')
RETURNING id;

-- As user 2, try to access user 1's program
SET request.jwt.claims.sub = '00000000-0000-0000-0000-000000000002';

SELECT * FROM workout_programs 
WHERE user_id = '00000000-0000-0000-0000-000000000001';
-- Expected: Empty result
```

### Test Exercise Library Policy

```sql
-- All authenticated users should see exercise library
SET request.jwt.claims.sub = '00000000-0000-0000-0000-000000000001';

SELECT COUNT(*) FROM exercise_library;
-- Expected: > 0 (should see all exercises)

-- But can only create custom exercises for themselves
INSERT INTO exercise_library (
  exercise_name, 
  exercise_type, 
  primary_muscle_groups, 
  is_custom, 
  created_by
)
VALUES (
  'My Custom Exercise',
  'strength',
  ARRAY['Chest'],
  true,
  '00000000-0000-0000-0000-000000000001'
);
-- Expected: Success

-- This should fail (wrong created_by)
INSERT INTO exercise_library (
  exercise_name, 
  exercise_type, 
  primary_muscle_groups, 
  is_custom, 
  created_by
)
VALUES (
  'Another Exercise',
  'strength',
  ARRAY['Back'],
  true,
  '00000000-0000-0000-0000-000000000002'
);
-- Expected: ERROR: new row violates row-level security policy
```

---

## Trigger Tests

### Test User Profile Creation Trigger

```sql
-- Insert a new auth user
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at)
VALUES (
  '00000000-0000-0000-0000-000000000003',
  'newuser@example.com',
  crypt('password', gen_salt('bf')),
  now()
);

-- Check if profile was auto-created
SELECT * FROM users WHERE id = '00000000-0000-0000-0000-000000000003';
-- Expected: 1 row

-- Check if gamification data was auto-created
SELECT * FROM gamification_data WHERE user_id = '00000000-0000-0000-0000-000000000003';
-- Expected: 1 row with default values
```

### Test Workout Completion Trigger

```sql
SET request.jwt.claims.sub = '00000000-0000-0000-0000-000000000001';

-- Get initial gamification data
SELECT total_points, total_workouts, current_streak 
FROM gamification_data 
WHERE user_id = '00000000-0000-0000-0000-000000000001';

-- Create and complete a workout
INSERT INTO workouts (user_id, workout_date, start_time)
VALUES ('00000000-0000-0000-0000-000000000001', CURRENT_DATE, now())
RETURNING id;

-- Mark it complete
UPDATE workouts 
SET is_completed = true 
WHERE user_id = '00000000-0000-0000-0000-000000000001'
AND workout_date = CURRENT_DATE;

-- Check updated gamification data
SELECT total_points, total_workouts, current_streak 
FROM gamification_data 
WHERE user_id = '00000000-0000-0000-0000-000000000001';
-- Expected: total_points increased by 10, total_workouts increased by 1
```

### Test Personal Record Trigger

```sql
-- Create workout and exercise
INSERT INTO workouts (user_id, workout_date, start_time)
VALUES ('00000000-0000-0000-0000-000000000001', CURRENT_DATE, now())
RETURNING id;
-- Save the workout_id

INSERT INTO exercises (workout_id, exercise_type, exercise_name)
VALUES ('workout-id-here', 'strength', 'Barbell Bench Press')
RETURNING id;
-- Save the exercise_id

-- Add sets
INSERT INTO exercise_sets (exercise_id, set_number, reps, weight, is_completed)
VALUES 
  ('exercise-id-here', 1, 10, 135, true),
  ('exercise-id-here', 2, 10, 135, true),
  ('exercise-id-here', 3, 8, 140, true);

-- Check if PR was created
SELECT * FROM personal_records 
WHERE user_id = '00000000-0000-0000-0000-000000000001'
AND exercise_name = 'Barbell Bench Press';
-- Expected: Records for max_weight, max_volume, max_reps

-- Check if bonus points were awarded
SELECT total_points FROM gamification_data 
WHERE user_id = '00000000-0000-0000-0000-000000000001';
-- Expected: Points increased by 25 (PR bonus)
```

### Test Updated_at Trigger

```sql
-- Create a workout program
INSERT INTO workout_programs (user_id, name, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Test Program',
  now(),
  now()
)
RETURNING id, created_at, updated_at;

-- Wait a moment, then update
SELECT pg_sleep(2);

UPDATE workout_programs 
SET name = 'Updated Program'
WHERE user_id = '00000000-0000-0000-0000-000000000001'
AND name = 'Test Program'
RETURNING created_at, updated_at;

-- Verify updated_at changed
-- Expected: updated_at > created_at
```

---

## Function Tests

### Test calculate_exercise_volume

```sql
-- Create test data
INSERT INTO workouts (id, user_id, workout_date)
VALUES ('test-workout-1', '00000000-0000-0000-0000-000000000001', CURRENT_DATE);

INSERT INTO exercises (id, workout_id, exercise_type, exercise_name)
VALUES ('test-exercise-1', 'test-workout-1', 'strength', 'Test Exercise');

INSERT INTO exercise_sets (exercise_id, set_number, reps, weight, is_completed, is_warmup)
VALUES 
  ('test-exercise-1', 1, 10, 100, true, false),
  ('test-exercise-1', 2, 10, 100, true, false),
  ('test-exercise-1', 3, 8, 105, true, false),
  ('test-exercise-1', 4, 5, 50, true, true); -- warmup, shouldn't count

-- Test function
SELECT calculate_exercise_volume('test-exercise-1');
-- Expected: (10*100) + (10*100) + (8*105) = 2840
```

### Test calculate_workout_volume

```sql
-- Using same workout, add another exercise
INSERT INTO exercises (id, workout_id, exercise_type, exercise_name)
VALUES ('test-exercise-2', 'test-workout-1', 'strength', 'Test Exercise 2');

INSERT INTO exercise_sets (exercise_id, set_number, reps, weight, is_completed)
VALUES 
  ('test-exercise-2', 1, 12, 50, true),
  ('test-exercise-2', 2, 12, 50, true);

-- Test function
SELECT calculate_workout_volume('test-workout-1');
-- Expected: 2840 + (12*50) + (12*50) = 4040
```

### Test update_workout_streak

```sql
-- Create workouts on consecutive days
INSERT INTO workouts (user_id, workout_date, is_completed)
VALUES 
  ('00000000-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '3 days', true),
  ('00000000-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '2 days', true),
  ('00000000-0000-0000-0000-000000000001', CURRENT_DATE, true);

-- Update streak
SELECT update_workout_streak('00000000-0000-0000-0000-000000000001');

-- Check streak
SELECT current_streak, longest_streak 
FROM gamification_data 
WHERE user_id = '00000000-0000-0000-0000-000000000001';
-- Expected: current_streak = 3, longest_streak = 3
```

### Test create_default_program_for_user

```sql
-- Create default program
SELECT create_default_program_for_user('00000000-0000-0000-0000-000000000001');

-- Verify program created
SELECT * FROM workout_programs 
WHERE user_id = '00000000-0000-0000-0000-000000000001'
AND name = 'Push Pull Legs';
-- Expected: 1 row

-- Verify days created
SELECT COUNT(*) FROM program_days pd
JOIN workout_programs wp ON wp.id = pd.program_id
WHERE wp.user_id = '00000000-0000-0000-0000-000000000001'
AND wp.name = 'Push Pull Legs';
-- Expected: 3 (Push, Pull, Legs)
```

---

## Query Tests

### Test TypeScript Queries

```typescript
// In a test file or Next.js API route
import { workoutQueries, exerciseQueries } from '@/lib/supabase/queries'

// Test getAllWorkouts
const { data: workouts, error } = await workoutQueries.getAllWorkouts(userId)
console.assert(!error, 'Should not have error')
console.assert(Array.isArray(workouts), 'Should return array')

// Test createWorkout
const { data: workout, error: createError } = await workoutQueries.createWorkout({
  user_id: userId,
  workout_date: new Date().toISOString().split('T')[0],
})
console.assert(!createError, 'Should create workout')
console.assert(workout?.id, 'Should have ID')

// Test getExerciseHistory
const { data: history, error: historyError } = await exerciseQueries.getExerciseHistory(
  userId,
  'Barbell Bench Press',
  5
)
console.assert(!historyError, 'Should not have error')
console.assert(history.length <= 5, 'Should respect limit')
```

---

## Real-time Tests

### Test Workout Subscription

```typescript
import { subscriptions } from '@/lib/supabase/subscriptions'

// Subscribe to workouts
const channel = subscriptions.subscribeToWorkouts(userId, (payload) => {
  console.log('Event:', payload.eventType)
  console.log('New:', payload.new)
  console.log('Old:', payload.old)
})

// In another tab/window, create a workout
// You should see the subscription fire

// Cleanup
subscriptions.unsubscribe(channel)
```

### Test PR Subscription

```typescript
// Subscribe to PRs
const channel = subscriptions.subscribeToPRs(userId, (payload) => {
  console.log('New PR!', payload.new)
  // Should trigger when a PR is auto-created
})

// Complete a workout with a new PR
// Subscription should fire
```

---

## Edge Function Tests

### Test reset-weekly-stats

```bash
# Start functions locally
supabase functions serve

# In another terminal, invoke
curl -X POST http://localhost:54321/functions/v1/reset-weekly-stats \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY"

# Expected response:
# {"success": true, "message": "Weekly stats reset successfully", "timestamp": "..."}
```

### Test calculate-weekly-comparison

```bash
# Get user access token first (from auth)
curl -X POST http://localhost:54321/functions/v1/calculate-weekly-comparison \
  -H "Authorization: Bearer USER_ACCESS_TOKEN"

# Expected response:
# {
#   "current_week": { "total_volume": 10000, "workout_count": 3, ... },
#   "previous_week": { "total_volume": 9000, "workout_count": 3, ... },
#   "changes": { "volume_delta": 11.11, "volume_change_type": "increase", ... }
# }
```

---

## Integration Tests

### Complete Workout Flow Test

```typescript
// 1. Create user
const { data: authData } = await supabase.auth.signUp({
  email: 'test@example.com',
  password: 'testpassword123',
})
const userId = authData.user!.id

// 2. Verify profile auto-created
const { data: profile } = await userQueries.getUserProfile(userId)
console.assert(profile?.id === userId, 'Profile should exist')

// 3. Verify gamification auto-created
const { data: gamification } = await gamificationQueries.getGamificationData(userId)
console.assert(gamification?.total_points === 0, 'Should start with 0 points')

// 4. Create workout
const { data: workout } = await workoutQueries.createWorkout({
  user_id: userId,
  workout_date: new Date().toISOString().split('T')[0],
})

// 5. Add exercise
const { data: exercise } = await exerciseQueries.createExercise({
  workout_id: workout!.id,
  exercise_type: 'strength',
  exercise_name: 'Barbell Bench Press',
  target_sets: 3,
})

// 6. Add sets
await setQueries.createSet({
  exercise_id: exercise!.id,
  set_number: 1,
  reps: 10,
  weight: 135,
  is_completed: true,
})

// 7. Complete workout
await workoutQueries.updateWorkout(workout!.id, {
  is_completed: true,
  end_time: new Date().toISOString(),
})

// 8. Verify gamification updated
const { data: updatedGamification } = await gamificationQueries.getGamificationData(userId)
console.assert(updatedGamification!.total_points >= 10, 'Should have earned points')
console.assert(updatedGamification!.total_workouts === 1, 'Should have 1 workout')

// 9. Verify PR created
const { data: prs } = await gamificationQueries.getExercisePRs(userId, 'Barbell Bench Press')
console.assert(prs!.length > 0, 'Should have PRs')
```

---

## Performance Tests

### Test Query Performance

```sql
-- Enable timing
\timing on

-- Test workout query performance
EXPLAIN ANALYZE
SELECT * FROM workouts
WHERE user_id = '00000000-0000-0000-0000-000000000001'
ORDER BY workout_date DESC
LIMIT 10;
-- Expected: Should use index, < 10ms

-- Test exercise history query
EXPLAIN ANALYZE
SELECT e.*, es.*
FROM exercises e
JOIN workouts w ON w.id = e.workout_id
LEFT JOIN exercise_sets es ON es.exercise_id = e.id
WHERE w.user_id = '00000000-0000-0000-0000-000000000001'
AND e.exercise_name = 'Barbell Bench Press'
ORDER BY w.workout_date DESC
LIMIT 10;
-- Expected: Should use indexes, < 20ms
```

### Test Index Usage

```sql
-- Check if indexes are being used
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan as scans,
  idx_tup_read as tuples_read
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;
-- Expected: High scan counts on frequently used indexes
```

---

## Cleanup

```sql
-- Clean up test data
DELETE FROM workouts WHERE user_id = '00000000-0000-0000-0000-000000000001';
DELETE FROM workout_programs WHERE user_id = '00000000-0000-0000-0000-000000000001';
DELETE FROM body_weight_logs WHERE user_id = '00000000-0000-0000-0000-000000000001';
DELETE FROM gamification_data WHERE user_id = '00000000-0000-0000-0000-000000000001';
DELETE FROM users WHERE id = '00000000-0000-0000-0000-000000000001';
DELETE FROM auth.users WHERE id = '00000000-0000-0000-0000-000000000001';
```

---

## Automated Testing

For CI/CD, create a test suite:

```bash
# test/backend.test.ts
import { describe, it, expect } from 'vitest'
import { workoutQueries } from '@/lib/supabase/queries'

describe('Backend Tests', () => {
  it('should create workout', async () => {
    const { data, error } = await workoutQueries.createWorkout({
      user_id: testUserId,
      workout_date: '2024-01-01',
    })
    expect(error).toBeNull()
    expect(data).toHaveProperty('id')
  })

  // Add more tests...
})
```

Run with:

```bash
npm test
```

---

**All tests should pass before deploying to production!**

