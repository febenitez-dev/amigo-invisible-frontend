'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Gift, Calendar, Users, ArrowRight } from 'lucide-react'
import { GameModeSelector } from '@/components/game-mode-selector'

export function WelcomeScreen() {
  const [showModeSelector, setShowModeSelector] = useState(false)

  if (showModeSelector) {
    return <GameModeSelector onBack={() => setShowModeSelector(false)} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-green-50 dark:from-red-950 dark:to-green-950">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="bg-red-100 dark:bg-red-900 p-4 rounded-full">
                <Gift className="h-12 w-12 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Amigo Invisible
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Organiza el intercambio de regalos perfecto con tus amigos, familia o compañeros de trabajo
            </p>
          </div>

          {/* Game Modes */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Gift className="h-8 w-8 text-red-600" />
                  <CardTitle className="text-2xl">Amigo Invisible Clásico</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base mb-4">
                  El juego tradicional donde todos intercambian regalos en una fecha específica.
                </CardDescription>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                    Sorteo único para toda la partida
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                    Fecha de entrega personalizable
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                    Perfecto para eventos especiales
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Calendar className="h-8 w-8 text-green-600" />
                  <CardTitle className="text-2xl">Modo Cumpleaños</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base mb-4">
                  Un juego que dura todo el año donde cada participante organiza el regalo en su cumpleaños.
                </CardDescription>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    Sorteo automático por fechas
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    Celebración durante todo el año
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    Ideal para grupos estables
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Features */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 mb-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-center mb-6">¿Por qué elegir nuestra plataforma?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <Users className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Fácil de usar</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Interfaz intuitiva para usuarios de cualquier nivel técnico
                </p>
              </div>
              <div className="text-center">
                <Gift className="h-12 w-12 text-purple-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Totalmente privado</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Cada participante solo ve su asignación, garantizando la sorpresa
                </p>
              </div>
              <div className="text-center">
                <Calendar className="h-12 w-12 text-orange-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Flexible</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Adapta el juego a tus necesidades con múltiples opciones
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6"
              onClick={() => setShowModeSelector(true)}
            >
              Comenzar Juego
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
