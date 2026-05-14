import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, it, expect, afterEach } from 'vitest'
import MascotaTable from './MascotaTable'

const mascotas = [
  { id: 1, nombre: 'Firulais', especie: 'Perro' },
  { id: 2, nombre: 'Michi',    especie: 'Gato'  },
]

afterEach(() => vi.restoreAllMocks())

describe('MascotaTable', () => {
  it('muestra estado vacío cuando no hay mascotas', () => {
    render(<MascotaTable mascotas={[]} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('No hay mascotas registradas aún.')).toBeInTheDocument()
  })

  it('renderiza las mascotas en la tabla', () => {
    render(<MascotaTable mascotas={mascotas} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('Firulais')).toBeInTheDocument()
    expect(screen.getByText('Michi')).toBeInTheDocument()
    expect(screen.getByText('Perro')).toBeInTheDocument()
    expect(screen.getByText('Gato')).toBeInTheDocument()
  })

  it('llama onEdit al hacer clic en Editar', async () => {
    const onEdit = vi.fn()
    const user = userEvent.setup()
    render(<MascotaTable mascotas={mascotas} onEdit={onEdit} onDelete={vi.fn()} />)
    await user.click(screen.getAllByTitle('Editar')[0])
    expect(onEdit).toHaveBeenCalledWith(mascotas[0])
  })

  it('llama onDelete cuando el usuario confirma eliminar', async () => {
    const onDelete = vi.fn()
    const user = userEvent.setup()
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    render(<MascotaTable mascotas={mascotas} onEdit={vi.fn()} onDelete={onDelete} />)
    await user.click(screen.getAllByTitle('Eliminar')[0])
    expect(onDelete).toHaveBeenCalledWith(1)
  })

  it('no llama onDelete cuando el usuario cancela', async () => {
    const onDelete = vi.fn()
    const user = userEvent.setup()
    vi.spyOn(window, 'confirm').mockReturnValue(false)
    render(<MascotaTable mascotas={mascotas} onEdit={vi.fn()} onDelete={onDelete} />)
    await user.click(screen.getAllByTitle('Eliminar')[0])
    expect(onDelete).not.toHaveBeenCalled()
  })
})
