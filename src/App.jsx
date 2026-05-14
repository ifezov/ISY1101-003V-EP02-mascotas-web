import { useState } from 'react'
import { useMascotas } from './hooks/useMascotas'
import MascotaForm  from './components/MascotaForm'
import MascotaTable from './components/MascotaTable'
import CsvPanel     from './components/CsvPanel'

export default function App() {
  const {
    mascotas, loading, error, success,
    crear, actualizar, eliminar, exportar, importar
  } = useMascotas()

  const [editing, setEditing] = useState(null)

  const handleSubmit = async (form) => {
    if (editing) {
      const ok = await actualizar(editing.id, form)
      if (ok) setEditing(null)
      return ok
    }
    return crear(form)
  }

  const especies = new Set(mascotas.map(m => m.especie)).size

  return (
    <div className="app-wrapper">
      {/* ── Header ── */}
      <header className="app-header">
        <h1>🐾 Gestión de Mascotas</h1>
        <p>Sistema CRUD — Spring Boot + PostgreSQL + React</p>
      </header>

      {/* ── Alertas ── */}
      {error   && <div className="alert alert-error">⚠️ {error}</div>}
      {success && <div className="alert alert-success">✅ {success}</div>}

      {/* ── Stats ── */}
      <div className="stats-bar">
        <div className="stat-card">
          <div className="stat-num">{mascotas.length}</div>
          <div className="stat-label">Total mascotas</div>
        </div>
        <div className="stat-card">
          <div className="stat-num">{especies}</div>
          <div className="stat-label">Especies distintas</div>
        </div>
      </div>

      {/* ── Formulario ── */}
      <MascotaForm
        editing={editing}
        onSubmit={handleSubmit}
        onCancel={() => setEditing(null)}
      />

      {/* ── CSV ── */}
      <CsvPanel onExport={exportar} onImport={importar} />

      {/* ── Tabla ── */}
      <div className="card">
        <div className="card-title">
          📋 Lista de mascotas
          {loading && <span style={{ fontSize: '.8rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
            Cargando...
          </span>}
        </div>

        {loading ? (
          <div className="spinner-wrap"><div className="spinner" /></div>
        ) : (
          <MascotaTable
            mascotas={mascotas}
            onEdit={setEditing}
            onDelete={eliminar}
          />
        )}
      </div>

      {/* ── Footer ── */}
      <footer style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '.8rem', marginTop: '1rem' }}>
        API: <code>/mascotas</code>
      </footer>
    </div>
  )
}
