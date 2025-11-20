import { useState, useEffect } from "react";
import type { EncuestaAsignatura } from "../types/Encuesta";
import { apiFetch } from "../api/client";

export function useEncuestas() {
  const [encuestas, setEncuestas] = useState<EncuestaAsignatura[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const API_PATH = "/encuestas-asignaturas/";

  const fetchEncuestas = async () => {
    try {
      setLoading(true);

      const response = await apiFetch(API_PATH);
      if (!response.ok) {
        throw new Error("Error al obtener las encuestas");
      }

      const data = await response.json();
      setEncuestas(data);
      setError(null);
    } catch (err: any) {
      setError(err.message ?? "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEncuestas();
  }, []);

  return {
    encuestas,
    loading,
    error,
    refetch: fetchEncuestas,
  };
}
