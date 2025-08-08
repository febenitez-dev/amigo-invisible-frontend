import { Participant } from '@/types/participant'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

class ParticipantService {
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

  async getAll(): Promise<Participant[]> {
    return this.request<Participant[]>('/participants')
  }

  async getById(id: string): Promise<Participant> {
    return this.request<Participant>(`/participants/${id}`)
  }

  async create(participant: Omit<Participant, 'id'>): Promise<Participant> {
    return this.request<Participant>('/participants', {
      method: 'POST',
      body: JSON.stringify(participant),
    })
  }

  async update(id: string, participant: Omit<Participant, 'id'>): Promise<Participant> {
    return this.request<Participant>(`/participants/${id}`, {
      method: 'PUT',
      body: JSON.stringify(participant),
    })
  }

  async delete(id: string): Promise<void> {
    return this.request<void>(`/participants/${id}`, {
      method: 'DELETE',
    })
  }
}

export const participantService = new ParticipantService()
