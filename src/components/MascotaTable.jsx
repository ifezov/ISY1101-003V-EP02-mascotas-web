export default function MascotaTable({ mascotas, onEdit, onDelete }) {
  if (mascotas.length === 0) {
    return (
      <div className="empty-state">
        <div className="icon">🐾</div>
        <p>No hay mascotas registradas aún.</p>
        <p style={{ fontSize: '.85rem', marginTop: '.25rem' }}>
          Usa el formulario de arriba para agregar la primera.
        </p>
      </div>
    )
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Especie</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {mascotas.map((m) => (
            <tr key={m.id}>
              <td><span className="badge">{m.id}</span></td>
              <td>{m.nombre}</td>
              <td>{m.especie}</td>
              <td>
                <div className="td-actions">
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => onEdit(m)}
                    title="Editar"
                  >
                    ✏️ Editar
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => {
                      if (window.confirm(`¿Eliminar a ${m.nombre}?`)) {
                        onDelete(m.id)
                      }
                    }}
                    title="Eliminar"
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
