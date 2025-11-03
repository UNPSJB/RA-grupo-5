import type { Asignatura } from "./Asignatura";
import type { Reporte } from "./Reporte";

enum EstadoInformeCurricular {
  abierto = "abierto",
  cerrado = "cerrado",
}


// Modelo de Informe Curricular para leer o listar un informe curricular
export interface InformeCurricular {
  id: number; // 
  sede: string; 
  ciclo_lectivo: number;
  docente: string;
  cant_alumnos_insc: number;
  cant_comisiones_teoricas: number;
  cant_comisiones_practicas: number;
  fecha_inicio: string; 
  fecha_fin: string;   
  estado: EstadoInformeCurricular;
  id_informe_base: number;
  asignatura: Asignatura;
  reporte: Reporte;
}


// Payload para crear o actualizar un Informe Curricular
export interface InformeCurricularPayload {
  fecha_inicio: string;
  fecha_fin: string;
  estado: string;
  sede: string;
  ciclo_lectivo: number;
  docente: string;
  cant_alumnos_insc: number;
  cant_comisiones_teoricas: number;
  cant_comisiones_practicas: number;
  id_informe_base: number;
  id_asignatura: number;
  id_reporte: number;
}
