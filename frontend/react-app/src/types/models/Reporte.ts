import type { EncuestaAsignatura } from "./EncuestaAsignatura";

export interface Reporte {
  id: number;
  encuesta_asignatura: EncuestaAsignatura;
  respuestas: any[];
}

export type ReporteListadoItem = {
  id: number;
  has_informe: boolean;
  has_respuesta: boolean;
  informe_id: number | null;
};
