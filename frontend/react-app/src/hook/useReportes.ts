import { useState, useEffect, useCallback } from "react";

const API_URL = "http://localhost:8000";

export function useReportes() {
  const [reportes, setReportes] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReportes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_URL}/reportes`);
      if (!res.ok) throw new Error("No se pudo obtener la lista de reportes");
      const data = await res.json();
      setReportes(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error desconocido al cargar reportes");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchReporteById = useCallback(async (id: string | number) => {
    const res = await fetch(`${API_URL}/reportes/${id}`);
    if (!res.ok) throw new Error("No se pudo obtener el reporte");
    return await res.json();
  }, []);

  const fetchResumenByReporteId = useCallback(async (id: number) => {
    console.log("Reportes desde el hook:", reportes);
    try {
      setLoading(true);
     const res = await fetch(`${API_URL}/reportes/generar/${id}`);
      
      if (!res.ok) throw new Error("Error al obtener el resumen");
      return await res.json();
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReportes();
  }, [fetchReportes]);

  return {
    reportes,
    loading,
    error,
    refetch: fetchReportes,
    fetchReporteById,
    fetchResumenByReporteId,
  };
}