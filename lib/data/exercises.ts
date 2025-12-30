export const EXERCISE_CATEGORIES = {
  PUSH: "Push",
  PULL: "Pull",
  LEGS: "Legs",
  CORE: "Core",
  CARDIO: "Cardio",
  OTHER: "Other"
} as const

export type ExerciseCategory = typeof EXERCISE_CATEGORIES[keyof typeof EXERCISE_CATEGORIES]

export const EXERCISE_DATABASE = [
  // Push
  { id: "bench-press", name: "Barbell Bench Press", category: EXERCISE_CATEGORIES.PUSH },
  { id: "push-up", name: "Push Up", category: EXERCISE_CATEGORIES.PUSH },
  { id: "overhead-press", name: "Overhead Press", category: EXERCISE_CATEGORIES.PUSH },
  { id: "incline-bench", name: "Incline Bench Press", category: EXERCISE_CATEGORIES.PUSH },
  { id: "tricep-pushdown", name: "Tricep Pushdown", category: EXERCISE_CATEGORIES.PUSH },
  
  // Pull
  { id: "pull-up", name: "Pull Up", category: EXERCISE_CATEGORIES.PULL },
  { id: "lat-pulldown", name: "Lat Pulldown", category: EXERCISE_CATEGORIES.PULL },
  { id: "barbell-row", name: "Barbell Row", category: EXERCISE_CATEGORIES.PULL },
  { id: "face-pull", name: "Face Pull", category: EXERCISE_CATEGORIES.PULL },
  { id: "bicep-curl", name: "Dumbbell Bicep Curl", category: EXERCISE_CATEGORIES.PULL },

  // Legs
  { id: "squat", name: "Barbell Squat", category: EXERCISE_CATEGORIES.LEGS },
  { id: "deadlift", name: "Deadlift", category: EXERCISE_CATEGORIES.LEGS },
  { id: "leg-press", name: "Leg Press", category: EXERCISE_CATEGORIES.LEGS },
  { id: "lunge", name: "Walking Lunge", category: EXERCISE_CATEGORIES.LEGS },
  { id: "calf-raise", name: "Calf Raise", category: EXERCISE_CATEGORIES.LEGS },

  // Core
  { id: "plank", name: "Plank", category: EXERCISE_CATEGORIES.CORE },
  { id: "crunch", name: "Crunch", category: EXERCISE_CATEGORIES.CORE },
]

