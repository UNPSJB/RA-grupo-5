// --- IMPORTAMOS LOS MODELOS CANÓNICOS ---
import type { Carrera } from "./models/Carrera";
import type { Asignatura } from "./models/Asignatura";
import type { InformeBase, Pregunta } from "./models/InformeBase";
import type { Respuesta, DetalleRespuesta, PreguntaOpcion } from "./models/Respuesta";
import type { InformeCurricular } from "./models/InformeCurricular";

// --- RE-EXPORTAMOS LOS TIPOS (buena práctica por si otros archivos los usan) ---
export type { 
  Carrera, 
  Asignatura, 
  Pregunta, 
  InformeBase, 
  PreguntaOpcion, 
  DetalleRespuesta, 
  Respuesta 
};

// Esta definición local se mantiene
export interface InformeSinteticoBase {
  id: number;
  titulo: string;
  // AÑADIMOS PREGUNTAS (basado en el schema del backend)
  preguntas: Pregunta[];
}

// ESTA INTERFAZ ES LA QUE CAMBIA
export interface InformeSinteticoCarrera {
  id: number;
  ciclo_lectivo: string;
  comision_asesora: string;
  sede: string;
  integrantes: string;
  id_carrera: number;

  id_informe_sintetico_base: number;
  carrera: Carrera;
  informe_sintetico_base: InformeSinteticoBase;
  informes_asignaturas: InformeCurricular[]; 
  respuesta: Respuesta | null;
}

// --- TODAS LAS DEFINICIONES DUPLICADAS (Asignatura, Pregunta, InformeBase, etc.) SE ELIMINARON ---