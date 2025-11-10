// en: src/hooks/useInformeSinteticoCarrera.ts

import { useState, useEffect } from 'react';
// Asegúrate de que la ruta a tus tipos sea correcta
import type { InformeSinteticoCarrera } from '../types/InformeSintetico'; 

const API_URL = 'http://127.0.0.1:8000';

export const useInformeSinteticoCarrera = (id: number | null) => {
  const [informe, setInforme] = useState<InformeSinteticoCarrera | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // No hacer nada si no hay ID
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchInforme = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(
          `${API_URL}/informe-sintetico-carrera/${id}`
        );

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Informe no encontrado');
          }
          throw new Error(`Error en la API: ${response.statusText}`);
        }

        const data: InformeSinteticoCarrera = await response.json();
        setInforme(data);

      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchInforme();

  }, [id]); 

  return { informe, loading, error };
};