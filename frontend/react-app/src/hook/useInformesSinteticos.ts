
import { useState, useCallback, useEffect } from "react";
const API_URL = "http://localhost:8000";

export function useInformesSinteticos(cicloLectivo: number) {
  const [resumenes, setResumenes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [resCarreras, resCurriculares, resSinteticos] = await Promise.all([
          fetch(`${API_URL}/carreras`),
          fetch(`${API_URL}/informes-asignaturas`),
          fetch(`${API_URL}/informe-sintetico-carrera`),
        ]);

        if (!resCarreras.ok || !resCurriculares.ok || !resSinteticos.ok) {
          throw new Error("Error al cargar datos");
        }

        const carreras = await resCarreras.json();
        const curriculares = await resCurriculares.json();
        const sinteticos = await resSinteticos.json();

        const resumenes = carreras.map((carrera: any) => {
          const informesPorCarrera = curriculares.filter(
            (informe: any) =>
              informe.asignatura?.carrera?.id === carrera.id &&
              informe.ciclo_lectivo === cicloLectivo
          );

          const publicados = informesPorCarrera.filter(
            (informe: any) => informe.estado === "cerrado"
          );

          const sintetico = sinteticos.find(
            (s: any) =>
              Number(s.carrera?.id) === Number(carrera.id) &&
              Number(s.ciclo_lectivo) === Number(cicloLectivo)
          );

          return {
            carrera,
            totalInformes: informesPorCarrera.length,
            publicados: publicados.length,
            sinteticoId: sintetico?.id ?? null,
          };
        });

        setResumenes(resumenes);
      } catch (err: any) {
        setError(err.message || "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [cicloLectivo]);

  return { resumenes, loading, error };
}
