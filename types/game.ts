export interface Game {
  id: string
  name: string
  description?: string
  mode: 'classic' | 'birthday'
  deliveryDate?: string
  status: 'pending' | 'active' | 'completed'
  participantIds: string[]
  createdAt: string
}

export interface Assignment {
  id: string
  gameId: string
  giverId: string
  receiverId: string
  giverName: string
  receiverName: string
}
