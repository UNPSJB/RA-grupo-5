import { useInformesSinteticos } from "../hook/useInformesSinteticos";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";

export default function TablaInformeSintetico() {
  const { resumenes, loading, error } = useInformesSinteticos();

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;
    console.log("Resumenes:", resumenes);

  return (
    <div className="container mt-4 p-4 border">
      <h2 className="mb-4">Resumen por Carrera</h2>
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
                {r.sinteticoId ? (               //si tiene un informe sintetico asociado muestra el boton para verlo
                  <Link
                    to={`/departamento/informe-sintetico/${r.sinteticoId}`}
                    className="btn btn-outline-primary"
                  >
                    Ver informe sintético
                  </Link>
                ) : (           //si no tiene un informe sintetico asociado muestra el boton para generarlo
                  <Link
                    to={`/departamento/generar-informe/${r.carrera.id}`}
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
    </div>
  );
}


