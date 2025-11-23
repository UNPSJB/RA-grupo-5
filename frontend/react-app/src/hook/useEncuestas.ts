import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "../api/client";
// Importamos la interfaz centralizada
import type { EncuestaAsignatura } from "../types/Encuesta"; 

export function useEncuestas() {
  const [encuestasPendientes, setEncuestasPendientes] = useState<EncuestaAsignatura[]>([]);
  const [encuestasRespondidas, setEncuestasRespondidas] = useState<
    EncuestaAsignatura[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPendientes = async () => {
    try {
      setLoading(true);
      
      // El backend ya filtra por token: Cursada + Fechas + Estado Abierto + No Respondida
      const response = await apiFetch("/encuestas-asignaturas/pendientes");
      
      if (!response.ok) {
        throw new Error("Error al obtener las encuestas pendientes");
      }

      const data = await response.json();
      
      // El pequeño hack para el ciclo lectivo sigue siendo útil aquí
      // para asegurar que el frontend tenga el año aunque el backend no lo mande directo
      const dataConCiclo = data.map((e: any) => ({
        ...e,
        ciclo_lectivo: e.ciclo_lectivo || new Date(e.fecha_inicio).getFullYear()
      }));
      setEncuestasPendientes(data);
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message ?? "Error desconocido al cargar pendientes");
    } finally {
      setLoading(false);
    }
  };

  const fetchRespondidas = async () => {
    try {
      setLoading(true);

      const personaId = getPersonaIdFromToken();
      if (personaId == null) {
        throw new Error(
          "No se pudo determinar la persona logueada a partir del token"
        );
      }

      setEncuestas(dataConCiclo);

    } catch (err: any) {
      console.error(err);
      setError(err.message ?? "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPendientes();
    fetchRespondidas();
  }, []);

  return {
    loading,
    error,
    encuestasPendientes,
    encuestasRespondidas,

  };
}