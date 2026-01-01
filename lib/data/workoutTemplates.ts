export interface WorkoutTemplate {
  id: string
  name: string
  description: string
  duration: string // "30 min", "45 min", etc.
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  category: 'Strength' | 'Cardio' | 'HIIT' | 'Full Body' | 'Upper Body' | 'Lower Body' | 'Core'
  exercises: {
    name: string
    sets: number
    reps?: number // for strength
    duration?: number // for cardio/timed exercises (in minutes)
  }[]
}

export const WORKOUT_TEMPLATES: WorkoutTemplate[] = [
  // BEGINNER WORKOUTS
  {
    id: 'beginner-full-body',
    name: 'Beginner Full Body',
    description: 'Perfect starter workout hitting all major muscle groups',
    duration: '30-40 min',
    difficulty: 'Beginner',
    category: 'Full Body',
    exercises: [
      { name: 'Barbell Squat', sets: 3, reps: 10 },
      { name: 'Barbell Bench Press', sets: 3, reps: 10 },
      { name: 'Lat Pulldown', sets: 3, reps: 10 },
      { name: 'Overhead Press', sets: 3, reps: 8 },
      { name: 'Plank', sets: 3, duration: 30 },
    ]
  },
  {
    id: 'beginner-cardio',
    name: 'Cardio Kickstart',
    description: 'Low-impact cardio to build endurance',
    duration: '20-30 min',
    difficulty: 'Beginner',
    category: 'Cardio',
    exercises: [
      { name: 'Walking', sets: 1, duration: 15 },
      { name: 'Elliptical', sets: 1, duration: 10 },
      { name: 'Cycling', sets: 1, duration: 5 },
    ]
  },

  // INTERMEDIATE WORKOUTS
  {
    id: 'push-day',
    name: 'Push Day Power',
    description: 'Chest, shoulders, and triceps focus',
    duration: '45-60 min',
    difficulty: 'Intermediate',
    category: 'Upper Body',
    exercises: [
      { name: 'Barbell Bench Press', sets: 4, reps: 8 },
      { name: 'Incline Bench Press', sets: 3, reps: 10 },
      { name: 'Overhead Press', sets: 4, reps: 8 },
      { name: 'Dumbbell Press', sets: 3, reps: 12 },
      { name: 'Tricep Pushdown', sets: 3, reps: 12 },
      { name: 'Dips', sets: 3, reps: 10 },
    ]
  },
  {
    id: 'pull-day',
    name: 'Pull Day Strength',
    description: 'Back and biceps builder',
    duration: '45-60 min',
    difficulty: 'Intermediate',
    category: 'Upper Body',
    exercises: [
      { name: 'Pull Up', sets: 4, reps: 8 },
      { name: 'Barbell Row', sets: 4, reps: 8 },
      { name: 'Lat Pulldown', sets: 3, reps: 10 },
      { name: 'Cable Row', sets: 3, reps: 12 },
      { name: 'Face Pull', sets: 3, reps: 15 },
      { name: 'Dumbbell Bicep Curl', sets: 3, reps: 12 },
    ]
  },
  {
    id: 'leg-day',
    name: 'Leg Day Crusher',
    description: 'Complete lower body workout',
    duration: '50-60 min',
    difficulty: 'Intermediate',
    category: 'Lower Body',
    exercises: [
      { name: 'Barbell Squat', sets: 4, reps: 8 },
      { name: 'Deadlift', sets: 4, reps: 6 },
      { name: 'Leg Press', sets: 3, reps: 12 },
      { name: 'Walking Lunge', sets: 3, reps: 10 },
      { name: 'Leg Curl', sets: 3, reps: 12 },
      { name: 'Calf Raise', sets: 4, reps: 15 },
    ]
  },
  {
    id: 'hiit-cardio',
    name: 'HIIT Blast',
    description: 'High intensity intervals to torch calories',
    duration: '20-25 min',
    difficulty: 'Intermediate',
    category: 'HIIT',
    exercises: [
      { name: 'HIIT Workout', sets: 1, duration: 20 },
      { name: 'Jump Rope', sets: 3, duration: 2 },
      { name: 'Cycling', sets: 1, duration: 5 },
    ]
  },

  // ADVANCED WORKOUTS
  {
    id: 'advanced-strength',
    name: 'Strength Elite',
    description: 'Heavy compound lifts for serious gains',
    duration: '60-75 min',
    difficulty: 'Advanced',
    category: 'Strength',
    exercises: [
      { name: 'Barbell Squat', sets: 5, reps: 5 },
      { name: 'Deadlift', sets: 5, reps: 5 },
      { name: 'Barbell Bench Press', sets: 5, reps: 5 },
      { name: 'Barbell Row', sets: 4, reps: 6 },
      { name: 'Overhead Press', sets: 4, reps: 6 },
    ]
  },
  {
    id: 'advanced-push-pull',
    name: 'Push/Pull Superset',
    description: 'Advanced upper body superset training',
    duration: '60-70 min',
    difficulty: 'Advanced',
    category: 'Upper Body',
    exercises: [
      { name: 'Barbell Bench Press', sets: 5, reps: 6 },
      { name: 'Pull Up', sets: 5, reps: 8 },
      { name: 'Incline Bench Press', sets: 4, reps: 8 },
      { name: 'Barbell Row', sets: 4, reps: 8 },
      { name: 'Dumbbell Press', sets: 3, reps: 10 },
      { name: 'Lat Pulldown', sets: 3, reps: 10 },
      { name: 'Tricep Pushdown', sets: 3, reps: 12 },
      { name: 'Dumbbell Bicep Curl', sets: 3, reps: 12 },
    ]
  },
  {
    id: 'core-blast',
    name: 'Core Destroyer',
    description: 'Comprehensive core and abs workout',
    duration: '25-30 min',
    difficulty: 'Intermediate',
    category: 'Core',
    exercises: [
      { name: 'Plank', sets: 4, duration: 60 },
      { name: 'Russian Twist', sets: 3, reps: 20 },
      { name: 'Hanging Leg Raise', sets: 3, reps: 12 },
      { name: 'Ab Wheel Rollout', sets: 3, reps: 10 },
      { name: 'Crunch', sets: 3, reps: 20 },
    ]
  },
  {
    id: 'athlete-cardio',
    name: 'Athlete Endurance',
    description: 'Multi-machine cardio for serious conditioning',
    duration: '40-50 min',
    difficulty: 'Advanced',
    category: 'Cardio',
    exercises: [
      { name: 'Treadmill Running', sets: 1, duration: 15 },
      { name: 'Rowing Machine', sets: 1, duration: 10 },
      { name: 'Cycling', sets: 1, duration: 10 },
      { name: 'Stairmaster', sets: 1, duration: 10 },
    ]
  },
  {
    id: 'quick-morning',
    name: 'Morning Express',
    description: 'Quick full body to start your day',
    duration: '15-20 min',
    difficulty: 'Beginner',
    category: 'Full Body',
    exercises: [
      { name: 'Push Up', sets: 3, reps: 15 },
      { name: 'Barbell Squat', sets: 3, reps: 15 },
      { name: 'Plank', sets: 3, duration: 45 },
      { name: 'Jump Rope', sets: 2, duration: 2 },
    ]
  },
]

// Helper to get templates by category
export const getTemplatesByCategory = (category: WorkoutTemplate['category']) => {
  return WORKOUT_TEMPLATES.filter(t => t.category === category)
}

// Helper to get templates by difficulty
export const getTemplatesByDifficulty = (difficulty: WorkoutTemplate['difficulty']) => {
  return WORKOUT_TEMPLATES.filter(t => t.difficulty === difficulty)
}

