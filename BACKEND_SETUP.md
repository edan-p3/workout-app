# Backend Setup Guide

Complete setup instructions for the Workout Tracker Supabase backend.

## Quick Start

### 1. Install Supabase CLI

```bash
npm install -g supabase
```

### 2. Start Local Supabase

```bash
cd workout-app
supabase start
```

This will output your local credentials. Save these!

### 3. Apply Migrations

```bash
supabase db push
```

### 4. Generate TypeScript Types

```bash
supabase gen types typescript --local > lib/supabase/types.ts
```

### 5. Configure Environment Variables

Create `.env.local` in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-local-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-local-service-role-key>
```

### 6. Start the App

```bash
npm run dev
```

Visit http://localhost:3000

## Production Deployment

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in project details
4. Wait for project to initialize

### 2. Link Your Project

```bash
supabase login
supabase link --project-ref <your-project-ref>
```

Find your project ref in: Project Settings > General > Reference ID

### 3. Deploy Database

```bash
supabase db push
```

### 4. Deploy Edge Functions

```bash
# Deploy both functions
supabase functions deploy reset-weekly-stats
supabase functions deploy calculate-weekly-comparison

# Set environment secrets
supabase secrets set SUPABASE_URL=https://your-project.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
```

### 5. Schedule Weekly Stats Reset

In Supabase Dashboard > SQL Editor, run:

```sql
SELECT cron.schedule(
  'reset-weekly-stats',
  '0 0 * * 0',
  $$
  SELECT net.http_post(
    url := 'https://your-project.supabase.co/functions/v1/reset-weekly-stats',
    headers := '{"Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"}'::jsonb
  );
  $$
);
```

### 6. Update Production Environment Variables

Update `.env.local` (or `.env.production`):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-production-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-production-service-role-key>
```

### 7. Generate Production Types

```bash
supabase gen types typescript --linked > lib/supabase/types.ts
```

## Verification

### Test Database Connection

```typescript
// Test in a Next.js page or API route
import { supabase } from '@/lib/supabase/client'

const { data, error } = await supabase.from('exercise_library').select('*').limit(5)
console.log('Exercises:', data)
```

### Test Authentication

```typescript
// Sign up a test user
const { data, error } = await supabase.auth.signUp({
  email: 'test@example.com',
  password: 'testpassword123',
})
```

### Test RLS Policies

1. Sign up a user
2. Create a workout
3. Sign in as different user
4. Try to access first user's workout (should fail)

### Test Triggers

1. Create a workout
2. Add exercises and sets
3. Mark workout as complete
4. Check gamification_data table - should see updated points and stats

## Database Schema Overview

### Core Tables

- **users** - User profiles
- **workouts** - Workout sessions
- **exercises** - Exercises in workouts
- **exercise_sets** - Individual sets
- **workout_programs** - User programs
- **program_days** - Days in programs

### Analytics Tables

- **personal_records** - Auto-tracked PRs
- **gamification_data** - Points and streaks
- **body_weight_logs** - Weight tracking
- **readiness_logs** - Daily readiness

### Reference Tables

- **exercise_library** - 60+ pre-seeded exercises

## Available Query Helpers

All located in `lib/supabase/queries.ts`:

```typescript
import {
  workoutQueries,
  exerciseQueries,
  setQueries,
  bodyWeightQueries,
  gamificationQueries,
  programQueries,
  exerciseLibraryQueries,
  readinessQueries,
  userQueries,
  databaseFunctions,
} from '@/lib/supabase/queries'
```

### Example Usage

```typescript
// Get all workouts
const { data: workouts } = await workoutQueries.getAllWorkouts(userId)

// Create workout
const { data: workout } = await workoutQueries.createWorkout({
  user_id: userId,
  workout_date: new Date().toISOString().split('T')[0],
})

// Get exercise history
const { data: history } = await exerciseQueries.getExerciseHistory(
  userId,
  'Barbell Bench Press'
)

// Get gamification data
const { data: gamification } = await gamificationQueries.getGamificationData(userId)

// Search exercises
const { data: exercises } = await exerciseLibraryQueries.searchExercises('bench')
```

## Real-time Subscriptions

Located in `lib/supabase/subscriptions.ts`:

```typescript
import { subscriptions } from '@/lib/supabase/subscriptions'

// Subscribe to workout updates
const channel = subscriptions.subscribeToWorkouts(userId, (payload) => {
  console.log('Change:', payload)
  // Update UI
})

// Subscribe to personal records
subscriptions.subscribeToPRs(userId, (payload) => {
  console.log('New PR!', payload.new)
  // Show celebration
})

// Cleanup
subscriptions.unsubscribe(channel)
```

## Database Functions

```typescript
import { databaseFunctions } from '@/lib/supabase/queries'

// Calculate exercise volume
const { data: volume } = await databaseFunctions.calculateExerciseVolume(exerciseId)

// Calculate workout volume
const { data: totalVolume } = await databaseFunctions.calculateWorkoutVolume(workoutId)

// Update streak
await databaseFunctions.updateWorkoutStreak(userId)

// Create default program
const { data: programId } = await databaseFunctions.createDefaultProgram(userId)
```

## Troubleshooting

### Migrations Won't Apply

```bash
# Reset local database
supabase db reset

# Or force push
supabase db push --force
```

### RLS Blocking Queries

Check you're authenticated:

```typescript
const {
  data: { user },
} = await supabase.auth.getUser()
console.log('Current user:', user?.id)
```

### Edge Functions Not Working

```bash
# Check logs
supabase functions logs reset-weekly-stats

# Test locally
supabase functions serve

# Then in another terminal
curl http://localhost:54321/functions/v1/reset-weekly-stats
```

### Types Out of Sync

```bash
# Regenerate types
supabase gen types typescript --local > lib/supabase/types.ts

# Or for production
supabase gen types typescript --linked > lib/supabase/types.ts
```

## Next Steps

1. **Implement Authentication UI** - Use the auth pages in `app/(auth)`
2. **Connect Workout Logging** - Use query helpers in workout components
3. **Add Real-time Updates** - Subscribe to changes in workout pages
4. **Test Gamification** - Complete workouts and check points/streaks
5. **Customize Exercise Library** - Add custom exercises for users

## Support

- [Supabase Documentation](https://supabase.com/docs)
- [Backend README](./supabase/README.md)
- [Database Schema Reference](./docs/BACKEND_DEVELOPMENT_PROMPT.md)

---

**Ready to build! 💪**

