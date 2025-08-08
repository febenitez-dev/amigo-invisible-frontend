'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Gift, Calendar, ArrowLeft, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useGameStore } from '@/store/game-store'

interface GameModeSelectorProps {
  onBack: () => void
}

export function GameModeSelector({ onBack }: GameModeSelectorProps) {
  const [selectedMode, setSelectedMode] = useState<'classic' | 'birthday' | null>(null)
  const router = useRouter()
  const { setGameMode } = useGameStore()

  const handleContinue = () => {
    if (selectedMode) {
      setGameMode(selectedMode)
      router.push('/participants')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-green-50 dark:from-red-950 dark:to-green-950">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-8">
            <Button variant="ghost" onClick={onBack} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Selecciona el modo de juego
            </h1>
          </div>

          {/* Mode Selection */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <Card 
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedMode === 'classic' 
                  ? 'ring-2 ring-red-500 bg-red-50 dark:bg-red-950' 
                  : ''
              }`}
              onClick={() => setSelectedMode('classic')}
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Gift className={`h-8 w-8 ${selectedMode === 'classic' ? 'text-red-600' : 'text-gray-600'}`} />
                  <CardTitle className="text-2xl">Amigo Invisible Clásico</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base mb-4">
                  Perfecto para eventos únicos como Navidad, fiestas de empresa o celebraciones especiales.
                </CardDescription>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2" />
                    <div>
                      <p className="font-medium">Sorteo único</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Se realiza una sola asignación para toda la partida
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2" />
                    <div>
                      <p className="font-medium">Fecha personalizable</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Elige cuándo será el intercambio de regalos
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2" />
                    <div>
                      <p className="font-medium">Evento único</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Ideal para ocasiones especiales
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card 
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedMode === 'birthday' 
                  ? 'ring-2 ring-green-500 bg-green-50 dark:bg-green-950' 
                  : ''
              }`}
              onClick={() => setSelectedMode('birthday')}
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Calendar className={`h-8 w-8 ${selectedMode === 'birthday' ? 'text-green-600' : 'text-gray-600'}`} />
                  <CardTitle className="text-2xl">Modo Cumpleaños</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base mb-4">
                  Ideal para grupos estables que quieren celebrar durante todo el año.
                </CardDescription>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                    <div>
                      <p className="font-medium">Sorteo automático</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Asignaciones basadas en fechas de cumpleaños
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                    <div>
                      <p className="font-medium">Todo el año</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Celebraciones distribuidas durante 12 meses
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                    <div>
                      <p className="font-medium">Grupos estables</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Perfecto para familias o equipos de trabajo
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Continue Button */}
          <div className="text-center">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6"
              disabled={!selectedMode}
              onClick={handleContinue}
            >
              Continuar
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
