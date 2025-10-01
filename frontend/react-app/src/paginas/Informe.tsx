import {useState, useEffect} from "react";
import {useInformes} from "../hook/useInformes";
import {useParams} from "react-router-dom";



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
        <p>Estado: {informe.estado}</p>
        <p>
            <strong>Sede:</strong> {informe.sede}
        </p>
        <p>
            <strong>Ciclo Lectivo:</strong> {informe.ciclo_lectivo}
        </p>
    </div>
);
}