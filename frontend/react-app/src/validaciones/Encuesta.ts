import { z } from 'zod';
import type { EncuestaBase } from '../types/Encuesta';

// Esta función está bien, no cambia
export const obtenerNombreCampo = (preguntaId: number): string => {
  return `pregunta_${preguntaId}`;
};


export function construirEsquemaEncuesta(encuesta: EncuestaBase) {

  const shape: Record<string, z.ZodTypeAny> = {};

  encuesta.variables.forEach(variable => {
    variable.preguntas.forEach(pregunta => {

      const fieldName = obtenerNombreCampo(pregunta.id);
      let rule: z.ZodTypeAny; 

      switch (pregunta.tipo) {
        
        case 'open':
          rule = z.string().optional(); // Siempre opcional
          break;

        case 'single_choice':
          if (pregunta.obligatoria) {
            
            // --- ¡AQUÍ ESTÁ LA CORRECCIÓN! ---
            // 1. Empezamos permitiendo que sea 'number' o 'null'.
            rule = z.number().nullable()
              // 2. Añadimos un 'refine' que falla si el valor es null.
              .refine(val => val !== null, {
                message: "Debe seleccionar una opción" 
              });

          } else {
            // Si no es obligatoria, 'null' está bien.
            rule = z.number().nullable().optional(); 
          }
          break;

        default:
          rule = z.any();
      }

      shape[fieldName] = rule;
    });
  });

  return z.object(shape);
}


export function construirValoresPorDefecto(encuesta: EncuestaBase) {
  const defaults: Record<string, any> = {};
  encuesta.variables.forEach(variable => {
    variable.preguntas.forEach(pregunta => {
      const fieldName = obtenerNombreCampo(pregunta.id);
      switch (pregunta.tipo) {
        case 'open':
          defaults[fieldName] = '';
          break;
        case 'single_choice':
          defaults[fieldName] = null; // El valor por defecto es null
          break;
        default:
          defaults[fieldName] = undefined;
      }
    });
  });
  return defaults;
}