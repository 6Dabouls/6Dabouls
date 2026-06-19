import axios from 'axios'
import toast from 'react-hot-toast'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  timeout: 15000,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const msg = error.response?.data?.message || 'Une erreur est survenue'
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('user')
      window.location.href = '/login'
    } else if (error.response?.status !== 422) {
      toast.error(Array.isArray(msg) ? msg[0] : msg)
    }
    return Promise.reject(error)
  }
)

export default api

// Auth
export const authApi = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  verify2fa: (data: any) => api.post('/auth/2fa/verify', data),
  setup2fa: () => api.post('/auth/2fa/setup'),
  enable2fa: (data: any) => api.post('/auth/2fa/enable', data),
  verifyEmail: (token: string) => api.post('/auth/verify-email', { token }),
  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
}

// Users
export const usersApi = {
  getMe: () => api.get('/users/me'),
  updateMe: (data: any) => api.put('/users/me', data),
  changePassword: (data: any) => api.put('/users/me/password', data),
  updateNotifications: (data: any) => api.put('/users/me/notifications', data),
}

// KYC
export const kycApi = {
  getStatus: () => api.get('/kyc/status'),
  submit: (data: any) => api.post('/kyc/submit', data),
}

// Projects
export const projectsApi = {
  getAll: (params?: any) => api.get('/projects', { params }),
  getFeatured: () => api.get('/projects/featured'),
  getStats: () => api.get('/projects/stats'),
  getOne: (id: string) => api.get(`/projects/${id}`),
  getUpdates: (id: string) => api.get(`/projects/${id}/updates`),
  create: (data: any) => api.post('/projects', data),
  update: (id: string, data: any) => api.put(`/projects/${id}`, data),
  addUpdate: (id: string, data: any) => api.post(`/projects/${id}/updates`, data),
}

// Investments
export const investmentsApi = {
  invest: (data: any) => api.post('/investments', data),
  getAll: (params?: any) => api.get('/investments', { params }),
  getOne: (id: string) => api.get(`/investments/${id}`),
  getReturns: (id: string) => api.get(`/investments/${id}/returns`),
}

// Portfolio
export const portfolioApi = {
  getSummary: () => api.get('/portfolio'),
  getReturns: (params?: any) => api.get('/portfolio/returns', { params }),
  getTransactions: (params?: any) => api.get('/portfolio/transactions', { params }),
}

// Payments
export const paymentsApi = {
  getWallet: () => api.get('/payments/wallet'),
  deposit: (data: any) => api.post('/payments/deposit', data),
  withdraw: (data: any) => api.post('/payments/withdraw', data),
  getTransactions: (params?: any) => api.get('/payments/transactions', { params }),
}

// Notifications
export const notificationsApi = {
  getAll: (params?: any) => api.get('/notifications', { params }),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markRead: (id: string) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/read-all'),
}

// Admin
export const adminApi = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: (params?: any) => api.get('/admin/users', { params }),
  banUser: (id: string, reason: string) => api.put(`/admin/users/${id}/ban`, { reason }),
  unbanUser: (id: string) => api.put(`/admin/users/${id}/unban`),
  getPendingProjects: () => api.get('/admin/projects/pending'),
  approveProject: (id: string) => api.put(`/admin/projects/${id}/approve`),
  rejectProject: (id: string, reason: string) => api.put(`/admin/projects/${id}/reject`, { reason }),
  getPendingKyc: (params?: any) => api.get('/admin/kyc/pending', { params }),
  reviewKyc: (id: string, data: any) => api.put(`/admin/kyc/${id}/review`, data),
  getPendingWithdrawals: () => api.get('/admin/withdrawals/pending'),
  approveWithdrawal: (id: string) => api.put(`/admin/withdrawals/${id}/approve`),
  rejectWithdrawal: (id: string, reason: string) => api.put(`/admin/withdrawals/${id}/reject`, { reason }),
}

// Promoter
export const promoterApi = {
  getProjects: () => api.get('/promoter/projects'),
  submitProject: (data: any) => api.post('/promoter/projects', data),
  updateProject: (id: string, data: any) => api.put(`/promoter/projects/${id}`, data),
  publishUpdate: (id: string, data: any) => api.post(`/promoter/projects/${id}/updates`, data),
  distributeReturns: (id: string, data: any) => api.post(`/promoter/projects/${id}/distribute-returns`, data),
}
