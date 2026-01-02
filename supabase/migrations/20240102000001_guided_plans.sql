-- =====================================================
-- Guided Plans Schema
-- Migration: 20240102000001
-- =====================================================

-- Table for storing user's guided workout plans
CREATE TABLE public.guided_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  
  -- Store the plan configuration as JSONB
  plan_data jsonb NOT NULL,
  
  -- Track progress
  current_week integer DEFAULT 1,
  started_at timestamptz DEFAULT now(),
  last_workout_date date,
  total_workouts_completed integer DEFAULT 0,
  
  -- Status
  is_active boolean DEFAULT true,
  
  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.guided_plans ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own guided plans"
  ON public.guided_plans FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own guided plans"
  ON public.guided_plans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own guided plans"
  ON public.guided_plans FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own guided plans"
  ON public.guided_plans FOR DELETE
  USING (auth.uid() = user_id);

-- Index for faster queries
CREATE INDEX idx_guided_plans_user_id ON public.guided_plans(user_id);
CREATE INDEX idx_guided_plans_active ON public.guided_plans(user_id, is_active) WHERE is_active = true;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_guided_plan_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.guided_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_guided_plan_updated_at();

-- Table for tracking individual workout completions in guided plans
CREATE TABLE public.guided_workout_completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guided_plan_id uuid NOT NULL REFERENCES public.guided_plans(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  workout_id uuid REFERENCES public.workouts(id) ON DELETE SET NULL,
  
  -- Which day in the plan was completed
  day_index integer NOT NULL,
  day_name text NOT NULL,
  week_number integer NOT NULL,
  
  -- Completion data
  completed_at timestamptz DEFAULT now(),
  duration_minutes integer,
  notes text,
  
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.guided_workout_completions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own guided workout completions"
  ON public.guided_workout_completions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own guided workout completions"
  ON public.guided_workout_completions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own guided workout completions"
  ON public.guided_workout_completions FOR UPDATE
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_guided_completions_plan_id ON public.guided_workout_completions(guided_plan_id);
CREATE INDEX idx_guided_completions_user_id ON public.guided_workout_completions(user_id);
CREATE INDEX idx_guided_completions_date ON public.guided_workout_completions(user_id, completed_at DESC);

