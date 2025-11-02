import { useState, useEffect, useCallback } from "react";

const API_URL = "http://localhost:8000";

type Flags = {
  id: number;
  has_informe: boolean;
  has_respuesta: boolean;
  informe_id: number | null;
};

export function useReportes() {
  const [reportes, setReportes] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fusiona el array "full" con los flags por id
  const mergeWithFlags = (full: any[], flags: Flags[]) => {
    const flagsById = new Map(flags.map((f) => [f.id, f]));
    return full.map((r) => ({
      ...r,
      ...(flagsById.get(r.id) ?? {
        has_informe: false,
        has_respuesta: false,
        informe_id: null,
      }),
    }));
  };

  const fetchReportes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Traemos ambos en paralelo
      const [resFull, resFlags] = await Promise.all([
        fetch(`${API_URL}/reportes`),
        fetch(`${API_URL}/reportes/disponibles`),
      ]);

      if (!resFull.ok)
        throw new Error("No se pudo obtener la lista de reportes");
      if (!resFlags.ok)
        throw new Error("No se pudieron obtener los flags de reportes");

      const full = await resFull.json(); // reportes con encuesta_asignatura/asignatura
      const flags = (await resFlags.json()) as Flags[]; // {id, has_informe, has_respuesta, informe_id}

      setReportes(mergeWithFlags(full, flags));
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error desconocido al cargar reportes");
      setReportes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchReporteById = useCallback(async (id: string | number) => {
    const res = await fetch(`${API_URL}/reportes/${id}`);
    if (!res.ok) throw new Error("No se pudo obtener el reporte");
    return await res.json();
  }, []);

  // Nota: este setLoading afecta al estado global del hook; si querés un loading independiente para el resumen,
  // movelo al componente que lo consuma. Por ahora lo dejamos igual a como lo tenías.
  const fetchResumenByReporteId = useCallback(async (id: number) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/reportes/generar/${id}`);
      if (!res.ok) throw new Error("Error al obtener el resumen");
      return await res.json();
    } catch (err: any) {
      setError(err.message || "Error al obtener el resumen");
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
