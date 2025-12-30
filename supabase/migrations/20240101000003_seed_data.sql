-- =====================================================
-- Workout Tracker - Seed Data
-- Migration: 20240101000003
-- =====================================================

-- =====================================================
-- EXERCISE LIBRARY SEED DATA
-- =====================================================

INSERT INTO public.exercise_library (exercise_name, exercise_type, primary_muscle_groups, equipment_needed, difficulty_level, description) VALUES

-- CHEST EXERCISES
('Barbell Bench Press', 'strength', ARRAY['Chest', 'Triceps'], ARRAY['Barbell', 'Bench'], 'intermediate', 'Compound pressing movement for chest development'),
('Incline Dumbbell Press', 'strength', ARRAY['Chest', 'Shoulders'], ARRAY['Dumbbells', 'Bench'], 'intermediate', 'Upper chest focused pressing movement'),
('Decline Bench Press', 'strength', ARRAY['Chest', 'Triceps'], ARRAY['Barbell', 'Bench'], 'intermediate', 'Lower chest focused pressing movement'),
('Cable Fly', 'strength', ARRAY['Chest'], ARRAY['Cable Machine'], 'beginner', 'Isolation movement for chest stretch and contraction'),
('Dumbbell Fly', 'strength', ARRAY['Chest'], ARRAY['Dumbbells', 'Bench'], 'beginner', 'Chest isolation with dumbbells'),
('Push-ups', 'strength', ARRAY['Chest', 'Triceps'], ARRAY[], 'beginner', 'Bodyweight chest exercise'),
('Chest Dip', 'strength', ARRAY['Chest', 'Triceps'], ARRAY['Dip Bar'], 'intermediate', 'Bodyweight chest and tricep exercise'),
('Pec Deck', 'strength', ARRAY['Chest'], ARRAY['Machine'], 'beginner', 'Machine chest fly'),

-- BACK EXERCISES
('Pull-ups', 'strength', ARRAY['Back', 'Biceps'], ARRAY['Pull-up Bar'], 'intermediate', 'Vertical pulling movement for back width'),
('Chin-ups', 'strength', ARRAY['Back', 'Biceps'], ARRAY['Pull-up Bar'], 'intermediate', 'Underhand grip vertical pull'),
('Barbell Row', 'strength', ARRAY['Back', 'Biceps'], ARRAY['Barbell'], 'intermediate', 'Horizontal pulling for back thickness'),
('Dumbbell Row', 'strength', ARRAY['Back', 'Biceps'], ARRAY['Dumbbells'], 'beginner', 'Single arm rowing movement'),
('Lat Pulldown', 'strength', ARRAY['Back'], ARRAY['Cable Machine'], 'beginner', 'Vertical pull variation'),
('Cable Row', 'strength', ARRAY['Back'], ARRAY['Cable Machine'], 'beginner', 'Seated horizontal pull'),
('T-Bar Row', 'strength', ARRAY['Back'], ARRAY['Barbell'], 'intermediate', 'Supported rowing movement'),
('Deadlift', 'strength', ARRAY['Back', 'Hamstrings', 'Glutes'], ARRAY['Barbell'], 'advanced', 'Full posterior chain compound movement'),
('Rack Pull', 'strength', ARRAY['Back', 'Traps'], ARRAY['Barbell', 'Rack'], 'intermediate', 'Partial deadlift for upper back'),
('Face Pull', 'strength', ARRAY['Shoulders', 'Back'], ARRAY['Cable Machine'], 'beginner', 'Rear delt and upper back exercise'),

-- SHOULDER EXERCISES
('Overhead Press', 'strength', ARRAY['Shoulders', 'Triceps'], ARRAY['Barbell'], 'intermediate', 'Primary shoulder pressing movement'),
('Dumbbell Shoulder Press', 'strength', ARRAY['Shoulders', 'Triceps'], ARRAY['Dumbbells'], 'beginner', 'Shoulder press with dumbbells'),
('Arnold Press', 'strength', ARRAY['Shoulders'], ARRAY['Dumbbells'], 'intermediate', 'Rotating shoulder press'),
('Dumbbell Lateral Raise', 'strength', ARRAY['Shoulders'], ARRAY['Dumbbells'], 'beginner', 'Lateral deltoid isolation'),
('Cable Lateral Raise', 'strength', ARRAY['Shoulders'], ARRAY['Cable Machine'], 'beginner', 'Cable lateral deltoid isolation'),
('Front Raise', 'strength', ARRAY['Shoulders'], ARRAY['Dumbbells'], 'beginner', 'Front deltoid isolation'),
('Rear Delt Fly', 'strength', ARRAY['Shoulders'], ARRAY['Dumbbells'], 'beginner', 'Rear deltoid isolation'),
('Upright Row', 'strength', ARRAY['Shoulders', 'Traps'], ARRAY['Barbell'], 'intermediate', 'Shoulder and trap exercise'),
('Shrugs', 'strength', ARRAY['Traps'], ARRAY['Dumbbells'], 'beginner', 'Trapezius isolation'),

-- LEG EXERCISES
('Barbell Squat', 'strength', ARRAY['Quads', 'Glutes'], ARRAY['Barbell', 'Rack'], 'intermediate', 'Primary lower body compound movement'),
('Front Squat', 'strength', ARRAY['Quads'], ARRAY['Barbell', 'Rack'], 'advanced', 'Quad-focused squat variation'),
('Romanian Deadlift', 'strength', ARRAY['Hamstrings', 'Glutes'], ARRAY['Barbell'], 'intermediate', 'Hamstring focused hip hinge'),
('Leg Press', 'strength', ARRAY['Quads', 'Glutes'], ARRAY['Leg Press Machine'], 'beginner', 'Machine-based leg exercise'),
('Hack Squat', 'strength', ARRAY['Quads'], ARRAY['Hack Squat Machine'], 'intermediate', 'Machine quad exercise'),
('Leg Curl', 'strength', ARRAY['Hamstrings'], ARRAY['Leg Curl Machine'], 'beginner', 'Hamstring isolation'),
('Leg Extension', 'strength', ARRAY['Quads'], ARRAY['Leg Extension Machine'], 'beginner', 'Quad isolation'),
('Walking Lunge', 'strength', ARRAY['Quads', 'Glutes'], ARRAY['Dumbbells'], 'beginner', 'Dynamic leg exercise'),
('Bulgarian Split Squat', 'strength', ARRAY['Quads', 'Glutes'], ARRAY['Dumbbells'], 'intermediate', 'Single leg squat variation'),
('Hip Thrust', 'strength', ARRAY['Glutes'], ARRAY['Barbell', 'Bench'], 'beginner', 'Glute-focused hip extension'),
('Calf Raise', 'strength', ARRAY['Calves'], ARRAY['Machine'], 'beginner', 'Calf isolation'),
('Seated Calf Raise', 'strength', ARRAY['Calves'], ARRAY['Machine'], 'beginner', 'Seated calf isolation'),

-- ARM EXERCISES - BICEPS
('Barbell Curl', 'strength', ARRAY['Biceps'], ARRAY['Barbell'], 'beginner', 'Primary bicep exercise'),
('Dumbbell Curl', 'strength', ARRAY['Biceps'], ARRAY['Dumbbells'], 'beginner', 'Basic bicep curl'),
('Hammer Curl', 'strength', ARRAY['Biceps', 'Forearms'], ARRAY['Dumbbells'], 'beginner', 'Neutral grip bicep exercise'),
('Preacher Curl', 'strength', ARRAY['Biceps'], ARRAY['Barbell', 'Bench'], 'intermediate', 'Supported bicep curl'),
('Cable Curl', 'strength', ARRAY['Biceps'], ARRAY['Cable Machine'], 'beginner', 'Cable bicep exercise'),
('Concentration Curl', 'strength', ARRAY['Biceps'], ARRAY['Dumbbells'], 'beginner', 'Isolated bicep curl'),

-- ARM EXERCISES - TRICEPS
('Tricep Pushdown', 'strength', ARRAY['Triceps'], ARRAY['Cable Machine'], 'beginner', 'Tricep isolation movement'),
('Overhead Tricep Extension', 'strength', ARRAY['Triceps'], ARRAY['Dumbbells'], 'beginner', 'Overhead tricep isolation'),
('Skull Crusher', 'strength', ARRAY['Triceps'], ARRAY['Barbell', 'Bench'], 'intermediate', 'Lying tricep extension'),
('Close Grip Bench Press', 'strength', ARRAY['Triceps', 'Chest'], ARRAY['Barbell', 'Bench'], 'intermediate', 'Compound tricep exercise'),
('Tricep Dip', 'strength', ARRAY['Triceps'], ARRAY['Dip Bar'], 'intermediate', 'Bodyweight tricep exercise'),
('Diamond Push-ups', 'strength', ARRAY['Triceps'], ARRAY[], 'beginner', 'Bodyweight tricep exercise'),

-- CORE EXERCISES
('Plank', 'strength', ARRAY['Core'], ARRAY[], 'beginner', 'Isometric core stability exercise'),
('Side Plank', 'strength', ARRAY['Core', 'Obliques'], ARRAY[], 'beginner', 'Lateral core stability'),
('Cable Crunch', 'strength', ARRAY['Abs'], ARRAY['Cable Machine'], 'beginner', 'Weighted abdominal exercise'),
('Hanging Leg Raise', 'strength', ARRAY['Abs'], ARRAY['Pull-up Bar'], 'intermediate', 'Advanced core exercise'),
('Ab Wheel Rollout', 'strength', ARRAY['Abs', 'Core'], ARRAY['Ab Wheel'], 'advanced', 'Dynamic core exercise'),
('Russian Twist', 'strength', ARRAY['Obliques'], ARRAY['Dumbbell'], 'beginner', 'Rotational core exercise'),
('Mountain Climbers', 'strength', ARRAY['Core'], ARRAY[], 'beginner', 'Dynamic core exercise'),

-- CARDIO EXERCISES
('Treadmill', 'cardio', ARRAY[], ARRAY['Treadmill'], 'beginner', 'Running or walking cardiovascular exercise'),
('Stationary Bike', 'cardio', ARRAY[], ARRAY['Bike'], 'beginner', 'Cycling cardiovascular exercise'),
('Rowing Machine', 'cardio', ARRAY[], ARRAY['Rowing Machine'], 'beginner', 'Full-body cardiovascular exercise'),
('Elliptical', 'cardio', ARRAY[], ARRAY['Elliptical'], 'beginner', 'Low-impact cardiovascular exercise'),
('Stairmaster', 'cardio', ARRAY[], ARRAY['Stairmaster'], 'intermediate', 'High-intensity stair climbing'),
('Jump Rope', 'cardio', ARRAY[], ARRAY['Jump Rope'], 'beginner', 'High-intensity cardio'),
('Battle Ropes', 'cardio', ARRAY[], ARRAY['Battle Ropes'], 'intermediate', 'High-intensity interval training'),
('Burpees', 'cardio', ARRAY[], ARRAY[], 'intermediate', 'Full-body cardio exercise')

ON CONFLICT (exercise_name) DO NOTHING;

