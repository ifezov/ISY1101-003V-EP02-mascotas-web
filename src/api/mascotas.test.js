import { vi, describe, it, expect, beforeEach } from 'vitest'

const mockApi = vi.hoisted(() => ({
  get:    vi.fn(),
  post:   vi.fn(),
  put:    vi.fn(),
  delete: vi.fn(),
}))

vi.mock('axios', () => ({
  default: { create: vi.fn(() => mockApi) }
}))

import { getMascotas, createMascota, updateMascota, deleteMascota, exportCSV, importCSV } from './mascotas'

describe('mascotas API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockApi.get.mockResolvedValue({ data: [] })
    mockApi.post.mockResolvedValue({ data: {} })
    mockApi.put.mockResolvedValue({ data: {} })
    mockApi.delete.mockResolvedValue({})
  })

  it('getMascotas llama GET con ruta vacía', async () => {
    await getMascotas()
    expect(mockApi.get).toHaveBeenCalledWith('')
  })

  it('createMascota llama POST con los datos', async () => {
    const data = { nombre: 'Firulais', especie: 'Perro' }
    await createMascota(data)
    expect(mockApi.post).toHaveBeenCalledWith('', data)
  })

  it('updateMascota llama PUT con el id', async () => {
    const data = { nombre: 'Michi', especie: 'Gato' }
    await updateMascota(1, data)
    expect(mockApi.put).toHaveBeenCalledWith('/1', data)
  })

  it('deleteMascota llama DELETE con el id', async () => {
    await deleteMascota(1)
    expect(mockApi.delete).toHaveBeenCalledWith('/1')
  })

  it('exportCSV llama GET /export con responseType text', async () => {
    await exportCSV()
    expect(mockApi.get).toHaveBeenCalledWith('/export', { responseType: 'text' })
  })

  it('importCSV llama POST /import con texto plano', async () => {
    const csv = 'Firulais,Perro'
    await importCSV(csv)
    expect(mockApi.post).toHaveBeenCalledWith('/import', csv, {
      headers: { 'Content-Type': 'text/plain' }
    })
  })
})
