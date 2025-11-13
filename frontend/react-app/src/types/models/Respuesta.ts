// (Contenido extraído de InformeSintetico.ts)

export interface PreguntaOpcion {
  id: number;
  id_pregunta: number; 
  id_opcion_respuesta: number | null;
}

export interface DetalleRespuesta {
  id: number;
  texto_respuesta_abierta: string | null;
  pregunta_opcion: PreguntaOpcion; 
}

export interface Respuesta {
  id: number;
  id_persona: number;
  detalles: DetalleRespuesta[];
}