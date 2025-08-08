'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Play, Trash2, Calendar, Users, Gift } from 'lucide-react'
import { Game } from '@/types/game'

interface GameListProps {
  games: Game[]
  gameMode: 'classic' | 'birthday'
  onPlay: (gameId: string) => void
  onDelete: (gameId: string) => void
}

export function GameList({ games, gameMode, onPlay, onDelete }: GameListProps) {
  const getStatusBadge = (status: Game['status']) => {
    const variants = {
      pending: 'secondary',
      active: 'default',
      completed: 'outline'
    } as const

    const labels = {
      pending: 'Pendiente',
      active: 'Activa',
      completed: 'Completada'
    }

    return (
      <Badge variant={variants[status]}>
        {labels[status]}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="space-y-4">
      {games.map((game) => (
        <div
          key={game.id}
          className="flex items-center justify-between p-6 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-green-100 dark:from-red-900 dark:to-green-900 rounded-lg flex items-center justify-center">
                <Gift className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {game.name}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {game.participantIds.length} participantes
                  </div>
                  {game.deliveryDate && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(game.deliveryDate)}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <span className="text-xs">Creada:</span>
                    {formatDate(game.createdAt)}
                  </div>
                </div>
              </div>
            </div>
            {game.description && (
              <p className="text-sm text-gray-600 dark:text-gray-300 ml-15">
                {game.description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            {getStatusBadge(game.status)}
            <Button
              variant="default"
              size="sm"
              onClick={() => onPlay(game.id)}
              disabled={game.status === 'completed'}
            >
              <Play className="h-4 w-4 mr-2" />
              {game.status === 'pending' ? 'Iniciar' : 'Ver'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(game.id)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
