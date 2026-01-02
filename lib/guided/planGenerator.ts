import type {
  GuidedPlanInput,
  GuidedPlan,
  WorkoutDay,
  FitnessGoal,
  ExperienceLevel,
  TrainingFrequency
} from "@/types/guided-plan"

// Exercise database with equipment requirements and constraints
const exerciseLibrary = {
  // Upper Body - Push
  push: [
    { name: "Barbell Bench Press", equipment: ["barbells"], avoid: ["shoulder_issues"], sets: 4, reps: "8-10" },
    { name: "Dumbbell Press", equipment: ["dumbbells"], avoid: ["shoulder_issues"], sets: 4, reps: "10-12" },
    { name: "Push-ups", equipment: ["bodyweight"], avoid: [], sets: 3, reps: "12-15" },
    { name: "Overhead Press", equipment: ["barbells", "dumbbells"], avoid: ["shoulder_issues"], sets: 3, reps: "8-10" },
    { name: "Dumbbell Flyes", equipment: ["dumbbells"], avoid: ["shoulder_issues"], sets: 3, reps: "12-15" },
    { name: "Tricep Dips", equipment: ["bodyweight"], avoid: ["shoulder_issues"], sets: 3, reps: "10-12" },
  ],
  
  // Upper Body - Pull
  pull: [
    { name: "Pull-ups", equipment: ["bodyweight"], avoid: ["shoulder_issues"], sets: 4, reps: "6-10" },
    { name: "Barbell Rows", equipment: ["barbells"], avoid: ["back_issues"], sets: 4, reps: "8-10" },
    { name: "Dumbbell Rows", equipment: ["dumbbells"], avoid: ["back_issues"], sets: 4, reps: "10-12" },
    { name: "Lat Pulldown", equipment: ["machines"], avoid: [], sets: 3, reps: "10-12" },
    { name: "Face Pulls", equipment: ["bands", "machines"], avoid: [], sets: 3, reps: "15-20" },
    { name: "Bicep Curls", equipment: ["dumbbells", "barbells", "bands"], avoid: [], sets: 3, reps: "12-15" },
  ],
  
  // Lower Body
  legs: [
    { name: "Barbell Squats", equipment: ["barbells"], avoid: ["knee_issues"], sets: 4, reps: "8-10" },
    { name: "Goblet Squats", equipment: ["dumbbells"], avoid: ["knee_issues"], sets: 3, reps: "12-15" },
    { name: "Romanian Deadlift", equipment: ["barbells", "dumbbells"], avoid: ["back_issues"], sets: 4, reps: "10-12" },
    { name: "Leg Press", equipment: ["machines"], avoid: [], sets: 4, reps: "10-12" },
    { name: "Lunges", equipment: ["dumbbells", "bodyweight"], avoid: ["knee_issues"], sets: 3, reps: "12 each" },
    { name: "Leg Curl", equipment: ["machines", "bands"], avoid: [], sets: 3, reps: "12-15" },
    { name: "Calf Raises", equipment: ["dumbbells", "bodyweight", "machines"], avoid: [], sets: 3, reps: "15-20" },
  ],
  
  // Core
  core: [
    { name: "Plank", equipment: ["bodyweight"], avoid: [], sets: 3, reps: "30-60s" },
    { name: "Dead Bug", equipment: ["bodyweight"], avoid: [], sets: 3, reps: "12 each" },
    { name: "Russian Twists", equipment: ["dumbbells", "bodyweight"], avoid: ["back_issues"], sets: 3, reps: "20 total" },
    { name: "Hanging Leg Raise", equipment: ["bodyweight"], avoid: [], sets: 3, reps: "10-15" },
    { name: "Cable Crunches", equipment: ["machines"], avoid: ["back_issues"], sets: 3, reps: "15-20" },
  ],
  
  // Cardio
  cardio: [
    { name: "Treadmill Run", equipment: ["cardio_machines"], avoid: ["knee_issues"], sets: 1, duration: 20 },
    { name: "Cycling", equipment: ["cardio_machines"], avoid: [], sets: 1, duration: 25 },
    { name: "Rowing", equipment: ["cardio_machines"], avoid: ["back_issues"], sets: 1, duration: 15 },
    { name: "Jump Rope", equipment: ["bodyweight"], avoid: ["knee_issues"], sets: 3, duration: 3 },
  ]
}

function getRestTime(goal: FitnessGoal, level: ExperienceLevel): number {
  if (goal === 'get_stronger') return level === 'advanced' ? 180 : 120
  if (goal === 'build_muscle') return 90
  if (goal === 'lose_fat') return 60
  return 75
}

function getSetsAndReps(goal: FitnessGoal, level: ExperienceLevel): { sets: number, reps: string } {
  if (goal === 'get_stronger') {
    return level === 'advanced' ? { sets: 5, reps: "3-5" } : { sets: 4, reps: "5-8" }
  }
  if (goal === 'build_muscle') {
    return level === 'beginner' ? { sets: 3, reps: "10-12" } : { sets: 4, reps: "8-12" }
  }
  if (goal === 'lose_fat' || goal === 'recomp') {
    return { sets: 3, reps: "12-15" }
  }
  return { sets: 3, reps: "10-12" }
}

function selectExercises(
  category: keyof typeof exerciseLibrary,
  count: number,
  equipment: string[],
  constraints: string[]
): any[] {
  const available = exerciseLibrary[category].filter(ex => {
    // Check if user has required equipment
    const hasEquipment = ex.equipment.some(eq => equipment.includes(eq))
    // Check if exercise should be avoided due to constraints
    const shouldAvoid = ex.avoid.some(constraint => constraints.includes(constraint))
    return hasEquipment && !shouldAvoid
  })
  
  // Randomly select from available
  const shuffled = available.sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

function generateWeeklySplit(input: GuidedPlanInput): WorkoutDay[] {
  const { fitnessGoal, experienceLevel, trainingFrequency, sessionLength, equipment, constraints } = input
  const schedule: WorkoutDay[] = []
  
  const restTime = getRestTime(fitnessGoal, experienceLevel)
  const { sets, reps } = getSetsAndReps(fitnessGoal, experienceLevel)
  
  // Determine split based on frequency
  if (trainingFrequency === '2-3') {
    // Full Body 2-3x/week
    const day1: WorkoutDay = {
      dayName: "Day 1: Full Body A",
      focus: "Compound Movements",
      duration: sessionLength,
      exercises: [
        ...selectExercises('push', 2, equipment, constraints).map(ex => ({
          name: ex.name,
          sets: ex.sets || sets,
          reps: ex.reps || reps,
          rest: restTime
        })),
        ...selectExercises('pull', 2, equipment, constraints).map(ex => ({
          name: ex.name,
          sets: ex.sets || sets,
          reps: ex.reps || reps,
          rest: restTime
        })),
        ...selectExercises('legs', 1, equipment, constraints).map(ex => ({
          name: ex.name,
          sets: ex.sets || sets,
          reps: ex.reps || reps,
          rest: restTime
        })),
        ...selectExercises('core', 1, equipment, constraints).map(ex => ({
          name: ex.name,
          sets: ex.sets || sets,
          reps: ex.reps || reps,
          rest: 60
        })),
      ]
    }
    
    const day2: WorkoutDay = {
      dayName: "Day 2: Full Body B",
      focus: "Accessory Work",
      duration: sessionLength,
      exercises: [
        ...selectExercises('legs', 2, equipment, constraints).map(ex => ({
          name: ex.name,
          sets: ex.sets || sets,
          reps: ex.reps || reps,
          rest: restTime
        })),
        ...selectExercises('push', 1, equipment, constraints).map(ex => ({
          name: ex.name,
          sets: ex.sets || sets,
          reps: ex.reps || reps,
          rest: restTime
        })),
        ...selectExercises('pull', 1, equipment, constraints).map(ex => ({
          name: ex.name,
          sets: ex.sets || sets,
          reps: ex.reps || reps,
          rest: restTime
        })),
        ...selectExercises('core', 1, equipment, constraints).map(ex => ({
          name: ex.name,
          sets: ex.sets || sets,
          reps: ex.reps || reps,
          rest: 60
        })),
      ]
    }
    
    schedule.push(day1, day2)
    
  } else if (trainingFrequency === '3-4') {
    // Upper/Lower Split
    const upperA: WorkoutDay = {
      dayName: "Day 1: Upper Body A",
      focus: "Push Emphasis",
      duration: sessionLength,
      exercises: [
        ...selectExercises('push', 3, equipment, constraints).map(ex => ({
          name: ex.name,
          sets: ex.sets || sets,
          reps: ex.reps || reps,
          rest: restTime
        })),
        ...selectExercises('pull', 2, equipment, constraints).map(ex => ({
          name: ex.name,
          sets: ex.sets || sets,
          reps: ex.reps || reps,
          rest: restTime
        })),
      ]
    }
    
    const lowerA: WorkoutDay = {
      dayName: "Day 2: Lower Body A",
      focus: "Squat Emphasis",
      duration: sessionLength,
      exercises: [
        ...selectExercises('legs', 4, equipment, constraints).map(ex => ({
          name: ex.name,
          sets: ex.sets || sets,
          reps: ex.reps || reps,
          rest: restTime
        })),
        ...selectExercises('core', 2, equipment, constraints).map(ex => ({
          name: ex.name,
          sets: ex.sets || sets,
          reps: ex.reps || reps,
          rest: 60
        })),
      ]
    }
    
    const upperB: WorkoutDay = {
      dayName: "Day 3: Upper Body B",
      focus: "Pull Emphasis",
      duration: sessionLength,
      exercises: [
        ...selectExercises('pull', 3, equipment, constraints).map(ex => ({
          name: ex.name,
          sets: ex.sets || sets,
          reps: ex.reps || reps,
          rest: restTime
        })),
        ...selectExercises('push', 2, equipment, constraints).map(ex => ({
          name: ex.name,
          sets: ex.sets || sets,
          reps: ex.reps || reps,
          rest: restTime
        })),
      ]
    }
    
    const lowerB: WorkoutDay = {
      dayName: "Day 4: Lower Body B",
      focus: "Deadlift Emphasis",
      duration: sessionLength,
      exercises: [
        ...selectExercises('legs', 4, equipment, constraints).map(ex => ({
          name: ex.name,
          sets: ex.sets || sets,
          reps: ex.reps || reps,
          rest: restTime
        })),
        ...selectExercises('core', 2, equipment, constraints).map(ex => ({
          name: ex.name,
          sets: ex.sets || sets,
          reps: ex.reps || reps,
          rest: 60
        })),
      ]
    }
    
    schedule.push(upperA, lowerA, upperB, lowerB)
    
  } else {
    // Push/Pull/Legs Split (5+ days)
    const pushDay: WorkoutDay = {
      dayName: "Day 1: Push",
      focus: "Chest, Shoulders, Triceps",
      duration: sessionLength,
      exercises: selectExercises('push', 6, equipment, constraints).map(ex => ({
        name: ex.name,
        sets: ex.sets || sets,
        reps: ex.reps || reps,
        rest: restTime
      }))
    }
    
    const pullDay: WorkoutDay = {
      dayName: "Day 2: Pull",
      focus: "Back, Biceps",
      duration: sessionLength,
      exercises: selectExercises('pull', 6, equipment, constraints).map(ex => ({
        name: ex.name,
        sets: ex.sets || sets,
        reps: ex.reps || reps,
        rest: restTime
      }))
    }
    
    const legsDay: WorkoutDay = {
      dayName: "Day 3: Legs",
      focus: "Quads, Hamstrings, Glutes",
      duration: sessionLength,
      exercises: [
        ...selectExercises('legs', 5, equipment, constraints).map(ex => ({
          name: ex.name,
          sets: ex.sets || sets,
          reps: ex.reps || reps,
          rest: restTime
        })),
        ...selectExercises('core', 2, equipment, constraints).map(ex => ({
          name: ex.name,
          sets: ex.sets || sets,
          reps: ex.reps || reps,
          rest: 60
        })),
      ]
    }
    
    schedule.push(pushDay, pullDay, legsDay, pushDay, pullDay)
  }
  
  return schedule
}

export function generateGuidedPlan(userId: string, input: GuidedPlanInput): GuidedPlan {
  const weeklySchedule = generateWeeklySplit(input)
  
  // Determine progression rules based on experience and goal
  const progressionRules = {
    strengthIncrease: input.experienceLevel === 'beginner' ? 2.5 : 5,
    repIncrease: 1,
    whenToProgress: "When you complete all sets with good form for 2 consecutive workouts"
  }
  
  return {
    id: crypto.randomUUID(),
    userId,
    name: `${input.fitnessGoal.replace('_', ' ').toUpperCase()} Plan`,
    description: `Personalized ${input.trainingFrequency} day/week ${input.experienceLevel} program`,
    weeklySchedule,
    currentWeek: 1,
    startedAt: new Date(),
    input,
    progressionRules
  }
}

