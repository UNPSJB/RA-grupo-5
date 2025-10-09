import type { PreguntaProps } from "../types/Preguntas";
import OpcionRespuesta from "./OpcionRespuesta";
import type { Extras } from "../types/OpcionRespuesta";

export default function Pregunta({
  pregunta,
  seleccionActual,
  onSeleccionar,
}: PreguntaProps & Extras) {
  return (
    <tr>
      <td style={{ width: "40%", fontWeight: "bold" }}>
        {pregunta.texto_pregunta}
      </td>

      {pregunta.opcionesRespuestas?.map((opcion: any) => {
        const idOpcion =
          opcion?.id ??
          opcion?.opcionRespuesta?.id ??
          opcion?.opcionRespuesta?.id_opcion ??
          opcion?.valor;

        return (
          <td key={idOpcion} style={{ textAlign: "center", minWidth: 90 }}>
            <OpcionRespuesta
              opcionRespuesta={opcion}
              seleccionada={seleccionActual === idOpcion}
              onSeleccionar={(id) => onSeleccionar(pregunta.id, id)}
            />
          </td>
        );
      })}
    </tr>
  );
}
