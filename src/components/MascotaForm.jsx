import { useState, useEffect } from 'react'

const EMPTY = { nombre: '', especie: '' }

export default function MascotaForm({ editing, onSubmit, onCancel }) {
  const [form, setForm] = useState(EMPTY)

  useEffect(() => {
    setForm(editing ? { nombre: editing.nombre, especie: editing.especie } : EMPTY)
  }, [editing])

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    if (!form.nombre.trim() || !form.especie.trim()) return
    const ok = await onSubmit(form)
    if (ok && !editing) setForm(EMPTY)
  }

  return (
    <div className="card">
      <div className="card-title">
        {editing ? '✏️ Editar mascota' : '➕ Nueva mascota'}
      </div>
      <form onSubmit={submit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="nombre">Nombre</label>
            <input
              id="nombre" name="nombre" value={form.nombre}
              onChange={handle} placeholder="Ej: Firulais"
              required autoComplete="off"
            />
          </div>
          <div className="form-group">
            <label htmlFor="especie">Especie</label>
            <input
              id="especie" name="especie" value={form.especie}
              onChange={handle} placeholder="Ej: Perro"
              required autoComplete="off"
            />
          </div>
        </div>
        <div className="btn-actions">
          <button type="submit" className="btn btn-primary">
            {editing ? 'Guardar cambios' : 'Registrar mascota'}
          </button>
          {editing && (
            <button type="button" className="btn btn-ghost" onClick={onCancel}>
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
