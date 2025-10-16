import { useInformesCurriculares } from "../hook/useInformesCurriculares";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";

export default function InformesCurricularesDisponibles() {
  const { informesCurriculares, loading, error } = useInformesCurriculares();

  if (loading) return <p>Cargando informes...</p>;
  if (error) return <p>Error: {error}</p>;

  const Cerrados = informesCurriculares.filter((informe) => informe.estado === "cerrado");

  return (
    <div className="container mt-3 p-4  border">
      <h2 className="m-3">Informes Disponibles</h2>
      <Table className="table table-striped border mt-5">
        <thead>
          <tr className="border">
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
                    className="btn btn-primary m-2 sm"
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
