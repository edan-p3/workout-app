-- Ensure all existing users have gamification data
-- This fixes users who were created before the trigger was set up

-- Insert gamification_data for any users who don't have it yet
INSERT INTO public.gamification_data (
  user_id,
  total_workouts,
  current_streak,
  longest_streak,
  total_points,
  level,
  achievements,
  weekly_stats
)
SELECT 
  u.id,
  COALESCE((SELECT COUNT(*) FROM workouts WHERE user_id = u.id AND is_completed = true), 0) as total_workouts,
  0 as current_streak, -- Will be calculated later
  0 as longest_streak,
  COALESCE((SELECT COUNT(*) * 100 FROM workouts WHERE user_id = u.id AND is_completed = true), 0) as total_points,
  1 as level,
  '[]'::jsonb as achievements,
  jsonb_build_object(
    'week_start', CURRENT_DATE,
    'workouts_completed', 0,
    'total_volume', 0,
    'cardio_minutes', 0,
    'points_earned', 0
  ) as weekly_stats
FROM public.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.gamification_data gd WHERE gd.user_id = u.id
);

-- Update existing gamification data to match actual workout counts
UPDATE public.gamification_data gd
SET 
  total_workouts = (
    SELECT COUNT(*) 
    FROM workouts 
    WHERE user_id = gd.user_id AND is_completed = true
  ),
  total_points = (
    SELECT COUNT(*) * 100 
    FROM workouts 
    WHERE user_id = gd.user_id AND is_completed = true
  ),
  updated_at = NOW()
WHERE gd.total_workouts = 0 
  AND EXISTS (
    SELECT 1 FROM workouts WHERE user_id = gd.user_id AND is_completed = true
  );

