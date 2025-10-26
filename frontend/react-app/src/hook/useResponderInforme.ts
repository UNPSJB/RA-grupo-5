// hook/useResponderInforme.ts
import { useState, useCallback } from "react";

const API_URL = "http://localhost:8000"; // ajustá si usás /api

export function useResponderInforme() {
  // answersByPreguntaOpcion[id_pregunta_opcion] = "texto que escribió el docente"
  const [answersByPreguntaOpcion, setAnswersByPreguntaOpcion] = useState<
    Record<number, string>
  >({});

  // cuando el docente escribe en un textarea:
  const setTextoRespuesta = useCallback(
    (id_pregunta_opcion: number, texto: string) => {
      setAnswersByPreguntaOpcion((prev) => ({
        ...prev,
        [id_pregunta_opcion]: texto,
      }));
    },
    []
  );

  // guardar TODO en backend:
  // idPersona: el docente actual (tarde o temprano vas a tenerlo)
  // idInformeAsignatura: el informe que acabamos de crear con crearInformeCurricular
  const guardarRespuestasInforme = useCallback(
    async (idPersona: number, idInformeAsignatura: number) => {
      // transformamos nuestro estado a la forma que tu backend espera:
      // {
      //   id_persona,
      //   id_informe_asignatura,
      //   detalles: [{ id_pregunta_opcion, texto_respuesta_abierta }, ...]
      // }

      const detalles = Object.entries(answersByPreguntaOpcion).map(
        ([id_pregunta_opcion_str, texto_respuesta_abierta]) => ({
          id_pregunta_opcion: Number(id_pregunta_opcion_str),
          texto_respuesta_abierta,
        })
      );

      const payload = {
        id_persona: idPersona,
        id_informe_asignatura: idInformeAsignatura,
        detalles,
      };

      const res = await fetch(`${API_URL}/respuestas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("No se pudieron guardar las respuestas del informe");
      }

      return await res.json();
    },
    [answersByPreguntaOpcion]
  );

  return {
    answersByPreguntaOpcion,
    setTextoRespuesta,
    guardarRespuestasInforme,
  };
}
