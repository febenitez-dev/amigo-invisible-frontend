'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { X } from 'lucide-react'
import { Game } from '@/types/game'
import { Participant } from '@/types/participant'

interface GameFormProps {
  gameMode: 'classic' | 'birthday'
  participants: Participant[]
  onSubmit: (game: Omit<Game, 'id' | 'status' | 'createdAt'>) => void
  onCancel: () => void
}

export function GameForm({ gameMode, participants, onSubmit, onCancel }: GameFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    deliveryDate: '',
    participantIds: [] as string[]
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre de la partida es obligatorio'
    }

    if (gameMode === 'classic' && !formData.deliveryDate) {
      newErrors.deliveryDate = 'La fecha de entrega es obligatoria en modo clásico'
    }

    if (formData.participantIds.length < 3) {
      newErrors.participants = 'Se necesitan al menos 3 participantes'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit({
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        mode: gameMode,
        deliveryDate: formData.deliveryDate || undefined,
        participantIds: formData.participantIds
      })
    }
  }

  const handleParticipantToggle = (participantId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      participantIds: checked
        ? [...prev.participantIds, participantId]
        : prev.participantIds.filter(id => id !== participantId)
    }))
  }

  const handleSelectAll = () => {
    const allSelected = formData.participantIds.length === participants.length
    setFormData(prev => ({
      ...prev,
      participantIds: allSelected ? [] : participants.map(p => p.id)
    }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            Nueva Partida - {gameMode === 'classic' ? 'Modo Clásico' : 'Modo Cumpleaños'}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">Nombre de la partida *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ej: Amigo Invisible Navidad 2024"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Descripción (opcional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe los detalles de la partida..."
                rows={3}
              />
            </div>

            {gameMode === 'classic' && (
              <div>
                <Label htmlFor="deliveryDate">Fecha de entrega *</Label>
                <Input
                  id="deliveryDate"
                  type="date"
                  value={formData.deliveryDate}
                  onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                  className={errors.deliveryDate ? 'border-red-500' : ''}
                />
                {errors.deliveryDate && (
                  <p className="text-sm text-red-500 mt-1">{errors.deliveryDate}</p>
                )}
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-3">
                <Label>Participantes *</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                >
                  {formData.participantIds.length === participants.length ? 'Deseleccionar todos' : 'Seleccionar todos'}
                </Button>
              </div>
              
              <div className="space-y-3 max-h-48 overflow-y-auto border rounded-lg p-3">
                {participants.map((participant) => (
                  <div key={participant.id} className="flex items-center space-x-3">
                    <Checkbox
                      id={participant.id}
                      checked={formData.participantIds.includes(participant.id)}
                      onCheckedChange={(checked) => 
                        handleParticipantToggle(participant.id, checked as boolean)
                      }
                    />
                    <label
                      htmlFor={participant.id}
                      className="flex-1 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 dark:text-blue-400 text-sm font-semibold">
                            {participant.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{participant.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{participant.email}</p>
                        </div>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
              
              {errors.participants && (
                <p className="text-sm text-red-500 mt-1">{errors.participants}</p>
              )}
              
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                Seleccionados: {formData.participantIds.length} de {participants.length}
              </p>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
                Cancelar
              </Button>
              <Button type="submit" className="flex-1">
                Crear Partida
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
