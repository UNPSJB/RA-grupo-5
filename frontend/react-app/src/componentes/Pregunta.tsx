import type { PreguntaProps } from "../types/models/Preguntas";
import OpcionRespuesta from "./OpcionRespuesta";
import type { Extras } from "../types/models/OpcionRespuesta";

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
      {pregunta.tipo === "open" ? (
        <td style={{ textAlign: "center", minWidth: 400 }}>
          <textarea
            placeholder="Escriba su respuesta aquí"
            value={seleccionActual || ""}
            onChange={(e) => onSeleccionar(pregunta.id, e.target.value)}
            rows={3}
            style={{
              //mover a la carpeta de syles...
              width: "100%",
              resize: "vertical",
              padding: "6px",
              fontSize: "0.95rem",
            }}
          />
        </td>
      ) : (
        pregunta.opcionesRespuestas?.map((opcion: any) => {
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
        })
      )}
    </tr>
  );
}
