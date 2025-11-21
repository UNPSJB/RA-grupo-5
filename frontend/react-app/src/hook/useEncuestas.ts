import { useState, useEffect } from "react";
import type { EncuestaAsignatura } from "../types/Encuesta";
import { apiFetch } from "../api/client";

// Helper local para sacar persona_id del JWT
function getPersonaIdFromToken(): number | null {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payloadBase64 = token.split(".")[1];
    const payloadJson = atob(payloadBase64);
    const payload = JSON.parse(payloadJson);
    return typeof payload.persona_id === "number" ? payload.persona_id : null;
  } catch (e) {
    console.error("No se pudo decodificar el token JWT", e);
    return null;
  }
}

export function useEncuestas() {
  const [encuestas, setEncuestas] = useState<EncuestaAsignatura[]>([]);
  const [encuestasRespondidas, setEncuestasRespondidas] = useState<
    EncuestaAsignatura[]
  >([]);
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

  const fetchRespondidas = async () => {
    try {
      setLoading(true);

      const personaId = getPersonaIdFromToken();
      if (personaId == null) {
        throw new Error(
          "No se pudo determinar la persona logueada a partir del token"
        );
      }

      const response = await apiFetch(
        `/encuestas-asignaturas/alumno/${personaId}`
      );
      if (!response.ok) {
        throw new Error("Error al cargar encuestas respondidas");
      }

      const data = await response.json();
      setEncuestasRespondidas(data);
      setError(null);
    } catch (err: any) {
      setError(err.message ?? "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEncuestas();
    fetchRespondidas();
  }, []);

  return {
    encuestas,
    loading,
    error,
    refetch: fetchEncuestas,
    encuestasRespondidas,
  };
}
