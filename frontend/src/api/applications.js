import api from './client'

export const applicationsApi = {
  getAll: (params) => api.get('/applications', { params }).then(r => r.data),
  getOne: (id) => api.get(`/applications/${id}`).then(r => r.data),
  create: (data) => api.post('/applications', data).then(r => r.data),
  update: (id, data) => api.put(`/applications/${id}`, data).then(r => r.data),
  delete: (id) => api.delete(`/applications/${id}`),
  getDashboard: () => api.get('/applications/dashboard').then(r => r.data),
  getFollowUps: () => api.get('/applications/follow-ups').then(r => r.data),
}
