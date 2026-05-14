import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import App from './App'

vi.mock('./hooks/useMascotas', () => ({
  useMascotas: vi.fn()
}))

import { useMascotas } from './hooks/useMascotas'

const baseHook = {
  mascotas: [
    { id: 1, nombre: 'Firulais', especie: 'Perro' },
    { id: 2, nombre: 'Michi',    especie: 'Gato'  },
  ],
  loading:  false,
  error:    null,
  success:  null,
  crear:     vi.fn().mockResolvedValue(true),
  actualizar: vi.fn().mockResolvedValue(true),
  eliminar:  vi.fn(),
  exportar:  vi.fn(),
  importar:  vi.fn(),
}

beforeEach(() => useMascotas.mockReturnValue({ ...baseHook }))
afterEach(() => vi.restoreAllMocks())

describe('App', () => {
  it('renderiza el encabezado y las estadísticas', () => {
    render(<App />)
    expect(screen.getByText(/Gestión de Mascotas/i)).toBeInTheDocument()
    expect(screen.getByText('Total mascotas')).toBeInTheDocument()
    expect(screen.getByText('Especies distintas')).toBeInTheDocument()
  })

  it('muestra alerta de error cuando hay error', () => {
    useMascotas.mockReturnValue({ ...baseHook, error: 'Error de prueba' })
    render(<App />)
    expect(screen.getByText(/Error de prueba/)).toBeInTheDocument()
  })

  it('muestra alerta de éxito cuando hay mensaje de éxito', () => {
    useMascotas.mockReturnValue({ ...baseHook, success: 'Operación exitosa' })
    render(<App />)
    expect(screen.getByText(/Operación exitosa/)).toBeInTheDocument()
  })

  it('muestra el spinner mientras carga', () => {
    useMascotas.mockReturnValue({ ...baseHook, loading: true })
    render(<App />)
    expect(screen.getByText('Cargando...')).toBeInTheDocument()
  })

  it('llama crear al enviar el formulario con nueva mascota', async () => {
    const crear = vi.fn().mockResolvedValue(true)
    useMascotas.mockReturnValue({ ...baseHook, mascotas: [], crear })
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText('Nombre'), 'Toby')
    await user.type(screen.getByLabelText('Especie'), 'Perro')
    await user.click(screen.getByRole('button', { name: /Registrar mascota/i }))
    expect(crear).toHaveBeenCalledWith({ nombre: 'Toby', especie: 'Perro' })
  })

  it('llama actualizar al editar una mascota existente', async () => {
    const actualizar = vi.fn().mockResolvedValue(true)
    useMascotas.mockReturnValue({ ...baseHook, actualizar })
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getAllByTitle('Editar')[0])
    expect(screen.getByText('✏️ Editar mascota')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /Guardar cambios/i }))
    expect(actualizar).toHaveBeenCalledWith(1, { nombre: 'Firulais', especie: 'Perro' })
  })

  it('cancela la edición al hacer clic en Cancelar', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getAllByTitle('Editar')[0])
    expect(screen.getByText('✏️ Editar mascota')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /Cancelar/i }))
    expect(screen.getByText('➕ Nueva mascota')).toBeInTheDocument()
  })

  it('muestra el conteo de mascotas y especies en las estadísticas', () => {
    render(<App />)
    const statNums = document.querySelectorAll('.stat-num')
    expect(statNums[0].textContent).toBe('2')
    expect(statNums[1].textContent).toBe('2')
  })
})
