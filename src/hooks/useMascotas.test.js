import { renderHook, waitFor, act } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'

vi.mock('../api/mascotas', () => ({
  getMascotas:   vi.fn(),
  createMascota: vi.fn(),
  updateMascota: vi.fn(),
  deleteMascota: vi.fn(),
  exportCSV:     vi.fn(),
  importCSV:     vi.fn(),
}))

import { useMascotas } from './useMascotas'
import * as api from '../api/mascotas'

const mockMascotas = [
  { id: 1, nombre: 'Firulais', especie: 'Perro' },
  { id: 2, nombre: 'Michi',    especie: 'Gato'  },
]

beforeEach(() => {
  vi.clearAllMocks()
  api.getMascotas.mockResolvedValue({ data: mockMascotas })
})

afterEach(() => vi.restoreAllMocks())

describe('useMascotas', () => {
  it('carga las mascotas al montar', async () => {
    const { result } = renderHook(() => useMascotas())
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.mascotas).toEqual(mockMascotas)
  })

  it('muestra error cuando falla la carga', async () => {
    api.getMascotas.mockRejectedValue(new Error('Network error'))
    const { result } = renderHook(() => useMascotas())
    await waitFor(() => expect(result.current.error).toBe('Error al cargar mascotas'))
  })

  it('crear llama createMascota y recarga la lista', async () => {
    api.createMascota.mockResolvedValue({})
    const { result } = renderHook(() => useMascotas())
    await waitFor(() => expect(result.current.loading).toBe(false))
    let ok
    await act(async () => { ok = await result.current.crear({ nombre: 'Toby', especie: 'Perro' }) })
    expect(ok).toBe(true)
    expect(api.createMascota).toHaveBeenCalled()
    expect(result.current.success).toBe('Mascota registrada correctamente')
  })

  it('crear muestra error cuando falla', async () => {
    api.createMascota.mockRejectedValue(new Error())
    const { result } = renderHook(() => useMascotas())
    await waitFor(() => expect(result.current.loading).toBe(false))
    let ok
    await act(async () => { ok = await result.current.crear({ nombre: 'Toby', especie: 'Perro' }) })
    expect(ok).toBe(false)
    expect(result.current.error).toBe('Error al registrar mascota')
  })

  it('actualizar llama updateMascota y recarga la lista', async () => {
    api.updateMascota.mockResolvedValue({})
    const { result } = renderHook(() => useMascotas())
    await waitFor(() => expect(result.current.loading).toBe(false))
    let ok
    await act(async () => { ok = await result.current.actualizar(1, { nombre: 'Toby', especie: 'Perro' }) })
    expect(ok).toBe(true)
    expect(result.current.success).toBe('Mascota actualizada correctamente')
  })

  it('actualizar muestra error cuando falla', async () => {
    api.updateMascota.mockRejectedValue(new Error())
    const { result } = renderHook(() => useMascotas())
    await waitFor(() => expect(result.current.loading).toBe(false))
    let ok
    await act(async () => { ok = await result.current.actualizar(1, { nombre: 'Toby', especie: 'Perro' }) })
    expect(ok).toBe(false)
    expect(result.current.error).toBe('Error al actualizar mascota')
  })

  it('eliminar llama deleteMascota y recarga la lista', async () => {
    api.deleteMascota.mockResolvedValue({})
    const { result } = renderHook(() => useMascotas())
    await waitFor(() => expect(result.current.loading).toBe(false))
    await act(async () => { await result.current.eliminar(1) })
    expect(api.deleteMascota).toHaveBeenCalledWith(1)
    expect(result.current.success).toBe('Mascota eliminada')
  })

  it('eliminar muestra error cuando falla', async () => {
    api.deleteMascota.mockRejectedValue(new Error())
    const { result } = renderHook(() => useMascotas())
    await waitFor(() => expect(result.current.loading).toBe(false))
    await act(async () => { await result.current.eliminar(1) })
    expect(result.current.error).toBe('Error al eliminar mascota')
  })

  it('exportar descarga el CSV correctamente', async () => {
    api.exportCSV.mockResolvedValue({ data: 'Firulais,Perro\n' })
    global.URL.createObjectURL = vi.fn(() => 'blob:url')
    global.URL.revokeObjectURL = vi.fn()

    const originalCreate = document.createElement.bind(document)
    const mockAnchor = document.createElement('a')
    const clickSpy = vi.spyOn(mockAnchor, 'click').mockImplementation(() => {})
    vi.spyOn(document, 'createElement').mockImplementation((tag) =>
      tag === 'a' ? mockAnchor : originalCreate(tag)
    )

    const { result } = renderHook(() => useMascotas())
    await waitFor(() => expect(result.current.loading).toBe(false))
    await act(async () => { await result.current.exportar() })

    expect(global.URL.createObjectURL).toHaveBeenCalled()
    expect(clickSpy).toHaveBeenCalled()
    expect(result.current.success).toBe('CSV exportado')
  })

  it('exportar muestra error cuando falla', async () => {
    api.exportCSV.mockRejectedValue(new Error())
    const { result } = renderHook(() => useMascotas())
    await waitFor(() => expect(result.current.loading).toBe(false))
    await act(async () => { await result.current.exportar() })
    expect(result.current.error).toBe('Error al exportar')
  })

  it('importar llama importCSV y recarga la lista', async () => {
    api.importCSV.mockResolvedValue({})
    const { result } = renderHook(() => useMascotas())
    await waitFor(() => expect(result.current.loading).toBe(false))
    let ok
    await act(async () => { ok = await result.current.importar('Firulais,Perro') })
    expect(ok).toBe(true)
    expect(result.current.success).toBe('CSV importado correctamente')
  })

  it('importar muestra error cuando falla', async () => {
    api.importCSV.mockRejectedValue(new Error())
    const { result } = renderHook(() => useMascotas())
    await waitFor(() => expect(result.current.loading).toBe(false))
    let ok
    await act(async () => { ok = await result.current.importar('datos incorrectos') })
    expect(ok).toBe(false)
    expect(result.current.error).toBe('Error al importar CSV')
  })

  it('reload recarga la lista manualmente', async () => {
    const { result } = renderHook(() => useMascotas())
    await waitFor(() => expect(result.current.loading).toBe(false))
    await act(async () => { await result.current.reload() })
    expect(api.getMascotas).toHaveBeenCalledTimes(2)
  })
})
