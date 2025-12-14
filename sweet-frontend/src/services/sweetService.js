import api from './api'

export const sweetService = {
  getAllSweets: async () => {
    const response = await api.get('/sweets')
    return response.data
  },

  searchSweets: async (params) => {
    const queryString = new URLSearchParams(params).toString()
    const url = `/sweets/search${queryString ? `?${queryString}` : ''}`
    const response = await api.get(url)
    return response.data
  },

  createSweet: async (sweetData) => {
    const response = await api.post('/sweets', sweetData)
    return response.data
  },

  updateSweet: async (id, sweetData) => {
    const response = await api.put(`/sweets/${id}`, sweetData)
    return response.data
  },

  deleteSweet: async (id) => {
    const response = await api.delete(`/sweets/${id}`)
    return response.data
  },

  purchaseSweet: async (sweetId, quantity) => {
    const response = await api.post(`/sweets/${sweetId}/purchase`, { quantity })
    return response.data
  },

  restockSweet: async (sweetId, quantity) => {
    const response = await api.post(`/sweets/${sweetId}/restock`, { quantity })
    return response.data
  }
}