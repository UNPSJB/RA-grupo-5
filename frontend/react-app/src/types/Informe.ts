enum EstadoInforme {
  abierto = "abierto",
  cerrado = "cerrado",
}

export interface Informe {
  id: number;
  estado: EstadoInforme;
  sede: string;
  ciclo_lectivo: string;
  cod_act_curricular: string;
  doc_responsable: string;
  cant_alu_inscriptos: number;
  cant_com_teoricas: number;
  cant_com_practicas: number;
}
