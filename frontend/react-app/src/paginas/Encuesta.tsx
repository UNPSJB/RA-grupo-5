import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useEncuestas } from "../hook/useEcuestas";

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
    </div>
  );
}
