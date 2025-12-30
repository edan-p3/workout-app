# Workout Progression Tracker - Technical Specification

## Executive Summary

A personal workout tracking and progression application designed for daily logging, volume tracking, and intelligent progression analytics. Built with Next.js 14 (App Router), Supabase backend, and a distinctive brutalist-minimal aesthetic focused on data clarity and quick mobile logging.

## Core Objectives

1. **Quick Daily Logging**: Mobile-first interface optimized for gym use
2. **Progression Intelligence**: Automatic volume calculations and week-over-week comparisons
3. **Data Clarity**: Bold typography and data visualization emphasizing numbers
4. **Gamification**: Streaks, points, and personal records without social complexity
5. **Single-User Focus**: Simple authentication, personal progression tracking

## System Architecture

### Frontend Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React hooks + Zustand for global state
- **Data Fetching**: React Query (TanStack Query)
- **Charts**: Recharts for progression visualization
- **Date Handling**: date-fns

### Backend Stack
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (email/password)
- **Real-time**: Supabase Realtime subscriptions
- **Storage**: Supabase Storage (future: exercise media)

### Design System

**Aesthetic Direction**: Athletic Brutalism
- Strong geometric typography
- High contrast (charcoal/amber/white)
- Numbers as visual hero elements
- Asymmetric layouts with generous spacing
- Subtle animations on data updates

**Typography**:
- Display/Numbers: JetBrains Mono (monospace for data alignment)
- Headings: Space Grotesk (geometric, bold)
- Body: DM Sans (functional clarity)

**Color Palette**:
```css
--bg-primary: #0F0F0F (near black)
--bg-secondary: #1A1A1A (charcoal)
--bg-tertiary: #2A2A2A (lighter charcoal)
--accent-primary: #F59E0B (amber/gold)
--accent-success: #10B981 (emerald)
--accent-warning: #EF4444 (red)
--text-primary: #FAFAFA (white)
--text-secondary: #A3A3A3 (neutral gray)
--text-muted: #525252 (dark gray)
```

## Data Model

### Database Schema

#### users
```sql
id: uuid (PK, from auth.users)
email: string
created_at: timestamp
settings: jsonb {
  default_rest_time: number
  weight_unit: 'lbs' | 'kg'
  distance_unit: 'mi' | 'km'
}
```

#### workout_programs
```sql
id: uuid (PK)
user_id: uuid (FK)
name: string ('My Program')
description: text
is_active: boolean
created_at: timestamp
```

#### program_days
```sql
id: uuid (PK)
program_id: uuid (FK)
day_name: string ('Push', 'Pull', 'Legs', 'Conditioning')
day_order: integer
muscle_groups: string[] (['Chest', 'Shoulders', 'Triceps'])
```

#### workouts
```sql
id: uuid (PK)
user_id: uuid (FK)
program_day_id: uuid (FK, nullable)
workout_date: date
start_time: timestamp
end_time: timestamp (nullable)
is_completed: boolean
notes: text
created_at: timestamp
updated_at: timestamp
```

#### exercises
```sql
id: uuid (PK)
workout_id: uuid (FK)
exercise_type: 'strength' | 'cardio'
exercise_name: string
order_index: integer
created_at: timestamp

-- Strength-specific fields
sets_completed: integer
target_sets: integer
target_reps_min: integer
target_reps_max: integer

-- Cardio-specific fields
machine_type: 'treadmill' | 'bike' | 'elliptical' | 'rowing' | 'other'
duration_minutes: decimal
distance: decimal
avg_pace: decimal (calculated)
calories: integer
```

#### exercise_sets
```sql
id: uuid (PK)
exercise_id: uuid (FK)
set_number: integer
reps: integer
weight: decimal
is_warmup: boolean
is_completed: boolean
rpe: integer (1-10, nullable)
created_at: timestamp
```

#### body_weight_logs
```sql
id: uuid (PK)
user_id: uuid (FK)
weight: decimal
log_date: date
notes: text
created_at: timestamp
```

#### personal_records
```sql
id: uuid (PK)
user_id: uuid (FK)
exercise_name: string
record_type: 'max_weight' | 'max_volume' | 'max_reps'
value: decimal
achieved_date: date
workout_id: uuid (FK, nullable)
created_at: timestamp
```

#### gamification_data
```sql
id: uuid (PK)
user_id: uuid (FK)
total_points: integer
current_streak: integer
longest_streak: integer
total_workouts: integer
last_workout_date: date
weekly_stats: jsonb {
  week_start: date
  workouts_completed: integer
  total_volume: number
  cardio_minutes: number
  points_earned: integer
}
```

#### readiness_logs
```sql
id: uuid (PK)
user_id: uuid (FK)
log_date: date
sleep_quality: integer (1-5)
energy_level: integer (1-5)
joint_comfort: integer (1-5)
overall_readiness: decimal (calculated avg)
notes: text
```

## Feature Specifications

### 1. Workout Logging

**Quick Log Flow**:
1. Select program day (Push/Pull/Legs/Conditioning) or create custom
2. Add exercises (searchable exercise database)
3. Log sets with weight/reps OR cardio with machine/time/distance
4. Real-time volume calculation display
5. Mark workout complete

**Strength Exercise Entry**:
- Exercise name (autocomplete from history)
- Target sets/reps range (10-12)
- Per-set logging: weight, reps, completion status
- Auto-calculate: Total volume = Σ(weight × reps)
- Previous workout comparison (same exercise)

**Cardio Exercise Entry**:
- Machine type selection
- Duration (minutes)
- Distance (optional)
- Auto-calculate pace (distance/time)
- Calories (manual or integrated via API later)

### 2. Progression Analytics

**Weekly Comparison**:
```typescript
interface WeeklyComparison {
  current_week: {
    total_volume: number
    workout_count: number
    cardio_minutes: number
    avg_intensity: number
  }
  previous_week: {
    // same structure
  }
  changes: {
    volume_delta: number // +/- percentage
    volume_change_type: 'increase' | 'decrease' | 'maintained'
    workout_frequency_delta: number
    cardio_delta: number
  }
}
```

**Volume Tracking**:
- Per exercise: track volume trend over last 4 weeks
- Per muscle group: aggregate volume
- Total weekly volume: all exercises combined
- Visual indicators: ↑ (>5% increase), → (±5%), ↓ (>5% decrease)

**Personal Records**:
- Auto-detect: new max weight per exercise
- Auto-detect: new max volume per session
- Badge system: display PR achievements
- Historical PR timeline

### 3. Body Weight Tracking

**Daily Logging**:
- Quick weight entry with date
- Notes field (optional)
- Visual weight graph (last 12 weeks)

**Weekly Average Calculation**:
```typescript
// Calculate rolling 7-day average
function calculateWeeklyAverage(logs: WeightLog[]): number {
  const lastSevenDays = logs
    .filter(log => isWithinInterval(log.date, { 
      start: subDays(new Date(), 7), 
      end: new Date() 
    }))
  return mean(lastSevenDays.map(l => l.weight))
}
```

**Weight Trends**:
- Week-over-week average comparison
- Monthly trend line
- Correlation with training volume (advanced)

### 4. Workout History

**List View**:
- Chronological list with date, program day, completion status
- Quick stats: total exercises, total volume, duration
- Filter: by date range, program day, completion status
- Search: by exercise name

**Calendar View**:
- Month view with workout indicators
- Color coding by program day type
- Streak visualization
- Tap day → view full workout details

### 5. Gamification System

**Points System**:
- Completed workout: 10 points
- Personal record: 25 points
- Streak milestone (7, 14, 30 days): 50 points
- Cardio session: 5 points
- Weekly volume increase: 15 points

**Streaks**:
- Current streak counter (days with workouts)
- Longest streak badge
- Streak save: 1 rest day per week doesn't break streak
- Visual streak calendar

**Achievements**:
- First workout
- 10 workouts completed
- 30-day streak
- 100 total workouts
- First PR
- 10 PRs
- Volume milestones (100k lbs, 500k lbs, 1M lbs)

### 6. Coach Intelligence (Optional Enhancement)

**Weekly Improvement Flags**:
```typescript
interface ImprovementFlag {
  type: 'strength' | 'cardio' | 'consistency' | 'weight_trend'
  message: string
  data: {
    exercise_name?: string
    improvement_percent: number
    comparison_period: string
  }
}
```

**Auto-Detection Logic**:
- Strength: >10% volume increase on any exercise vs. last week
- Cardio: +15 minutes total cardio vs. previous week
- Consistency: 4+ workouts in week (vs. <3 previous week)
- Weight trend: -1% bodyweight over 2 weeks (cutting) or +0.5% (bulking)

**Deload Week Recommendations**:
- Track: weeks since last deload
- Suggest: every 4-5 weeks
- Auto-calculate: 60% volume reduction
- Display: "Consider deload week - reduced volume targets"

**Readiness Score**:
```typescript
interface ReadinessScore {
  overall: number // 1-5, avg of factors
  sleep: number // 1-5
  energy: number // 1-5
  joint_comfort: number // 1-5
  recommendation: 'full_workout' | 'moderate' | 'minimum_viable' | 'rest'
}
```

**Minimum Viable Workout Mode**:
- Triggered: readiness score <3
- Suggest: 2 sets per exercise (vs. 3-4)
- Suggest: lighter weight (90% of previous)
- Message: "Low energy detected - quality over quantity today"

## UI/UX Specifications

### Mobile-First Navigation

**Bottom Tab Bar**:
1. **Log** (primary action, centered, larger)
2. **History**
3. **Stats**
4. **Profile**

**Quick Actions**:
- Floating action button: "Start Workout"
- Swipe gestures: swipe left on history item → delete, swipe right → duplicate

### Key Screens

#### 1. Dashboard/Stats
- Current streak (large, centered)
- This week summary card
  - Workouts completed (X/target)
  - Total volume (with arrow indicator)
  - Cardio minutes
  - Weight trend
- Quick-start buttons (by program day)
- Recent PRs carousel
- Achievement badges

#### 2. Workout Logging
- Program day selector (chips)
- Exercise list (draggable to reorder)
- Add exercise (search/autocomplete)
- Per-exercise:
  - Previous best indicator
  - Set logging interface (weight/reps)
  - Live volume calculation
  - Rest timer between sets
- Complete workout button (sticky bottom)

#### 3. History
- Toggle: List / Calendar view
- List view:
  - Card per workout
  - Date, program day, exercises count
  - Total volume badge
  - Tap → full workout detail
- Calendar view:
  - Month grid
  - Colored dots (by program day)
  - Streak indicators
  - Tap → workout detail

#### 4. Exercise Detail Modal
- Exercise name
- Date performed
- All sets table (set #, weight, reps, volume)
- Historical graph (last 8 weeks)
- Notes
- Edit/Delete actions

#### 5. Profile/Settings
- User info
- Current program
- Unit preferences (lbs/kg, mi/km)
- Rest timer default
- Deload tracking
- Export data (CSV)

### Progressive Enhancement

**Phase 1 (MVP)**:
- Workout logging (strength + cardio)
- Volume calculations
- Basic history
- Weekly comparison
- Body weight tracking

**Phase 2**:
- Calendar view
- Gamification (points, streaks)
- Personal records tracking
- Charts and graphs

**Phase 3**:
- Coach intelligence
- Readiness tracking
- Deload recommendations
- Advanced analytics

## Performance Considerations

**Mobile Optimization**:
- Lazy load history items (virtual scrolling)
- Optimize Supabase queries with indexes
- Cache workout templates locally
- Service worker for offline logging (future)

**Database Indexes**:
```sql
CREATE INDEX idx_workouts_user_date ON workouts(user_id, workout_date DESC);
CREATE INDEX idx_exercises_workout ON exercises(workout_id);
CREATE INDEX idx_sets_exercise ON exercise_sets(exercise_id);
CREATE INDEX idx_body_weight_user_date ON body_weight_logs(user_id, log_date DESC);
```

## Security & Privacy

**Authentication**:
- Supabase Auth (email/password)
- Row Level Security (RLS) policies
- All queries filtered by user_id

**RLS Policies Example**:
```sql
-- Users can only read their own workouts
CREATE POLICY "Users can view own workouts"
ON workouts FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own workouts
CREATE POLICY "Users can create own workouts"
ON workouts FOR INSERT
WITH CHECK (auth.uid() = user_id);
```

## Deployment Strategy

**Environment Setup**:
- Development: Local Supabase instance
- Staging: Vercel preview deployments
- Production: Vercel + Supabase production

**Environment Variables**:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY= (server-only)
```

## Testing Strategy

**Unit Tests**:
- Calculation functions (volume, averages, trends)
- Date utilities (week comparisons, streak logic)
- Points/gamification logic

**Integration Tests**:
- Workout logging flow
- Volume calculation accuracy
- Personal record detection

**E2E Tests (Playwright)**:
- Complete workout logging
- View history
- Week-over-week comparison

## Future Enhancements

**Phase 4+**:
- Exercise library with videos/images
- Workout templates marketplace
- Export to Apple Health / Google Fit
- Advanced analytics (periodization tracking)
- Training split optimizer
- Photo progress tracking
- Custom exercise creation
- Rest timer with notifications
- Apple Watch companion app
- Social features (optional sharing)

## Success Metrics

**User Engagement**:
- Daily active usage
- Workout completion rate
- Average session duration
- Feature usage (which screens most visited)

**Progression Metrics**:
- Average weekly volume growth
- PR frequency
- Streak length distribution
- Consistency (workouts per week)

## Technical Debt Considerations

**Known Tradeoffs**:
1. Single-user focus (future: multi-user requires tenant architecture)
2. Manual exercise database (future: integrate external API)
3. Client-side calculations (future: move heavy analytics to edge functions)
4. No offline-first (future: implement service worker + IndexedDB)

## Development Timeline Estimate

**Week 1**: Setup, database schema, authentication
**Week 2**: Workout logging UI, basic CRUD operations  
**Week 3**: Volume calculations, progression analytics
**Week 4**: History views, body weight tracking
**Week 5**: Gamification system, personal records
**Week 6**: Polish, testing, deployment
**Week 7+**: Optional enhancements (coach intelligence)

---

## Appendix: Sample Calculations

### Volume Calculation
```typescript
function calculateExerciseVolume(sets: ExerciseSet[]): number {
  return sets
    .filter(set => set.is_completed && !set.is_warmup)
    .reduce((total, set) => total + (set.weight * set.reps), 0)
}
```

### Week-over-Week Comparison
```typescript
function compareWeeks(
  currentWeek: Workout[],
  previousWeek: Workout[]
): WeekComparison {
  const currentVolume = calculateTotalVolume(currentWeek)
  const previousVolume = calculateTotalVolume(previousWeek)
  
  const delta = ((currentVolume - previousVolume) / previousVolume) * 100
  
  return {
    currentVolume,
    previousVolume,
    percentageChange: delta,
    changeType: delta > 5 ? 'increase' : delta < -5 ? 'decrease' : 'maintained'
  }
}
```

### Streak Calculation
```typescript
function calculateStreak(workouts: Workout[]): number {
  const sortedDates = workouts
    .map(w => w.workout_date)
    .sort((a, b) => b.getTime() - a.getTime())
  
  let streak = 0
  let currentDate = new Date()
  
  for (const workoutDate of sortedDates) {
    const daysDiff = differenceInDays(currentDate, workoutDate)
    
    // Allow 1 rest day per week
    if (daysDiff <= 2) {
      streak++
      currentDate = workoutDate
    } else {
      break
    }
  }
  
  return streak
}
```
