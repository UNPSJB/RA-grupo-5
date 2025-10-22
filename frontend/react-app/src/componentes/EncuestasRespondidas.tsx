import { useEncuestas } from "../hook/useEncuestas";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";

export default function EncuestasRespondidas() {
  const { encuestas, loading, error } = useEncuestas();

  if (loading) return <p>Cargando encuestas...</p>;
  if (error) return <p>Error: {error}</p>;

  const Respondidas = encuestas.filter(
    (encuesta) => encuesta.estado === "cerrada"
  );

  return (
    <div className="container mt-4 p-4 border">
      <h1 className="m-3">Encuestas Respondidas</h1>
      <Table className="table table-striped border mt-5">
        <thead>
          <tr className="border">
            <th>Asignatura</th>
            <th>Año</th>
            <th>Cursado</th>
            <th>Fecha Fin</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {Respondidas.length === 0 ? (
            <tr>
              <td colSpan={5}>No hay encuestas pendientes.</td>
            </tr>
          ) : (
            Respondidas.map((encuesta) => (
              <tr key={encuesta.id}>
                <td>{encuesta.asignatura?.nombre}</td>
                <td>{encuesta.asignatura?.año}</td>
                <td>{encuesta.asignatura?.cursado}</td>
                <td>{encuesta.fecha_fin}</td>
                <td>
                  <Link
                    to={`/alumno/encuestas/${encuesta.id}`}
                    className="btn btn-primary m-2"
                  >
                    Ir a encuesta
                  </Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
}
