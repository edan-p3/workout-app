# Backend Development Prompt for Workout Progression Tracker

## Project Context

You are building the **complete backend infrastructure** for a personal workout tracking and progression application. The frontend has already been implemented using Next.js 14, TypeScript, and Tailwind CSS. Your task is to create a production-ready Supabase backend that powers all workout logging, analytics, and gamification features.

## Your Mission

Create a **comprehensive, secure, and performant Supabase backend** including database schema, Row Level Security (RLS) policies, database functions, triggers, indexes, and seed data. The backend must support real-time updates, efficient queries, and automatic calculations for progression analytics.

---

## Technical Stack

### Backend Technologies
- **Database**: Supabase (PostgreSQL 15+)
- **Authentication**: Supabase Auth with email/password
- **Real-time**: Supabase Realtime subscriptions
- **Functions**: Supabase Edge Functions (Deno runtime)
- **Storage**: Supabase Storage (for future exercise media)

### Integration Requirements
- **Frontend**: Next.js 14 with App Router (already built)
- **Client Library**: @supabase/supabase-js
- **Type Generation**: Supabase CLI for TypeScript types

---

## Database Schema - Complete Implementation

Create the following tables with proper relationships, constraints, and indexes:

### 1. Users Table Extension

```sql
-- Extend the auth.users table with a public profile
CREATE TABLE public.users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  settings jsonb DEFAULT '{
    "default_rest_time": 90,
    "weight_unit": "lbs",
    "distance_unit": "mi",
    "notifications_enabled": true
  }'::jsonb
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create updated_at trigger
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### 2. Workout Programs

```sql
CREATE TABLE public.workout_programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  is_active boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.workout_programs ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_workout_programs_user ON workout_programs(user_id);
CREATE INDEX idx_workout_programs_active ON workout_programs(user_id, is_active) WHERE is_active = true;
```

### 3. Program Days

```sql
CREATE TABLE public.program_days (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id uuid NOT NULL REFERENCES public.workout_programs(id) ON DELETE CASCADE,
  day_name text NOT NULL,
  day_order integer NOT NULL,
  muscle_groups text[] DEFAULT ARRAY[]::text[],
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.program_days ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_program_days_program ON program_days(program_id, day_order);
```

### 4. Workouts

```sql
CREATE TABLE public.workouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  program_day_id uuid REFERENCES public.program_days(id) ON DELETE SET NULL,
  workout_date date NOT NULL DEFAULT CURRENT_DATE,
  start_time timestamptz NOT NULL DEFAULT now(),
  end_time timestamptz,
  is_completed boolean DEFAULT false,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;

-- Critical indexes for performance
CREATE INDEX idx_workouts_user_date ON workouts(user_id, workout_date DESC);
CREATE INDEX idx_workouts_user_completed ON workouts(user_id, is_completed);
CREATE INDEX idx_workouts_date ON workouts(workout_date DESC);
```

### 5. Exercises

```sql
CREATE TYPE exercise_type AS ENUM ('strength', 'cardio');
CREATE TYPE machine_type AS ENUM ('treadmill', 'bike', 'elliptical', 'rowing', 'stairmaster', 'other');

CREATE TABLE public.exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id uuid NOT NULL REFERENCES public.workouts(id) ON DELETE CASCADE,
  exercise_type exercise_type NOT NULL,
  exercise_name text NOT NULL,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  
  -- Strength-specific fields
  sets_completed integer DEFAULT 0,
  target_sets integer,
  target_reps_min integer,
  target_reps_max integer,
  
  -- Cardio-specific fields
  machine_type machine_type,
  duration_minutes decimal(10,2),
  distance decimal(10,2),
  avg_pace decimal(10,2),
  calories integer
);

ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_exercises_workout ON exercises(workout_id, order_index);
CREATE INDEX idx_exercises_name ON exercises(exercise_name);
```

### 6. Exercise Sets

```sql
CREATE TABLE public.exercise_sets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exercise_id uuid NOT NULL REFERENCES public.exercises(id) ON DELETE CASCADE,
  set_number integer NOT NULL,
  reps integer NOT NULL,
  weight decimal(10,2) NOT NULL DEFAULT 0,
  is_warmup boolean DEFAULT false,
  is_completed boolean DEFAULT false,
  rpe integer CHECK (rpe >= 1 AND rpe <= 10),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.exercise_sets ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_exercise_sets_exercise ON exercise_sets(exercise_id, set_number);
CREATE INDEX idx_exercise_sets_completed ON exercise_sets(exercise_id) WHERE is_completed = true;
```

### 7. Body Weight Logs

```sql
CREATE TABLE public.body_weight_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  weight decimal(10,2) NOT NULL,
  log_date date NOT NULL DEFAULT CURRENT_DATE,
  notes text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, log_date)
);

ALTER TABLE public.body_weight_logs ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_body_weight_user_date ON body_weight_logs(user_id, log_date DESC);
```

### 8. Personal Records

```sql
CREATE TYPE record_type AS ENUM ('max_weight', 'max_volume', 'max_reps');

CREATE TABLE public.personal_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  exercise_name text NOT NULL,
  record_type record_type NOT NULL,
  value decimal(10,2) NOT NULL,
  achieved_date date NOT NULL DEFAULT CURRENT_DATE,
  workout_id uuid REFERENCES public.workouts(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, exercise_name, record_type)
);

ALTER TABLE public.personal_records ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_personal_records_user ON personal_records(user_id, achieved_date DESC);
CREATE INDEX idx_personal_records_exercise ON personal_records(exercise_name, record_type);
```

### 9. Gamification Data

```sql
CREATE TABLE public.gamification_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  total_points integer DEFAULT 0,
  current_streak integer DEFAULT 0,
  longest_streak integer DEFAULT 0,
  total_workouts integer DEFAULT 0,
  last_workout_date date,
  weekly_stats jsonb DEFAULT '{
    "week_start": null,
    "workouts_completed": 0,
    "total_volume": 0,
    "cardio_minutes": 0,
    "points_earned": 0
  }'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.gamification_data ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_gamification_user ON gamification_data(user_id);
```

### 10. Readiness Logs

```sql
CREATE TABLE public.readiness_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  log_date date NOT NULL DEFAULT CURRENT_DATE,
  sleep_quality integer NOT NULL CHECK (sleep_quality >= 1 AND sleep_quality <= 5),
  energy_level integer NOT NULL CHECK (energy_level >= 1 AND energy_level <= 5),
  joint_comfort integer NOT NULL CHECK (joint_comfort >= 1 AND joint_comfort <= 5),
  overall_readiness decimal(3,2) GENERATED ALWAYS AS (
    (sleep_quality + energy_level + joint_comfort) / 3.0
  ) STORED,
  notes text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, log_date)
);

ALTER TABLE public.readiness_logs ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_readiness_user_date ON readiness_logs(user_id, log_date DESC);
```

### 11. Exercise Library (Searchable Database)

```sql
CREATE TABLE public.exercise_library (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exercise_name text UNIQUE NOT NULL,
  exercise_type exercise_type NOT NULL,
  primary_muscle_groups text[] NOT NULL,
  secondary_muscle_groups text[] DEFAULT ARRAY[]::text[],
  equipment_needed text[] DEFAULT ARRAY[]::text[],
  difficulty_level text CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  description text,
  video_url text,
  is_custom boolean DEFAULT false,
  created_by uuid REFERENCES public.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.exercise_library ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_exercise_library_name ON exercise_library USING gin(to_tsvector('english', exercise_name));
CREATE INDEX idx_exercise_library_muscle ON exercise_library USING gin(primary_muscle_groups);
```

---

## Database Functions & Triggers

### 1. Updated_at Trigger Function

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.workout_programs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.workouts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.gamification_data FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 2. Automatic User Profile Creation

```sql
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (NEW.id, NEW.email);
  
  INSERT INTO public.gamification_data (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_profile();
```

### 3. Calculate Exercise Volume Function

```sql
CREATE OR REPLACE FUNCTION calculate_exercise_volume(exercise_uuid uuid)
RETURNS decimal AS $$
  SELECT COALESCE(SUM(weight * reps), 0)
  FROM exercise_sets
  WHERE exercise_id = exercise_uuid
    AND is_completed = true
    AND is_warmup = false;
$$ LANGUAGE sql STABLE;
```

### 4. Calculate Workout Total Volume Function

```sql
CREATE OR REPLACE FUNCTION calculate_workout_volume(workout_uuid uuid)
RETURNS decimal AS $$
  SELECT COALESCE(SUM(calculate_exercise_volume(e.id)), 0)
  FROM exercises e
  WHERE e.workout_id = workout_uuid
    AND e.exercise_type = 'strength';
$$ LANGUAGE sql STABLE;
```

### 5. Update Gamification on Workout Completion

```sql
CREATE OR REPLACE FUNCTION update_gamification_on_workout_complete()
RETURNS TRIGGER AS $$
DECLARE
  user_uuid uuid;
  workout_volume decimal;
  new_points integer := 10;
BEGIN
  -- Only trigger on completion
  IF NEW.is_completed = true AND (OLD.is_completed IS NULL OR OLD.is_completed = false) THEN
    user_uuid := NEW.user_id;
    workout_volume := calculate_workout_volume(NEW.id);
    
    -- Update gamification data
    UPDATE gamification_data
    SET 
      total_points = total_points + new_points,
      total_workouts = total_workouts + 1,
      last_workout_date = NEW.workout_date,
      weekly_stats = jsonb_set(
        weekly_stats,
        '{workouts_completed}',
        to_jsonb((weekly_stats->>'workouts_completed')::int + 1)
      ),
      weekly_stats = jsonb_set(
        weekly_stats,
        '{total_volume}',
        to_jsonb((weekly_stats->>'total_volume')::numeric + workout_volume)
      ),
      weekly_stats = jsonb_set(
        weekly_stats,
        '{points_earned}',
        to_jsonb((weekly_stats->>'points_earned')::int + new_points)
      )
    WHERE user_id = user_uuid;
    
    -- Calculate and update streak
    PERFORM update_workout_streak(user_uuid);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_workout_completed
  AFTER UPDATE ON public.workouts
  FOR EACH ROW
  EXECUTE FUNCTION update_gamification_on_workout_complete();
```

### 6. Calculate and Update Workout Streak

```sql
CREATE OR REPLACE FUNCTION update_workout_streak(user_uuid uuid)
RETURNS void AS $$
DECLARE
  streak_count integer := 0;
  current_date date := CURRENT_DATE;
  prev_workout_date date;
  workout_dates date[];
BEGIN
  -- Get all workout dates in descending order
  SELECT ARRAY_AGG(workout_date ORDER BY workout_date DESC)
  INTO workout_dates
  FROM workouts
  WHERE user_id = user_uuid AND is_completed = true;
  
  -- Calculate streak
  IF array_length(workout_dates, 1) > 0 THEN
    FOREACH prev_workout_date IN ARRAY workout_dates LOOP
      -- Allow 1-2 rest days without breaking streak
      IF (current_date - prev_workout_date) <= 2 THEN
        streak_count := streak_count + 1;
        current_date := prev_workout_date;
      ELSE
        EXIT;
      END IF;
    END LOOP;
  END IF;
  
  -- Update gamification data
  UPDATE gamification_data
  SET 
    current_streak = streak_count,
    longest_streak = GREATEST(longest_streak, streak_count)
  WHERE user_id = user_uuid;
END;
$$ LANGUAGE plpgsql;
```

### 7. Auto-Detect Personal Records

```sql
CREATE OR REPLACE FUNCTION check_and_create_personal_record()
RETURNS TRIGGER AS $$
DECLARE
  exercise_rec RECORD;
  exercise_volume decimal;
  max_weight decimal;
  max_reps integer;
  existing_volume_pr decimal;
  existing_weight_pr decimal;
  existing_reps_pr integer;
  user_uuid uuid;
  workout_date date;
BEGIN
  -- Get exercise details
  SELECT e.exercise_name, e.workout_id, w.user_id, w.workout_date
  INTO exercise_rec
  FROM exercises e
  JOIN workouts w ON w.id = e.workout_id
  WHERE e.id = NEW.exercise_id;
  
  user_uuid := exercise_rec.user_id;
  workout_date := exercise_rec.workout_date;
  
  -- Only check if set is completed
  IF NEW.is_completed = true AND NEW.is_warmup = false THEN
    -- Calculate current exercise volume
    exercise_volume := calculate_exercise_volume(NEW.exercise_id);
    
    -- Get max weight and reps for this set
    SELECT MAX(weight), MAX(reps)
    INTO max_weight, max_reps
    FROM exercise_sets
    WHERE exercise_id = NEW.exercise_id
      AND is_completed = true
      AND is_warmup = false;
    
    -- Check existing PRs
    SELECT value INTO existing_volume_pr
    FROM personal_records
    WHERE user_id = user_uuid
      AND exercise_name = exercise_rec.exercise_name
      AND record_type = 'max_volume';
    
    SELECT value INTO existing_weight_pr
    FROM personal_records
    WHERE user_id = user_uuid
      AND exercise_name = exercise_rec.exercise_name
      AND record_type = 'max_weight';
    
    SELECT value INTO existing_reps_pr
    FROM personal_records
    WHERE user_id = user_uuid
      AND exercise_name = exercise_rec.exercise_name
      AND record_type = 'max_reps';
    
    -- Create or update volume PR
    IF existing_volume_pr IS NULL OR exercise_volume > existing_volume_pr THEN
      INSERT INTO personal_records (user_id, exercise_name, record_type, value, achieved_date, workout_id)
      VALUES (user_uuid, exercise_rec.exercise_name, 'max_volume', exercise_volume, workout_date, exercise_rec.workout_id)
      ON CONFLICT (user_id, exercise_name, record_type)
      DO UPDATE SET value = EXCLUDED.value, achieved_date = EXCLUDED.achieved_date, workout_id = EXCLUDED.workout_id;
      
      -- Award PR points
      UPDATE gamification_data
      SET total_points = total_points + 25
      WHERE user_id = user_uuid;
    END IF;
    
    -- Create or update weight PR
    IF existing_weight_pr IS NULL OR max_weight > existing_weight_pr THEN
      INSERT INTO personal_records (user_id, exercise_name, record_type, value, achieved_date, workout_id)
      VALUES (user_uuid, exercise_rec.exercise_name, 'max_weight', max_weight, workout_date, exercise_rec.workout_id)
      ON CONFLICT (user_id, exercise_name, record_type)
      DO UPDATE SET value = EXCLUDED.value, achieved_date = EXCLUDED.achieved_date, workout_id = EXCLUDED.workout_id;
    END IF;
    
    -- Create or update reps PR
    IF existing_reps_pr IS NULL OR max_reps > existing_reps_pr THEN
      INSERT INTO personal_records (user_id, exercise_name, record_type, value, achieved_date, workout_id)
      VALUES (user_uuid, exercise_rec.exercise_name, 'max_reps', max_reps, workout_date, exercise_rec.workout_id)
      ON CONFLICT (user_id, exercise_name, record_type)
      DO UPDATE SET value = EXCLUDED.value, achieved_date = EXCLUDED.achieved_date, workout_id = EXCLUDED.workout_id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_set_completed
  AFTER INSERT OR UPDATE ON public.exercise_sets
  FOR EACH ROW
  EXECUTE FUNCTION check_and_create_personal_record();
```

### 8. Reset Weekly Stats Function

```sql
CREATE OR REPLACE FUNCTION reset_weekly_stats()
RETURNS void AS $$
BEGIN
  UPDATE gamification_data
  SET weekly_stats = jsonb_build_object(
    'week_start', CURRENT_DATE,
    'workouts_completed', 0,
    'total_volume', 0,
    'cardio_minutes', 0,
    'points_earned', 0
  )
  WHERE (weekly_stats->>'week_start')::date < (CURRENT_DATE - INTERVAL '7 days');
END;
$$ LANGUAGE plpgsql;

-- Schedule this with pg_cron or call from edge function
```

---

## Row Level Security (RLS) Policies

### Users Table

```sql
-- Users can read their own profile
CREATE POLICY "Users can view own profile"
ON public.users FOR SELECT
USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON public.users FOR UPDATE
USING (auth.uid() = id);
```

### Workout Programs

```sql
CREATE POLICY "Users can view own programs"
ON public.workout_programs FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own programs"
ON public.workout_programs FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own programs"
ON public.workout_programs FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own programs"
ON public.workout_programs FOR DELETE
USING (auth.uid() = user_id);
```

### Program Days

```sql
CREATE POLICY "Users can view program days"
ON public.program_days FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM workout_programs
    WHERE id = program_days.program_id
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can manage program days"
ON public.program_days FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM workout_programs
    WHERE id = program_days.program_id
    AND user_id = auth.uid()
  )
);
```

### Workouts

```sql
CREATE POLICY "Users can view own workouts"
ON public.workouts FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own workouts"
ON public.workouts FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own workouts"
ON public.workouts FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own workouts"
ON public.workouts FOR DELETE
USING (auth.uid() = user_id);
```

### Exercises

```sql
CREATE POLICY "Users can view exercises in own workouts"
ON public.exercises FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM workouts
    WHERE id = exercises.workout_id
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can manage exercises in own workouts"
ON public.exercises FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM workouts
    WHERE id = exercises.workout_id
    AND user_id = auth.uid()
  )
);
```

### Exercise Sets

```sql
CREATE POLICY "Users can view sets in own exercises"
ON public.exercise_sets FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM exercises e
    JOIN workouts w ON w.id = e.workout_id
    WHERE e.id = exercise_sets.exercise_id
    AND w.user_id = auth.uid()
  )
);

CREATE POLICY "Users can manage sets in own exercises"
ON public.exercise_sets FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM exercises e
    JOIN workouts w ON w.id = e.workout_id
    WHERE e.id = exercise_sets.exercise_id
    AND w.user_id = auth.uid()
  )
);
```

### Body Weight Logs

```sql
CREATE POLICY "Users can view own weight logs"
ON public.body_weight_logs FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own weight logs"
ON public.body_weight_logs FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own weight logs"
ON public.body_weight_logs FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own weight logs"
ON public.body_weight_logs FOR DELETE
USING (auth.uid() = user_id);
```

### Personal Records

```sql
CREATE POLICY "Users can view own PRs"
ON public.personal_records FOR SELECT
USING (auth.uid() = user_id);

-- PRs are auto-generated by triggers, not manually inserted
-- But allow deletion if needed
CREATE POLICY "Users can delete own PRs"
ON public.personal_records FOR DELETE
USING (auth.uid() = user_id);
```

### Gamification Data

```sql
CREATE POLICY "Users can view own gamification data"
ON public.gamification_data FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own gamification data"
ON public.gamification_data FOR UPDATE
USING (auth.uid() = user_id);
```

### Readiness Logs

```sql
CREATE POLICY "Users can view own readiness logs"
ON public.readiness_logs FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own readiness logs"
ON public.readiness_logs FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own readiness logs"
ON public.readiness_logs FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own readiness logs"
ON public.readiness_logs FOR DELETE
USING (auth.uid() = user_id);
```

### Exercise Library

```sql
-- Everyone can read exercise library
CREATE POLICY "Anyone can view exercise library"
ON public.exercise_library FOR SELECT
TO authenticated
USING (true);

-- Users can create custom exercises
CREATE POLICY "Users can create custom exercises"
ON public.exercise_library FOR INSERT
WITH CHECK (auth.uid() = created_by AND is_custom = true);

-- Users can update their custom exercises
CREATE POLICY "Users can update own custom exercises"
ON public.exercise_library FOR UPDATE
USING (auth.uid() = created_by AND is_custom = true);

-- Users can delete their custom exercises
CREATE POLICY "Users can delete own custom exercises"
ON public.exercise_library FOR DELETE
USING (auth.uid() = created_by AND is_custom = true);
```

---

## Seed Data

### Default Exercise Library

```sql
INSERT INTO public.exercise_library (exercise_name, exercise_type, primary_muscle_groups, equipment_needed, difficulty_level, description) VALUES
-- Chest
('Barbell Bench Press', 'strength', ARRAY['Chest', 'Triceps'], ARRAY['Barbell', 'Bench'], 'intermediate', 'Compound pressing movement for chest development'),
('Incline Dumbbell Press', 'strength', ARRAY['Chest', 'Shoulders'], ARRAY['Dumbbells', 'Bench'], 'intermediate', 'Upper chest focused pressing movement'),
('Cable Fly', 'strength', ARRAY['Chest'], ARRAY['Cable Machine'], 'beginner', 'Isolation movement for chest stretch and contraction'),
('Push-ups', 'strength', ARRAY['Chest', 'Triceps'], ARRAY[], 'beginner', 'Bodyweight chest exercise'),

-- Back
('Pull-ups', 'strength', ARRAY['Back', 'Biceps'], ARRAY['Pull-up Bar'], 'intermediate', 'Vertical pulling movement for back width'),
('Barbell Row', 'strength', ARRAY['Back', 'Biceps'], ARRAY['Barbell'], 'intermediate', 'Horizontal pulling for back thickness'),
('Lat Pulldown', 'strength', ARRAY['Back'], ARRAY['Cable Machine'], 'beginner', 'Vertical pull variation'),
('Cable Row', 'strength', ARRAY['Back'], ARRAY['Cable Machine'], 'beginner', 'Seated horizontal pull'),
('Deadlift', 'strength', ARRAY['Back', 'Hamstrings', 'Glutes'], ARRAY['Barbell'], 'advanced', 'Full posterior chain compound movement'),

-- Shoulders
('Overhead Press', 'strength', ARRAY['Shoulders', 'Triceps'], ARRAY['Barbell'], 'intermediate', 'Primary shoulder pressing movement'),
('Dumbbell Lateral Raise', 'strength', ARRAY['Shoulders'], ARRAY['Dumbbells'], 'beginner', 'Lateral deltoid isolation'),
('Face Pull', 'strength', ARRAY['Shoulders', 'Back'], ARRAY['Cable Machine'], 'beginner', 'Rear delt and upper back exercise'),

-- Legs
('Barbell Squat', 'strength', ARRAY['Quads', 'Glutes'], ARRAY['Barbell', 'Rack'], 'intermediate', 'Primary lower body compound movement'),
('Romanian Deadlift', 'strength', ARRAY['Hamstrings', 'Glutes'], ARRAY['Barbell'], 'intermediate', 'Hamstring focused hip hinge'),
('Leg Press', 'strength', ARRAY['Quads', 'Glutes'], ARRAY['Leg Press Machine'], 'beginner', 'Machine-based leg exercise'),
('Leg Curl', 'strength', ARRAY['Hamstrings'], ARRAY['Leg Curl Machine'], 'beginner', 'Hamstring isolation'),
('Calf Raise', 'strength', ARRAY['Calves'], ARRAY['Machine'], 'beginner', 'Calf isolation'),

-- Arms
('Barbell Curl', 'strength', ARRAY['Biceps'], ARRAY['Barbell'], 'beginner', 'Primary bicep exercise'),
('Tricep Pushdown', 'strength', ARRAY['Triceps'], ARRAY['Cable Machine'], 'beginner', 'Tricep isolation movement'),
('Hammer Curl', 'strength', ARRAY['Biceps', 'Forearms'], ARRAY['Dumbbells'], 'beginner', 'Neutral grip bicep exercise'),

-- Core
('Plank', 'strength', ARRAY['Core'], ARRAY[], 'beginner', 'Isometric core stability exercise'),
('Cable Crunch', 'strength', ARRAY['Abs'], ARRAY['Cable Machine'], 'beginner', 'Weighted abdominal exercise'),

-- Cardio
('Treadmill', 'cardio', ARRAY[], ARRAY['Treadmill'], 'beginner', 'Running or walking cardiovascular exercise'),
('Stationary Bike', 'cardio', ARRAY[], ARRAY['Bike'], 'beginner', 'Cycling cardiovascular exercise'),
('Rowing Machine', 'cardio', ARRAY[], ARRAY['Rowing Machine'], 'beginner', 'Full-body cardiovascular exercise'),
('Elliptical', 'cardio', ARRAY[], ARRAY['Elliptical'], 'beginner', 'Low-impact cardiovascular exercise'),
('Stairmaster', 'cardio', ARRAY[], ARRAY['Stairmaster'], 'intermediate', 'High-intensity stair climbing');
```

### Sample Program (Push/Pull/Legs)

```sql
-- This would be created per user, but here's the structure
-- You can create a function to auto-generate default program for new users

CREATE OR REPLACE FUNCTION create_default_program_for_user(user_uuid uuid)
RETURNS uuid AS $$
DECLARE
  program_uuid uuid;
  push_day_uuid uuid;
  pull_day_uuid uuid;
  legs_day_uuid uuid;
BEGIN
  -- Create program
  INSERT INTO workout_programs (user_id, name, description, is_active)
  VALUES (user_uuid, 'Push Pull Legs', 'Classic 3-day split focusing on push, pull, and leg movements', true)
  RETURNING id INTO program_uuid;
  
  -- Create Push day
  INSERT INTO program_days (program_id, day_name, day_order, muscle_groups)
  VALUES (program_uuid, 'Push', 1, ARRAY['Chest', 'Shoulders', 'Triceps'])
  RETURNING id INTO push_day_uuid;
  
  -- Create Pull day
  INSERT INTO program_days (program_id, day_name, day_order, muscle_groups)
  VALUES (program_uuid, 'Pull', 2, ARRAY['Back', 'Biceps'])
  RETURNING id INTO pull_day_uuid;
  
  -- Create Legs day
  INSERT INTO program_days (program_id, day_name, day_order, muscle_groups)
  VALUES (program_uuid, 'Legs', 3, ARRAY['Quads', 'Hamstrings', 'Glutes', 'Calves'])
  RETURNING id INTO legs_day_uuid;
  
  RETURN program_uuid;
END;
$$ LANGUAGE plpgsql;
```

---

## Supabase Edge Functions

### 1. Weekly Stats Reset (Scheduled)

Create: `supabase/functions/reset-weekly-stats/index.ts`

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  const { error } = await supabaseClient.rpc('reset_weekly_stats')

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
})
```

### 2. Calculate Week-over-Week Analytics

Create: `supabase/functions/calculate-weekly-comparison/index.ts`

```typescript
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
    })
  }

  const today = new Date()
  const currentWeekStart = new Date(today.setDate(today.getDate() - today.getDay()))
  const previousWeekStart = new Date(currentWeekStart)
  previousWeekStart.setDate(previousWeekStart.getDate() - 7)

  // Fetch current week data
  const { data: currentWeekWorkouts } = await supabaseClient
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

  // Fetch previous week data
  const { data: previousWeekWorkouts } = await supabaseClient
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
      : 0

  const comparison: WeeklyComparison = {
    current_week: currentStats,
    previous_week: previousStats,
    changes: {
      volume_delta: volumeDelta,
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
})
```

---

## TypeScript Type Generation

Generate TypeScript types from your Supabase schema:

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref YOUR_PROJECT_REF

# Generate types
supabase gen types typescript --linked > lib/supabase/types.ts
```

Create: `lib/supabase/types.ts` (auto-generated)

---

## Client Integration Helpers

Create: `lib/supabase/queries.ts`

```typescript
import { supabase } from './client'
import type { Database } from './types'

type Tables = Database['public']['Tables']

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
}

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
}

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
}

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
}

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
}

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
      .single()
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
}

export const exerciseLibraryQueries = {
  // Search exercises
  async searchExercises(searchTerm: string) {
    return await supabase
      .from('exercise_library')
      .select('*')
      .textSearch('exercise_name', searchTerm)
      .limit(10)
  },

  // Get exercises by muscle group
  async getExercisesByMuscleGroup(muscleGroup: string) {
    return await supabase
      .from('exercise_library')
      .select('*')
      .contains('primary_muscle_groups', [muscleGroup])
  },

  // Get all exercises
  async getAllExercises() {
    return await supabase
      .from('exercise_library')
      .select('*')
      .order('exercise_name')
  },
}

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
}
```

---

## Real-time Subscriptions Setup

Create: `lib/supabase/subscriptions.ts`

```typescript
import { supabase } from './client'
import { RealtimeChannel } from '@supabase/supabase-js'

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

  // Unsubscribe from channel
  unsubscribe(channel: RealtimeChannel) {
    supabase.removeChannel(channel)
  },
}
```

---

## Environment Variables Setup

Create: `.env.local`

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

---

## Migration Scripts

Create a directory: `supabase/migrations/`

### Migration 001: Initial Schema

File: `supabase/migrations/20240101000001_initial_schema.sql`

```sql
-- Execute all the CREATE TABLE statements from above
-- Execute all indexes
-- Execute all functions
-- Execute all triggers
-- Execute all RLS policies
-- Execute seed data
```

### Migration 002: Sample Data

File: `supabase/migrations/20240101000002_seed_data.sql`

```sql
-- Insert exercise library data
-- Insert any default configurations
```

---

## Testing & Validation

### 1. Test RLS Policies

```sql
-- Test as different user
SET ROLE authenticated;
SET request.jwt.claims.sub = 'user-uuid-here';

-- Try to access data
SELECT * FROM workouts;

-- Should only return workouts for that user
```

### 2. Test Triggers

```sql
-- Insert a workout
INSERT INTO workouts (user_id, workout_date, start_time, is_completed)
VALUES ('test-user-id', CURRENT_DATE, now(), true);

-- Check if gamification_data was updated
SELECT * FROM gamification_data WHERE user_id = 'test-user-id';
```

### 3. Test Functions

```sql
-- Test volume calculation
SELECT calculate_exercise_volume('exercise-uuid');

-- Test streak calculation
SELECT * FROM update_workout_streak('user-uuid');
```

---

## Performance Optimization

### 1. Query Optimization

```sql
-- Analyze query plans
EXPLAIN ANALYZE
SELECT * FROM workouts
WHERE user_id = 'some-uuid'
ORDER BY workout_date DESC
LIMIT 10;

-- Create additional indexes based on slow queries
```

### 2. Connection Pooling

Update `lib/supabase/client.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseKey, {
  db: {
    schema: 'public',
  },
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    headers: {
      'x-application-name': 'workout-tracker',
    },
  },
})
```

---

## Security Checklist

- [ ] RLS enabled on all tables
- [ ] Policies created for SELECT, INSERT, UPDATE, DELETE
- [ ] Service role key kept secure (server-only)
- [ ] Input validation in edge functions
- [ ] Auth checks in all queries
- [ ] HTTPS enforced
- [ ] Environment variables not committed to git
- [ ] SQL injection prevention (parameterized queries)

---

## Deployment Instructions

### 1. Local Development

```bash
# Install Supabase CLI
npm install -g supabase

# Start local Supabase
supabase start

# Apply migrations
supabase db push

# Generate types
supabase gen types typescript --local > lib/supabase/types.ts
```

### 2. Production Deployment

```bash
# Link to production project
supabase link --project-ref YOUR_PROJECT_REF

# Push migrations to production
supabase db push

# Deploy edge functions
supabase functions deploy reset-weekly-stats
supabase functions deploy calculate-weekly-comparison

# Set secrets for edge functions
supabase secrets set SUPABASE_URL=your-url
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-key
```

---

## Monitoring & Maintenance

### 1. Database Health Checks

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
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan ASC;
```

### 2. Scheduled Maintenance

```sql
-- Vacuum analyze (run weekly)
VACUUM ANALYZE;

-- Update statistics
ANALYZE;
```

---

## Documentation Requirements

Create the following documentation:

1. **API Documentation**: Document all query functions with parameters and return types
2. **Schema Diagram**: Visual representation of database relationships
3. **RLS Policy Matrix**: Table showing which users can do what operations
4. **Migration Guide**: How to add new tables/columns
5. **Troubleshooting Guide**: Common issues and solutions

---

## Success Criteria

A successful backend implementation will:

✅ Have all tables created with proper relationships  
✅ Implement comprehensive RLS policies for security  
✅ Include automatic triggers for gamification  
✅ Calculate volumes, streaks, and PRs accurately  
✅ Generate TypeScript types from schema  
✅ Provide optimized query functions for frontend  
✅ Support real-time updates  
✅ Include proper indexes for performance  
✅ Have seed data for exercise library  
✅ Pass all security and performance tests  

---

## Development Phases

### Phase 1: Core Schema (Priority 1)
1. Create users, workouts, exercises, exercise_sets tables
2. Implement basic RLS policies
3. Create volume calculation functions
4. Test CRUD operations

### Phase 2: Analytics & Gamification (Priority 2)
1. Create gamification_data and personal_records tables
2. Implement PR detection triggers
3. Create streak calculation functions
4. Test workout completion flow

### Phase 3: Advanced Features (Priority 3)
1. Create readiness_logs and exercise_library tables
2. Implement search functionality
3. Create edge functions for analytics
4. Set up real-time subscriptions

### Phase 4: Polish & Optimization (Priority 4)
1. Add indexes for slow queries
2. Optimize RLS policies
3. Generate comprehensive types
4. Create helper query functions
5. Write documentation

---

## Deliverables

Please provide:

1. **Complete SQL migration files** in `supabase/migrations/`
2. **TypeScript type definitions** in `lib/supabase/types.ts`
3. **Query helper functions** in `lib/supabase/queries.ts`
4. **Real-time subscriptions** in `lib/supabase/subscriptions.ts`
5. **Edge functions** in `supabase/functions/`
6. **Seed data scripts** for exercise library
7. **Testing documentation** for RLS policies and triggers
8. **README.md** with setup and deployment instructions

---

## Questions to Address

As you build, consider:
- Are all user data properly isolated with RLS?
- Are indexes optimized for common queries?
- Do triggers handle edge cases gracefully?
- Is error handling comprehensive?
- Are calculations accurate and performant?
- Can the schema scale with more users?
- Is the data model normalized appropriately?

---

## Final Notes

This backend powers a personal fitness tracking application that users rely on daily. Prioritize:

1. **Data Integrity**: Never lose workout data
2. **Security**: Strict RLS policies
3. **Performance**: Sub-100ms query times
4. **Accuracy**: Correct volume and analytics calculations
5. **Reliability**: Handle edge cases gracefully

Build a backend that's robust, secure, and maintainable. Good luck! 💪

---

## Reference Implementation Checklist

- [ ] All tables created
- [ ] All indexes added
- [ ] All functions implemented
- [ ] All triggers configured
- [ ] All RLS policies applied
- [ ] Seed data inserted
- [ ] Types generated
- [ ] Query helpers written
- [ ] Edge functions deployed
- [ ] Real-time subscriptions set up
- [ ] Environment variables configured
- [ ] Local development tested
- [ ] Production deployment successful
- [ ] Documentation complete

