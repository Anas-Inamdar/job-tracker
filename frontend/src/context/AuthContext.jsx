import { createContext, useContext, useState, useCallback } from 'react'
import { authApi } from '../api/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user')
      return stored ? JSON.parse(stored) : null
    } catch { return null }
  })

  const login = useCallback(async (credentials) => {
    const data = await authApi.login(credentials)
    localStorage.setItem('accessToken', data.accessToken)
    localStorage.setItem('user', JSON.stringify({
      id: data.userId, email: data.email,
      firstName: data.firstName, lastName: data.lastName
    }))
    setUser({ id: data.userId, email: data.email, firstName: data.firstName, lastName: data.lastName })
    return data
  }, [])

  const register = useCallback(async (userData) => {
    const data = await authApi.register(userData)
    localStorage.setItem('accessToken', data.accessToken)
    localStorage.setItem('user', JSON.stringify({
      id: data.userId, email: data.email,
      firstName: data.firstName, lastName: data.lastName
    }))
    setUser({ id: data.userId, email: data.email, firstName: data.firstName, lastName: data.lastName })
    return data
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('user')
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
