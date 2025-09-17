import { useEncuestas } from "../hook/useEcuestas";
import Table from 'react-bootstrap/Table';

export default function EncuestasPendientes() {
    //Parametros para usar el hook useEncuestas
    const { encuestas, loading, error } = useEncuestas();
    // hook que provee la función de navegación (react-router-dom )


    if (loading) return <p>Cargando encuestas...</p>;
    if (error) return <p>Error: {error}</p>;


    const Pendientes = encuestas.filter(encuesta => encuesta.estado === "abierta");

    return (
        < >
            <div className="container text-center m-4">
                <h1>Encuestas Pendientes</h1>
            </div>
            <div className="container m-2 border border-dark border-1.5 rounded">
                <Table className=" table table-hover ">
                    <thead className="text-center">
                        <tr>
                            <th>Asignatura</th>
                            <th>cursado</th>
                            <th>Fecha de cierre</th>
                        </tr>
                    </thead>  
                    <tbody className="text-center">
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
            </div>
        </>
    );
}