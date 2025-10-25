import { useState, useEffect } from "react";
// 👇 1. Importa los tipos para crear la respuesta
import type { 
    EncuestaBase,
    Asignatura, 
    EncuestaAsignatura,
    RespuestaCreate, // <--- AÑADE ESTE
    DetalleRespuestaCreate // <--- AÑADE ESTE
} from '../types/Encuesta';

const API_URL = "http://localhost:8000";

type RespuestasState = Map<number, string | number | number[]>;

export function useResponderEncuesta(idEncuestaAsignatura: number | null) {

  // --- 1. ESTADOS DEL HOOK ---
  const [encuesta, setEncuesta] = useState<EncuestaBase | null>(null);
  const [asignatura, setAsignatura] = useState<Asignatura | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [respuestas, setRespuestas] = useState<RespuestasState>(new Map());

  
  // --- 2. FUNCIÓN PARA MANEJAR RESPUESTAS ---
  const handleRespuestaChange = (
    preguntaId: number, 
    valor: string | number,
    tipo: 'open' | 'single_choice' | 'multiple_choice'
  ) => {
    setRespuestas(prevRespuestas => {
      const nuevasRespuestas = new Map(prevRespuestas);
      if (tipo === 'multiple_choice') {
        const valoresActuales = (nuevasRespuestas.get(preguntaId) as number[]) || [];
        const valorNumero = valor as number;
        if (valoresActuales.includes(valorNumero)) {
          nuevasRespuestas.set(preguntaId, valoresActuales.filter(v => v !== valorNumero));
        } else {
          nuevasRespuestas.set(preguntaId, [...valoresActuales, valorNumero]);
        }
      } else {
        nuevasRespuestas.set(preguntaId, valor);
      }
      return nuevasRespuestas;
    });
  };

  // --- 3. EFECTO PARA CARGAR DATOS ---
  useEffect(() => {
    if (!idEncuestaAsignatura) {
      setLoading(false);
      return;
    }
    const fetchEncuestaCompleta = async () => {
      setLoading(true);
      setError(null);
      setEncuesta(null);
      setAsignatura(null);
      setRespuestas(new Map()); 
      try {
        const resAsignatura = await fetch(`${API_URL}/encuestas-asignaturas/${idEncuestaAsignatura}`);
        if (!resAsignatura.ok) throw new Error(`Error al cargar la asignatura (ID: ${idEncuestaAsignatura})`);
        const dataAsignatura: EncuestaAsignatura = await resAsignatura.json();
        setAsignatura(dataAsignatura.asignatura); 
        const idEncuestaBase = dataAsignatura.id_encuesta_base;
        const resEncuesta = await fetch(`${API_URL}/encuestas-base/${idEncuestaBase}`);
        if (!resEncuesta.ok) throw new Error(`Error al cargar la encuesta base (ID: ${idEncuestaBase})`);
        const dataEncuesta: EncuestaBase = await resEncuesta.json();
        setEncuesta(dataEncuesta);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEncuestaCompleta();
  }, [idEncuestaAsignatura]);

  
  const guardarRespuestas = async (idPersona: number) => {
    if (!encuesta || !idEncuestaAsignatura) {
      setError("No se puede guardar: la encuesta o la asignatura no están cargadas.");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const detalles: DetalleRespuestaCreate[] = [];
      
      encuesta.variables.forEach(variable => {
        variable.preguntas.forEach(pregunta => {
          const valorRespuesta = respuestas.get(pregunta.id);

          if (valorRespuesta === undefined) return; 

          if (pregunta.tipo === 'open') {
            const po = pregunta.pregunta_opcion.find(p => p.id_opcion_respuesta === null);
            if (po) {
              detalles.push({
                id_pregunta_opcion: po.id,
                texto_respuesta_abierta: valorRespuesta as string
              });
            }
          } 
          
          else if (pregunta.tipo === 'single_choice') {
            const po = pregunta.pregunta_opcion.find(p => p.id_opcion_respuesta === (valorRespuesta as number));
            if (po) {
              detalles.push({
                id_pregunta_opcion: po.id,
              });
            }
          } 
          
          else if (pregunta.tipo === 'multiple_choice') {
            const valoresSeleccionados = valorRespuesta as number[];
            valoresSeleccionados.forEach(idOpcion => {
              const po = pregunta.pregunta_opcion.find(p => p.id_opcion_respuesta === idOpcion);
              if (po) {
                detalles.push({
                  id_pregunta_opcion: po.id,
                });
              }
            });
          }
        });
      });
      
      // --- Creación del Payload ---
      const payload: RespuestaCreate = {
        id_persona: idPersona, 
        id_encuesta_asignatura: idEncuestaAsignatura,
        detalles: detalles
      };

      // --- Envío a la API ---
      const response = await fetch(`${API_URL}/respuestas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Error al guardar las respuestas");
      }

      const dataGuardada = await response.json();
      return dataGuardada;
    } catch (err: any) {
      setError(err.message);
      return null; 
    } finally {
      setLoading(false);
    }
  };


  return {
    encuesta,
    asignatura,
    loading,
    error,
    respuestas,
    handleRespuestaChange,
    guardarRespuestas 
  };
}