import { Game, Assignment } from '@/types/game'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

class GameService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  async getAll(): Promise<Game[]> {
    return this.request<Game[]>('/games')
  }

  async getById(id: string): Promise<Game> {
    return this.request<Game>(`/games/${id}`)
  }

  async create(game: Omit<Game, 'id' | 'status' | 'createdAt'>): Promise<Game> {
    return this.request<Game>('/games', {
      method: 'POST',
      body: JSON.stringify({
        ...game,
        status: 'pending',
        createdAt: new Date().toISOString()
      }),
    })
  }

  async update(id: string, game: Partial<Game>): Promise<Game> {
    return this.request<Game>(`/games/${id}`, {
      method: 'PUT',
      body: JSON.stringify(game),
    })
  }

  async delete(id: string): Promise<void> {
    return this.request<void>(`/games/${id}`, {
      method: 'DELETE',
    })
  }

  async assign(gameId: string): Promise<Assignment[]> {
    return this.request<Assignment[]>(`/games/${gameId}/assign`, {
      method: 'POST',
    })
  }

  async getAssignment(gameId: string, participantId: string): Promise<Assignment> {
    return this.request<Assignment>(`/games/${gameId}/assignments/${participantId}`)
  }

  async exportResults(gameId: string): Promise<Blob> {
    const url = `${API_BASE_URL}/games/${gameId}/export`
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/pdf',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.blob()
  }
}

export const gameService = new GameService()
