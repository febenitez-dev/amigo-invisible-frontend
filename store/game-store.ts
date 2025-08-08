'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface GameState {
  gameMode: 'classic' | 'birthday' | null
  setGameMode: (mode: 'classic' | 'birthday') => void
  reset: () => void
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      gameMode: null,
      setGameMode: (mode) => set({ gameMode: mode }),
      reset: () => set({ gameMode: null })
    }),
    {
      name: 'game-store'
    }
  )
)
