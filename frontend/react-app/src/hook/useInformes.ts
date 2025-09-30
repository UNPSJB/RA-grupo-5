import { useState, useEffect } from "react";
import type { Informe } from "../types/Informe";

enum EstadoInforme {
  abierto = "abierto",
  cerrado = "cerrado",
}

export function useInformes() {
  const [informes, setInformes] = useState<Informe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const API_URL = "http://localhost:8000/informes"; //definimos la URL como una const}
  return {};
}
