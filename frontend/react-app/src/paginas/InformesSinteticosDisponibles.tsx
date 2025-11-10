import { useState } from "react";
import { useInformesSinteticos } from "../hook/useInformesSinteticos";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";

export default function TablaInformeSintetico() {
  const [cicloLectivo, setCicloLectivo] = useState(2025); // ciclo por defecto
  const { resumenes, loading, error } = useInformesSinteticos(cicloLectivo);

  const ciclosDisponibles = [2023, 2024, 2025]; // se puede generar dinámicamente si es necesario

  return (
    <div className="container mt-4 p-4 border">
<div className="row mb-3">
  <div className="col-auto">
    <label htmlFor="cicloSelect" className="me-2 fw-bold">
       Ciclo lectivo:
    </label>

    <select
      id="cicloSelect"
      className="form-select form-select-sm"
      style={{ maxWidth: "120px" }}
      value={cicloLectivo}
      onChange={(e) => setCicloLectivo(Number(e.target.value))}
    >
      {ciclosDisponibles.map((ciclo) => (
        <option key={ciclo} value={ciclo}>
          {ciclo}
        </option>
      ))}
    </select>
  </div>
</div>
      {loading ? (
        <p>Cargando...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <Table className="table table-striped border">
          <thead>
            <tr>
              <th>Carrera</th>
              <th>Cantidad de informes</th>
              <th>Informes publicados</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {resumenes.map((r) => (
              <tr key={r.carrera.id}>
                <td>{r.carrera.nombre}</td>
                <td>{r.totalInformes}</td>
                <td>{r.publicados}</td>
                <td>
                  {r.totalInformes === 0 ? (
                    <span className="text-muted fst-italc" >
                      No hay informes disponibles
                    </span>
                  ) :
                  r.sinteticoId ? (
                    <Link
                      to={`/departamento/informe-sintetico/${r.sinteticoId}`}
                      className="btn btn-outline-primary"
                    >
                      Ver informe sintético
                    </Link>
                  ) : (
                    <Link
                      to={`/departamento/generar-informe/${r.carrera.id}?ciclo=${cicloLectivo}`}
                      className="btn btn-primary"
                    >
                      Generar informe sintético
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
