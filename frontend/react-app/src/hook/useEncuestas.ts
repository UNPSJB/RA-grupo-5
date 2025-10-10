import { useState, useEffect } from "react";

enum EstadoEncuesta {
    abierta = "abierta",
    cerrada = "cerrada",
}

enum Cursado {
    PrimerCuatrimestre = "cuatrimestre 1",
    SegundoCuatrimestre = "cuatrimestre 2",
    Anual = "Anual"
}   

enum Ciclo{
    ciclo_basico = "ciclo basico",
    ciclo_superior = "ciclo superior"
}

interface Asignatura {
    id: number;
    nombre: string;
    nombre_docente: string;
    año: number;
    cursado: Cursado;
}

interface EncuestaBase {
    id: number;
    nombre: string;
    ciclo: Ciclo
    variables?: any[];
}

interface Encuesta{
    id: number;
    id_asignatura: number;
    id_encuesta_base: number;
    estado: EstadoEncuesta;  
    fecha_inicio: string;
    fecha_fin: string;
    asignatura?: Asignatura;
    encuesta_base?: EncuestaBase;
}


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
