import type { Asignatura } from "./Asignatura";
import type { Reporte } from "./Reporte";
// --- IMPORTS AÑADIDOS ---
import type { Respuesta } from "./Respuesta";
import type { InformeBase } from "./InformeBase";

enum EstadoInformeCurricular {
  abierto = "abierto",
  cerrado = "cerrado",
}

// Modelo de Informe Curricular para leer o listar un informe curricular
export interface InformeCurricular {
  id: number; 
  sede: string;
  ciclo_lectivo: number;
  docente: string;
  cant_alumnos_insc: number;
  cant_comisiones_teoricas: number;
  cant_comisiones_practicas: number;
  fecha_inicio: string;
  fecha_fin: string;
  estado: EstadoInformeCurricular;
  informe_curricular_base: InformeBase; 
  respuesta: Respuesta | null; 
  asignatura: Asignatura;
  reporte: Reporte;

}

// Payload para crear o actualizar un Informe Curricular
// (Esta interfaz no cambia, se usa solo para enviar datos, no para recibirlos)
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
  id_informe_curricular_base: number;
  id_asignatura: number;
  id_reporte: number;
}