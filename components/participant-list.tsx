'use client'

import { Button } from '@/components/ui/button'
import { Edit, Trash2, Calendar, Mail } from 'lucide-react'
import { Participant } from '@/types/participant'

interface ParticipantListProps {
  participants: Participant[]
  gameMode: 'classic' | 'birthday'
  onEdit: (participant: Participant) => void
  onDelete: (id: string) => void
}

export function ParticipantList({ participants, gameMode, onEdit, onDelete }: ParticipantListProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'long' 
    })
  }

  return (
    <div className="space-y-4">
      {participants.map((participant) => (
        <div
          key={participant.id}
          className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400 font-semibold">
                  {participant.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {participant.name}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {participant.email}
                  </div>
                  {participant.birthDate && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(participant.birthDate)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {gameMode === 'birthday' && !participant.birthDate && (
              <span className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded">
                Fecha pendiente
              </span>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(participant)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(participant.id)}
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
