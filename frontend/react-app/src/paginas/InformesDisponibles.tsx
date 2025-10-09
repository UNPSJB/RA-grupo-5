import { useInformes } from "../hook/useInformes";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";

export default function InformesDisponibles() {
  const { informes, loading, error } = useInformes();

  if (loading) return <p>Cargando informes...</p>;
  if (error) return <p>Error: {error}</p>;

  const Cerrados = informes.filter((informe) => informe.estado === "cerrado");

  return (
    <div className="container mt-4">
      <h1>Informes Disponibles</h1>
      <Table className="table table-striped">
        <thead>
          <tr>
            <th>Cod. Asignatura</th>
            <th>Docente</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {Cerrados.length === 0 ? (
            <tr>
              <td colSpan={2}>No hay informes cerrados disponibles.</td>
            </tr>
          ) : (
            Cerrados.map((informe) => (
              <tr key={informe.id}>
                <td>{informe.cod_act_curricular}</td>
                <td>{informe.doc_responsable}</td>
                <td>
                  <Link
                    to={`/departamento/informes/${informe.id}`}
                    className="btn btn-primary m-2"
                  >
                  Ir a informe
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
