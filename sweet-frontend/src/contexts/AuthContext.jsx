import React, { createContext, useState, useContext, useEffect } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = authService.getCurrentUser()
    if (storedUser) {
      setUser(storedUser)
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password)
      setUser(response.user)
      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))
      return { success: true, data: response }
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Login failed' }
    }
  }

  const register = async (name, email, password, role) => {
    try {
      const response = await authService.register(name, email, password, role)
      setUser(response.user)
      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))
      return { success: true, data: response }
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Registration failed' }
    }
  }

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  const isAdmin = () => {
    return user?.role === 'admin'
  }

  const isCustomer = () => {
    return user?.role === 'customer'
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAdmin,
    isCustomer,
    isAuthenticated: !!user
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}