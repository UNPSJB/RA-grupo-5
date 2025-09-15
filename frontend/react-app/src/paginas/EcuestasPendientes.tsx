import { useEncuestas } from "../hook/useEcuestas";
import Table from 'react-bootstrap/Table';

export default function EncuestasPendientes() {
    const { encuestas, loading, error, refetch } = useEncuestas();

    if (loading) return <p>Cargando encuestas...</p>;
    if (error) return <p>Error: {error}</p>;

    const Pendientes = encuestas.filter(encuesta => encuesta.estado === "abierta");

    return (
        <div className="container mt-4" >
            <h1>Encuestas Pendientes</h1>
            <Table className="table table-striped">
                <thead>
                    <tr>
                        <th>Asignatura</th>
                        <th>cursado</th>
                        <th>fecha_fin</th>
                    </tr>
                </thead>  
                <tbody>
                    {Pendientes.length === 0 ? (
                    <tr>
                        <td colSpan={2}>No hay encuestas pendientes.</td>
                    </tr>
                    ) : (
                    Pendientes.map((encuesta) => (
                        <tr key={encuesta.id}>
                            <td>
                                {encuesta.asignatura}
                            </td>
                            <td>
                                {encuesta.cursado}
                            </td>
                            <td>
                                {encuesta.fecha_fin}
                            </td>
                        </tr>
                    ))
                    )}
                </tbody>      
                
            </Table >
            <button onClick={refetch} className="btn btn-primary m-4">Refrescar</button>
        </div>
    );
}