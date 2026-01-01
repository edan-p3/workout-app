-- This script helps diagnose and fix gamification data issues
-- Run this in Supabase SQL Editor

-- 1. Check current gamification data for your user
SELECT 
  gd.user_id,
  u.settings->>'full_name' as name,
  gd.total_workouts,
  gd.current_streak,
  gd.total_points,
  gd.updated_at
FROM gamification_data gd
LEFT JOIN users u ON u.id = gd.user_id
WHERE u.settings->>'email' = 'edvora@gmail.com' -- Change to your email
   OR gd.user_id = auth.uid(); -- Or use current logged in user

-- 2. Count actual completed workouts for your user
SELECT 
  user_id,
  COUNT(*) as actual_workout_count,
  MIN(workout_date) as first_workout,
  MAX(workout_date) as last_workout
FROM workouts
WHERE is_completed = true
  AND user_id = auth.uid()
GROUP BY user_id;

-- 3. Fix gamification data to match actual workouts (OPTIONAL - only run if data is incorrect)
-- Uncomment the UPDATE statement below if you want to sync the data

/*
UPDATE gamification_data gd
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
WHERE user_id = auth.uid();
*/

-- 4. Verify the update (run after uncommenting and running step 3)
SELECT 
  gd.user_id,
  gd.total_workouts as gamification_workouts,
  COUNT(w.id) as actual_workouts,
  gd.total_points,
  gd.current_streak
FROM gamification_data gd
LEFT JOIN workouts w ON w.user_id = gd.user_id AND w.is_completed = true
WHERE gd.user_id = auth.uid()
GROUP BY gd.user_id, gd.total_workouts, gd.total_points, gd.current_streak;

