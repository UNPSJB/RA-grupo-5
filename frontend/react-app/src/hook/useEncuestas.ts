import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "../api/client";
// Importamos la interfaz centralizada
import type { EncuestaAsignatura } from "../types/Encuesta"; 

export function useEncuestas() {
  const [encuestas, setEncuestas] = useState<EncuestaAsignatura[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const API_PATH = "/encuestas-asignaturas/";

  const fetchEncuestas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiFetch(API_PATH);
      
      if (!response.ok) {
        throw new Error("Error al obtener las encuestas");
      }

      const data = await response.json();
      
      // El pequeño hack para el ciclo lectivo sigue siendo útil aquí
      // para asegurar que el frontend tenga el año aunque el backend no lo mande directo
      const dataConCiclo = data.map((e: any) => ({
        ...e,
        ciclo_lectivo: e.ciclo_lectivo || new Date(e.fecha_inicio).getFullYear()
      }));

      setEncuestas(dataConCiclo);

    } catch (err: any) {
      console.error(err);
      setError(err.message ?? "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEncuestas();
  }, [fetchEncuestas]);

  return {
    encuestas,
    loading,
    error,
    refetch: fetchEncuestas,
  };
}