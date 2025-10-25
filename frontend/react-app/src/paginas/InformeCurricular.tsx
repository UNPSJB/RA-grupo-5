// NuevoInformeCurricular.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useReportes } from "../hook/useReportes";
import { useInformesCurriculares } from "../hook/useInformesCurriculares";

export default function NuevoInformeCurricular() {
  // Antes: const [params] = useSearchParams();
  //        const reporteId = params.get("reporteId");

  const { reporteId } = useParams(); // <-- ahora viene del path /:reporteId

  const { fetchReporteById } = useReportes();
  const { crearInformeCurricular } = useInformesCurriculares();

  const [reporte, setReporte] = useState<any>(null);
  const [loadingReporte, setLoadingReporte] = useState<boolean>(true);
  const [errorReporte, setErrorReporte] = useState<string | null>(null);

  const [actividades, setActividades] = useState("");
  const [dificultades, setDificultades] = useState("");
  const [sugerencias, setSugerencias] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveOk, setSaveOk] = useState(false);

  useEffect(() => {
    async function cargarReporte() {
      if (!reporteId) {
        setErrorReporte("Falta reporteId en la URL");
        setLoadingReporte(false);
        return;
      }

      try {
        setLoadingReporte(true);
        const data = await fetchReporteById(reporteId);
        if (!data) {
          setErrorReporte("No se encontró el reporte indicado.");
        } else {
          setReporte(data);
        }
      } catch (err) {
        setErrorReporte("Error cargando el reporte.");
      } finally {
        setLoadingReporte(false);
      }
    }

    cargarReporte();
  }, [reporteId, fetchReporteById]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!reporteId) return;

    setSaving(true);
    setSaveError(null);
    setSaveOk(false);

    try {
      const payload = {
        reporte_id: Number(reporteId),
        descripcion_actividades: actividades,
        dificultades: dificultades,
        sugerencias_mejora: sugerencias,
      };

      await crearInformeCurricular(payload);

      setSaveOk(true);
    } catch (err) {
      setSaveError("No se pudo guardar el informe.");
    } finally {
      setSaving(false);
    }
  }

  if (loadingReporte) {
    return <div>Cargando datos del reporte...</div>;
  }

  if (errorReporte) {
    return <div style={{ color: "red" }}>{errorReporte}</div>;
  }

  if (!reporte) {
    return <div>No hay datos del reporte.</div>;
  }

  const asignatura = reporte.encuesta_asignatura?.asignatura || {};

  return (
    <div style={{ maxWidth: "800px", margin: "2rem auto" }}>
      <h2>Nuevo Informe Curricular</h2>

      <div
        style={{
          background: "#f5f5f5",
          padding: "1rem",
          borderRadius: "8px",
          marginBottom: "1.5rem",
        }}
      >
        <p>
          <strong>Asignatura:</strong> {asignatura.nombre}
        </p>
        <p>
          <strong>Año:</strong> {asignatura.año}
        </p>
        <p>
          <strong>Cursado:</strong> {asignatura.cursado}
        </p>
        <p>
          <strong>Carrera:</strong> {asignatura.carrera}
        </p>
        <p>
          <strong>Docente:</strong> {asignatura.nombre_docente}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label>
            Actividades desarrolladas
            <textarea
              value={actividades}
              onChange={(e) => setActividades(e.target.value)}
              required
              style={{ width: "100%", minHeight: "80px" }}
            />
          </label>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>
            Dificultades encontradas
            <textarea
              value={dificultades}
              onChange={(e) => setDificultades(e.target.value)}
              style={{ width: "100%", minHeight: "80px" }}
            />
          </label>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>
            Sugerencias de mejora
            <textarea
              value={sugerencias}
              onChange={(e) => setSugerencias(e.target.value)}
              style={{ width: "100%", minHeight: "80px" }}
            />
          </label>
        </div>

        {saveError && (
          <div style={{ color: "red", marginBottom: "1rem" }}>{saveError}</div>
        )}

        {saveOk && (
          <div style={{ color: "green", marginBottom: "1rem" }}>
            Informe guardado correctamente ✔
          </div>
        )}

        <button type="submit" disabled={saving}>
          {saving ? "Guardando..." : "Guardar Informe"}
        </button>
      </form>
    </div>
  );
}
