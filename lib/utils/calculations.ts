import { Set } from "@/lib/stores/workoutStore";

export function calculateVolume(sets: Set[]): number {
  return sets
    .filter((set) => set.completed)
    .reduce((total, set) => total + set.weight * set.reps, 0);
}

