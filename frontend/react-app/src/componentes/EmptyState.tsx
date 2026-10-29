import type { ReactNode } from "react";

type Props = {
  /** Clase de Bootstrap Icons, por ejemplo "bi-inbox". */
  icon?: string;
  title?: string;
  message?: ReactNode;
  className?: string;
  children?: ReactNode;
};

/**
 * Estado vacío reutilizable: ícono, título y mensaje amable.
 * Es puramente visual y defensivo (tolera props nulas/ausentes).
 */
export default function EmptyState({
  icon = "bi-inbox",
  title = "No hay elementos para mostrar",
  message,
  className = "",
  children,
}: Props) {
  return (
    <div className={`empty-state ${className}`.trim()} role="status">
      <div className="empty-state__icon" aria-hidden="true">
        <i className={`bi ${icon || "bi-inbox"}`} />
      </div>
      <h6 className="empty-state__title">{title || "Sin resultados"}</h6>
      {message && <p className="empty-state__text">{message}</p>}
      {children}
    </div>
  );
}
