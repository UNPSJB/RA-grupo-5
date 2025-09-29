import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useEncuestas } from "../hook/useEcuestas";
//import Variable from "../componentes/Variable";

export default function Encuesta() {
  const { id } = useParams<{ id: string }>();
  const { fetchEncuestaById } = useEncuestas();
  const [encuesta, setEncuesta] = useState<any>(null);

  useEffect(() => {
    if (id) {
      fetchEncuestaById(Number(id)).then((data) => setEncuesta(data));
    }
  }, [id]);

  if (!encuesta) return <p>Cargando encuesta...</p>;

  return (
    <div>
      <h1>{encuesta.asignatura}</h1>
      <p>Estado: {encuesta.estado}</p>
      <p><strong>Carrera:</strong> {encuesta.carrera}</p>
      <p><strong>Sede:</strong> {encuesta.sede}</p>

      <h2>Variables asociadas</h2>
      {encuesta.variables && encuesta.variables.length > 0 ? (
        <ul>
          {encuesta.variables.map((v: any) => (
            <li key={v.id}>{v.nombre}</li>
          ))}
        </ul>
      ) : (
        <p>No hay variables asociadas.</p>
      )}
    </div>
  );
}