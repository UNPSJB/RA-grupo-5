import type { Cursado } from "./Cursado";
 
export interface Asignatura {
    id: number;
    nombre: string;
    nombre_docente: string;
    año: number;
    cursado: Cursado;
}