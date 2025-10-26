import { useState, useEffect } from "react";
import type { Reporte } from "../types/models/Reporte";

    export function useReportes(){

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

