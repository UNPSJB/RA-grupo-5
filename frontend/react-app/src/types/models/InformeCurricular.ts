enum EstadoInformeCurricular {
  abierto = "abierto",
  cerrado = "cerrado",
}

export interface InformeCurricular {
  id: number;
  estado: EstadoInformeCurricular;
  sede: string;
  ciclo_lectivo: string;
  cod_act_curricular: string;
  doc_responsable: string;
  cant_alu_inscriptos: number;
  cant_com_teoricas: number;
  cant_com_practicas: number;
}