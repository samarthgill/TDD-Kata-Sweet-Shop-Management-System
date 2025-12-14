import api from './api'

export const authService = {
  login: async (email, password) => {
    try {
      console.log('Login attempt:', email)
      const response = await api.post('/auth/login', { 
        email, 
        password 
      })
      console.log('Login response:', response.data)
      return response.data
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message)
      throw error
    }
  },

  register: async (name, email, password, role = 'customer') => {
    try {
      console.log('Registration attempt:', { name, email, role })
      
      // Prepare data
      const userData = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password,
        role: role
      }
      
      console.log('Sending registration data:', userData)
      
      const response = await api.post('/auth/register', userData)
      console.log('Registration response:', response.data)
      return response.data
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message)
      throw error
    }
  },

  logout: () => {
    console.log('Logging out')
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user')
    const user = userStr ? JSON.parse(userStr) : null
    console.log('Current user:', user)
    return user
  },

  getToken: () => {
    return localStorage.getItem('token')
  },

  isAuthenticated: () => {
    const token = localStorage.getItem('token')
    return !!token
  },

  isAdmin: () => {
    const user = authService.getCurrentUser()
    return user?.role === 'admin'
  },

  isCustomer: () => {
    const user = authService.getCurrentUser()
    return user?.role === 'customer'
  }
}