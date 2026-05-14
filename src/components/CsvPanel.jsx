import { useRef } from 'react'

export default function CsvPanel({ onExport, onImport }) {
  const fileRef = useRef(null)

  const handleImport = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => onImport(ev.target.result)
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <div className="card">
      <div className="card-title">📂 Importar / Exportar CSV</div>
      <div className="btn-actions">
        <button className="btn btn-ghost" onClick={onExport}>
          ⬇️ Exportar CSV
        </button>
        <button className="btn btn-ghost" onClick={() => fileRef.current?.click()}>
          ⬆️ Importar CSV
        </button>
        <input
          ref={fileRef} type="file" accept=".csv"
          style={{ display: 'none' }} onChange={handleImport}
        />
      </div>
      <p style={{ fontSize: '.8rem', color: 'var(--text-muted)', marginTop: '.5rem' }}>
        Formato CSV: <code>nombre,especie</code> (una fila por mascota, sin encabezado)
      </p>
    </div>
  )
}
