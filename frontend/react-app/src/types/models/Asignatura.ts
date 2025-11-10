import type { Cursado } from "./Cursado";
import type { Carrera } from "./Carrera";

export interface Asignatura {
    id: number;
    nombre: string;
    nombre_docente: string;
    año: number;
    carrera: Carrera;
    cursado: Cursado;
}