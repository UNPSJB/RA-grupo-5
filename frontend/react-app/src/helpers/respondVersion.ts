import apiFetch from "../api/client";

export async function obtenerPeriodosEncuestaPorAnio(anio: number): Promise<string[]> {
  const response = await apiFetch("/encuestas-base/");
  if (!response.ok) return [];

  const encuestasBase = await response.json();
  return (Array.from(
    new Set(
      encuestasBase
        .filter(
          (base: { anio_inicio?: number | null; anio_fin?: number | null }) =>
            base.anio_inicio != null &&
            base.anio_fin != null &&
            base.anio_inicio <= anio &&
            base.anio_fin >= anio
        )
        .map(
          (base: { anio_inicio: number; anio_fin: number }) =>
            `${base.anio_inicio} - ${base.anio_fin}`
        )
    )
  ) as string[]).sort();
}

export async function obtenerPeriodoEncuestaAsignada(
  idAsignatura: number,
  cicloLectivo: number
): Promise<string | null> {
  const response = await apiFetch("/encuestas-asignaturas/cortas");
  if (!response.ok) return null;

  const encuestas = await response.json();
  const encuesta = encuestas.find(
    (item: {
      id_asignatura: number;
      ciclo_lectivo: number;
      encuesta_base?: { anio_inicio?: number | null; anio_fin?: number | null };
    }) =>
      item.id_asignatura === idAsignatura &&
      item.ciclo_lectivo === cicloLectivo
  );

  const base = encuesta?.encuesta_base;
  return base?.anio_inicio != null && base?.anio_fin != null
    ? `${base.anio_inicio} - ${base.anio_fin}`
    : null;
}
