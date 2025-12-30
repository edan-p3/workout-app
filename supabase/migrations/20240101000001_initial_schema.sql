-- =====================================================
-- Workout Tracker - Initial Database Schema
-- Migration: 20240101000001
-- =====================================================

-- =====================================================
-- 1. ENUMS
-- =====================================================

CREATE TYPE exercise_type AS ENUM ('strength', 'cardio');
CREATE TYPE machine_type AS ENUM ('treadmill', 'bike', 'elliptical', 'rowing', 'stairmaster', 'other');
CREATE TYPE record_type AS ENUM ('max_weight', 'max_volume', 'max_reps');

-- =====================================================
-- 2. TABLES
-- =====================================================

-- -----------------------------------------------------
-- Users Table (extends auth.users)
-- -----------------------------------------------------
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

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------
-- Workout Programs
-- -----------------------------------------------------
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

-- -----------------------------------------------------
-- Program Days
-- -----------------------------------------------------
CREATE TABLE public.program_days (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id uuid NOT NULL REFERENCES public.workout_programs(id) ON DELETE CASCADE,
  day_name text NOT NULL,
  day_order integer NOT NULL,
  muscle_groups text[] DEFAULT ARRAY[]::text[],
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.program_days ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------
-- Workouts
-- -----------------------------------------------------
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

-- -----------------------------------------------------
-- Exercises
-- -----------------------------------------------------
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

-- -----------------------------------------------------
-- Exercise Sets
-- -----------------------------------------------------
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

-- -----------------------------------------------------
-- Body Weight Logs
-- -----------------------------------------------------
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

-- -----------------------------------------------------
-- Personal Records
-- -----------------------------------------------------
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

-- -----------------------------------------------------
-- Gamification Data
-- -----------------------------------------------------
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

-- -----------------------------------------------------
-- Readiness Logs
-- -----------------------------------------------------
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

-- -----------------------------------------------------
-- Exercise Library
-- -----------------------------------------------------
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

-- =====================================================
-- 3. INDEXES
-- =====================================================

-- Workout Programs
CREATE INDEX idx_workout_programs_user ON workout_programs(user_id);
CREATE INDEX idx_workout_programs_active ON workout_programs(user_id, is_active) WHERE is_active = true;

-- Program Days
CREATE INDEX idx_program_days_program ON program_days(program_id, day_order);

-- Workouts
CREATE INDEX idx_workouts_user_date ON workouts(user_id, workout_date DESC);
CREATE INDEX idx_workouts_user_completed ON workouts(user_id, is_completed);
CREATE INDEX idx_workouts_date ON workouts(workout_date DESC);

-- Exercises
CREATE INDEX idx_exercises_workout ON exercises(workout_id, order_index);
CREATE INDEX idx_exercises_name ON exercises(exercise_name);

-- Exercise Sets
CREATE INDEX idx_exercise_sets_exercise ON exercise_sets(exercise_id, set_number);
CREATE INDEX idx_exercise_sets_completed ON exercise_sets(exercise_id) WHERE is_completed = true;

-- Body Weight Logs
CREATE INDEX idx_body_weight_user_date ON body_weight_logs(user_id, log_date DESC);

-- Personal Records
CREATE INDEX idx_personal_records_user ON personal_records(user_id, achieved_date DESC);
CREATE INDEX idx_personal_records_exercise ON personal_records(exercise_name, record_type);

-- Gamification Data
CREATE INDEX idx_gamification_user ON gamification_data(user_id);

-- Readiness Logs
CREATE INDEX idx_readiness_user_date ON readiness_logs(user_id, log_date DESC);

-- Exercise Library
CREATE INDEX idx_exercise_library_name ON exercise_library USING gin(to_tsvector('english', exercise_name));
CREATE INDEX idx_exercise_library_muscle ON exercise_library USING gin(primary_muscle_groups);

-- =====================================================
-- 4. FUNCTIONS
-- =====================================================

-- -----------------------------------------------------
-- Update updated_at timestamp
-- -----------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- -----------------------------------------------------
-- Automatic User Profile Creation
-- -----------------------------------------------------
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

-- -----------------------------------------------------
-- Calculate Exercise Volume
-- -----------------------------------------------------
CREATE OR REPLACE FUNCTION calculate_exercise_volume(exercise_uuid uuid)
RETURNS decimal AS $$
  SELECT COALESCE(SUM(weight * reps), 0)
  FROM exercise_sets
  WHERE exercise_id = exercise_uuid
    AND is_completed = true
    AND is_warmup = false;
$$ LANGUAGE sql STABLE;

-- -----------------------------------------------------
-- Calculate Workout Total Volume
-- -----------------------------------------------------
CREATE OR REPLACE FUNCTION calculate_workout_volume(workout_uuid uuid)
RETURNS decimal AS $$
  SELECT COALESCE(SUM(calculate_exercise_volume(e.id)), 0)
  FROM exercises e
  WHERE e.workout_id = workout_uuid
    AND e.exercise_type = 'strength';
$$ LANGUAGE sql STABLE;

-- -----------------------------------------------------
-- Update Workout Streak
-- -----------------------------------------------------
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

-- -----------------------------------------------------
-- Update Gamification on Workout Completion
-- -----------------------------------------------------
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

-- -----------------------------------------------------
-- Auto-Detect Personal Records
-- -----------------------------------------------------
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

-- -----------------------------------------------------
-- Reset Weekly Stats
-- -----------------------------------------------------
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

-- -----------------------------------------------------
-- Create Default Program for User
-- -----------------------------------------------------
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

-- =====================================================
-- 5. TRIGGERS
-- =====================================================

-- Updated at triggers
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.users 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.workout_programs 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.workouts 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.gamification_data 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- User profile creation trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_profile();

-- Workout completion trigger
CREATE TRIGGER on_workout_completed
  AFTER UPDATE ON public.workouts
  FOR EACH ROW
  EXECUTE FUNCTION update_gamification_on_workout_complete();

-- Personal record detection trigger
CREATE TRIGGER on_set_completed
  AFTER INSERT OR UPDATE ON public.exercise_sets
  FOR EACH ROW
  EXECUTE FUNCTION check_and_create_personal_record();

