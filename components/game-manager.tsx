'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Plus, Play, Users, Calendar, Gift } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useGameStore } from '@/store/game-store'
import { GameForm } from '@/components/game-form'
import { GameList } from '@/components/game-list'
import { useGames } from '@/hooks/use-games'
import { useParticipants } from '@/hooks/use-participants'
import { Game } from '@/types/game'

export function GameManager() {
  const router = useRouter()
  const { gameMode } = useGameStore()
  const { games, loading, createGame, deleteGame } = useGames()
  const { participants } = useParticipants()
  const [showForm, setShowForm] = useState(false)

  const handleCreateGame = async (gameData: Omit<Game, 'id' | 'status' | 'createdAt'>) => {
    await createGame(gameData)
    setShowForm(false)
  }

  const handleDeleteGame = async (id: string) => {
    await deleteGame(id)
  }

  const handlePlayGame = (gameId: string) => {
    router.push(`/games/${gameId}/play`)
  }

  if (!gameMode) {
    router.push('/')
    return null
  }

  if (participants.length < 3) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Participantes insuficientes</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Se necesitan al menos 3 participantes para crear una partida.
            </p>
            <Button onClick={() => router.push('/participants')}>
              Gestionar Participantes
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <Button variant="ghost" onClick={() => router.push('/participants')} className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Gestión de Partidas
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  Modo: {gameMode === 'classic' ? 'Amigo Invisible Clásico' : 'Modo Cumpleaños'}
                </p>
              </div>
            </div>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Partida
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Gift className="h-8 w-8 text-blue-600 mr-3" />
                  <div>
                    <p className="text-2xl font-bold">{games.length}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Total Partidas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Play className="h-8 w-8 text-green-600 mr-3" />
                  <div>
                    <p className="text-2xl font-bold">
                      {games.filter(g => g.status === 'active').length}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Activas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Calendar className="h-8 w-8 text-orange-600 mr-3" />
                  <div>
                    <p className="text-2xl font-bold">
                      {games.filter(g => g.status === 'pending').length}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Pendientes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-purple-600 mr-3" />
                  <div>
                    <p className="text-2xl font-bold">{participants.length}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Participantes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Games List */}
          <Card>
            <CardHeader>
              <CardTitle>Mis Partidas</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">Cargando partidas...</p>
                </div>
              ) : games.length === 0 ? (
                <div className="text-center py-8">
                  <Gift className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    No hay partidas creadas
                  </p>
                  <Button onClick={() => setShowForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Crear primera partida
                  </Button>
                </div>
              ) : (
                <GameList
                  games={games}
                  gameMode={gameMode}
                  onPlay={handlePlayGame}
                  onDelete={handleDeleteGame}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Game Form Modal */}
      {showForm && (
        <GameForm
          gameMode={gameMode}
          participants={participants}
          onSubmit={handleCreateGame}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  )
}
