import { useReportes } from "../hook/useReportes";  
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";

export default function ReportesDisponibles() {
    const { reportes, loading, error } = useReportes();

    if (loading) return <p>Cargando reportes...</p>;
    if (error) return <p>Error: {error}</p>;
return (
    <div className="container mt-4">
        <h1>Reportes Disponibles</h1>
        <Table className="table table-striped">
        <thead>
            <tr>
            <th>Asignatura</th>
            <th>Año</th>
            <th>Cursado</th>
            <th>Acciones</th>
            </tr>
        </thead>
            <tbody>
            {reportes.length === 0 ? (
            <tr>
                <td colSpan={4}>No hay reportes disponibles.</td>
            </tr>
            ) : (
            reportes.map((reporte) => (
                <tr key={reporte.id}>
                <td>{reporte.asignatura}</td>
                <td>{reporte.año}</td>
                <td>{reporte.cursado}</td>
                <td>
                    <Link
                    to={`/Docente/reportes/${reporte.id}`}
                    className="btn btn-primary m-2"
                    >
                    ir a reporte  
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