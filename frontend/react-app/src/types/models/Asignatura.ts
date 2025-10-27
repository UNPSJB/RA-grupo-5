import type { Cursado } from "./Cursado";
 
export interface Asignatura {
    id: number;
    nombre: string;
    nombre_docente: string;
    año: number;
<<<<<<< Updated upstream
    carrera: string;
=======
>>>>>>> Stashed changes
    cursado: Cursado;
}