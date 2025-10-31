import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { useReportes } from "../hook/useReportes";
import { useInformesCurriculares } from "../hook/useInformesCurriculares";
import { useInformeBase } from "../hook/useInformeBase";
import { useResponderInforme } from "../hook/useResponderInforme";
import LayoutReporte from "../componentes/LayoutReporte";
import { Container, Card, Toast, ToastContainer } from "react-bootstrap";
import ResumenVariable from "../componentes/ResumenVariable";

export default function InformeCurricular() {
  const { reporteId } = useParams();
  const navigate = useNavigate();

  const { fetchReporteById, fetchResumenByReporteId } = useReportes();
  const { crearInformeCurricular } = useInformesCurriculares();
  const { fetchInformeBaseActual } = useInformeBase();

  const [reporte, setReporte] = useState<any>(null);
  const [loadingReporte, setLoadingReporte] = useState(true);
  const [errorReporte, setErrorReporte] = useState<string | null>(null);

  const [resumenData, setResumenData] = useState<any>(null);
  const [loadingResumen, setLoadingResumen] = useState(true);
  const [errorResumen, setErrorResumen] = useState<string | null>(null);

  const [informeBase, setInformeBase] = useState<any>(null);
  const [loadingBase, setLoadingBase] = useState(true);
  const [errorBase, setErrorBase] = useState<string | null>(null);

  const {
    answersByPreguntaOpcion,
    setTextoRespuesta,
    guardarRespuestasInforme,
  } = useResponderInforme();

  const [sede, setSede] = useState("");
  const [cicloLectivo, setCicloLectivo] = useState<number | "">("");
  const [docente, setDocente] = useState("");
  const [cantInscriptos, setCantInscriptos] = useState<number | "">("");
  const [cantTeoricas, setCantTeoricas] = useState<number | "">("");
  const [cantPracticas, setCantPracticas] = useState<number | "">("");

  const [saving, setSaving] = useState(false);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState<"success" | "danger">(
    "success"
  );

  // -------- cargar reporte ----------
  useEffect(() => {
    async function cargarReporte() {
      if (!reporteId) {
        setErrorReporte("Falta reporteId en la URL");
        setLoadingReporte(false);
        return;
      }
      try {
        const data = await fetchReporteById(reporteId);
        setReporte(data);
        const asignatura = data.encuesta_asignatura?.asignatura;
        setSede(asignatura?.sede || "");
        setDocente(asignatura?.nombre_docente || "");
        setCicloLectivo(
          asignatura?.ciclo_lectivo ? Number(asignatura.ciclo_lectivo) : ""
        );
      } catch (err) {
        setErrorReporte("Error cargando el reporte.");
      } finally {
        setLoadingReporte(false);
      }
    }
    cargarReporte();
  }, [reporteId, fetchReporteById]);

  // -------- cargar resumen ----------
  useEffect(() => {
    async function cargarResumen() {
      if (!reporteId) {
        setErrorResumen("Falta reporteId en la URL (resumen).");
        setLoadingResumen(false);
        return;
      }
      try {
        const resum = await fetchResumenByReporteId(Number(reporteId));
        setResumenData(resum);
      } catch (err) {
        setErrorResumen("Error cargando el resumen del reporte.");
      } finally {
        setLoadingResumen(false);
      }
    }
    cargarResumen();
  }, [reporteId, fetchResumenByReporteId]);

  // -------- cargar informe base ----------
  useEffect(() => {
    async function cargarInformeBase() {
      try {
        const base = await fetchInformeBaseActual();
        setInformeBase(base);
      } catch (err) {
        setErrorBase("Error cargando la plantilla del informe.");
      } finally {
        setLoadingBase(false);
      }
    }
    cargarInformeBase();
  }, [fetchInformeBaseActual]);

  // -------- submit ----------
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!reporte || !informeBase) return;
      setSaving(true);
      try {
        const asignatura = reporte.encuesta_asignatura?.asignatura;
        const id_asignatura =
          asignatura?.id ||
          asignatura?.id_asignatura ||
          asignatura?.idAsignatura;

        const payloadCabecera = {
          fecha_inicio: "2025-03-01",
          fecha_fin: "2025-07-30",
          estado: "abierto",
          sede,
          ciclo_lectivo: Number(cicloLectivo),
          docente,
          cant_alumnos_insc: Number(cantInscriptos) || 0,
          cant_comisiones_teoricas: Number(cantTeoricas) || 0,
          cant_comisiones_practicas: Number(cantPracticas) || 0,
          id_informe_base: informeBase.id,
          id_asignatura,
          id_reporte: Number(reporteId),
        };

        const informeCreado = await crearInformeCurricular(payloadCabecera);
        const idDocente = 1;
        await guardarRespuestasInforme(idDocente, informeCreado.id);

        setToastVariant("success");
        setToastMessage("Informe guardado correctamente ✔");
        setShowToast(true);
      } catch (err) {
        console.error(err);
        setToastVariant("danger");
        setToastMessage("No se pudo guardar el informe curricular.");
        setShowToast(true);
      } finally {
        setSaving(false);
      }
    },
    [
      reporte,
      informeBase,
      sede,
      cicloLectivo,
      docente,
      cantInscriptos,
      cantTeoricas,
      cantPracticas,
      reporteId,
      crearInformeCurricular,
      guardarRespuestasInforme,
    ]
  );

  // -------- estados iniciales / errores ----------
  if (loadingReporte || loadingBase || loadingResumen)
    return <div className="container mt-4">Cargando...</div>;

  if (errorReporte)
    return <div className="container mt-4 text-danger">{errorReporte}</div>;
  if (errorBase)
    return <div className="container mt-4 text-danger">{errorBase}</div>;
  if (errorResumen)
    return <div className="container mt-4 text-danger">{errorResumen}</div>;

  if (!reporte)
    return <div className="container mt-4">No hay datos del reporte.</div>;
  if (!informeBase)
    return (
      <div className="container mt-4">
        No hay plantilla de Informe Base disponible.
      </div>
    );
  if (!resumenData)
    return (
      <div className="container mt-4">
        No hay datos de resumen para este reporte.
      </div>
    );

  // -------- preparar variables B, C, D, E --------
  const resultados: Record<string, any> =
    resumenData?.resultados_por_pregunta ?? {};
  const resumenes: Record<string, any> =
    resumenData?.resumen_por_variable ?? {};

  const CODIGOS_OBJETIVO = new Set(["B", "C", "D", "E"]);

  function extraerCodigo(nombreVar: string, variableData: any) {
    const crudo = (variableData?.codigo ?? "").toString();
    const desdeNombre = (nombreVar ?? "").split(":")[0];
    return (crudo || desdeNombre || "").trim().toUpperCase();
  }

  function obtenerResumen(nombreVar: string, codigo: string) {
    if (resumenes[nombreVar]) return resumenes[nombreVar];
    if (resumenes[codigo]) return resumenes[codigo];
    const matchKey = Object.keys(resumenes).find((k) => {
      const kNorm = k.toString().trim().toUpperCase();
      return kNorm === codigo || kNorm.startsWith(`${codigo}:`);
    });
    return matchKey ? resumenes[matchKey] : null;
  }

  const resumenVariablesFiltradas = Object.entries(resultados)
    .map(([nombreVar, variableData]) => {
      const codigo = extraerCodigo(nombreVar, variableData);
      return {
        nombreVar,
        codigo,
        resumen: obtenerResumen(nombreVar, codigo),
      };
    })
    .filter(
      (it) =>
        CODIGOS_OBJETIVO.has(it.codigo) &&
        it.resumen &&
        Array.isArray(it.resumen.opciones) &&
        it.resumen.opciones.length > 0
    );

  const asignatura = reporte.encuesta_asignatura?.asignatura || {};

  // -------- render --------
  return (
    <div className="container mt-4">
      <h2>Informe de Actividad Curricular</h2>

      <LayoutReporte
        asignatura={asignatura.nombre}
        anio={asignatura.año}
        docente={asignatura.nombre_docente}
        carrera={asignatura.carrera}
      >
        <Container className="mt-5">
          <form onSubmit={handleSubmit}>
            {/* Card de respuestas abiertas */}
            <Card className="shadow-lg border-0">
              <Card.Body>
                <div className="mb-4">
                  <h5>Responda:</h5>

                  {informeBase.preguntas?.map((pregunta: any) => {
                    const primeraOpcion = pregunta.pregunta_opcion?.[0];
                    const idPreguntaOpcion = primeraOpcion?.id;

                    return (
                      <div
                        className="mb-3"
                        key={idPreguntaOpcion ?? pregunta.id ?? Math.random()}
                      >
                        <label className="form-label">
                          {pregunta.texto_pregunta ??
                            pregunta.texto ??
                            "Pregunta"}

                          {Number(pregunta.id) === 35 && (
                            <div className="my-3">
                              {resumenVariablesFiltradas.length > 0 ? (
                                <div className="d-flex flex-wrap gap-3 mt-2">
                                  {resumenVariablesFiltradas.map(
                                    ({ codigo, resumen, nombreVar }) => (
                                      <Card
                                        key={nombreVar}
                                        className="border-0 shadow-sm p-2"
                                        style={{
                                          width: "260px",
                                          flex: "0 0 auto",
                                          fontSize: "0.9rem",
                                        }}
                                      >
                                        <Card.Body className="p-3">
                                          <div className="fw-semibold text-center mb-2 text-secondary">
                                            Variable {codigo}
                                          </div>
                                          <ResumenVariable
                                            resumen={resumen}
                                            variant="compact"
                                          />
                                        </Card.Body>
                                      </Card>
                                    )
                                  )}
                                </div>
                              ) : (
                                <p className="text-muted small">
                                  No hay variables B, C, D o E para mostrar.
                                </p>
                              )}
                            </div>
                          )}

                          <textarea
                            className="form-control"
                            style={{ minHeight: "80px" }}
                            value={
                              idPreguntaOpcion
                                ? answersByPreguntaOpcion[idPreguntaOpcion] ??
                                  ""
                                : ""
                            }
                            onChange={(e) => {
                              if (idPreguntaOpcion) {
                                setTextoRespuesta(
                                  idPreguntaOpcion,
                                  e.target.value
                                );
                              }
                            }}
                          />
                        </label>
                      </div>
                    );
                  })}
                </div>

                <div className="d-flex justify-content-center">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={saving}
                  >
                    {saving ? "Guardando..." : "Guardar Informe"}
                  </button>
                </div>
              </Card.Body>
            </Card>
          </form>
        </Container>
      </LayoutReporte>
    </div>
  );
}
