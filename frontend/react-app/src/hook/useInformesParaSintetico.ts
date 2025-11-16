import { useState, useEffect } from "react";
import type { InformeCurricular } from "../types/models/InformeCurricular";
import type { Carrera } from "../types/models/Carrera";
import { apiFetch } from "../api/client";

// CAMBIO 1: Aceptar 'cuatrimestre' como parámetro (debe ser string | null)
export function useInformesParaSintetico(
  carreraId: number | null,
  ciclo: number | null,
  cuatrimestre: string | null // <-- ACEPTA EL PARÁMETRO
) {
  const [informesFiltrados, setInformesFiltrados] = useState<
    InformeCurricular[]
  >([]);
  const [carrera, setCarrera] = useState<Carrera | null>(null);
  // CAMBIO 2: Eliminar el estado local 'cuatrimestre'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // CAMBIO 3: 'cuatrimestre' ahora es el parámetro
    if (!carreraId || !ciclo || !cuatrimestre) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // 1. Traer la carrera (esto ahora se ejecutará)
        const resCarrera = await apiFetch(`/carreras/${carreraId}`);
        if (!resCarrera.ok)
          throw new Error(`No se encontró la carrera (ID: ${carreraId})`);
        const dataCarrera: Carrera = await resCarrera.json();
        setCarrera(dataCarrera);

        // 2. Traer TODOS los informes curriculares
        // Departamento ahora debe ver la vista "solo lectura" de informes:
        const resInformes = await apiFetch(
          `/informes-asignaturas/departamento`
        );
        if (!resInformes.ok)
          throw new Error("Error al cargar los informes curriculares");
        const todosInformes: InformeCurricular[] = await resInformes.json();

        // 3. CAMBIO 4: Aplicar la MISMA lógica de filtro que en useInformesSinteticos
        const filtrados = todosInformes.filter((informe) => {
          const cursado = informe.asignatura?.cursado; // ej: "cuatrimestre 1"
          // Mapea el valor de la BD al valor del filtro
          const etiquetaCuatrimestre =
            cursado === "cuatrimestre 1"
              ? "1° cuatrimestre"
              : cursado === "cuatrimestre 2"
              ? "2° cuatrimestre"
              : cursado === "anual"
              ? "2° cuatrimestre" // Tu lógica de "anual"
              : null;

          return (
            informe.asignatura?.carrera?.id === carreraId &&
            informe.ciclo_lectivo === ciclo &&
            etiquetaCuatrimestre === cuatrimestre && // Compara con el parámetro
            informe.estado === "cerrado"
          );
        });

        setInformesFiltrados(filtrados);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [carreraId, ciclo, cuatrimestre]); // CAMBIO 5: 'cuatrimestre' ahora es el parámetro

  return { informesFiltrados, carrera, loading, error };
}
