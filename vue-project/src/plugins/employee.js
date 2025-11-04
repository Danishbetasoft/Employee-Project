import { apiClient } from '@/plugins/api'

export const apiemployee = {
  getAll(params) {
    return apiClient.get('/employees', { params })
  },
  create(data) {
    return apiClient.post('/employees', data)
  },
  update(id, data) {
    return apiClient.put(`/employees/${id}`, data)
  },
  remove(id) {
    return apiClient.delete(`/employees/${id}`)
  },
  updateBackground(id, payload) {
    return apiClient.put(`/employees/${id}/bgInfo`, payload)
  },
  sendMail(payload) {
    return apiClient.post('/mail/send', payload)
  },
}
