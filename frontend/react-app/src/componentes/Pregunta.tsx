import OpcionRespuesta from "./OpcionRespuesta";
import type { PreguntaProps } from "../types/Preguntas"; 

export default function Pregunta({
  pregunta,
  seleccionActual,
  onSeleccionar,
}: PreguntaProps) {  
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
            onChange={(e) => 
              onSeleccionar(pregunta.id, e.target.value, 'open')
            } 
            rows={3}
            style={{ width: "100%", resize: "vertical", padding: "6px", fontSize: "0.95rem" }}
          />
        </td>
      ) : (
        pregunta.pregunta_opcion?.map((opcion: any) => { 
          
          const idOpcionAGuardar = opcion.id_opcion_respuesta;

          return (
            <td key={opcion.id} style={{ textAlign: "center", minWidth: 90 }}>
              <OpcionRespuesta
                opcionRespuesta={opcion.opcion_respuesta} 
                seleccionada={
                  pregunta.tipo === 'multiple_choice' 
                    ? seleccionActual?.includes(idOpcionAGuardar)
                    : seleccionActual === idOpcionAGuardar
                }
                onSeleccionar={(idDelBoton) => 
                  onSeleccionar(pregunta.id, idDelBoton, pregunta.tipo) 
                }
              />
            </td>
          );
        })
      )}
    </tr>
  );
}