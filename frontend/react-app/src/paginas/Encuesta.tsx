import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useEncuestas } from "../hook/useEncuestas";
import Variable from "../componentes/Variable";

export default function Encuesta() {
  const { id } = useParams<{ id: string }>();
  const { fetchEncuestaById } = useEncuestas();
  const [encuesta, setEncuesta] = useState<any>(null);

  // Mapa: preguntaId -> opcionId
  const [respuestas, setRespuestas] = useState<
    Record<string | number, string | number>
  >({});

  useEffect(() => {
    if (id) {
      fetchEncuestaById(Number(id)).then((data) => setEncuesta(data));
    }
  }, [id]);

  const handleSeleccionar = (
    idPregunta: number | string,
    idOpcion: number | string
  ) => {
    setRespuestas((prev) => ({ ...prev, [idPregunta]: idOpcion }));
    //acá podríamos llamar al backend u otro hook para guardar la respuesta
  };

  if (!encuesta) return <p>Cargando encuesta...</p>;

  return (
    <div>
      <h1>{encuesta.asignatura}</h1>
      <p>Estado: {encuesta.estado}</p>
      <p>
        <strong>Carrera:</strong> {encuesta.carrera}
      </p>
      <p>
        <strong>Sede:</strong> {encuesta.sede}
      </p>
      {encuesta.variables?.map((variable: any) => (
        <Variable
          key={variable.id}
          variable={variable}
          getSeleccion={(idPregunta: number | string) =>
            respuestas[idPregunta] ?? null
          }
          onSeleccionar={handleSeleccionar}
        />
      ))}
    </div>
  );
}
