'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Plus, Edit, Trash2, Users, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useGameStore } from '@/store/game-store'
import { ParticipantForm } from '@/components/participant-form'
import { ParticipantList } from '@/components/participant-list'
import { useParticipants } from '@/hooks/use-participants'
import { Participant } from '@/types/participant'

export function ParticipantManager() {
  const router = useRouter()
  const { gameMode } = useGameStore()
  const { participants, loading, addParticipant, updateParticipant, deleteParticipant } = useParticipants()
  const [showForm, setShowForm] = useState(false)
  const [editingParticipant, setEditingParticipant] = useState<Participant | null>(null)

  const handleAddParticipant = async (participantData: Omit<Participant, 'id'>) => {
    await addParticipant(participantData)
    setShowForm(false)
  }

  const handleEditParticipant = async (participantData: Omit<Participant, 'id'>) => {
    if (editingParticipant) {
      await updateParticipant(editingParticipant.id, participantData)
      setEditingParticipant(null)
    }
  }

  const handleDeleteParticipant = async (id: string) => {
    await deleteParticipant(id)
  }

  const handleContinue = () => {
    router.push('/games')
  }

  if (!gameMode) {
    router.push('/')
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <Button variant="ghost" onClick={() => router.push('/')} className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Gestión de Participantes
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  Modo: {gameMode === 'classic' ? 'Amigo Invisible Clásico' : 'Modo Cumpleaños'}
                </p>
              </div>
            </div>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Agregar Participante
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-blue-600 mr-3" />
                  <div>
                    <p className="text-2xl font-bold">{participants.length}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Participantes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mr-3">
                    <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {participants.filter(p => gameMode === 'classic' || p.birthDate).length}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Completos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mr-3">
                    <span className="text-yellow-600 dark:text-yellow-400 font-bold">!</span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {gameMode === 'birthday' ? participants.filter(p => !p.birthDate).length : 0}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Pendientes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Participant List */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Lista de Participantes</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">Cargando participantes...</p>
                </div>
              ) : participants.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    No hay participantes registrados
                  </p>
                  <Button onClick={() => setShowForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar primer participante
                  </Button>
                </div>
              ) : (
                <ParticipantList
                  participants={participants}
                  gameMode={gameMode}
                  onEdit={setEditingParticipant}
                  onDelete={handleDeleteParticipant}
                />
              )}
            </CardContent>
          </Card>

          {/* Continue Button */}
          {participants.length >= 3 && (
            <div className="text-center">
              <Button size="lg" onClick={handleContinue}>
                Continuar a Partidas
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          )}

          {participants.length > 0 && participants.length < 3 && (
            <div className="text-center">
              <p className="text-amber-600 dark:text-amber-400 mb-4">
                Se necesitan al menos 3 participantes para crear una partida
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Participant Form Modal */}
      {(showForm || editingParticipant) && (
        <ParticipantForm
          participant={editingParticipant}
          gameMode={gameMode}
          onSubmit={editingParticipant ? handleEditParticipant : handleAddParticipant}
          onCancel={() => {
            setShowForm(false)
            setEditingParticipant(null)
          }}
        />
      )}
    </div>
  )
}
