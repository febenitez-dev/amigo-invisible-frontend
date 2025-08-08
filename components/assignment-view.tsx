'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X, Gift, User } from 'lucide-react'
import { Assignment } from '@/types/game'

interface AssignmentViewProps {
  assignment: Assignment
  gameMode: 'classic' | 'birthday'
  onClose: () => void
}

export function AssignmentView({ assignment, gameMode, onClose }: AssignmentViewProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-red-600" />
            Tu Amigo Invisible
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-green-100 dark:from-red-900 dark:to-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-10 w-10 text-gray-600 dark:text-gray-300" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {assignment.receiverName}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {gameMode === 'classic' 
                ? 'Esta persona será tu amigo invisible. ¡Prepara un regalo especial!'
                : 'Esta persona organizará tu regalo de cumpleaños. ¡Mantén el secreto!'
              }
            </p>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>¡Importante!</strong> Esta información es privada. No la compartas con otros participantes para mantener la sorpresa.
            </p>
          </div>

          <Button onClick={onClose} className="w-full">
            Entendido
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
