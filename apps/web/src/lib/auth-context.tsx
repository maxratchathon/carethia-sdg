'use client'
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

export interface AuthUser {
  id: number
  email: string
  firstName: string
  lastName: string
  role: 'CUSTOMER' | 'CAREGIVER' | 'ADMIN'
  points: number
}

interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean
  login: (user: AuthUser) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: () => {},
  logout: () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('carethia_user')
      if (stored) setUser(JSON.parse(stored))
    } catch {
      // ignore parse errors
    } finally {
      setIsLoading(false)
    }
  }, [])

  const login = useCallback((u: AuthUser) => {
    setUser(u)
    localStorage.setItem('carethia_user', JSON.stringify(u))
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem('carethia_user')
  }, [])

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
