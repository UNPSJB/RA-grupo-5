import { useState, useCallback, useEffect } from "react";
const API_URL = "http://localhost:8000";

export interface InformeSinteticoCarreraPayload {
  ciclo_lectivo: string;
  comision_asesora: string;
  sede: string;
  integrantes: string;
  id_carrera: number;
  id_informe_sintetico_base: number;
  estado: "abierto" | "cerrado";
  informes_asignaturas: number[]; 
}

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
           Number(s.ciclo_lectivo) === Number(cicloLectivo) &&
           s.respuesta !== null 
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

  // --- NUEVA FUNCIÓN AÑADIDA ---
  const crearInformeSinteticoCarrera = useCallback(
    async (payload: InformeSinteticoCarreraPayload) => {
      const res = await fetch(`${API_URL}/informe-sintetico-carrera/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        console.error("Error al crear el informe sintético:", errData);
        throw new Error(errData.detail || "Error al crear la cabecera del informe sintético");
      }
      
      return await res.json();
    },
    []
  );

  return { 
    resumenes, 
    loading, 
    error,
    crearInformeSinteticoCarrera 
  };
}