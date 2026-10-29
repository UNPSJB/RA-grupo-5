/**
 * Confeti visual liviano, sin dependencias externas.
 *
 * Uso exclusivamente estético: crea una capa temporal de partículas sobre la
 * pantalla y la elimina automáticamente. No modifica estado de React ni datos.
 */
export function lanzarConfeti(cantidad = 90): void {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  try {
    const prefiereMenosMovimiento = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    )?.matches;

    if (prefiereMenosMovimiento) return;

    const colores = [
      "#0d6efd",
      "#198754",
      "#ffc107",
      "#dc3545",
      "#0dcaf0",
      "#6f42c1",
      "#e83e8c",
    ];

    const capa = document.createElement("div");
    capa.className = "confetti-layer";
    capa.setAttribute("aria-hidden", "true");

    const total = Math.max(20, Math.min(160, cantidad));

    for (let i = 0; i < total; i++) {
      const pieza = document.createElement("span");
      const tamano = 6 + Math.random() * 8;

      pieza.className = "confetti-piece";
      pieza.style.left = `${Math.random() * 100}%`;
      pieza.style.width = `${tamano}px`;
      pieza.style.height = `${tamano * 1.4}px`;
      pieza.style.backgroundColor =
        colores[Math.floor(Math.random() * colores.length)];
      pieza.style.animationDuration = `${1.6 + Math.random() * 1.4}s`;
      pieza.style.animationDelay = `${Math.random() * 0.25}s`;
      pieza.style.setProperty(
        "--confetti-drift",
        `${(Math.random() - 0.5) * 220}px`
      );
      pieza.style.setProperty(
        "--confetti-spin",
        `${(Math.random() * 2 - 1) * 720}deg`
      );

      if (Math.random() > 0.6) {
        pieza.style.borderRadius = "50%";
      }

      capa.appendChild(pieza);
    }

    document.body.appendChild(capa);
    window.setTimeout(() => capa.remove(), 3600);
  } catch {
    // Cualquier fallo visual nunca debe interrumpir el flujo de la aplicación.
  }
}
