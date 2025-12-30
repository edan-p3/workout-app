# 🚀 Quick Start Guide

Get your Workout Tracker backend up and running in 5 minutes!

---

## Prerequisites

- Node.js 18+ installed
- npm or yarn installed

---

## Step 1: Install Supabase CLI

```bash
npm install -g supabase
```

---

## Step 2: Run Setup Script

```bash
cd workout-app
npm run backend:setup
```

This will:
- ✅ Start local Supabase
- ✅ Apply all database migrations
- ✅ Generate TypeScript types
- ✅ Display your credentials

---

## Step 3: Create Environment File

Create `.env.local` in the project root and paste the credentials from Step 2:

```bash
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
```

---

## Step 4: Start the App

```bash
npm run dev
```

Visit: http://localhost:3000

---

## Step 5: Test It Out

1. **Sign Up** - Create a new account
2. **Log Workout** - Navigate to "Log Workout"
3. **Add Exercise** - Search for "Bench Press"
4. **Log Sets** - Add weight, reps, mark complete
5. **Complete Workout** - Finish and see points awarded!
6. **Check Dashboard** - View your stats and streak

---

## 🎯 What You Get

### Database (11 Tables)
- ✅ Users with profiles
- ✅ Workouts with exercises and sets
- ✅ Personal records (auto-tracked)
- ✅ Gamification (points, streaks)
- ✅ Body weight logs
- ✅ Readiness tracking
- ✅ Exercise library (60+ exercises)
- ✅ Workout programs

### Features
- ✅ Automatic PR detection
- ✅ Points and streak tracking
- ✅ Volume calculations
- ✅ Real-time updates
- ✅ Complete data security (RLS)
- ✅ Type-safe queries

---

## 📊 Useful Commands

```bash
# View Supabase status
npm run supabase:status

# Access Supabase Studio
# Open: http://localhost:54323

# Stop Supabase
npm run supabase:stop

# Restart Supabase
npm run supabase:start

# Reset database (WARNING: deletes all data)
npm run supabase:reset

# Regenerate types
npm run supabase:types
```

---

## 🔍 Verify Setup

### Check Database

Visit Supabase Studio: http://localhost:54323

1. Go to **Table Editor**
2. You should see 11 tables
3. Click **exercise_library** - should have 60+ exercises

### Check API

In your browser console (on localhost:3000):

```javascript
// Test query
const { data, error } = await supabase
  .from('exercise_library')
  .select('*')
  .limit(5)

console.log('Exercises:', data)
```

---

## 🐛 Troubleshooting

### "Supabase CLI not found"

```bash
npm install -g supabase
```

### "Port already in use"

Stop existing Supabase:
```bash
supabase stop
supabase start
```

### "Cannot connect to database"

Check Supabase is running:
```bash
supabase status
```

### "RLS policy error"

Make sure you're authenticated:
```javascript
const { data: { user } } = await supabase.auth.getUser()
console.log('User:', user)
```

---

## 📚 Next Steps

1. **Read the docs**: Check out [BACKEND_SETUP.md](./BACKEND_SETUP.md)
2. **Explore queries**: See [API_REFERENCE.md](./docs/API_REFERENCE.md)
3. **Test features**: Follow [TESTING_GUIDE.md](./docs/TESTING_GUIDE.md)
4. **Deploy**: Use [deploy-production.sh](./scripts/deploy-production.sh)

---

## 🎮 Try These Features

### Log Your First Workout

```typescript
import { workoutQueries, exerciseQueries, setQueries } from '@/lib/supabase/queries'

// 1. Create workout
const { data: workout } = await workoutQueries.createWorkout({
  user_id: userId,
  workout_date: new Date().toISOString().split('T')[0],
})

// 2. Add exercise
const { data: exercise } = await exerciseQueries.createExercise({
  workout_id: workout.id,
  exercise_type: 'strength',
  exercise_name: 'Barbell Bench Press',
  target_sets: 3,
})

// 3. Add sets
await setQueries.createSet({
  exercise_id: exercise.id,
  set_number: 1,
  reps: 10,
  weight: 135,
  is_completed: true,
})

// 4. Complete workout
await workoutQueries.updateWorkout(workout.id, {
  is_completed: true,
  end_time: new Date().toISOString(),
})

// 5. Check your points!
const { data: gamification } = await gamificationQueries.getGamificationData(userId)
console.log('Points:', gamification.total_points)
```

### Subscribe to Real-time Updates

```typescript
import { subscriptions } from '@/lib/supabase/subscriptions'

// Get notified of new PRs
const channel = subscriptions.subscribeToPRs(userId, (payload) => {
  console.log('🎉 New PR!', payload.new)
  // Show celebration UI
})

// Cleanup when done
subscriptions.unsubscribe(channel)
```

---

## 🎉 You're All Set!

Your backend is now running with:
- ✅ 11 database tables
- ✅ 40+ security policies
- ✅ 9 database functions
- ✅ 7 automatic triggers
- ✅ 60+ exercises pre-loaded
- ✅ 80+ type-safe query helpers
- ✅ Real-time subscriptions
- ✅ Complete documentation

**Start building your workout tracker! 💪**

---

## 💡 Tips

- Use Supabase Studio (http://localhost:54323) to explore your database
- Check the API Reference for all available queries
- Enable real-time subscriptions for live updates
- Test RLS policies by creating multiple users
- Monitor query performance in Supabase Studio

---

## 📞 Need Help?

- **Setup Issues**: See [BACKEND_SETUP.md](./BACKEND_SETUP.md)
- **API Questions**: See [API_REFERENCE.md](./docs/API_REFERENCE.md)
- **Testing**: See [TESTING_GUIDE.md](./docs/TESTING_GUIDE.md)
- **Backend Details**: See [supabase/README.md](./supabase/README.md)

---

**Happy Coding! 🚀**

