import { useState, useEffect } from "react";

interface Asignatura {
  id: number;
  nombre: string;
  carrera: string;
  cursado: string;
  año: number;
  nombre_docente: string;
  sede: string;
}

interface EncuestaBase {
  id: number;
  nombre: string;
  ciclo: string;
}

interface EncuestaAsignatura {
  asignatura: Asignatura;
  encuesta_base: EncuestaBase;
  estado: string;
  fecha_inicio: string;
  fecha_fin: string;
}

interface Reporte {
  id: number;
  encuesta_asignatura: EncuestaAsignatura;
  respuestas: any[];
}

export function useReportes() {
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const API_URL = "http://localhost:8000/reportes"; //definimos la URL como una const
  const fetchReportes = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error("Error al obtener los reportes");
      }
      const data = await response.json();
      setReportes(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const fetchReporteById = async (id: number | string) => {
    try {
      const response = await fetch(`${API_URL}/${id}`);
      if (!response.ok) {
        throw new Error("No se pudo obtener el reporte");
      }
      const data = await response.json();
      return data; // <- IMPORTANTÍSIMO que retorne
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error desconocido");
      return null;
    }
  };
  useEffect(() => {
    fetchReportes();
  }, []);

  return {
    reportes,
    loading,
    error,
    refetch: fetchReportes,
    fetchReporteById,
  };
}
