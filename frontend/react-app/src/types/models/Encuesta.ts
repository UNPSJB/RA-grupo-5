import type { Asignatura } from "./Asignatura";
import type { EncuestaBase } from "./EncuestaBase";
import type { EstadoEncuesta } from "./EstadoEncuesta";



export interface Encuesta{
    id: number;
    id_asignatura: number;
    id_encuesta_base: number;
    estado: EstadoEncuesta;  
    asignatura?: Asignatura;
    encuesta_base?: EncuestaBase;
}