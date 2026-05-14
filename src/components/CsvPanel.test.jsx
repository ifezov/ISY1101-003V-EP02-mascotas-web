import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, it, expect, afterEach } from 'vitest'
import CsvPanel from './CsvPanel'

afterEach(() => vi.restoreAllMocks())

describe('CsvPanel', () => {
  it('renderiza los botones de exportar e importar', () => {
    render(<CsvPanel onExport={vi.fn()} onImport={vi.fn()} />)
    expect(screen.getByRole('button', { name: /Exportar CSV/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Importar CSV/ })).toBeInTheDocument()
  })

  it('llama onExport al hacer clic en Exportar', async () => {
    const onExport = vi.fn()
    const user = userEvent.setup()
    render(<CsvPanel onExport={onExport} onImport={vi.fn()} />)
    await user.click(screen.getByRole('button', { name: /Exportar CSV/ }))
    expect(onExport).toHaveBeenCalled()
  })

  it('abre el selector de archivos al hacer clic en Importar', async () => {
    const user = userEvent.setup()
    render(<CsvPanel onExport={vi.fn()} onImport={vi.fn()} />)
    const input = document.querySelector('input[type="file"]')
    const clickSpy = vi.spyOn(input, 'click')
    await user.click(screen.getByRole('button', { name: /Importar CSV/ }))
    expect(clickSpy).toHaveBeenCalled()
  })

  it('llama onImport con el contenido del archivo seleccionado', () => {
    const onImport = vi.fn()
    render(<CsvPanel onExport={vi.fn()} onImport={onImport} />)

    const csvContent = 'Firulais,Perro\nMichi,Gato'
    const file = new File([csvContent], 'mascotas.csv', { type: 'text/csv' })

    const mockReader = { readAsText: vi.fn(), onload: null }
    vi.spyOn(window, 'FileReader').mockImplementation(() => mockReader)

    const input = document.querySelector('input[type="file"]')
    fireEvent.change(input, { target: { files: [file] } })
    mockReader.onload({ target: { result: csvContent } })

    expect(onImport).toHaveBeenCalledWith(csvContent)
  })

  it('no llama onImport cuando no se selecciona archivo', () => {
    const onImport = vi.fn()
    render(<CsvPanel onExport={vi.fn()} onImport={onImport} />)
    const input = document.querySelector('input[type="file"]')
    fireEvent.change(input, { target: { files: [] } })
    expect(onImport).not.toHaveBeenCalled()
  })
})
