import { useState } from "react";
import { useInformesSinteticos } from "../hook/useInformesSinteticos";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";

export default function TablaInformeSintetico() {
  const [cicloLectivo, setCicloLectivo] = useState(2025);
  const [cuatrimestre, setCuatrimestre] = useState("1° cuatrimestre");

const { resumenes, loading, error } = useInformesSinteticos(cicloLectivo, cuatrimestre);


  const ciclosDisponibles = [2023, 2024, 2025];

  return (
    <div className="container mt-4 p-4 border">
      {/* Título */}
      <div className="row mb-2">
        <div className="col text-center">
          <h2>Resumen por Carrera</h2>
        </div>
      </div>

      {/* Filtros */}
      <div className="row mb-3 justify-content-start">
        <div className="col-auto d-flex align-items-center">
          <label htmlFor="anioSelect" className="me-2 fw-bold">Año:</label>
          <select
            id="anioSelect"
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

        <div className="col-auto d-flex align-items-center ms-4">
          <label htmlFor="cuatrimestreSelect" className="me-2 fw-bold">Cuatrimestre:</label>
          <select
            id="cuatrimestreSelect"
            className="form-select form-select-sm"
            style={{ maxWidth: "150px" }}
            value={cuatrimestre}
            onChange={(e) => setCuatrimestre(e.target.value)}
          >
            <option value="1° cuatrimestre">1° </option>
            <option value="2° cuatrimestre">2° </option>
          </select>
        </div>

        <div className="col-auto align-self-center ms-4">
        </div>
      </div>

      {}
      {loading ? (
        <p>Cargando...</p>
      ) : error ? (
        <p className="text-danger">Error: {error}</p>
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
                    <span className="text-muted fst-italic">
                      No hay informes disponibles
                    </span>
                  ) : r.sinteticoId ? (
                    <Link
                      to={`/departamento/informe-sintetico/${r.sinteticoId}`}
                      className="btn btn-outline-primary btn-sm"
                    >
                      Ver informe sintético
                    </Link>
                  ) : (
                    <Link
                      to={`/departamento/generar-informe/${r.carrera.id}?ciclo=${cicloLectivo}&cuatrimestre=${cuatrimestre}`}
                      className="btn btn-primary btn-sm"
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
