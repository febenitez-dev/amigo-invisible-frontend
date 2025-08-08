'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { X } from 'lucide-react'
import { Participant } from '@/types/participant'

interface ParticipantFormProps {
  participant?: Participant | null
  gameMode: 'classic' | 'birthday'
  onSubmit: (participant: Omit<Participant, 'id'>) => void
  onCancel: () => void
}

export function ParticipantForm({ participant, gameMode, onSubmit, onCancel }: ParticipantFormProps) {
  const [formData, setFormData] = useState({
    name: participant?.name || '',
    email: participant?.email || '',
    birthDate: participant?.birthDate || ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El email no es válido'
    }

    if (gameMode === 'birthday' && !formData.birthDate) {
      newErrors.birthDate = 'La fecha de cumpleaños es obligatoria en modo cumpleaños'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit({
        name: formData.name.trim(),
        email: formData.email.trim(),
        birthDate: formData.birthDate || undefined
      })
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            {participant ? 'Editar Participante' : 'Nuevo Participante'}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nombre *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nombre completo"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="correo@ejemplo.com"
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <Label htmlFor="birthDate">
                Fecha de Cumpleaños {gameMode === 'birthday' ? '*' : '(opcional)'}
              </Label>
              <Input
                id="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                className={errors.birthDate ? 'border-red-500' : ''}
              />
              {errors.birthDate && (
                <p className="text-sm text-red-500 mt-1">{errors.birthDate}</p>
              )}
              {gameMode === 'birthday' && (
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  Requerido para el modo cumpleaños
                </p>
              )}
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
                Cancelar
              </Button>
              <Button type="submit" className="flex-1">
                {participant ? 'Actualizar' : 'Agregar'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
