import type { EncuestaAsignatura } from "./EncuestaAsignatura";


export interface Reporte {
    id: number;
    encuesta_asignatura: EncuestaAsignatura;
    respuestas: any[];
    }