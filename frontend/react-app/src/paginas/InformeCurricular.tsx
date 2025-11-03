import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { useReportes } from "../hook/useReportes";
import { useInformesCurriculares } from "../hook/useInformesCurriculares";
import { useInformeBase } from "../hook/useInformeBase";
import { useResponderInforme } from "../hook/useResponderInforme";
import LayoutReporte from "../componentes/LayoutReporte";
import { Container, Card } from "react-bootstrap";
import Alert from "react-bootstrap/Alert"; // <-- NUEVO
import ResumenVariable from "../componentes/ResumenVariable";

import "../styles/informe.css";

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

  // ---- NUEVO: estado para Alert ----
  const [alert, setAlert] = useState<{
    show: boolean;
    variant: "success" | "danger" | "warning" | "info";
    message: string;
  }>({ show: false, variant: "success", message: "" });

  // Autocierre del Alert a los 5s. Si es éxito, navega al cerrar.
  useEffect(() => {
    if (!alert.show) return;
    const t = setTimeout(() => {
      setAlert((a) => ({ ...a, show: false }));
      if (alert.variant === "success") navigate("/docente");
    }, 5000);
    return () => clearTimeout(t);
  }, [alert.show, alert.variant, navigate]);

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
      } catch {
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
      } catch {
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
      } catch {
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

        // 1) Crear cabecera
        const informeCreado = await crearInformeCurricular(payloadCabecera);

        // 2) Enviar respuestas (el backend cierra al primer guardado)
        const idDocente = 1; // TODO: id real del usuario
        const result = await guardarRespuestasInforme(
          idDocente,
          informeCreado.id
        );

        // 3) Manejo de resultado
        if (!result.ok && result.conflict) {
          setAlert({
            show: true,
            variant: "danger",
            message:
              result.detail || "El informe ya tiene una respuesta registrada.",
          });
          return;
        }

        if (!result.ok) {
          throw new Error(
            result.detail || "No se pudo guardar la respuesta del informe."
          );
        }

        // Éxito
        setAlert({
          show: true,
          variant: "success",
          message: "Informe guardado correctamente ✔",
        });
      } catch (err: any) {
        console.error(err);
        setAlert({
          show: true,
          variant: "danger",
          message: err?.message || "No se pudo guardar el informe curricular.",
        });
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

      {/* ALERT GLOBAL (flotante centro-arriba) */}
      {alert.show && (
        <div
          className="position-fixed top-0 start-50 translate-middle-x mt-3"
          style={{ zIndex: 2000, minWidth: 320, maxWidth: "90vw" }}
        >
          <Alert
            variant={alert.variant}
            onClose={() => {
              setAlert((a) => ({ ...a, show: false }));
              if (alert.variant === "success") navigate("/docente");
            }}
            dismissible
          >
            {alert.message}
          </Alert>
        </div>
      )}

      <LayoutReporte
        asignatura={asignatura.nombre}
        anio={asignatura.año}
        docente={asignatura.nombre_docente}
        carrera={asignatura.carrera}
      >
        <Container className="mt-5">
          <form onSubmit={handleSubmit}>
            {/* Card de datos administrativos */}
            <Card
              className="shadow-sm p-4 mb-4 border-0"
              style={{ fontSize: "0.95rem", borderRadius: "0.75rem" }}
            >
              <div className="border rounded-3 overflow-hidden">
                <div className="d-flex border-bottom">
                  <div className="bg-light fw-semibold p-2 col-4">Sede</div>
                  <div className="flex-grow-1 p-2">
                    <input
                      type="text"
                      className="form-control border-0 shadow-none"
                      value={sede}
                      onChange={(e) => setSede(e.target.value)}
                      placeholder="Ej: Puerto Madryn"
                      readOnly
                    />
                  </div>
                </div>

                <div className="d-flex border-bottom">
                  <div className="bg-light fw-semibold p-2 col-4">
                    Ciclo Lectivo
                  </div>
                  <div className="flex-grow-1 p-2">
                    <input
                      type="number"
                      className="form-control border-0 shadow-none"
                      value={cicloLectivo}
                      onChange={(e) =>
                        setCicloLectivo(
                          e.target.value === "" ? "" : Number(e.target.value)
                        )
                      }
                      placeholder="2025 (ejemplo)"
                      min={2000}
                      disabled={saving}
                    />
                  </div>
                </div>

                <div className="d-flex border-bottom">
                  <div className="bg-light fw-semibold p-2 col-4">
                    Docente/s Responsable/s
                  </div>
                  <div className="flex-grow-1 p-2">
                    <input
                      type="text"
                      className="form-control border-0 shadow-none"
                      value={docente}
                      onChange={(e) => setDocente(e.target.value)}
                      placeholder="Nombre del docente"
                      readOnly
                    />
                  </div>
                </div>

                <div className="d-flex border-bottom">
                  <div className="bg-light fw-semibold p-2 col-4">
                    Cantidad de alumnos inscriptos
                  </div>
                  <div className="flex-grow-1 p-2">
                    <input
                      type="number"
                      className="form-control border-0 shadow-none"
                      value={cantInscriptos}
                      onChange={(e) =>
                        setCantInscriptos(
                          e.target.value === "" ? "" : Number(e.target.value)
                        )
                      }
                      min={1}
                      placeholder="1"
                      disabled={saving}
                    />
                  </div>
                </div>

                <div className="d-flex border-bottom">
                  <div className="bg-light fw-semibold p-2 col-4">
                    Cantidad de comisiones clases teóricas
                  </div>
                  <div className="flex-grow-1 p-2">
                    <input
                      type="number"
                      className="form-control border-0 shadow-none"
                      value={cantTeoricas}
                      onChange={(e) =>
                        setCantTeoricas(
                          e.target.value === "" ? "" : Number(e.target.value)
                        )
                      }
                      min={1}
                      placeholder="1"
                      disabled={saving}
                    />
                  </div>
                </div>

                <div className="d-flex">
                  <div className="bg-light fw-semibold p-2 col-4">
                    Cantidad de comisiones clases prácticas
                  </div>
                  <div className="flex-grow-1 p-2">
                    <input
                      type="number"
                      className="form-control border-0 shadow-none"
                      value={cantPracticas}
                      onChange={(e) =>
                        setCantPracticas(
                          e.target.value === "" ? "" : Number(e.target.value)
                        )
                      }
                      min={1}
                      placeholder="1"
                      disabled={saving}
                    />
                  </div>
                </div>
              </div>
            </Card>

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
                        <label
                          htmlFor={`pregunta-${idPreguntaOpcion}`}
                          className="form-label form-label-required"
                        >
                          {pregunta.texto_pregunta ??
                            pregunta.texto ??
                            "Pregunta"}
                        </label>

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
                          id={`pregunta-${idPreguntaOpcion}`}
                          className="form-control"
                          style={{ minHeight: "80px" }}
                          value={
                            idPreguntaOpcion
                              ? answersByPreguntaOpcion[idPreguntaOpcion] ?? ""
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
                          required={Number(pregunta.id) !== 35}
                          disabled={saving}
                        />
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
