import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type TimerStatus = 'not_started' | 'running' | 'paused'

interface TimerState {
  timerStatus: TimerStatus
  timerStartTime: number | null
  pausedDuration: number
  elapsedTime: number
  
  startTimer: () => void
  pauseTimer: () => void
  resumeTimer: () => void
  resetTimer: () => void
  updateElapsedTime: () => number
}

export const useTimerStore = create<TimerState>()(
  persist(
    (set, get) => ({
      timerStatus: 'not_started',
      timerStartTime: null,
      pausedDuration: 0,
      elapsedTime: 0,
      
      startTimer: () => {
        set({
          timerStartTime: Date.now(),
          timerStatus: 'running',
          pausedDuration: 0,
          elapsedTime: 0
        })
      },
      
      pauseTimer: () => {
        set({ timerStatus: 'paused' })
      },
      
      resumeTimer: () => {
        const state = get()
        if (state.timerStartTime) {
          // Calculate how long we've been paused and add to total paused duration
          const pausedTime = Math.floor((Date.now() - state.timerStartTime) / 1000) - state.elapsedTime
          set({
            pausedDuration: state.pausedDuration + pausedTime,
            timerStatus: 'running'
          })
        }
      },
      
      resetTimer: () => {
        set({
          timerStatus: 'not_started',
          timerStartTime: null,
          elapsedTime: 0,
          pausedDuration: 0
        })
      },
      
      updateElapsedTime: () => {
        const state = get()
        if (state.timerStatus === 'running' && state.timerStartTime) {
          const now = Date.now()
          const elapsed = Math.floor((now - state.timerStartTime) / 1000) - state.pausedDuration
          set({ elapsedTime: elapsed })
          return elapsed
        }
        return state.elapsedTime
      }
    }),
    {
      name: 'timer-storage'
    }
  )
)

