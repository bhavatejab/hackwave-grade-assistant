import React, { createContext, useContext, useState } from 'react'
import { UserProfile } from '../types'
import { MOCK_USER } from '../constants/mockData'

interface AuthContextType {
  user: UserProfile
  isAuthenticated: boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user] = useState<UserProfile>(MOCK_USER)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true)

  const logout = () => {
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
