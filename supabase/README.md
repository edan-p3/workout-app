# Workout Tracker - Supabase Backend

Complete backend implementation for the Workout Tracker application using Supabase (PostgreSQL).

## 📋 Table of Contents

- [Overview](#overview)
- [Database Schema](#database-schema)
- [Setup Instructions](#setup-instructions)
- [Migrations](#migrations)
- [Edge Functions](#edge-functions)
- [TypeScript Integration](#typescript-integration)
- [Security](#security)
- [Testing](#testing)
- [Deployment](#deployment)

## 🎯 Overview

This backend provides:
- **11 Database Tables** with proper relationships and constraints
- **Row Level Security (RLS)** policies for data isolation
- **Automatic Triggers** for gamification and personal records
- **Database Functions** for calculations and analytics
- **Edge Functions** for scheduled tasks and complex queries
- **Real-time Subscriptions** for live updates
- **TypeScript Types** auto-generated from schema

## 🗄️ Database Schema

### Core Tables

1. **users** - User profiles extending auth.users
2. **workout_programs** - User workout programs
3. **program_days** - Days within programs
4. **workouts** - Individual workout sessions
5. **exercises** - Exercises within workouts
6. **exercise_sets** - Sets within exercises
7. **body_weight_logs** - Body weight tracking
8. **personal_records** - PR tracking (auto-generated)
9. **gamification_data** - Points, streaks, stats
10. **readiness_logs** - Daily readiness tracking
11. **exercise_library** - Searchable exercise database

### Key Features

- **Automatic PR Detection**: Triggers detect and record personal records
- **Gamification**: Auto-updates points, streaks, and weekly stats
- **Volume Calculations**: Functions calculate exercise and workout volumes
- **Streak Tracking**: Smart streak calculation allowing rest days

## 🚀 Setup Instructions

### Prerequisites

```bash
# Install Supabase CLI
npm install -g supabase

# Or with Homebrew
brew install supabase/tap/supabase
```

### Local Development

1. **Initialize Supabase**

```bash
# Start local Supabase instance
supabase start

# This will output your local credentials
```

2. **Apply Migrations**

```bash
# Push migrations to local database
supabase db push

# Or reset and apply all migrations
supabase db reset
```

3. **Generate TypeScript Types**

```bash
# Generate types from local database
supabase gen types typescript --local > lib/supabase/types.ts
```

4. **Setup Environment Variables**

Create `.env.local` in project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-local-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-local-service-role-key
```

5. **Test the Setup**

```bash
# Run the Next.js app
npm run dev

# Visit http://localhost:3000
```

### Production Setup

1. **Create Supabase Project**

Visit [supabase.com](https://supabase.com) and create a new project.

2. **Link Project**

```bash
# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref
```

3. **Deploy Migrations**

```bash
# Push migrations to production
supabase db push
```

4. **Deploy Edge Functions**

```bash
# Deploy reset weekly stats function
supabase functions deploy reset-weekly-stats

# Deploy weekly comparison function
supabase functions deploy calculate-weekly-comparison

# Set secrets for edge functions
supabase secrets set SUPABASE_URL=your-production-url
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

5. **Update Environment Variables**

Update `.env.local` with production credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-production-service-role-key
```

6. **Generate Production Types**

```bash
# Generate types from production database
supabase gen types typescript --linked > lib/supabase/types.ts
```

## 📦 Migrations

### Migration Files

Located in `supabase/migrations/`:

1. **20240101000001_initial_schema.sql**
   - Creates all tables, enums, indexes
   - Implements database functions
   - Sets up triggers

2. **20240101000002_rls_policies.sql**
   - Implements Row Level Security policies
   - Ensures data isolation per user

3. **20240101000003_seed_data.sql**
   - Seeds exercise library with 60+ exercises
   - Categorized by muscle groups

### Running Migrations

```bash
# Apply all migrations
supabase db push

# Reset database (WARNING: deletes all data)
supabase db reset

# Create new migration
supabase migration new migration_name
```

## ⚡ Edge Functions

### reset-weekly-stats

Resets weekly statistics for all users (scheduled weekly).

**Location**: `supabase/functions/reset-weekly-stats/index.ts`

**Usage**:
```bash
# Deploy
supabase functions deploy reset-weekly-stats

# Test locally
supabase functions serve reset-weekly-stats

# Invoke
curl -X POST https://your-project.supabase.co/functions/v1/reset-weekly-stats \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY"
```

**Schedule with pg_cron** (in Supabase dashboard SQL editor):
```sql
SELECT cron.schedule(
  'reset-weekly-stats',
  '0 0 * * 0', -- Every Sunday at midnight
  $$
  SELECT net.http_post(
    url := 'https://your-project.supabase.co/functions/v1/reset-weekly-stats',
    headers := '{"Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"}'::jsonb
  );
  $$
);
```

### calculate-weekly-comparison

Calculates week-over-week workout analytics for a user.

**Location**: `supabase/functions/calculate-weekly-comparison/index.ts`

**Usage**:
```typescript
// From your Next.js app
const response = await fetch(
  `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/calculate-weekly-comparison`,
  {
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  }
)
const data = await response.json()
```

## 💻 TypeScript Integration

### Client Setup

```typescript
// lib/supabase/client.ts
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

### Query Helpers

```typescript
import { workoutQueries } from '@/lib/supabase/queries'

// Get all workouts
const { data, error } = await workoutQueries.getAllWorkouts(userId)

// Create workout
const { data, error } = await workoutQueries.createWorkout({
  user_id: userId,
  workout_date: '2024-01-01',
  start_time: new Date().toISOString(),
})
```

### Real-time Subscriptions

```typescript
import { subscriptions } from '@/lib/supabase/subscriptions'

// Subscribe to workout updates
const channel = subscriptions.subscribeToWorkouts(userId, (payload) => {
  console.log('Workout updated:', payload)
})

// Cleanup
subscriptions.unsubscribe(channel)
```

## 🔒 Security

### Row Level Security (RLS)

All tables have RLS enabled with policies ensuring:
- Users can only access their own data
- Exercise library is readable by all authenticated users
- Custom exercises can only be modified by creators

### Testing RLS Policies

```sql
-- Test as specific user
SET ROLE authenticated;
SET request.jwt.claims.sub = 'user-uuid-here';

-- Try to access data
SELECT * FROM workouts;
-- Should only return workouts for that user
```

### Security Checklist

- ✅ RLS enabled on all tables
- ✅ Policies for SELECT, INSERT, UPDATE, DELETE
- ✅ Service role key kept secure (server-only)
- ✅ Input validation in edge functions
- ✅ Auth checks in all queries
- ✅ HTTPS enforced
- ✅ Parameterized queries prevent SQL injection

## 🧪 Testing

### Test Database Functions

```sql
-- Test volume calculation
SELECT calculate_exercise_volume('exercise-uuid');

-- Test workout volume
SELECT calculate_workout_volume('workout-uuid');

-- Test streak calculation
SELECT * FROM update_workout_streak('user-uuid');
```

### Test Triggers

```sql
-- Insert a completed workout
INSERT INTO workouts (user_id, workout_date, start_time, is_completed)
VALUES ('test-user-id', CURRENT_DATE, now(), true);

-- Check if gamification_data was updated
SELECT * FROM gamification_data WHERE user_id = 'test-user-id';
```

### Test RLS Policies

```sql
-- Set user context
SET request.jwt.claims.sub = 'user-uuid';

-- Try to access another user's data
SELECT * FROM workouts WHERE user_id != 'user-uuid';
-- Should return empty
```

## 🚢 Deployment

### Pre-Deployment Checklist

- [ ] All migrations tested locally
- [ ] RLS policies verified
- [ ] Edge functions tested
- [ ] Environment variables configured
- [ ] Types generated
- [ ] Seed data loaded

### Deploy to Production

```bash
# 1. Link to production project
supabase link --project-ref your-project-ref

# 2. Push database changes
supabase db push

# 3. Deploy edge functions
supabase functions deploy reset-weekly-stats
supabase functions deploy calculate-weekly-comparison

# 4. Set secrets
supabase secrets set SUPABASE_URL=your-url
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-key

# 5. Generate production types
supabase gen types typescript --linked > lib/supabase/types.ts
```

### Post-Deployment

1. **Verify Tables**: Check Supabase dashboard table editor
2. **Test RLS**: Try accessing data as different users
3. **Monitor Logs**: Check edge function logs
4. **Test Real-time**: Verify subscriptions work
5. **Load Test**: Ensure performance meets requirements

## 📊 Monitoring

### Database Health

```sql
-- Check table sizes
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Check index usage
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read
FROM pg_stat_user_indexes
ORDER BY idx_scan ASC;
```

### Performance Optimization

```sql
-- Analyze query plans
EXPLAIN ANALYZE
SELECT * FROM workouts
WHERE user_id = 'some-uuid'
ORDER BY workout_date DESC
LIMIT 10;
```

## 🛠️ Maintenance

### Weekly Tasks

```sql
-- Vacuum analyze
VACUUM ANALYZE;

-- Update statistics
ANALYZE;
```

### Backup Strategy

Supabase provides automatic daily backups. For critical data:

```bash
# Export specific tables
supabase db dump --data-only -t workouts > workouts_backup.sql

# Restore
psql -h your-db-host -U postgres -d postgres < workouts_backup.sql
```

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Edge Functions Guide](https://supabase.com/docs/guides/functions)

## 🐛 Troubleshooting

### Common Issues

**Issue**: RLS policies blocking queries
```sql
-- Check current policies
SELECT * FROM pg_policies WHERE tablename = 'workouts';

-- Temporarily disable RLS for testing (NOT in production!)
ALTER TABLE workouts DISABLE ROW LEVEL SECURITY;
```

**Issue**: Triggers not firing
```sql
-- Check triggers
SELECT * FROM pg_trigger WHERE tgname LIKE '%workout%';

-- Test trigger manually
UPDATE workouts SET is_completed = true WHERE id = 'test-id';
```

**Issue**: Edge functions timing out
- Check function logs in Supabase dashboard
- Optimize queries (add indexes)
- Reduce payload size

## 📝 License

This backend is part of the Workout Tracker application.

---

**Built with ❤️ using Supabase**

