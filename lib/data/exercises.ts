export const EXERCISE_CATEGORIES = {
  PUSH: "Push",
  PULL: "Pull",
  LEGS: "Legs",
  CORE: "Core",
  CARDIO: "Cardio",
  SPORTS: "Sports",
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
  { id: "dumbbell-press", name: "Dumbbell Press", category: EXERCISE_CATEGORIES.PUSH },
  { id: "dips", name: "Dips", category: EXERCISE_CATEGORIES.PUSH },
  
  // Pull
  { id: "pull-up", name: "Pull Up", category: EXERCISE_CATEGORIES.PULL },
  { id: "lat-pulldown", name: "Lat Pulldown", category: EXERCISE_CATEGORIES.PULL },
  { id: "barbell-row", name: "Barbell Row", category: EXERCISE_CATEGORIES.PULL },
  { id: "face-pull", name: "Face Pull", category: EXERCISE_CATEGORIES.PULL },
  { id: "bicep-curl", name: "Dumbbell Bicep Curl", category: EXERCISE_CATEGORIES.PULL },
  { id: "cable-row", name: "Cable Row", category: EXERCISE_CATEGORIES.PULL },

  // Legs
  { id: "squat", name: "Barbell Squat", category: EXERCISE_CATEGORIES.LEGS },
  { id: "deadlift", name: "Deadlift", category: EXERCISE_CATEGORIES.LEGS },
  { id: "leg-press", name: "Leg Press", category: EXERCISE_CATEGORIES.LEGS },
  { id: "lunge", name: "Walking Lunge", category: EXERCISE_CATEGORIES.LEGS },
  { id: "calf-raise", name: "Calf Raise", category: EXERCISE_CATEGORIES.LEGS },
  { id: "leg-curl", name: "Leg Curl", category: EXERCISE_CATEGORIES.LEGS },
  { id: "leg-extension", name: "Leg Extension", category: EXERCISE_CATEGORIES.LEGS },

  // Core
  { id: "plank", name: "Plank", category: EXERCISE_CATEGORIES.CORE },
  { id: "crunch", name: "Crunch", category: EXERCISE_CATEGORIES.CORE },
  { id: "russian-twist", name: "Russian Twist", category: EXERCISE_CATEGORIES.CORE },
  { id: "hanging-leg-raise", name: "Hanging Leg Raise", category: EXERCISE_CATEGORIES.CORE },
  { id: "ab-wheel", name: "Ab Wheel Rollout", category: EXERCISE_CATEGORIES.CORE },

  // Cardio
  { id: "treadmill", name: "Treadmill Running", category: EXERCISE_CATEGORIES.CARDIO },
  { id: "cycling", name: "Cycling", category: EXERCISE_CATEGORIES.CARDIO },
  { id: "elliptical", name: "Elliptical", category: EXERCISE_CATEGORIES.CARDIO },
  { id: "rowing", name: "Rowing Machine", category: EXERCISE_CATEGORIES.CARDIO },
  { id: "stairmaster", name: "Stairmaster", category: EXERCISE_CATEGORIES.CARDIO },
  { id: "jump-rope", name: "Jump Rope", category: EXERCISE_CATEGORIES.CARDIO },
  { id: "hiit", name: "HIIT Workout", category: EXERCISE_CATEGORIES.CARDIO },
  { id: "pilates", name: "Pilates", category: EXERCISE_CATEGORIES.CARDIO },
  { id: "yoga", name: "Yoga", category: EXERCISE_CATEGORIES.CARDIO },
  { id: "swimming", name: "Swimming", category: EXERCISE_CATEGORIES.CARDIO },
  { id: "walking", name: "Walking", category: EXERCISE_CATEGORIES.CARDIO },

  // Sports
  { id: "basketball", name: "Basketball", category: EXERCISE_CATEGORIES.SPORTS },
  { id: "soccer", name: "Soccer", category: EXERCISE_CATEGORIES.SPORTS },
  { id: "tennis", name: "Tennis", category: EXERCISE_CATEGORIES.SPORTS },
  { id: "volleyball", name: "Volleyball", category: EXERCISE_CATEGORIES.SPORTS },
  { id: "baseball", name: "Baseball", category: EXERCISE_CATEGORIES.SPORTS },
  { id: "football", name: "Football", category: EXERCISE_CATEGORIES.SPORTS },
  { id: "hockey", name: "Hockey", category: EXERCISE_CATEGORIES.SPORTS },
  { id: "golf", name: "Golf", category: EXERCISE_CATEGORIES.SPORTS },
  { id: "badminton", name: "Badminton", category: EXERCISE_CATEGORIES.SPORTS },
  { id: "racquetball", name: "Racquetball", category: EXERCISE_CATEGORIES.SPORTS },
  { id: "squash", name: "Squash", category: EXERCISE_CATEGORIES.SPORTS },
  { id: "martial-arts", name: "Martial Arts", category: EXERCISE_CATEGORIES.SPORTS },
  { id: "boxing", name: "Boxing", category: EXERCISE_CATEGORIES.SPORTS },
  { id: "rock-climbing", name: "Rock Climbing", category: EXERCISE_CATEGORIES.SPORTS },
  { id: "pickleball", name: "Pickleball", category: EXERCISE_CATEGORIES.SPORTS },
]

