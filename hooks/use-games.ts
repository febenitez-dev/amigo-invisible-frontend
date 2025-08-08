'use client'

import { useState, useEffect } from 'react'
import { Game } from '@/types/game'
import { gameService } from '@/services/game-service'

export function useGames() {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchGames = async () => {
    try {
      setLoading(true)
      const data = await gameService.getAll()
      setGames(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar partidas')
    } finally {
      setLoading(false)
    }
  }

  const createGame = async (gameData: Omit<Game, 'id' | 'status' | 'createdAt'>) => {
    try {
      const newGame = await gameService.create(gameData)
      setGames(prev => [...prev, newGame])
      return newGame
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear partida')
      throw err
    }
  }

  const updateGame = async (id: string, gameData: Partial<Game>) => {
    try {
      const updatedGame = await gameService.update(id, gameData)
      setGames(prev => 
        prev.map(g => g.id === id ? updatedGame : g)
      )
      return updatedGame
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar partida')
      throw err
    }
  }

  const deleteGame = async (id: string) => {
    try {
      await gameService.delete(id)
      setGames(prev => prev.filter(g => g.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar partida')
      throw err
    }
  }

  useEffect(() => {
    fetchGames()
  }, [])

  return {
    games,
    loading,
    error,
    createGame,
    updateGame,
    deleteGame,
    refetch: fetchGames
  }
}
