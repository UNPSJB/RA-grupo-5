import type { InformeCurricular, InformeCurricularPayload } from "../types/models/InformeCurricular";
import { useState, useCallback, useEffect } from "react";
const API_URL = "http://localhost:8000";

export function useInformesCurriculares() {
  const [informesCurriculares, setInformes] = useState<InformeCurricular[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  async function crearInformeCurricular(payload : InformeCurricularPayload): Promise<InformeCurricular> {
    const res = await fetch(`${API_URL}/informes-asignaturas/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error("Error al crear el informe curricular");
    }

    return await res.json();
  }
const fetchInformesCurriculares = useCallback(async () => {
  try {
    setLoading(true);
    setError(null);
    const res = await fetch(`${API_URL}/informes-asignaturas`);
          if (!res.ok) throw new Error("No se pudo obtener la lista de reportes");
      const data = await res.json();
      setInformes(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error desconocido al cargar reportes");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchInformeById = useCallback(async (id: number): Promise<InformeCurricular> => {
    const res = await fetch(`${API_URL}/informes-asignaturas/${id}`);
    if (!res.ok) throw new Error("No se pudo obtener el informe curricular");
    return await res.json();
  }, []);

  useEffect(() => {
    fetchInformesCurriculares();
  }, [fetchInformesCurriculares]);

  return {
    informesCurriculares,
    loading,
    error,  
    crearInformeCurricular,
    fetchInformeById,


  };
}
