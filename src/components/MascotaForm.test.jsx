import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, it, expect } from 'vitest'
import MascotaForm from './MascotaForm'

describe('MascotaForm', () => {
  it('renderiza el formulario de nueva mascota', () => {
    render(<MascotaForm editing={null} onSubmit={vi.fn()} onCancel={vi.fn()} />)
    expect(screen.getByText('➕ Nueva mascota')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Registrar mascota/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Cancelar/i })).not.toBeInTheDocument()
  })

  it('renderiza en modo edición con los datos existentes', () => {
    const mascota = { id: 1, nombre: 'Firulais', especie: 'Perro' }
    render(<MascotaForm editing={mascota} onSubmit={vi.fn()} onCancel={vi.fn()} />)
    expect(screen.getByText('✏️ Editar mascota')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Firulais')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Perro')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Cancelar/i })).toBeInTheDocument()
  })

  it('llama onSubmit con los datos del formulario', async () => {
    const onSubmit = vi.fn().mockResolvedValue(true)
    const user = userEvent.setup()
    render(<MascotaForm editing={null} onSubmit={onSubmit} onCancel={vi.fn()} />)
    await user.type(screen.getByLabelText('Nombre'), 'Michi')
    await user.type(screen.getByLabelText('Especie'), 'Gato')
    await user.click(screen.getByRole('button', { name: /Registrar mascota/i }))
    expect(onSubmit).toHaveBeenCalledWith({ nombre: 'Michi', especie: 'Gato' })
  })

  it('no envía cuando los campos están vacíos', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()
    render(<MascotaForm editing={null} onSubmit={onSubmit} onCancel={vi.fn()} />)
    await user.click(screen.getByRole('button', { name: /Registrar mascota/i }))
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('limpia el formulario tras un submit exitoso en modo nuevo', async () => {
    const onSubmit = vi.fn().mockResolvedValue(true)
    const user = userEvent.setup()
    render(<MascotaForm editing={null} onSubmit={onSubmit} onCancel={vi.fn()} />)
    const nombreInput = screen.getByLabelText('Nombre')
    await user.type(nombreInput, 'Toby')
    await user.type(screen.getByLabelText('Especie'), 'Perro')
    await user.click(screen.getByRole('button', { name: /Registrar mascota/i }))
    await waitFor(() => expect(nombreInput).toHaveValue(''))
  })

  it('no limpia el formulario si onSubmit retorna false en modo edición', async () => {
    const onSubmit = vi.fn().mockResolvedValue(false)
    const user = userEvent.setup()
    const mascota = { id: 1, nombre: 'Firulais', especie: 'Perro' }
    render(<MascotaForm editing={mascota} onSubmit={onSubmit} onCancel={vi.fn()} />)
    await user.click(screen.getByRole('button', { name: /Guardar cambios/i }))
    expect(onSubmit).toHaveBeenCalled()
    expect(screen.getByDisplayValue('Firulais')).toBeInTheDocument()
  })

  it('llama onCancel al hacer clic en Cancelar', async () => {
    const onCancel = vi.fn()
    const user = userEvent.setup()
    const mascota = { id: 1, nombre: 'Firulais', especie: 'Perro' }
    render(<MascotaForm editing={mascota} onSubmit={vi.fn()} onCancel={onCancel} />)
    await user.click(screen.getByRole('button', { name: /Cancelar/i }))
    expect(onCancel).toHaveBeenCalled()
  })
})
