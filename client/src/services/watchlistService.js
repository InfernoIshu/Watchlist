import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL

const apiClient = axios.create({
  baseURL: API_BASE_URL,
})

// Automatically add x-user-id header if available in useStore
apiClient.interceptors.request.use((config) => {
  // We'll pass the userId explicitly from the component or hook
  return config
})

export const getWatchlist = (userId) => 
  apiClient.get('/watchlist', { headers: { 'x-user-id': userId } })

export const addToWatchlist = (userId, item) => 
  apiClient.post('/watchlist/add', item, { headers: { 'x-user-id': userId } })

export const updateWatchItem = (userId, id, updates) => 
  apiClient.put(`/watchlist/update/${id}`, updates, { headers: { 'x-user-id': userId } })

export const deleteWatchItem = (userId, id) => 
  apiClient.delete(`/watchlist/delete/${id}`, { headers: { 'x-user-id': userId } })
