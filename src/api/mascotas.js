import axios from 'axios'

const api = axios.create({ baseURL: `/mascotas` })

export const getMascotas   = ()           => api.get('')
export const createMascota = (data)       => api.post('', data)
export const updateMascota = (id, data)   => api.put(`/${id}`, data)
export const deleteMascota = (id)         => api.delete(`/${id}`)
export const exportCSV     = ()           => api.get('/export', { responseType: 'text' })
export const importCSV     = (csvText)    => api.post('/import', csvText, {
  headers: { 'Content-Type': 'text/plain' }
})
