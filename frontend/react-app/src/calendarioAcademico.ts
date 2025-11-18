// En: frontend/react-app/src/config/academicCalendar.ts

/**
 * ¡IMPORTANTE! Los meses en JavaScript se cuentan desde 0:
 * Enero = 0, Febrero = 1, Marzo = 2, Abril = 3, Mayo = 4, Junio = 5,
 * Julio = 6, Agosto = 7, Septiembre = 8, Octubre = 9, Noviembre = 10, Diciembre = 11
 */

// --- 1. VENTANAS PARA RESPONDER ENCUESTAS (ALUMNOS) --- un mes para responder cada cuatri
const ENCUESTA_C1_START = new Date(2025, 6, 1); //julio
const ENCUESTA_C1_END = new Date(2025, 6, 30);  
const ENCUESTA_C2_START = new Date(2025, 11, 1);  //diciembre
const ENCUESTA_C2_END = new Date(2025, 11, 30);  

// --- 2. VENTANAS PARA GENERAR INFORMES CURRICULARES (DOCENTES) ---
// Período C1 
const IC_C1_START = new Date(2025, 7, 1);//agosto
const IC_C1_END = new Date(2025, 10, 30); //noviembre

// Período C2/Anual 
const IC_C2_START = new Date(2025, 11, 1); //diciembre
const IC_C2_END = new Date(2026, 1, 30); //febrero

// --- 3. VENTANAS PARA GENERAR INFORMES SINTÉTICOS (DEPARTAMENTO) ---

// Período C1
const IS_C1_START = new Date(2025, 11, 1); //diciembre
const IS_C1_END = new Date(2026, 1, 30); //febrero

// Período C2/Anual 
const IS_C2_START = new Date(2026, 2, 1); //marzo  
const IS_C2_END = new Date(2026, 4, 1);  //mayo


const CUATRIMESTRE_1 = "cuatrimestre 1";
const CUATRIMESTRE_2 = "cuatrimestre 2";
const ANUAL = "anual";

/**
 * FUNCIÓN PARA DOCENTES (Informes Curriculares)
 * Verifica si se puede generar un Informe Curricular (Reporte)
 */
export function isGeneracionInformeCurricularActiva(cursado: string, today: Date): boolean {
  if (cursado === CUATRIMESTRE_1) {
    return today >= IC_C1_START && today <= IC_C1_END;
  }
  
  if (cursado === CUATRIMESTRE_2 || cursado === ANUAL) {
    return today >= IC_C2_START && today <= IC_C2_END;
  }
  return false;
}

/**
 * FUNCIÓN PARA DEPARTAMENTO (Informes Sintéticos)
 * Verifica si se puede generar un Informe Sintético
 */
export function isGeneracionInformeSinteticoActivo(cursado: string, today: Date): boolean {
  if (cursado === CUATRIMESTRE_1) {
    return today >= IS_C1_START && today <= IS_C1_END;
  }
  
  if (cursado === CUATRIMESTRE_2 || cursado === ANUAL) {
    return today >= IS_C2_START && today <= IS_C2_END;
  }
  return false;
}

/**
 * FUNCIÓN PARA ALUMNOS (Encuestas)
 * Verifica si se puede responder una Encuesta
 */
export function isRespuestaEncuestaActiva(cursado: string, today: Date): boolean {
  if (cursado === CUATRIMESTRE_1) {
    return today >= ENCUESTA_C1_START && today <= ENCUESTA_C1_END;
  }
  
  if (cursado === CUATRIMESTRE_2 || cursado === ANUAL) {
    return today >= ENCUESTA_C2_START && today <= ENCUESTA_C2_END;
  }
  return false;
}

// (Opcional) Puedes añadir también una función para hardcodear la fecha de prueba
export function getToday(): Date {
  return new Date(); //fecha actual
  
  // Opción B: Fecha Fija para Pruebas (descomenta la que necesites)
  // return new Date(2025, 7, 15); // Simula Agosto 2025 (Permite IC C1)
  // return new Date(2025, 11, 15); // Simula Diciembre 2025 (Permite IC C2 e IS C1)
  // return new Date(2025, 4, 15); // Simula Mayo 2025 (No permite nada)
}