//tipo genérico que representa la plantilla de cualquier informe

export interface Pregunta {
  id: number;
  texto_pregunta: string;
  tipo: string;
  codigo: string | null; 
}

export interface InformeBase {
  id: number;
  titulo: string;
  preguntas: Pregunta[]; 
}