// (Opcional, pero recomendado) Importa el tipo real de 'Variable'
import type { Variable as ApiVariable } from './Encuesta'; 

// 1. Define el tipo de pregunta (necesario para 'onSeleccionar')
export type TipoPregunta = 'open' | 'single_choice' | 'multiple_choice';

// 2. Define las props base del componente
export interface VariableProps {
  variable: ApiVariable | any; // 'any' por si no quieres importar ApiVariable
}

// 3. Define las props extra que vienen de la página (el "pegamento")
export type Extras = {
  /** Función para obtener la respuesta actual de una pregunta */
  getSeleccion: (idPregunta: number) => any;

  /** * Función para actualizar la respuesta de una pregunta.
   * Debe tener 3 argumentos para que el hook 'useResponderEncuesta' funcione.
   */
  onSeleccionar: (
    idPregunta: number,
    valor: number | string,
    tipo: TipoPregunta 
  ) => void;
};

// 4. Combina ambos tipos en el 'Props' final que usa tu componente
export type Props = VariableProps & Extras;