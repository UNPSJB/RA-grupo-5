import { useState, useEffect } from 'react';
import type { InformeCurricular } from '../types/models/InformeCurricular';
import type { Carrera } from '../types/models/Carrera';

const API_URL = "http://localhost:8000";

export function useInformesParaSintetico(carreraId: number | null, ciclo: number | null) {
  const [informesFiltrados, setInformesFiltrados] = useState<InformeCurricular[]>([]);
  const [carrera, setCarrera] = useState<Carrera | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!carreraId || !ciclo) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // 1. Traer la carrera
        const resCarrera = await fetch(`${API_URL}/carreras/${carreraId}`);
        if (!resCarrera.ok) throw new Error(`No se encontró la carrera (ID: ${carreraId})`);
        const dataCarrera: Carrera = await resCarrera.json();
        setCarrera(dataCarrera);

        // 2. Traer TODOS los informes curriculares
        const resInformes = await fetch(`${API_URL}/informes-asignaturas`);
        if (!resInformes.ok) throw new Error("Error al cargar los informes curriculares");
        const todosInformes: InformeCurricular[] = await resInformes.json();

        // 3. Filtrar client-side (como en useInformesSinteticos)
        const filtrados = todosInformes.filter(
          (informe) =>
            informe.asignatura?.carrera?.id === carreraId &&
            informe.ciclo_lectivo === ciclo &&
            informe.estado === "cerrado" // Solo incluimos los ya respondidos por docentes
        );
        
        setInformesFiltrados(filtrados);

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [carreraId, ciclo]);

  return { informesFiltrados, carrera, loading, error };
}