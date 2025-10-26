const API_URL = "http://localhost:8000";

export function useInformesCurriculares() {
  async function crearInformeCurricular(payload: {
    fecha_inicio: string;
    fecha_fin: string;
    estado: string;

    sede: string;
    ciclo_lectivo: string;
    docente: string;

    cant_alumnos_insc: number;
    cant_comisiones_teoricas: number;
    cant_comisiones_practicas: number;

    id_informe_base: number;
    id_asignatura: number;
    id_reporte: number;
  }) {
    const res = await fetch(`${API_URL}/informes-asignaturas/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error("Error al crear el informe curricular");
    }

    return await res.json();
  }

  return {
    crearInformeCurricular,
  };
}
