// --- Interfaces para LEER la encuesta ---

// Corresponde a OpcionRespuestaRead
export interface OpcionRespuesta {
  id: number;
  texto_opcion: string;
}

// Corresponde a PreguntaOpcionRead
export interface PreguntaOpcion {
  id: number; // Este es el ID clave para guardar la respuesta
  id_pregunta: number;
  id_opcion_respuesta?: number;
  opcion_respuesta?: OpcionRespuesta;
}

// Corresponde a PreguntaRead
export interface Pregunta {
  id: number;
  texto_pregunta: string;
  tipo: 'single_choice' | 'multiple_choice' | 'open';
  obligatoria: Boolean;
  pregunta_opcion: PreguntaOpcion[];
  // No necesitamos las subpreguntas por ahora para este hook
}

// Corresponde a VariableRead
export interface Variable {
  id: number;
  nombre: string;
  preguntas: Pregunta[];
}

// Corresponde a EncuestaBaseRead
export interface EncuestaBase {
  id: number;
  nombre: string;
  variables: Variable[];
}

// Corresponde a AsignaturaRead
export interface Asignatura {
  id: number;
  nombre: string;
  año: number; // <-- ¡Asegúrate de que esta línea exista!
  nombre_docente: string;
  cursado: string; // <-- ¡Asegúrate de que esta línea exista!
  carrera: string;
  sede: string;
}
// Corresponde a EncuestaAsignaturaRead (pero solo usamos partes)
export interface EncuestaAsignatura {
  id: number;
  id_encuesta_base: number;
  id_asignatura: number;
  fecha_inicio: string; 
  fecha_fin: string; 
  estado: "abierta" | "cerrada"; 
  asignatura: Asignatura; 
}


// --- Interfaces para ESCRIBIR las respuestas ---

// Corresponde a DetalleRespuestaCreate
export interface DetalleRespuestaCreate {
  id_pregunta_opcion: number;
  texto_respuesta_abierta?: string;
}

// Corresponde a RespuestaCreate
export interface RespuestaCreate {
  id_persona: number;
  id_encuesta_asignatura: number;
  detalles: DetalleRespuestaCreate[];
}