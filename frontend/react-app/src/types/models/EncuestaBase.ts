import type { Ciclo } from "./Ciclo";

export interface EncuestaBase {
    id: number;
    nombre: string;
    ciclo: Ciclo;
    variables?: any[];
    }