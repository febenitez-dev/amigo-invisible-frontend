type EmailRequest = {
  to: string
  subject: string
  body: string
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

class EmailService {
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

  async sendEmail(emailRequest: EmailRequest): Promise<string> {
    return this.request<string>('/email/send', {
      method: 'POST',
      body: JSON.stringify(emailRequest),
    })
  }
}

export const emailService = new EmailService()
