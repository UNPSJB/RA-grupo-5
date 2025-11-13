import { useReportes } from "../hook/useReportes";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";

export default function ReportesDisponibles() {
  const { reportes, loading, error } = useReportes();

  if (loading) return <p>Cargando reportes...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mt-3 p-4 border">
      <h2 className="m-3">Reportes Disponibles</h2>
      <Table className="table table-striped border mt-5">
        <thead>
          <tr className="border">
            <th>Asignatura</th>
            <th>Año</th>
            <th>Cursado</th>
            <th>Docente</th>
            <th>Carrera</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {reportes.length === 0 ? (
            <tr>
              <td colSpan={4}>No hay reportes disponibles.</td>
            </tr>
          ) : (
            reportes.map((reporte) => {
              const asignatura = reporte.encuesta_asignatura.asignatura;
              return (
                <tr key={reporte.id}>
                  <td>{asignatura.nombre}</td>
                  <td>{asignatura.año}</td>
                  <td>{asignatura.cursado}</td>
                  <td>{asignatura.nombre_docente}</td>
                  <td>{asignatura.carrera.nombre}</td>
                  <td>
                    {/* Ver Reporte siempre */}
                    <Link
                      to={`/docente/reportes/${reporte.id}`}
                      className="btn btn-secondary m-2"
                    >
                      Ver Reporte
                    </Link>

                    {/* Condicional según flags */}
                    {reporte.has_respuesta ? (
                      // Si ya fue respondido -> ver informe (necesita informe_id)
                      <Link
                        to={`/docente/informes/${reporte.informe_id}`}
                        className="btn btn-outline-primary m-2"
                      >
                        Ver Informe
                      </Link>
                    ) : (
                      <Link
                        to={`/docente/nuevo-informe/${reporte.id}`}
                        className="btn btn-primary m-2"
                      >
                        Nuevo Informe de Act.Curricular
                      </Link>
                    )}
                      {}
                       <Link
                       to={`/docente/estadisticas/${reporte.id}`}
                        className="btn btn-success m-2"
                      >
                        Ver Estadísticas
                      </Link>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </Table>
    </div>
  );
}
