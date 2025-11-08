export interface Carrera {
  id: number;
  nombre: string;
  sede: string;
}

// CORREGIDA: Molde del informe sintético (solo id y titulo)
export interface InformeSinteticoBase {
  id: number;
  titulo: string;
}

export interface Asignatura {
  id: number;
  nombre: string;
  año: number;
  nombre_docente: string;
}

export interface Pregunta {
  id: number;
  texto_pregunta: string;
  tipo: string;
  codigo: string | null; 
}

// Base del informe curricular (Anexo I)
export interface InformeBase {
  id: number;
  titulo: string;
  preguntas: Pregunta[]; 
}

export interface PreguntaOpcion {
  id: number;
  pregunta: Pregunta;
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

// --- CORREGIDA ---
// Instancia del informe de asignatura (Anexo I)
export interface InformeAsignatura {
  id: number;
  sede: string; 
  ciclo_lectivo: number;
  docente: string;
  cant_alumnos_insc: number;
  asignatura: Asignatura;

  // 1. Corregido: 'respuesta' (singular y opcional)
  respuesta: Respuesta | null;

  // 2. Corregido: 'informe_curricular_base'
  informe_curricular_base: InformeBase;
}

// --- CORREGIDA ---
// Instancia del informe sintético (Anexo II)
export interface InformeSinteticoCarrera {
  id: number;
  ciclo_lectivo: string;
  comision_asesora: string;
  sede: string;
  integrantes: string;
  id_carrera: number;

  // 3. Corregido: 'id_informe_sintetico_base'
  id_informe_sintetico_base: number;
  carrera: Carrera;

  // 4. Corregido: 'informe_sintetico_base'
  informe_sintetico_base: InformeSinteticoBase;
  
  // Usará la interfaz 'InformeAsignatura' corregida de arriba
  informes_asignaturas: InformeAsignatura[];
}