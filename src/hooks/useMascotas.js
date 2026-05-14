import { useState, useEffect, useCallback } from 'react'
import {
  getMascotas, createMascota, updateMascota,
  deleteMascota, exportCSV, importCSV
} from '../api/mascotas'

export function useMascotas() {
  const [mascotas, setMascotas] = useState([])
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState(null)
  const [success,  setSuccess]  = useState(null)

  const notify = (msg, isError = false) => {
    if (isError) { setError(msg);   setTimeout(() => setError(null),   4000) }
    else         { setSuccess(msg); setTimeout(() => setSuccess(null), 3000) }
  }

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await getMascotas()
      setMascotas(data)
    } catch {
      notify('Error al cargar mascotas', true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const crear = async (mascota) => {
    try {
      await createMascota(mascota)
      notify('Mascota registrada correctamente')
      load()
      return true
    } catch {
      notify('Error al registrar mascota', true)
      return false
    }
  }

  const actualizar = async (id, mascota) => {
    try {
      await updateMascota(id, mascota)
      notify('Mascota actualizada correctamente')
      load()
      return true
    } catch {
      notify('Error al actualizar mascota', true)
      return false
    }
  }

  const eliminar = async (id) => {
    try {
      await deleteMascota(id)
      notify('Mascota eliminada')
      load()
    } catch {
      notify('Error al eliminar mascota', true)
    }
  }

  const exportar = async () => {
    try {
      const { data } = await exportCSV()
      const blob = new Blob([data], { type: 'text/csv' })
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href = url; a.download = 'mascotas.csv'; a.click()
      URL.revokeObjectURL(url)
      notify('CSV exportado')
    } catch {
      notify('Error al exportar', true)
    }
  }

  const importar = async (csvText) => {
    try {
      await importCSV(csvText)
      notify('CSV importado correctamente')
      load()
      return true
    } catch {
      notify('Error al importar CSV', true)
      return false
    }
  }

  return { mascotas, loading, error, success, crear, actualizar, eliminar, exportar, importar, reload: load }
}
