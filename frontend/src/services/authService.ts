import { UserProfile } from '../types'

export const MOCK_USER_PROFILE: UserProfile = {
  id: 'usr-101',
  name: 'Dr. Sarah Jenkins',
  email: 'sarah.jenkins@university.edu',
  role: 'Associate Professor & Evaluator',
  department: 'Computer Science & Engineering',
  institution: 'Stanford University',
  avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
}

export const authService = {
  async getProfile(): Promise<UserProfile> {
    await new Promise((resolve) => setTimeout(resolve, 100))
    return MOCK_USER_PROFILE
  },

  async login(email: string): Promise<{ user: UserProfile; token: string }> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    localStorage.setItem('auth_token', 'mock-jwt-token-' + Date.now())
    return {
      user: { ...MOCK_USER_PROFILE, email },
      token: 'mock-jwt-token-' + Date.now(),
    }
  },

  async logout(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 100))
    localStorage.removeItem('auth_token')
  },
}
