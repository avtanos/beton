import { create } from 'zustand'
import apiClient from '../api/client'
import { UserRole } from '../types'

interface User {
  id: number
  username: string
  email?: string
  full_name?: string
  role: UserRole
  is_active: boolean
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  fetchCurrentUser: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: !!localStorage.getItem('access_token'),

  login: async (username: string, password: string) => {
    const response = await apiClient.post('/auth/login', {
      username,
      password,
    })
    const { access_token } = response.data
    localStorage.setItem('access_token', access_token)
    await useAuthStore.getState().fetchCurrentUser()
    set({ isAuthenticated: true })
  },

  logout: () => {
    localStorage.removeItem('access_token')
    set({ user: null, isAuthenticated: false })
  },

  fetchCurrentUser: async () => {
    try {
      const response = await apiClient.get('/auth/me')
      set({ user: response.data })
    } catch (error) {
      console.error('Failed to fetch current user:', error)
    }
  },
}))

