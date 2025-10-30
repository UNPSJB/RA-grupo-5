import { z } from 'zod';
import type { EncuestaBase, Pregunta } from '../types/Encuesta';

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
            if (pregunta.obligatoria) {
                rule = z.string().min(1, 'Esta respuesta es obligatoria');
            } else {
                rule = z.string().optional();
        }
        break;

        case 'single_choice':
            if (pregunta.obligatoria) {
                rule = z.number(); 
            } else {
                rule = z.number().nullable().optional(); 
            }
        break;

        case 'multiple_choice':
            if (pregunta.obligatoria) {
                rule = z.array(z.number()).min(1, 'Debe seleccionar al menos una opción');
            } else {
                rule = z.array(z.number()); 
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
            defaults[fieldName] = null;
            break;
            case 'multiple_choice':
            defaults[fieldName] = [];
            break;
        default:
            defaults[fieldName] = undefined;
    }
    });
});
return defaults;
}