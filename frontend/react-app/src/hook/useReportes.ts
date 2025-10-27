<<<<<<< Updated upstream
import { useState, useEffect } from "react";
=======
import { useState, useEffect, useCallback } from "react";
>>>>>>> Stashed changes
import type { Reporte } from "../types/models/Reporte";

    export function useReportes(){

<<<<<<< Updated upstream
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
            }catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        const fetchReporteById = async (id: number) => {
            try {
                setLoading(true);
                const response = await fetch(`${API_URL}/${id}`);
                if (!response.ok) {
                    throw new Error("Error al obtener el reporte");
                }
                const data = await response.json();
                console.log("Reporte obtenido:", data);
                setReportes((prev) => [...prev, data]);
                setError(null);
                return data;
            } catch (err: any) {
                setError(err.message);
                return null;
            } finally {
                setLoading(false);
            }
        };
=======
export function useReportes() {
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
>>>>>>> Stashed changes

        const fetchResumenByReporteId = async (id: number) => {
        console.log("Reportes desde el hook:", reportes);
        try {
        setLoading(true);
        const res = await fetch(`${API_URL}/generar/${id}`);
        if (!res.ok) throw new Error("Error al obtener el resumen");
        return await res.json(); 
    } catch (err: any) {
        setError(err.message);
        return null;
        } finally {
        setLoading(false);
    };
        }
        useEffect(() => {
            fetchReportes();
        }, []);

    return {
        reportes,
        loading,
        error,
        refetch: fetchReportes,
        fetchReporteById,
        fetchResumenByReporteId,
        };
    }

<<<<<<< Updated upstream
=======
  const fetchReporteById = useCallback(async (id: string | number) => {
    const res = await fetch(`${API_URL}/reportes/${id}`);
    if (!res.ok) {
      throw new Error("No se pudo obtener el reporte");
    }
    return await res.json();
  }, []);

const fetchResumenByReporteId = async (id: number) => {
        console.log("Reportes desde el hook:", reportes);
        try {
        setLoading(true);
        console.log("🧪 fetchResumenByReporteId llamado con:", id);
        const res = await fetch(`${API_URL}/reportes/generar/${id}`);
        if (!res.ok) throw new Error("Error al obtener el resumen");
        return await res.json(); 
    } catch (err: any) {
        setError(err.message);
        return null;
        } finally {
        setLoading(false);
    };
    }
  

  useEffect(() => {
    fetchReportes();
  }, [fetchReportes]);

  return {
    reportes,
    loading,
    error,
    refetch: fetchReportes,
    fetchReporteById,
    fetchResumenByReporteId
  };
}
>>>>>>> Stashed changes
