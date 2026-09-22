import type { Ciclo } from "./Ciclo";

export interface EncuestaBase {
    id: number;
    nombre: string;
    ciclo: Ciclo;
    variables?: any[];
    anio_inicio: number | null;
    anio_fin: number | null;
}