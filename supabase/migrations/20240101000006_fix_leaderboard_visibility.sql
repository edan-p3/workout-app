-- Fix leaderboard visibility: Allow all users to view everyone's gamification data
-- Drop the restrictive policy
DROP POLICY IF EXISTS "Users can view own gamification data" ON public.gamification_data;

-- Create new policy that allows everyone to see all gamification data (for leaderboard)
CREATE POLICY "Users can view all gamification data for leaderboard"
ON public.gamification_data FOR SELECT
USING (true);

-- Keep the update policy restricted to own data
-- (Already exists: "Users can update own gamification data")

