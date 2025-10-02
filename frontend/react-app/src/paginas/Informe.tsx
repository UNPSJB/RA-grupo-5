import {useState, useEffect} from "react";
import {useInformes} from "../hook/useInformes";
import {useParams} from "react-router-dom";
import Table from "react-bootstrap/Table";


export default function Informe() {
    const {id} = useParams<{id: string}>();
    const {fetchInformeById} = useInformes();
    const [informe, setInforme] = useState<any>(null);


useEffect(() => {
    console.log("ID recibido:", id); // <-- Agrega este log
    if (id) {
        fetchInformeById(Number(id)).then((data) => {
            console.log("Datos recibidos:", data); // <-- Y este log
            setInforme(data);
        });
    }
}, [id]);


if (!informe) return <p>Cargando informe...</p>;


return (
    <div>
        <h1>Informe de {informe.cod_act_curricular}</h1>
            <div className="container mt-4 ">
                <p className="">Estado: {informe.estado}</p>
                <p>
                    <strong>Sede:</strong> {informe.sede}
                </p>
                <p>
                    <strong>Ciclo Lectivo:</strong> {informe.ciclo_lectivo}
                </p>
            </div>
        <Table striped bordered hover size="sm">
            <thead>
                <tr>
                    <th>Necesidades de equipamiento</th>

                </tr>
            </thead>
            <tbody>
                <tr>
                    
                    <p>1: Indique en el caso que corresponda, las necesidades de equipamiento y actualización de bibliografía que considere prioritarias para su actuación docente. Asimismo, en caso de corresponder, indique los insumos básicos necesarios para el desarrollo de actividades prácticas, renovación o incorporación de equipamientos informáticos requeridos para el desarrollo de clases. (Por favor, verifique si lo solicitado en años anteriores  ya  se encuentra  disponible)</p>
                    
                </tr>
                <tr>
                    <textarea name="campo-1" id="campo-1"></textarea>
                </tr>
            </tbody>
        </Table>
    
    </div>
    

);
}