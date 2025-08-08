'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Shuffle, Eye, Download, Mail, Gift, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Game, Assignment } from '@/types/game'
import { Participant } from '@/types/participant'
import { gameService } from '@/services/game-service'
import { participantService } from '@/services/participant-service'
import { AssignmentView } from '@/components/assignment-view'

interface GamePlayProps {
  gameId: string
}

export function GamePlay({ gameId }: GamePlayProps) {
  const router = useRouter()
  const [game, setGame] = useState<Game | null>(null)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)
  const [assigning, setAssigning] = useState(false)
  const [selectedParticipantId, setSelectedParticipantId] = useState('')
  const [showAssignment, setShowAssignment] = useState(false)
  const [currentAssignment, setCurrentAssignment] = useState<Assignment | null>(null)

  useEffect(() => {
    loadGameData()
  }, [gameId])

  const loadGameData = async () => {
    try {
      setLoading(true)
      const gameData = await gameService.getById(gameId)
      setGame(gameData)

      // Load participants
      const participantPromises = gameData.participantIds.map(id => 
        participantService.getById(id)
      )
      const participantsData = await Promise.all(participantPromises)
      setParticipants(participantsData)
    } catch (error) {
      console.error('Error loading game data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAssign = async () => {
    if (!game) return

    try {
      setAssigning(true)
      const assignmentData = await gameService.assign(gameId)
      setAssignments(assignmentData)
      
      // Update game status to active
      await gameService.update(gameId, { status: 'active' })
      setGame(prev => prev ? { ...prev, status: 'active' } : null)
    } catch (error) {
      console.error('Error creating assignments:', error)
    } finally {
      setAssigning(false)
    }
  }

  const handleViewAssignment = async () => {
    if (!selectedParticipantId) return

    try {
      const assignment = await gameService.getAssignment(gameId, selectedParticipantId)
      setCurrentAssignment(assignment)
      setShowAssignment(true)
    } catch (error) {
      console.error('Error loading assignment:', error)
    }
  }

  const handleExport = async () => {
    try {
      const blob = await gameService.exportResults(gameId)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = `amigo-invisible-${game?.name || 'partida'}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error exporting results:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Cargando partida...</p>
        </div>
      </div>
    )
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">Partida no encontrada</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              La partida que buscas no existe o ha sido eliminada.
            </p>
            <Button onClick={() => router.push('/games')}>
              Volver a Partidas
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-8">
            <Button variant="ghost" onClick={() => router.push('/games')} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {game.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                {game.mode === 'classic' ? 'Amigo Invisible Clásico' : 'Modo Cumpleaños'} • 
                Estado: {game.status === 'pending' ? 'Pendiente' : game.status === 'active' ? 'Activa' : 'Completada'}
              </p>
            </div>
          </div>

          {/* Game Info */}
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
                  <Gift className="h-8 w-8 text-green-600 mr-3" />
                  <div>
                    <p className="text-2xl font-bold">
                      {game.status === 'active' ? assignments.length : '0'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Asignaciones</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mr-3">
                    <span className="text-purple-600 dark:text-purple-400 font-bold">
                      {game.status === 'pending' ? '⏳' : game.status === 'active' ? '🎯' : '✅'}
                    </span>
                  </div>
                  <div>
                    <p className="text-lg font-bold">
                      {game.status === 'pending' ? 'Pendiente' : 
                       game.status === 'active' ? 'En curso' : 'Finalizada'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Estado</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Game Description */}
          {game.description && (
            <Card className="mb-8">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Descripción</h3>
                <p className="text-gray-600 dark:text-gray-300">{game.description}</p>
              </CardContent>
            </Card>
          )}

          {/* Participants List */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Participantes ({participants.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {participants.map((participant) => (
                  <div
                    key={participant.id}
                    className="flex items-center gap-3 p-3 border rounded-lg"
                  >
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 dark:text-blue-400 font-semibold">
                        {participant.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{participant.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                        {participant.email}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="space-y-6">
            {game.status === 'pending' && (
              <Card>
                <CardHeader>
                  <CardTitle>Realizar Sorteo</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Una vez que realices el sorteo, se asignarán los amigos invisibles y no podrás modificar la partida.
                  </p>
                  <Button 
                    onClick={handleAssign} 
                    disabled={assigning}
                    size="lg"
                    className="w-full md:w-auto"
                  >
                    <Shuffle className="h-4 w-4 mr-2" />
                    {assigning ? 'Realizando sorteo...' : 'Realizar Sorteo'}
                  </Button>
                </CardContent>
              </Card>
            )}

            {game.status === 'active' && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Ver Asignación Individual</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="participant-select">Selecciona un participante</Label>
                        <select
                          id="participant-select"
                          value={selectedParticipantId}
                          onChange={(e) => setSelectedParticipantId(e.target.value)}
                          className="w-full mt-1 p-2 border rounded-md bg-background"
                        >
                          <option value="">-- Selecciona un participante --</option>
                          {participants.map((participant) => (
                            <option key={participant.id} value={participant.id}>
                              {participant.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <Button 
                        onClick={handleViewAssignment}
                        disabled={!selectedParticipantId}
                        className="w-full md:w-auto"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Asignación
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Acciones del Organizador</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col md:flex-row gap-4">
                      <Button onClick={handleExport} variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Exportar Resultados
                      </Button>
                      <Button variant="outline">
                        <Mail className="h-4 w-4 mr-2" />
                        Enviar Notificaciones
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Assignment View Modal */}
      {showAssignment && currentAssignment && (
        <AssignmentView
          assignment={currentAssignment}
          gameMode={game.mode}
          onClose={() => {
            setShowAssignment(false)
            setCurrentAssignment(null)
          }}
        />
      )}
    </div>
  )
}
