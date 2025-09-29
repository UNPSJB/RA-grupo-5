import { useEncuestas } from "../hook/useEncuestas";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";

export default function EncuestasPendientes() {
    const { encuestas, loading, error } = useEncuestas();

    if (loading) return <p>Cargando encuestas...</p>;
    if (error) return <p>Error: {error}</p>;

    const Pendientes = encuestas.filter(
    (encuesta) => encuesta.estado === "abierta"
    );

    return (
    <div className="container mt-4">
        <h1>Encuestas Pendientes</h1>
        <Table className="table table-striped">
        <thead>
            <tr>
            <th>Asignatura</th>
            <th>Año</th>
            <th>Cursado</th>
            <th>Fecha Fin</th>
            <th>Acciones</th>
            </tr>
        </thead>
            <tbody>
            {Pendientes.length === 0 ? (
            <tr>
                <td colSpan={5}>No hay encuestas pendientes.</td>
            </tr>
            ) : (
            Pendientes.map((encuesta) => (
                <tr key={encuesta.id}>
                <td>{encuesta.asignatura}</td>
                <td>{encuesta.año}</td>
                <td>{encuesta.cursado}</td>
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