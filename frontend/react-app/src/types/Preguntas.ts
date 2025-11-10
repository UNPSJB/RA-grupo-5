// (Asumo que este archivo está en 'types/Pregunta.ts')

// 1. (Opcional, pero recomendado) Importa el tipo real de 'Pregunta'
import type { Pregunta as ApiPregunta } from './Encuesta';

// 2. Define el tipo de pregunta (lo necesitamos para el 'tipo')
export type TipoPregunta = 'open' | 'single_choice' | 'multiple_choice';

// 3. Esta es la interfaz corregida y completa
export interface PreguntaProps {
  
  // La pregunta que viene de la API
  pregunta: ApiPregunta | any; // Usamos 'any' por si no quieres importar ApiPregunta

  // 👇 4. AÑADE LAS PROPS QUE FALTABAN:
  
  /** El valor/respuesta actual para esta pregunta */
  seleccionActual: any; // Puede ser string, number, number[], o null

  /** * La función que se llama cuando el usuario responde.
   * Debe tener 3 argumentos para que el hook 'useResponderEncuesta' funcione.
   */
  onSeleccionar: (
    idPregunta: number,
    valor: number | string,
    tipo: TipoPregunta 
  ) => void;
}