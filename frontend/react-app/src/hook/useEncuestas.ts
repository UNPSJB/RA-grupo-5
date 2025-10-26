import { useState, useEffect } from "react";
import type { Encuesta } from "../types/models/Encuesta";

export function useEncuestas(){

    const[encuestas, setEncuestas] = useState<Encuesta[]>([]);
    const[loading, setLoading] = useState<boolean>(true);
    const[error, setError] = useState<string | null>(null);
    const API_URL = "http://localhost:8000/encuestas-asignaturas"; //definimos la URL como una const

    const fetchEncuestas = async () => {  // Función para obtener las encuestas
        try {
            setLoading(true);
            const response = await fetch(API_URL);
            if (!response.ok) { 
                throw new Error("Error al obtener las encuestas");
            }
            const data = await response.json();
            setEncuestas(data);
            setError(null);
        }catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }    

    const fetchEncuestaById = async (id:number) => { // Función para obtener una encuesta por ID
    try {
        setLoading(true);
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) {
        throw new Error("Error al obtener la encuesta");
        }
        const data = await response.json();
        setError(null);
      return data; // devuelve la encuesta
    } catch (err: any) {
        setError(err.message);
        return null;
    } finally {
        setLoading(false);
    }
    };


useEffect(() => {
    fetchEncuestas();
}, []);

return {
    encuestas,
    loading,
    error,
    refetch: fetchEncuestas,
    fetchEncuestaById,
    };
}
