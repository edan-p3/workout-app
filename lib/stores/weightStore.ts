import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type WeightEntry = {
  id: string
  weight: number
  date: string // ISO Date String
}

export type WeightState = {
  entries: WeightEntry[]
  addEntry: (weight: number, date: string) => void
  deleteEntry: (id: string) => void
  getLatestWeight: () => number | null
  getWeeklyAverage: () => number | null
}

export const useWeightStore = create<WeightState>()(
  persist(
    (set, get) => ({
      entries: [],
      addEntry: (weight, date) => set((state) => ({
        entries: [
            { id: crypto.randomUUID(), weight, date }, 
            ...state.entries
        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      })),
      deleteEntry: (id) => set((state) => ({
        entries: state.entries.filter(e => e.id !== id)
      })),
      getLatestWeight: () => {
          const { entries } = get()
          return entries.length > 0 ? entries[0].weight : null
      },
      getWeeklyAverage: () => {
          const { entries } = get()
          if (entries.length === 0) return null
          
          const now = new Date()
          const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          
          const recentEntries = entries.filter(e => new Date(e.date) >= oneWeekAgo)
          if (recentEntries.length === 0) return get().getLatestWeight() // Fallback to latest if no recent

          const sum = recentEntries.reduce((acc, e) => acc + e.weight, 0)
          return sum / recentEntries.length
      }
    }),
    {
      name: 'weight-storage',
    }
  )
)

