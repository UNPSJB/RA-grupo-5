export interface VariableProps {
  variable: any;
}

export type Props = VariableProps & Extras;

export type Extras = {
  getSeleccion: (idPregunta: number | string) => number | string | null;
  onSeleccionar: (
    idPregunta: number | string,
    idOpcion: number | string
  ) => void;
};