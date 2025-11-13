import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useCallback, useMemo } from "react"; 
import { useReportes } from "../hook/useReportes";
import { useInformesCurriculares } from "../hook/useInformesCurriculares";
import { useInformeCurricularBase } from "../hook/useInformeCurricularBase";
import { useResponderInforme } from "../hook/useResponderInforme";
import LayoutReporte from "../componentes/LayoutReporte";
import {
  Container,
  Card,
  Alert,
  Form,
  Row,
  Col,
  Button,
  Spinner,
} from "react-bootstrap";
import ResumenVariable from "../componentes/ResumenVariable";
import "../styles/informe.css"; 

export default function InformeCurricular() {
  const { reporteId } = useParams();
  const navigate = useNavigate();

  // --- 1. HOOKS DE DATOS ---
  const { fetchReporteById, fetchResumenByReporteId } = useReportes();
  const { crearInformeCurricular } = useInformesCurriculares();
  const { fetchInformeBaseActual } = useInformeCurricularBase();
  const {
    answersByPreguntaOpcion,
    setTextoRespuesta,
    guardarRespuestasInforme,
  } = useResponderInforme();

  // --- 2. ESTADOS DE CARGA Y DATOS ---
  const [reporte, setReporte] = useState<any>(null);
  const [loadingReporte, setLoadingReporte] = useState(true);
  const [errorReporte, setErrorReporte] = useState<string | null>(null);

  const [resumenData, setResumenData] = useState<any>(null);
  const [loadingResumen, setLoadingResumen] = useState(true);
  const [errorResumen, setErrorResumen] = useState<string | null>(null);

  const [informeBase, setInformeBase] = useState<any>(null);
  const [loadingBase, setLoadingBase] = useState(true);
  const [errorBase, setErrorBase] = useState<string | null>(null);

  // --- 3. ESTADOS DEL FORMULARIO ---
  const [sede, setSede] = useState("");
  const [cicloLectivo, setCicloLectivo] = useState<number | "">("");
  const [docente, setDocente] = useState("");
  const [cantInscriptos, setCantInscriptos] = useState<number | "">("");
  const [cantTeoricas, setCantTeoricas] = useState<number | "">("");
  const [cantPracticas, setCantPracticas] = useState<number | "">("");

  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState<{
    show: boolean;
    exiting: boolean;
    variant: "success" | "danger" | "warning" | "info";
    message: string;
  }>({ show: false, exiting: false, variant: "success", message: "" });

  // --- 4. useEffects (PARA ALERTAS Y CARGA DE DATOS) ---
  // (Todos tus useEffects se quedan aquí)
  useEffect(() => {
    if (!alert.show || alert.exiting) return;
    const t = setTimeout(() => {
      setAlert((a) => ({ ...a, exiting: true, show: false }));
    }, 2500);
    return () => clearTimeout(t);
  }, [alert.show, alert.exiting]);

  useEffect(() => {
    if (!alert.exiting) return;
    const t = setTimeout(() => {
      const go = alert.variant === "success";
      setAlert({
        show: false,
        exiting: false,
        variant: "success",
        message: "",
      });
      if (go) navigate("/docente");
    }, 300);
    return () => clearTimeout(t);
  }, [alert.exiting, alert.variant, navigate]);

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
          asignatura?.año ? Number(asignatura.año) : ""
        );
      } catch {
        setErrorReporte("Error cargando el reporte.");
      } finally {
        setLoadingReporte(false);
      }
    }
    cargarReporte();
  }, [reporteId, fetchReporteById]);

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

  // --- 5. LÓGICA DE SUBMIT (useCallback es un hook) ---
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      // ... (Toda tu lógica de guardado se mantiene igual) ...
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
      navigate,
    ]
  );

  // --- 6. LÓGICA DE VARIABLES (useMemo es un hook) ---
  const asignatura = reporte?.encuesta_asignatura?.asignatura || {};
  
  const resumenVariablesFiltradas = useMemo(() => {
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

    return Object.entries(resultados)
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
  }, [resumenData]); 

  // --- 7. ESTADOS DE CARGA / ERRORES (EARLY RETURNS) ---
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

  // -------- 8. RENDER REFACTORIZADO --------
  return (
    <div className="container mt-4">
      <h2>Informe de Actividad Curricular</h2>

      {/* Alerta flotante (depende de tu informe.css) */}
      {(alert.show || alert.exiting) && (
        <div
          className={`alert-float ${
            alert.exiting ? "alert-float-hide" : "alert-float-show"
          }`}
        >
          <Alert
            show={alert.show}
            variant={alert.variant}
            dismissible
            transition={false}
            onClose={() =>
              setAlert((a) => ({
                ...a,
                exiting: true,
                show: false,
              }))
            }
            className="shadow-lg"
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
        <Container className="mt-5 text-start">
          {/* --- INICIO DEL GRID CONSISTENTE --- */}
          <Row>
            <Col lg={9} md={10} className="mx-auto">
              
              <Form onSubmit={handleSubmit}>
                
                <Card className="border rounded shadow-sm mb-4">
                  <Card.Header as="h5">
                    Datos Administrativos
                  </Card.Header>
                  <Card.Body className="p-4">
                    <Form.Group as={Row} className="mb-3" controlId="formSede">
                      <Form.Label column sm={4} className="fw-semibold">
                        Sede
                      </Form.Label>
                      <Col sm={8}>
                        <Form.Control
                          type="text"
                          value={sede}
                          readOnly
                          plaintext
                        />
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="formCiclo">
                      <Form.Label column sm={4} className="fw-semibold">
                        Ciclo Lectivo
                        <span className="text-danger ms-1">*</span>
                      </Form.Label>
                      <Col sm={8}>
                        <Form.Control
                          type="number"
                          value={cicloLectivo}
                          onChange={(e) =>
                            setCicloLectivo(
                              e.target.value === "" ? "" : Number(e.target.value)
                            )
                          }
                          placeholder="2025 (ejemplo)"
                          min={2000}
                          required
                          disabled={saving}
                        />
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="formDocente">
                      <Form.Label column sm={4} className="fw-semibold">
                        Docente/s Responsable/s
                      </Form.Label>
                      <Col sm={8}>
                        <Form.Control
                          type="text"
                          value={docente}
                          readOnly
                          plaintext
                        />
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="formInscriptos">
                      <Form.Label column sm={4} className="fw-semibold">
                        Cantidad de alumnos inscriptos
                        <span className="text-danger ms-1">*</span>
                      </Form.Label>
                      <Col sm={8}>
                        <Form.Control
                          type="number"
                          value={cantInscriptos}
                          onChange={(e) =>
                            setCantInscriptos(
                              e.target.value === "" ? "" : Number(e.target.value)
                            )
                          }
                          min={1}
                          placeholder="1"
                          required
                          disabled={saving}
                        />
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="formTeoricas">
                      <Form.Label column sm={4} className="fw-semibold">
                        Cantidad de comisiones teóricas
                        <span className="text-danger ms-1">*</span>
                      </Form.Label>
                      <Col sm={8}>
                        <Form.Control
                          type="number"
                          value={cantTeoricas}
                          onChange={(e) =>
                            setCantTeoricas(
                              e.target.value === "" ? "" : Number(e.target.value)
                            )
                          }
                          min={1}
                          placeholder="1"
                          required
                          disabled={saving}
                        />
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="formPracticas">
                      <Form.Label column sm={4} className="fw-semibold">
                        Cantidad de comisiones prácticas
                        <span className="text-danger ms-1">*</span>
                      </Form.Label>
                      <Col sm={8}>
                        <Form.Control
                          type="number"
                          value={cantPracticas}
                          onChange={(e) =>
                            setCantPracticas(
                              e.target.value === "" ? "" : Number(e.target.value)
                            )
                          }
                          min={1}
                          placeholder="1"
                          required
                          disabled={saving}
                        />
                      </Col>
                    </Form.Group>
                  </Card.Body>
                </Card>

                <Card className="border rounded shadow-sm">
                  <Card.Body className="p-4">
                    <h5 className="mb-4">Responda:</h5>

                    {informeBase.preguntas?.map((pregunta: any) => {
                      const primeraOpcion = pregunta.pregunta_opcion?.[0];
                      const idPreguntaOpcion = primeraOpcion?.id;
                      const esObligatoria = pregunta.obligatoria === true;
                      const idHtml = `pregunta-${idPreguntaOpcion}`;

                      return (
                        <Form.Group
                          className="mb-4" 
                          key={idPreguntaOpcion ?? pregunta.id ?? Math.random()}
                          controlId={idHtml}
                        >
                          <Form.Label className="fw-bold">
                            {pregunta.texto_pregunta ??
                              pregunta.texto ??
                              "Pregunta"}
                            {esObligatoria && (
                              <span className="text-danger ms-1">*</span>
                            )}
                          </Form.Label>

                          {Number(pregunta.id) === 35 && (
                            <div className="my-3">
                              {resumenVariablesFiltradas.length > 0 ? (
                                // --- ¡CAMBIO AQUÍ! ---
                                <div className="d-flex flex-wrap gap-3 mt-2 justify-content-center">
                                  {resumenVariablesFiltradas.map(
                                    ({ codigo, resumen, nombreVar }) => (
                                      <Card
                                        key={nombreVar}
                                        className="border rounded shadow-sm"
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

                          <Form.Control
                            as="textarea"
                            rows={3} 
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
                            required={esObligatoria}
                            disabled={saving}
                          />
                        </Form.Group>
                      );
                    })}

                    <div className="text-center mt-4">
                      <Button
                        variant="primary"
                        type="submit"
                        disabled={saving}
                        size="lg"
                      >
                        {saving ? (
                           <>
                             <Spinner
                               as="span"
                               animation="border"
                               size="sm"
                               role="status"
                               aria-hidden="true"
                               className="me-2"
                             />
                             Guardando...
                           </>
                        ) : (
                           "Guardar Informe"
                        )}
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Form>

            </Col>
          </Row>
          {/* --- FIN DEL GRID CONSISTENTE --- */}
        </Container>
      </LayoutReporte>
    </div>
  );
}