// Types for the Guided Workout Experience

export type FitnessGoal = 
  | 'build_muscle' 
  | 'lose_fat' 
  | 'recomp' 
  | 'get_stronger' 
  | 'rehab' 
  | 'maintain'

export type PrimaryGoal = 
  | 'increase_strength'
  | 'improve_endurance'
  | 'improve_mobility'
  | 'look_leaner'
  | 'athletic_performance'
  | 'improve_consistency'

export type ExperienceLevel = 
  | 'beginner'    // 0-6 months
  | 'intermediate' // 6-24 months
  | 'advanced'     // 2+ years

export type TrainingFrequency = '2-3' | '3-4' | '5+'

export type SessionLength = 30 | 45 | 60

export type Equipment = 
  | 'dumbbells'
  | 'barbells'
  | 'machines'
  | 'bands'
  | 'bodyweight'
  | 'cardio_machines'

export type Constraint = 
  | 'knee_issues'
  | 'back_issues'
  | 'shoulder_issues'
  | 'cardio_first'
  | 'home_workouts'

export interface GuidedPlanInput {
  fitnessGoal: FitnessGoal
  primaryGoals: PrimaryGoal[] // Max 2
  experienceLevel: ExperienceLevel
  trainingFrequency: TrainingFrequency
  sessionLength: SessionLength
  equipment: Equipment[]
  constraints: Constraint[]
}

export interface WorkoutDay {
  dayName: string
  focus: string
  duration: number
  exercises: {
    name: string
    sets: number
    reps?: string
    duration?: number
    rest: number // seconds
    notes?: string
  }[]
}

export interface GuidedPlan {
  id: string
  userId: string
  name: string
  description: string
  weeklySchedule: WorkoutDay[]
  currentWeek: number
  startedAt: Date
  input: GuidedPlanInput
  progressionRules: {
    strengthIncrease: number // lbs to add
    repIncrease: number
    whenToProgress: string
  }
}

export interface ProgressionSuggestion {
  exerciseName: string
  currentWeight?: number
  currentReps?: number
  suggestion: string
  reason: string
}

