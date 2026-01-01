-- Fix leaderboard: Allow all users to view basic info (email, settings) from other users
-- This is needed for leaderboard to show names

-- Drop the restrictive policy
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;

-- Create new policy that allows reading email and settings for leaderboard display
CREATE POLICY "Users can view all user profiles for leaderboard"
ON public.users FOR SELECT
USING (true);

-- Note: Users can still only UPDATE their own profile (that policy remains unchanged)

