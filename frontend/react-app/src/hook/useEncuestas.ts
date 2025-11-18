// hook/useEncuestas.tsx
import { useState, useEffect } from 'react';
// Importa la interfaz que usas para la lista (asumo EncuestaAsignatura)
import type { EncuestaAsignatura } from '../types/Encuesta'; 

export function useEncuestas() {

  // Fíjate que el estado es un array: EncuestaAsignatura[]
  const [encuestas, setEncuestas] = useState<EncuestaAsignatura[]>([]);
  const [encuestasRespondidas, setEncuestasRespondidas] = useState<EncuestaAsignatura[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const API_URL = "http://localhost:8000/encuestas-asignaturas"; // URL de la lista

    // ID HARDCODEADO POR AHORA (hasta tener login)
  const ID_ALUMNO = 1; 


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

  const fetchRespondidas = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8000/encuestas-asignaturas/alumno/${ID_ALUMNO}`);
        if (!response.ok) throw new Error("Error al cargar encuestas respondidas");
        const data = await response.json();
        setEncuestasRespondidas(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchEncuestas();
    fetchRespondidas();
  }, []);

  // Fíjate que devuelve 'encuestas' (plural)
  return {
    encuestas,
    loading,
    error,
    refetch: fetchEncuestas,
    encuestasRespondidas,

  };
}