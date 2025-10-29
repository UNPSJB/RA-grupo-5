import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { useReportes } from "../hook/useReportes";
import { useInformesCurriculares } from "../hook/useInformesCurriculares";
import { useInformeBase } from "../hook/useInformeBase";
import { useResponderInforme } from "../hook/useResponderInforme";
import LayoutReporte from "../componentes/LayoutReporte";
import { Container, Card, Toast, ToastContainer } from "react-bootstrap";

export default function InformeCurricular() {
  const { reporteId } = useParams();
  const navigate = useNavigate();

  const { fetchReporteById } = useReportes();
  const { crearInformeCurricular } = useInformesCurriculares();
  const { fetchInformeBaseActual } = useInformeBase();

  const {
    answersByPreguntaOpcion,
    setTextoRespuesta,
    guardarRespuestasInforme,
  } = useResponderInforme();

  const [reporte, setReporte] = useState<any>(null);
  const [loadingReporte, setLoadingReporte] = useState(true);
  const [errorReporte, setErrorReporte] = useState<string | null>(null);

  const [informeBase, setInformeBase] = useState<any>(null);
  const [loadingBase, setLoadingBase] = useState(true);
  const [errorBase, setErrorBase] = useState<string | null>(null);

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

        if (
          asignatura?.ciclo_lectivo === 0 ||
          asignatura?.ciclo_lectivo === "" ||
          asignatura?.ciclo_lectivo === undefined ||
          asignatura?.ciclo_lectivo === null
        ) {
          setCicloLectivo("");
        } else {
          setCicloLectivo(Number(asignatura.ciclo_lectivo));
        }
      } catch (err) {
        setErrorReporte("Error cargando el reporte.");
      } finally {
        setLoadingReporte(false);
      }
    }

    cargarReporte();
  }, [reporteId, fetchReporteById]);

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
          sede: sede,
          ciclo_lectivo: Number(cicloLectivo),
          docente: docente,
          cant_alumnos_insc: cantInscriptos === "" ? 0 : Number(cantInscriptos),
          cant_comisiones_teoricas:
            cantTeoricas === "" ? 0 : Number(cantTeoricas),
          cant_comisiones_practicas:
            cantPracticas === "" ? 0 : Number(cantPracticas),
          id_informe_base: informeBase.id,
          id_asignatura: id_asignatura,
          id_reporte: Number(reporteId),
        };

        const informeCreado = await crearInformeCurricular(payloadCabecera);

        // TODO: usar docente logueado real
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
  if (loadingReporte || loadingBase) {
    return <div className="container mt-4">Cargando...</div>;
  }

  if (errorReporte) {
    return <div className="container mt-4 text-danger">{errorReporte}</div>;
  }
  if (errorBase) {
    return <div className="container mt-4 text-danger">{errorBase}</div>;
  }
  if (!reporte) {
    return <div className="container mt-4">No hay datos del reporte.</div>;
  }
  if (!informeBase) {
    return (
      <div className="container mt-4">
        No hay plantilla de Informe Base disponible.
      </div>
    );
  }

  const asignatura = reporte.encuesta_asignatura?.asignatura || {};

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
          {/* Overlay modal centrado cuando showToast = true */}
          {showToast && (
            <div
              style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(0,0,0,0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 2000,
              }}
            >
              <ToastContainer
                style={{
                  position: "static",
                  zIndex: 2100,
                  minWidth: "320px",
                  maxWidth: "90vw",
                }}
              >
                <Toast
                  bg={toastVariant === "success" ? "success" : "danger"}
                  onClose={() => {
                    setShowToast(false);
                    if (toastVariant === "success") {
                      navigate("/docente");
                    }
                  }}
                  show={showToast}
                  delay={5000}
                  autohide
                >
                  <Toast.Header closeButton={true}>
                    <strong className="me-auto">
                      {toastVariant === "success" ? "Listo" : "Error"}
                    </strong>
                  </Toast.Header>
                  <Toast.Body className="text-white">{toastMessage}</Toast.Body>
                </Toast>
              </ToastContainer>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Card de datos administrativos */}
            <Card
              className="shadow-sm p-4 mb-4 border-0"
              style={{ fontSize: "0.95rem", borderRadius: "0.75rem" }}
            >
              <h5 className="mb-3 fw-semibold text-secondary text-center">
                Informe de Actividad Curricular
              </h5>

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
                      disabled={showToast}
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
                      disabled={showToast}
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
                      disabled={showToast}
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
                      disabled={showToast}
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
                      disabled={showToast}
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
                      disabled={showToast}
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Card de respuestas abiertas */}
            <Card className="shadow-lg border-0">
              <Card.Body
                style={
                  showToast
                    ? {
                        filter: "blur(2px) brightness(0.8)",
                        pointerEvents: "none",
                      }
                    : {}
                }
              >
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
                            disabled={showToast}
                          />
                        </label>
                      </div>
                    );
                  })}
                </div>

                {/* contenedor del botón. lo dejamos centrado y reservamos altura */}
                <div
                  className="d-flex justify-content-center"
                  style={{
                    minHeight: "3rem",
                  }}
                >
                  {!showToast && (
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={saving}
                    >
                      {saving ? "Guardando..." : "Guardar Informe"}
                    </button>
                  )}
                </div>
              </Card.Body>
            </Card>
          </form>
        </Container>
      </LayoutReporte>
    </div>
  );
}
