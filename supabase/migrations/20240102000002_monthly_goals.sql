-- Create monthly_goals table
CREATE TABLE IF NOT EXISTS public.monthly_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  month_year TEXT NOT NULL, -- Format: "2024-01" for January 2024
  goal_workouts INTEGER NOT NULL DEFAULT 12,
  completed_workouts INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Ensure one goal per user per month
  UNIQUE(user_id, month_year)
);

-- Enable RLS
ALTER TABLE public.monthly_goals ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own monthly goals"
  ON public.monthly_goals
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own monthly goals"
  ON public.monthly_goals
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own monthly goals"
  ON public.monthly_goals
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Index for faster lookups
CREATE INDEX idx_monthly_goals_user_month ON public.monthly_goals(user_id, month_year);

-- Function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_monthly_goals_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER monthly_goals_updated_at
  BEFORE UPDATE ON public.monthly_goals
  FOR EACH ROW
  EXECUTE FUNCTION update_monthly_goals_updated_at();

