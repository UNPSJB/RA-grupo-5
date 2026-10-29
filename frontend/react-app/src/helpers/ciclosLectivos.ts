import apiFetch from "../api/client";

/**
 * Normaliza el ciclo lectivo que llega del backend (por ejemplo "2025" o 2025).
 * Devuelve null cuando el valor está vacío o no representa un año válido.
 */
export function parseCicloLectivo(value: unknown): number | null {
  const texto = String(value ?? "").trim();
  if (!/^\d{4}$/.test(texto)) return null;

  const anio = Number(texto);
  return anio > 0 ? anio : null;
}

/**
 * Devuelve los años cubiertos por los períodos definidos en encuestas_base.
 * Se usa para ignorar combinaciones de informes que no pertenecen a un ciclo
 * lectivo vigente.
 */
export async function obtenerAniosCicloValidos(): Promise<Set<number>> {
  const response = await apiFetch("/encuestas-base/");
  if (!response.ok) return new Set();

  const encuestasBase = await response.json();
  const anios = new Set<number>();

  encuestasBase.forEach(
    (base: { anio_inicio?: number | null; anio_fin?: number | null }) => {
      if (base.anio_inicio == null || base.anio_fin == null) return;

      const inicio = Number(base.anio_inicio);
      const fin = Number(base.anio_fin);
      if (!Number.isInteger(inicio) || !Number.isInteger(fin) || fin < inicio) {
        return;
      }

      for (let anio = inicio; anio <= fin; anio += 1) {
        anios.add(anio);
      }
    }
  );

  return anios;
}
