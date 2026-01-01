import { Set } from "@/lib/stores/workoutStore";

export function calculateVolume(sets: Set[]): number {
  return sets
    .filter((set) => set.completed)
    .reduce((total, set) => total + set.weight * set.reps, 0);
}

export function calculateTotalDuration(sets: Set[]): number {
  return sets
    .filter((set) => set.completed)
    .reduce((total, set) => total + (set.duration || 0), 0);
}

export function calculateTotalDistance(sets: Set[]): number {
  return sets
    .filter((set) => set.completed)
    .reduce((total, set) => total + (set.distance || 0), 0);
}

export function calculateTotalCalories(sets: Set[]): number {
  return sets
    .filter((set) => set.completed)
    .reduce((total, set) => total + (set.calories || 0), 0);
}

