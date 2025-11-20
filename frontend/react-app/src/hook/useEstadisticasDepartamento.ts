import { useState, useEffect } from "react";
import type { DashboardData } from "../types/Dashboard";

const API_URL = "http://localhost:8000"; 

export function useEstadisticasDepartamento(ciclo: number) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_URL}/estadisticas/dashboard?ciclo=${ciclo}`);
        
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.detail || "Error al cargar estadísticas del departamento");
        }
        
        const jsonData = await res.json();
        setData(jsonData);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Error de conexión con el servidor");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [ciclo]); 

  return { data, loading, error };
}