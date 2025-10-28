import type { Asignatura } from "./Asignatura";
import type { EncuestaBase } from "./EncuestaBase";

    export interface EncuestaAsignatura {
        asignatura: Asignatura;
        encuesta_base: EncuestaBase;
        estado: string;
        fecha_inicio: string;
        fecha_fin: string;
        }