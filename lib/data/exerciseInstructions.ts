export interface ExerciseInstruction {
  name: string
  formCues: string[]
  videoUrl?: string
  tips?: string
}

export const EXERCISE_INSTRUCTIONS: Record<string, ExerciseInstruction> = {
  // PUSH EXERCISES
  "Barbell Bench Press": {
    name: "Barbell Bench Press",
    formCues: [
      "Lie flat on bench, feet firmly on ground",
      "Grip bar slightly wider than shoulder width",
      "Lower bar to mid-chest with control",
      "Press up explosively, keeping core tight",
      "Keep shoulder blades retracted throughout"
    ],
    tips: "Arch your lower back slightly and keep your butt on the bench",
  },
  "Push Up": {
    name: "Push Up",
    formCues: [
      "Start in plank position, hands shoulder-width",
      "Keep body in straight line from head to heels",
      "Lower chest to ground, elbows at 45 degrees",
      "Push back up to starting position",
      "Keep core engaged throughout"
    ],
    tips: "Don't let your hips sag or pike up"
  },
  "Overhead Press": {
    name: "Overhead Press",
    formCues: [
      "Stand with feet shoulder-width apart",
      "Start with bar at shoulder height",
      "Press bar straight overhead",
      "Lock out arms at top, slight head tilt",
      "Lower with control to shoulders"
    ],
    tips: "Engage your core and glutes to prevent lower back arching"
  },
  "Incline Bench Press": {
    name: "Incline Bench Press",
    formCues: [
      "Set bench to 30-45 degree angle",
      "Grip bar slightly wider than shoulders",
      "Lower to upper chest",
      "Press up and slightly back",
      "Maintain shoulder blade retraction"
    ],
    tips: "Focus on upper chest contraction at the top"
  },
  "Dumbbell Press": {
    name: "Dumbbell Press",
    formCues: [
      "Hold dumbbells at shoulder height",
      "Press up simultaneously",
      "Rotate palms forward at top",
      "Lower with control to shoulders",
      "Keep core stable"
    ],
    tips: "Allow natural arc of motion, don't force straight up"
  },

  // PULL EXERCISES
  "Pull Up": {
    name: "Pull Up",
    formCues: [
      "Hang from bar with overhand grip",
      "Pull shoulder blades down and back",
      "Drive elbows to sides to lift body",
      "Chin over bar at top",
      "Lower with control to full hang"
    ],
    tips: "Avoid swinging or kipping - strict form builds strength"
  },
  "Lat Pulldown": {
    name: "Lat Pulldown",
    formCues: [
      "Grip bar wider than shoulder width",
      "Lean back slightly from hips",
      "Pull bar to upper chest",
      "Squeeze shoulder blades together",
      "Control the return to start"
    ],
    tips: "Don't use momentum - feel the lats working"
  },
  "Barbell Row": {
    name: "Barbell Row",
    formCues: [
      "Hinge at hips, back at 45 degrees",
      "Grip bar shoulder-width, overhand",
      "Pull bar to lower chest/upper abs",
      "Keep elbows close to body",
      "Lower with control"
    ],
    tips: "Keep your core braced and back flat throughout"
  },
  "Cable Row": {
    name: "Cable Row",
    formCues: [
      "Sit with slight bend in knees",
      "Chest up, shoulders back",
      "Pull handle to lower chest",
      "Squeeze shoulder blades together",
      "Extend arms fully on return"
    ],
    tips: "Don't lean back excessively - movement comes from arms/back"
  },
  "Dumbbell Bicep Curl": {
    name: "Dumbbell Bicep Curl",
    formCues: [
      "Stand with dumbbells at sides",
      "Keep elbows pinned to sides",
      "Curl weights up, rotating palms",
      "Squeeze biceps at top",
      "Lower with control"
    ],
    tips: "Don't swing or use momentum - strict form for best results"
  },

  // LEG EXERCISES
  "Barbell Squat": {
    name: "Barbell Squat",
    formCues: [
      "Bar on upper traps, feet shoulder-width",
      "Push knees out, chest up",
      "Descend until thighs parallel or below",
      "Drive through heels to stand",
      "Keep core braced throughout"
    ],
    tips: "Don't let knees cave in - push them out during the entire movement"
  },
  "Deadlift": {
    name: "Deadlift",
    formCues: [
      "Feet hip-width, bar over mid-foot",
      "Grip bar outside legs, mixed or double overhand",
      "Chest up, back flat, shoulders over bar",
      "Drive through floor, extend hips",
      "Lock out at top, squeeze glutes"
    ],
    tips: "Keep the bar close to your body throughout the entire lift"
  },
  "Leg Press": {
    name: "Leg Press",
    formCues: [
      "Feet shoulder-width on platform",
      "Lower weight until knees at 90 degrees",
      "Push through heels to extend",
      "Don't lock knees at top",
      "Keep lower back pressed to pad"
    ],
    tips: "Don't let your lower back round at the bottom"
  },
  "Walking Lunge": {
    name: "Walking Lunge",
    formCues: [
      "Step forward into lunge position",
      "Back knee nearly touches ground",
      "Front knee tracks over toes",
      "Push through front heel to stand",
      "Alternate legs walking forward"
    ],
    tips: "Keep torso upright and core engaged"
  },
  "Leg Curl": {
    name: "Leg Curl",
    formCues: [
      "Lie face down, pad on lower calves",
      "Curl heels toward glutes",
      "Squeeze hamstrings at top",
      "Lower with control",
      "Keep hips on pad"
    ],
    tips: "Focus on hamstring contraction, not momentum"
  },

  // CORE EXERCISES
  "Plank": {
    name: "Plank",
    formCues: [
      "Forearms on ground, elbows under shoulders",
      "Body in straight line from head to heels",
      "Engage core, squeeze glutes",
      "Don't let hips sag or pike up",
      "Breathe normally, hold position"
    ],
    tips: "Focus on quality over duration - maintain perfect form"
  },
  "Russian Twist": {
    name: "Russian Twist",
    formCues: [
      "Sit with knees bent, feet off ground",
      "Lean back slightly, core engaged",
      "Rotate torso side to side",
      "Touch ground beside hips",
      "Keep chest up throughout"
    ],
    tips: "Move from the core, not just the arms"
  },
  "Crunch": {
    name: "Crunch",
    formCues: [
      "Lie on back, knees bent, feet flat",
      "Hands behind head lightly",
      "Curl shoulders up toward knees",
      "Squeeze abs at top",
      "Lower with control"
    ],
    tips: "Don't pull on your neck - let abs do the work"
  },

  // CARDIO EXERCISES
  "Treadmill Running": {
    name: "Treadmill Running",
    formCues: [
      "Start with warm-up walk",
      "Land mid-foot, not heel",
      "Keep torso upright, relaxed shoulders",
      "Arms swing naturally at sides",
      "Gradually increase speed/incline"
    ],
    tips: "Stay hydrated and listen to your body"
  },
  "Cycling": {
    name: "Cycling",
    formCues: [
      "Adjust seat so knee slightly bent at bottom",
      "Keep core engaged, shoulders relaxed",
      "Pedal in smooth circles",
      "Vary resistance for intervals",
      "Maintain steady breathing"
    ],
    tips: "Start easy and build intensity gradually"
  },
  "Elliptical": {
    name: "Elliptical",
    formCues: [
      "Stand tall, don't slouch",
      "Push and pull handles with arms",
      "Keep feet flat on pedals",
      "Engage core throughout",
      "Vary speed and resistance"
    ],
    tips: "Low impact makes it great for active recovery"
  },
  "Walking": {
    name: "Walking",
    formCues: [
      "Stand tall, shoulders back",
      "Swing arms naturally",
      "Land heel-first, roll to toes",
      "Maintain steady pace",
      "Engage core for posture"
    ],
    tips: "Perfect for beginners and recovery days"
  },
  "HIIT Workout": {
    name: "HIIT Workout",
    formCues: [
      "Warm up thoroughly first",
      "Alternate high and low intensity",
      "Push hard during work intervals",
      "Recover fully during rest",
      "Cool down afterwards"
    ],
    tips: "Quality over quantity - give max effort during work intervals"
  },
  "Jump Rope": {
    name: "Jump Rope",
    formCues: [
      "Jump on balls of feet",
      "Keep jumps small and controlled",
      "Elbows close to sides",
      "Rotate rope from wrists",
      "Land softly with knees slightly bent"
    ],
    tips: "Great cardio and coordination builder"
  }
}

// Helper function to get instructions for an exercise
export const getExerciseInstructions = (exerciseName: string): ExerciseInstruction | undefined => {
  return EXERCISE_INSTRUCTIONS[exerciseName]
}

