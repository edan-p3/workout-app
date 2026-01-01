-- Fix RLS policies for exercises and exercise_sets to allow inserts
-- The existing policies use USING which checks existing rows
-- We need WITH CHECK for INSERT operations

-- Drop and recreate exercises policy with proper INSERT support
DROP POLICY IF EXISTS "Users can manage exercises in own workouts" ON public.exercises;

CREATE POLICY "Users can view exercises in own workouts"
ON public.exercises FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM workouts
    WHERE id = exercises.workout_id
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert exercises in own workouts"
ON public.exercises FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM workouts
    WHERE id = workout_id
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can update exercises in own workouts"
ON public.exercises FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM workouts
    WHERE id = exercises.workout_id
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete exercises in own workouts"
ON public.exercises FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM workouts
    WHERE id = exercises.workout_id
    AND user_id = auth.uid()
  )
);

-- Drop and recreate exercise_sets policy with proper INSERT support
DROP POLICY IF EXISTS "Users can manage sets in own exercises" ON public.exercise_sets;

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

CREATE POLICY "Users can insert sets in own exercises"
ON public.exercise_sets FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM exercises e
    JOIN workouts w ON w.id = e.workout_id
    WHERE e.id = exercise_id
    AND w.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update sets in own exercises"
ON public.exercise_sets FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM exercises e
    JOIN workouts w ON w.id = e.workout_id
    WHERE e.id = exercise_sets.exercise_id
    AND w.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete sets in own exercises"
ON public.exercise_sets FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM exercises e
    JOIN workouts w ON w.id = e.workout_id
    WHERE e.id = exercise_sets.exercise_id
    AND w.user_id = auth.uid()
  )
);

