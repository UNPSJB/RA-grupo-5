import { useEffect, useState } from "react";
import { Dropdown, Badge, Spinner } from "react-bootstrap";
import { apiFetch } from "../api/client";
import { useAuth } from "../context/AuthContext";

interface SimularAnioResponse {
  anio_simulado: number;
  fecha_simulada: string;
  periodo_vigente: string;
  mensaje: string;
}

export default function TimeTravelSelector() {
  const { roles } = useAuth();
  const [anioActual, setAnioActual] = useState<number>(2026);
  const [periodo, setPeriodo] = useState<string>("2025–2028");
  const [loading, setLoading] = useState<boolean>(false);
  const esAdmin = roles.includes("admin");

  useEffect(() => {
    apiFetch("/api/config/simular-anio")
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("No se pudo obtener el año actual");
      })
      .then((data: SimularAnioResponse) => {
        setAnioActual(data.anio_simulado);
        setPeriodo(data.periodo_vigente);
      })
      .catch((err) => {
        console.warn("Aviso TimeTravel:", err);
      });
  }, []);

  const handleCambiarAnio = async (nuevoAnio: number) => {
    if (nuevoAnio === anioActual || loading) return;
    setLoading(true);
    try {
      const res = await apiFetch("/api/config/simular-anio", {
        method: "POST",
        body: JSON.stringify({ anio: nuevoAnio }),
      });

      if (res.ok) {
        const data: SimularAnioResponse = await res.json();
        setAnioActual(data.anio_simulado);
        setPeriodo(data.periodo_vigente);
        // Recargar para que todas las vistas se sincronicen con el nuevo año
        window.location.reload();
      } else {
        alert("Error al cambiar el año del sistema en el servidor.");
      }
    } catch (error) {
      console.error("Error al cambiar año:", error);
      alert("Error de conexión con el backend.");
    } finally {
      setLoading(false);
    }
  };

  const is2026 = anioActual === 2026;
  const is2029 = anioActual === 2029;

  if (!esAdmin) {
    return null;
  }

  return (
    <Dropdown align="end" className="me-2">
      <Dropdown.Toggle
        variant={is2029 ? "warning" : "light"}
        id="dropdown-time-travel"
        size="sm"
        className="d-flex align-items-center gap-2 fw-bold shadow-sm"
        disabled={loading || !esAdmin}
        title={!esAdmin ? "Solo el administrador puede cambiar el año del sistema" : undefined}
      >
        {loading ? (
          <Spinner animation="border" size="sm" />
        ) : (
          <span>Simulación: <strong>{anioActual}</strong></span>
        )}
        <Badge bg={is2029 ? "dark" : "primary"}>{periodo}</Badge>
      </Dropdown.Toggle>

      <Dropdown.Menu style={{ minWidth: "300px" }}>
        <Dropdown.Header className="text-uppercase small fw-bold">
          Modo Demo - Simulación de año
        </Dropdown.Header>

        <Dropdown.Item
          active={is2026}
          onClick={() => handleCambiarAnio(2026)}
          className="py-2"
        >
          <div className="d-flex justify-content-between align-items-center">
            <strong>Año 2026 (Vigente)</strong>
            <Badge bg="primary">2025–2028 (V1)</Badge>
          </div>
          <small className="text-muted d-block mt-1">
            Versión 1: Encuestas 2025–2028 activas. Período 2029 cerrado.
          </small>
        </Dropdown.Item>

        <Dropdown.Divider />

        <Dropdown.Item
          active={is2029}
          onClick={() => handleCambiarAnio(2029)}
          disabled={!esAdmin}
          className="py-2"
        >
          <div className="d-flex justify-content-between align-items-center">
            <strong>Año 2029</strong>
            <Badge bg="warning" text="dark">2029–2032 (V2 - IA)</Badge>
          </div>
          <small className="text-muted d-block mt-1">
            Versión 2: Período 2025–2028 congelado como histórico. Se activan preguntas de IA.
          </small>
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

