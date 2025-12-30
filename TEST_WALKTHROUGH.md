# 🧪 Complete Backend Testing Walkthrough

Follow this step-by-step guide to test your entire backend implementation.

---

## Prerequisites Check ✅

Before starting, make sure you have:
- [ ] Node.js 18+ installed
- [ ] npm installed
- [ ] Supabase CLI installed (`npm install -g supabase`)

---

## Phase 1: Environment Setup (5 minutes)

### Step 1: Start Supabase

```bash
cd /Users/edandvora/Documents/workout-app
supabase start
```

**Expected Output:**
```
Started supabase local development setup.

API URL: http://localhost:54321
GraphQL URL: http://localhost:54321/graphql/v1
DB URL: postgresql://postgres:postgres@localhost:54322/postgres
Studio URL: http://localhost:54323
Inbucket URL: http://localhost:54324
JWT secret: super-secret-jwt-token-with-at-least-32-characters-long
anon key: eyJ...
service_role key: eyJ...
```

📝 **Save these values!** You'll need them.

---

### Step 2: Apply Migrations

```bash
supabase db push
```

**Expected Output:**
```
Applying migration 20240101000001_initial_schema.sql...
Applying migration 20240101000002_rls_policies.sql...
Applying migration 20240101000003_seed_data.sql...
✅ All migrations applied successfully!
```

---

### Step 3: Generate TypeScript Types

```bash
supabase gen types typescript --local > lib/supabase/types.ts
```

**Verify:** Check that `lib/supabase/types.ts` was created and is ~500+ lines.

---

### Step 4: Create .env.local

Create `.env.local` in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<paste-anon-key-from-step-1>
SUPABASE_SERVICE_ROLE_KEY=<paste-service-role-key-from-step-1>
```

---

## Phase 2: Database Structure Tests (10 minutes)

### Test 1: Verify Tables Exist

Open Supabase Studio: http://localhost:54323

Click **"Table Editor"** in the left sidebar.

**Expected Tables (11 total):**
- [ ] body_weight_logs
- [ ] exercise_library
- [ ] exercise_sets
- [ ] exercises
- [ ] gamification_data
- [ ] personal_records
- [ ] program_days
- [ ] readiness_logs
- [ ] users
- [ ] workout_programs
- [ ] workouts

✅ **Pass Criteria:** All 11 tables visible

---

### Test 2: Verify Seed Data

In Supabase Studio:
1. Click **exercise_library** table
2. Check the data

**Expected Result:**
- [ ] 60+ exercises present
- [ ] Various muscle groups (Chest, Back, Legs, etc.)
- [ ] Both 'strength' and 'cardio' types
- [ ] Equipment information filled

✅ **Pass Criteria:** 60+ exercises with complete data

---

### Test 3: Verify Indexes

In Supabase Studio, go to **SQL Editor** and run:

```sql
SELECT 
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE schemaname = 'public'
ORDER BY tablename, indexname;
```

**Expected Result:**
- [ ] Multiple indexes per table
- [ ] Indexes on user_id columns
- [ ] Indexes on date columns
- [ ] GIN indexes on text/array columns

✅ **Pass Criteria:** 15+ indexes created

---

### Test 4: Verify Functions

In SQL Editor, run:

```sql
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
ORDER BY routine_name;
```

**Expected Functions:**
- [ ] calculate_exercise_volume
- [ ] calculate_workout_volume
- [ ] check_and_create_personal_record
- [ ] create_default_program_for_user
- [ ] create_user_profile
- [ ] reset_weekly_stats
- [ ] update_gamification_on_workout_complete
- [ ] update_updated_at_column
- [ ] update_workout_streak

✅ **Pass Criteria:** All 9 functions present

---

### Test 5: Verify Triggers

In SQL Editor, run:

```sql
SELECT trigger_name, event_object_table, action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;
```

**Expected Triggers:**
- [ ] on_auth_user_created
- [ ] on_workout_completed
- [ ] on_set_completed
- [ ] set_updated_at (on multiple tables)

✅ **Pass Criteria:** 7+ triggers present

---

## Phase 3: Security Tests (15 minutes)

### Test 6: Verify RLS is Enabled

In SQL Editor, run:

```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```

**Expected Result:**
- [ ] All tables show `rowsecurity = true`

✅ **Pass Criteria:** RLS enabled on all 11 tables

---

### Test 7: Count RLS Policies

In SQL Editor, run:

```sql
SELECT COUNT(*) as total_policies
FROM pg_policies
WHERE schemaname = 'public';
```

**Expected Result:**
- [ ] 40+ policies

✅ **Pass Criteria:** At least 40 policies

---

### Test 8: Test User Isolation (Manual)

We'll test this in Phase 4 with actual users.

---

## Phase 4: Application Integration Tests (20 minutes)

### Step 1: Start the Development Server

```bash
npm run dev
```

Visit: http://localhost:3000

---

### Test 9: Test Authentication

1. **Sign Up:**
   - Go to `/signup`
   - Enter email: `test1@example.com`
   - Enter password: `testpassword123`
   - Click Sign Up

**Expected Result:**
- [ ] Account created successfully
- [ ] Redirected to dashboard

2. **Check Auto-Created Data:**

Open Supabase Studio > SQL Editor:

```sql
-- Find your user ID (replace email)
SELECT id FROM auth.users WHERE email = 'test1@example.com';

-- Check if profile was auto-created
SELECT * FROM users WHERE email = 'test1@example.com';

-- Check if gamification was auto-created
SELECT * FROM gamification_data 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'test1@example.com');
```

**Expected Result:**
- [ ] User exists in `auth.users`
- [ ] Profile exists in `users`
- [ ] Gamification row exists with default values (0 points, 0 streak, 0 workouts)

✅ **Pass Criteria:** Profile and gamification auto-created on signup

---

### Test 10: Test Workout Creation

**Create a test API route** to verify queries work:

Create `app/api/test/route.ts`:

```typescript
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'
import { workoutQueries, exerciseQueries, setQueries, gamificationQueries } from '@/lib/supabase/queries'

export async function GET() {
  try {
    // Test 1: Check connection
    const { data: exercises, error: exercisesError } = await supabase
      .from('exercise_library')
      .select('*')
      .limit(5)

    if (exercisesError) throw exercisesError

    // Test 2: Check auth
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError) {
      return NextResponse.json({
        success: false,
        message: 'Not authenticated',
        tests: {
          connection: true,
          exercises_count: exercises?.length || 0,
          authenticated: false
        }
      })
    }

    // Test 3: Get user data
    const { data: gamification } = await gamificationQueries.getGamificationData(user.id)
    const { data: workouts } = await workoutQueries.getAllWorkouts(user.id)

    return NextResponse.json({
      success: true,
      message: 'All tests passed!',
      tests: {
        connection: true,
        exercises_count: exercises?.length || 0,
        authenticated: true,
        user_id: user.id,
        user_email: user.email,
        gamification_exists: !!gamification,
        total_points: gamification?.total_points || 0,
        total_workouts: gamification?.total_workouts || 0,
        workouts_count: workouts?.length || 0
      }
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}
```

**Test it:**
1. Make sure you're logged in
2. Visit: http://localhost:3000/api/test
3. Check the JSON response

**Expected Result:**
```json
{
  "success": true,
  "message": "All tests passed!",
  "tests": {
    "connection": true,
    "exercises_count": 5,
    "authenticated": true,
    "user_id": "...",
    "user_email": "test1@example.com",
    "gamification_exists": true,
    "total_points": 0,
    "total_workouts": 0,
    "workouts_count": 0
  }
}
```

✅ **Pass Criteria:** All tests return true/expected values

---

### Test 11: Test Complete Workout Flow

Now let's test the full workflow in SQL:

```sql
-- 1. Create a workout (replace USER_ID with your actual user ID)
INSERT INTO workouts (user_id, workout_date, start_time)
VALUES ('YOUR-USER-ID-HERE', CURRENT_DATE, now())
RETURNING id;

-- Save the returned workout ID!

-- 2. Add an exercise (replace WORKOUT_ID)
INSERT INTO exercises (workout_id, exercise_type, exercise_name, target_sets, target_reps_min, target_reps_max)
VALUES ('YOUR-WORKOUT-ID-HERE', 'strength', 'Barbell Bench Press', 3, 8, 12)
RETURNING id;

-- Save the returned exercise ID!

-- 3. Add sets (replace EXERCISE_ID)
INSERT INTO exercise_sets (exercise_id, set_number, reps, weight, is_completed, is_warmup)
VALUES 
  ('YOUR-EXERCISE-ID-HERE', 1, 10, 135, true, false),
  ('YOUR-EXERCISE-ID-HERE', 2, 10, 135, true, false),
  ('YOUR-EXERCISE-ID-HERE', 3, 8, 140, true, false);

-- 4. Check if volume was calculated
SELECT calculate_exercise_volume('YOUR-EXERCISE-ID-HERE');
-- Expected: (10*135) + (10*135) + (8*140) = 3820

-- 5. Complete the workout (replace WORKOUT_ID and USER_ID)
UPDATE workouts 
SET is_completed = true, end_time = now()
WHERE id = 'YOUR-WORKOUT-ID-HERE';

-- 6. Check if gamification was updated
SELECT 
  total_points, 
  total_workouts, 
  current_streak,
  weekly_stats
FROM gamification_data 
WHERE user_id = 'YOUR-USER-ID-HERE';
```

**Expected Results:**
- [ ] Volume calculation: 3820
- [ ] total_points increased by 10
- [ ] total_workouts increased to 1
- [ ] current_streak is 1
- [ ] weekly_stats shows 1 workout completed

✅ **Pass Criteria:** Gamification auto-updated with correct values

---

### Test 12: Test Personal Record Detection

Continuing from Test 11, check for PRs:

```sql
-- Check if PRs were created (replace USER_ID)
SELECT 
  exercise_name,
  record_type,
  value,
  achieved_date
FROM personal_records
WHERE user_id = 'YOUR-USER-ID-HERE'
AND exercise_name = 'Barbell Bench Press'
ORDER BY record_type;
```

**Expected Results:**
- [ ] max_weight PR: 140
- [ ] max_volume PR: 3820
- [ ] max_reps PR: 10
- [ ] Bonus points awarded (check gamification_data, should have +25 points for PR)

✅ **Pass Criteria:** All 3 PR types auto-created

---

### Test 13: Test RLS User Isolation

Create a second test user:

```sql
-- In Supabase Studio, go to Authentication > Users > Add User
-- Email: test2@example.com
-- Password: testpassword123
```

Or sign up through the app.

Then in SQL Editor:

```sql
-- Set context to user 2
SET request.jwt.claims.sub = 'USER-2-ID-HERE';

-- Try to access user 1's workouts
SELECT * FROM workouts WHERE user_id = 'USER-1-ID-HERE';
-- Expected: Empty result (RLS blocks access)

-- Try to access user 1's gamification
SELECT * FROM gamification_data WHERE user_id = 'USER-1-ID-HERE';
-- Expected: Empty result (RLS blocks access)
```

✅ **Pass Criteria:** User 2 cannot access User 1's data

---

### Test 14: Test Streak Calculation

Create workouts on consecutive days:

```sql
-- Add more workouts for User 1 (replace USER_ID)
INSERT INTO workouts (user_id, workout_date, start_time, is_completed)
VALUES 
  ('YOUR-USER-ID', CURRENT_DATE - INTERVAL '1 day', now(), true),
  ('YOUR-USER-ID', CURRENT_DATE - INTERVAL '2 days', now(), true);

-- Manually trigger streak update
SELECT update_workout_streak('YOUR-USER-ID');

-- Check streak
SELECT current_streak, longest_streak, total_workouts
FROM gamification_data
WHERE user_id = 'YOUR-USER-ID';
```

**Expected Results:**
- [ ] current_streak: 3 (or more)
- [ ] longest_streak: 3 (or more)
- [ ] total_workouts: 3 (or more)

✅ **Pass Criteria:** Streak correctly calculated

---

## Phase 5: TypeScript Integration Tests (10 minutes)

### Test 15: Test Query Helpers

Create a test page: `app/test-queries/page.tsx`:

```typescript
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import {
  workoutQueries,
  exerciseQueries,
  exerciseLibraryQueries,
  gamificationQueries,
} from '@/lib/supabase/queries'

export default function TestQueriesPage() {
  const [results, setResults] = useState<any>({})
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    runTests()
  }, [])

  async function runTests() {
    const tests: any = {}

    // Test 1: Auth
    const { data: { user } } = await supabase.auth.getUser()
    tests.authenticated = !!user
    tests.userEmail = user?.email || 'Not logged in'
    setUserId(user?.id || null)

    if (!user) {
      setResults(tests)
      return
    }

    // Test 2: Get exercises from library
    const { data: exercises, error: exercisesError } = 
      await exerciseLibraryQueries.getAllExercises()
    tests.exerciseLibrary = {
      success: !exercisesError,
      count: exercises?.length || 0,
      error: exercisesError?.message
    }

    // Test 3: Get workouts
    const { data: workouts, error: workoutsError } = 
      await workoutQueries.getAllWorkouts(user.id)
    tests.workouts = {
      success: !workoutsError,
      count: workouts?.length || 0,
      error: workoutsError?.message
    }

    // Test 4: Get gamification
    const { data: gamification, error: gamificationError } = 
      await gamificationQueries.getGamificationData(user.id)
    tests.gamification = {
      success: !gamificationError,
      points: gamification?.total_points || 0,
      workouts: gamification?.total_workouts || 0,
      streak: gamification?.current_streak || 0,
      error: gamificationError?.message
    }

    // Test 5: Get PRs
    const { data: prs, error: prsError } = 
      await gamificationQueries.getPersonalRecords(user.id)
    tests.personalRecords = {
      success: !prsError,
      count: prs?.length || 0,
      error: prsError?.message
    }

    // Test 6: Search exercises
    const { data: searchResults, error: searchError } = 
      await exerciseLibraryQueries.searchExercises('bench')
    tests.exerciseSearch = {
      success: !searchError,
      count: searchResults?.length || 0,
      error: searchError?.message
    }

    setResults(tests)
  }

  async function createTestWorkout() {
    if (!userId) return

    try {
      // Create workout
      const { data: workout, error: workoutError } = await workoutQueries.createWorkout({
        user_id: userId,
        workout_date: new Date().toISOString().split('T')[0],
      })

      if (workoutError) throw workoutError

      // Add exercise
      const { data: exercise, error: exerciseError } = await exerciseQueries.createExercise({
        workout_id: workout!.id,
        exercise_type: 'strength',
        exercise_name: 'Test Exercise',
        target_sets: 3,
      })

      if (exerciseError) throw exerciseError

      alert('Test workout created! ID: ' + workout!.id)
      runTests() // Refresh
    } catch (error: any) {
      alert('Error: ' + error.message)
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Backend Query Tests</h1>
      
      <button
        onClick={runTests}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4 mr-2"
      >
        Run Tests Again
      </button>

      {userId && (
        <button
          onClick={createTestWorkout}
          className="bg-green-500 text-white px-4 py-2 rounded mb-4"
        >
          Create Test Workout
        </button>
      )}

      <pre className="bg-gray-100 p-4 rounded overflow-auto">
        {JSON.stringify(results, null, 2)}
      </pre>
    </div>
  )
}
```

**Visit:** http://localhost:3000/test-queries

**Expected Results:**
```json
{
  "authenticated": true,
  "userEmail": "test1@example.com",
  "exerciseLibrary": {
    "success": true,
    "count": 60+
  },
  "workouts": {
    "success": true,
    "count": 1+
  },
  "gamification": {
    "success": true,
    "points": 10+,
    "workouts": 1+,
    "streak": 1+
  },
  "personalRecords": {
    "success": true,
    "count": 3+
  },
  "exerciseSearch": {
    "success": true,
    "count": 4+
  }
}
```

✅ **Pass Criteria:** All queries return success: true

---

## Phase 6: Real-time Subscription Tests (5 minutes)

### Test 16: Test Real-time Updates

Add to your test page or create new:

```typescript
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { subscriptions } from '@/lib/supabase/subscriptions'

export default function TestRealtimePage() {
  const [events, setEvents] = useState<any[]>([])
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    async function setup() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      
      setUserId(user.id)

      // Subscribe to workouts
      const channel = subscriptions.subscribeToWorkouts(user.id, (payload) => {
        setEvents(prev => [...prev, {
          type: 'workout',
          event: payload.eventType,
          time: new Date().toISOString(),
          data: payload.new
        }])
      })

      // Subscribe to PRs
      subscriptions.subscribeToPRs(user.id, (payload) => {
        setEvents(prev => [...prev, {
          type: 'PR',
          event: 'INSERT',
          time: new Date().toISOString(),
          data: payload.new
        }])
      })

      return () => {
        subscriptions.unsubscribe(channel)
      }
    }

    setup()
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Real-time Subscription Test</h1>
      <p className="mb-4">Watching for workout and PR updates...</p>
      
      <div className="bg-gray-100 p-4 rounded">
        <h2 className="font-bold mb-2">Events Received:</h2>
        {events.length === 0 ? (
          <p>No events yet. Create a workout in another tab to test!</p>
        ) : (
          events.map((event, i) => (
            <div key={i} className="mb-2 p-2 bg-white rounded">
              <strong>{event.type}</strong> - {event.event} at {event.time}
              <pre className="text-xs">{JSON.stringify(event.data, null, 2)}</pre>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
```

**Test Steps:**
1. Open this page in one browser tab
2. In another tab, create a workout or update data
3. Watch for events to appear in real-time

✅ **Pass Criteria:** Events appear within 1-2 seconds

---

## Phase 7: Edge Functions Tests (5 minutes)

### Test 17: Test Edge Functions Locally

```bash
# Start edge functions locally
supabase functions serve
```

In another terminal:

```bash
# Test reset-weekly-stats
curl -X POST http://localhost:54321/functions/v1/reset-weekly-stats \
  -H "Authorization: Bearer YOUR-SERVICE-ROLE-KEY"

# Expected response:
# {"success":true,"message":"Weekly stats reset successfully","timestamp":"..."}

# Test calculate-weekly-comparison (requires user token)
# First get a user access token (from browser console after login):
# const { data: { session } } = await supabase.auth.getSession()
# console.log(session.access_token)

curl -X POST http://localhost:54321/functions/v1/calculate-weekly-comparison \
  -H "Authorization: Bearer USER-ACCESS-TOKEN"

# Expected response includes current_week, previous_week, changes
```

✅ **Pass Criteria:** Both functions return valid JSON responses

---

## ✅ Final Checklist

Run through this checklist to ensure everything works:

### Database
- [ ] All 11 tables exist
- [ ] 60+ exercises in library
- [ ] 15+ indexes created
- [ ] 9 functions present
- [ ] 7+ triggers active
- [ ] RLS enabled on all tables
- [ ] 40+ RLS policies active

### Authentication & Security
- [ ] Users can sign up
- [ ] Profile auto-created on signup
- [ ] Gamification auto-created
- [ ] Users isolated (cannot access each other's data)
- [ ] RLS policies enforced

### Core Features
- [ ] Can create workouts
- [ ] Can add exercises
- [ ] Can log sets
- [ ] Volume calculations work
- [ ] Completing workout updates points
- [ ] PRs auto-detected
- [ ] Streaks calculated correctly
- [ ] Weekly stats tracked

### TypeScript Integration
- [ ] Types generated
- [ ] Query helpers work
- [ ] No TypeScript errors
- [ ] All queries type-safe

### Real-time
- [ ] Subscriptions connect
- [ ] Events received in real-time
- [ ] Multiple subscriptions work
- [ ] Cleanup works properly

### Edge Functions
- [ ] reset-weekly-stats responds
- [ ] calculate-weekly-comparison responds
- [ ] Both functions process correctly

---

## 🎉 Success Criteria

Your backend is working perfectly if:

1. ✅ All database tests pass
2. ✅ All security tests pass
3. ✅ All application tests pass
4. ✅ All TypeScript tests pass
5. ✅ Real-time subscriptions work
6. ✅ Edge functions respond correctly

---

## 🐛 Common Issues & Solutions

### Issue: "Supabase not running"
```bash
supabase start
```

### Issue: "Cannot connect to database"
```bash
supabase stop
supabase start
```

### Issue: "RLS policy error"
Make sure you're logged in:
```typescript
const { data: { user } } = await supabase.auth.getUser()
console.log(user) // Should not be null
```

### Issue: "Types out of sync"
```bash
supabase gen types typescript --local > lib/supabase/types.ts
```

### Issue: "Migrations not applied"
```bash
supabase db reset  # WARNING: Deletes all data
```

---

## 📊 Expected Performance

- Database queries: < 50ms
- Workout creation: < 100ms
- PR detection: < 200ms
- Real-time latency: < 2 seconds
- Edge function response: < 500ms

---

**If all tests pass, your backend is production-ready! 🎉**

