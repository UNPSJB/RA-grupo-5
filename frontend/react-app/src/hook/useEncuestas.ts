// hook/useEncuestas.tsx
import { useState, useEffect } from 'react';
// Importa la interfaz que usas para la lista (asumo EncuestaAsignatura)
import type { EncuestaAsignatura } from '../types/Encuesta'; 

export function useEncuestas() {

  // Fíjate que el estado es un array: EncuestaAsignatura[]
  const [encuestas, setEncuestas] = useState<EncuestaAsignatura[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const API_URL = "http://localhost:8000/encuestas-asignaturas"; // URL de la lista

  const fetchEncuestas = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error("Error al obtener las encuestas");
      }
      const data = await response.json();
      setEncuestas(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEncuestas();
  }, []);

  // Fíjate que devuelve 'encuestas' (plural)
  return {
    encuestas,
    loading,
    error,
    refetch: fetchEncuestas,
  };
}