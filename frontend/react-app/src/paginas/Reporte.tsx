import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useReportes } from "../hook/useReportes";
import Table from "react-bootstrap/Table";


export default function Reporte(){
    const { id } = useParams<{ id: string }>();
    const { fetchReporteById } = useReportes();
    const [reporte, setReporte] = useState<any>(null);

    useEffect(() => {
        console.log("ID recibido:", id); // <-- Agrega este log
        if (id) {
            fetchReporteById(Number(id)).then((data) => {
                console.log("Datos recibidos:", data); // <-- Y este log
                setReporte(data);
            });
        }
    }, [id]);

    if (!reporte) return <p>Cargando reporte...</p>;

    return (
        <div>
            <h1>Reporte de {reporte.asignatura}</h1>
            <div className="container mt-4 ">
                <p className="">Año: {reporte.año}</p>
                <p>
                    <strong>Cursado:</strong> {reporte.cursado}
                </p>
            </div>
            <Table striped bordered hover size="sm">
                <thead>
                    <tr>
                        <th>Nombre del campo del reporte</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <h3>Contenido del campo del reporte:</h3>
                        <p>
                            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Itaque sunt dolorum fugit alias fugiat facilis incidunt totam accusamus esse recusandae. Aut necessitatibus ullam nulla maiores?
                        </p>
                    </tr>
                </tbody>
            </Table>
        </div>
    );
}