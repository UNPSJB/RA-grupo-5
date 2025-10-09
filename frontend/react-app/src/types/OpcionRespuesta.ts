export interface OpcionRespuesta {
  opcionRespuesta: any;
}

export type Extras = {
  seleccionActual: number | string | null;
  onSeleccionar: (
    idPregunta: number | string,
    idOpcion: number | string
  ) => void;
};
