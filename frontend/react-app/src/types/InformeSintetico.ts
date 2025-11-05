export interface Carrera {
    id: number;
    nombre: string;
    sede: string;
}

export interface InformeSinteticoBase {
    id: number;
    titulo: string;
    comision_asesora: string;
    sede: string;
    integrantes: number;
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

export interface InformeAsignatura {
    id: number;
    sede: string; 
    ciclo_lectivo: number;
    docente: string;
    cant_alumnos_insc: number;
    asignatura: Asignatura;
    respuestas: Respuesta[];
    informe_base: InformeBase;
}

export interface InformeSinteticoCarrera {
    id: number;
    ciclo_lectivo: string;
    comision_asesora: string;
    sede: string;
    integrantes: string;
    id_carrera: number;
    id_informe_sintetico: number;
    carrera: Carrera;
    informe_sintetico: InformeSinteticoBase;
    
    informes_asignaturas: InformeAsignatura[];
}