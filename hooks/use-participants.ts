'use client'

import { useState, useEffect } from 'react'
import { Participant } from '@/types/participant'
import { participantService } from '@/services/participant-service'

export function useParticipants() {
  const [participants, setParticipants] = useState<Participant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchParticipants = async () => {
    try {
      setLoading(true)
      const data = await participantService.getAll()
      setParticipants(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar participantes')
    } finally {
      setLoading(false)
    }
  }

  const addParticipant = async (participantData: Omit<Participant, 'id'>) => {
    try {
      const newParticipant = await participantService.create(participantData)
      setParticipants(prev => [...prev, newParticipant])
      return newParticipant
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al agregar participante')
      throw err
    }
  }

  const updateParticipant = async (id: string, participantData: Omit<Participant, 'id'>) => {
    try {
      const updatedParticipant = await participantService.update(id, participantData)
      setParticipants(prev => 
        prev.map(p => p.id === id ? updatedParticipant : p)
      )
      return updatedParticipant
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar participante')
      throw err
    }
  }

  const deleteParticipant = async (id: string) => {
    try {
      await participantService.delete(id)
      setParticipants(prev => prev.filter(p => p.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar participante')
      throw err
    }
  }

  useEffect(() => {
    fetchParticipants()
  }, [])

  return {
    participants,
    loading,
    error,
    addParticipant,
    updateParticipant,
    deleteParticipant,
    refetch: fetchParticipants
  }
}
