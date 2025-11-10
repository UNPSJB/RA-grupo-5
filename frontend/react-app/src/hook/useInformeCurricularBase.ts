import { useCallback } from "react";

const API_URL = "http://localhost:8000";

export function useInformeCurricularBase() {
  const fetchInformeBaseActual = useCallback(async () => {
    const res = await fetch(`${API_URL}/informes-curriculares-base/actual`);
    if (!res.ok) {
      throw new Error("No se pudo obtener el informe base actual");
    }
    return await res.json();
  }, []);

  return { fetchInformeBaseActual };
}
