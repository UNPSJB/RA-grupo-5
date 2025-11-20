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
          data.encuesta_asignatura?.ciclo_lectivo ? Number(data.encuesta_asignatura?.ciclo_lectivo) : "" // <-- Respetamos tu cambio
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

  // --- 5. LÓGICA DE SUBMIT (RESTAURADA) ---
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!reporte || !informeBase) return;

      setSaving(true); // <-- LLAMADA FALTANTE
      try {
        const asignatura = reporte.encuesta_asignatura?.asignatura;
        const id_asignatura =
          asignatura?.id ||
          asignatura?.id_asignatura ||
          asignatura?.idAsignatura;

        const payloadCabecera = {
          estado: "abierto",
          sede,
          ciclo_lectivo: Number(cicloLectivo),
          docente,
          cant_alumnos_insc: Number(cantInscriptos) || 0,
          cant_comisiones_teoricas: Number(cantTeoricas) || 0,
          cant_comisiones_practicas: Number(cantPracticas) || 0,
          id_informe_curricular_base: informeBase.id,
          id_asignatura,
          id_reporte: Number(reporteId),
        };

        // 1) Crear cabecera
        const informeCreado = await crearInformeCurricular(payloadCabecera);

        // 2) Enviar respuestas
        const idDocente = 1; // TODO: id real del usuario
        const result = await guardarRespuestasInforme(
          idDocente,
          informeCreado.id
        );

        // 3) Manejo de resultado
        if (!result.ok && result.conflict) {
          setAlert({
            show: true,
            exiting: false,
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
          exiting: false,
          variant: "success",
          message: "Informe guardado correctamente ✔",
        });
      } catch (err: any) {
        console.error(err);
        setAlert({
          show: true,
          exiting: false,
          variant: "danger",
          message: err?.message || "No se pudo guardar el informe curricular.",
        });
      } finally {
        setSaving(false); // <-- LLAMADA FALTANTE
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
      navigate,
    ]
  );

  // --- 6. LÓGICA DE VARIABLES (useMemo es un hook) ---
  const asignatura = reporte?.encuesta_asignatura?.asignatura || {};
  
  const resumenVariablesFiltradas = useMemo(() => {
    // ... (Toda tu lógica de 'resumenVariablesFiltradas' se mantiene igual)
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
      {/* ¡CAMBIO AQUÍ! Título de la página con color primario */}
      <h2 className="text-primary fw-bold">Informe de Actividad Curricular</h2>

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
          <Row>
            <Col lg={9} md={10} className="mx-auto">
              
              <Form onSubmit={handleSubmit}>
                
                {/* --- Card de datos administrativos (CON TEMA) --- */}
                <Card className="border rounded shadow-sm mb-4">
                  {/* ¡CAMBIO AQUÍ! Encabezado temático */}
                  <Card.Header as="h5" className="bg-primary text-white">
                    Datos Administrativos
                  </Card.Header>
                  <Card.Body className="p-4">
                    {/* ... (Todo tu Formulario Administrativo Refactorizado) ... */}
                    <Form.Group as={Row} className="mb-3" controlId="formSede">
                      <Form.Label column sm={4} className="fw-semibold">Sede</Form.Label>
                      <Col sm={8}>
                        <Form.Control type="text" value={sede} readOnly plaintext />
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
                          plaintext
                          readOnly
                        />
                      </Col>
                    </Form.Group>
                    
                    {/* ... (El resto de tus Form.Group de admin) ... */}
                    <Form.Group as={Row} className="mb-3" controlId="formDocente">
                      <Form.Label column sm={4} className="fw-semibold">Docente/s Responsable/s</Form.Label>
                      <Col sm={8}>
                        <Form.Control type="text" value={docente} readOnly plaintext />
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
                          onChange={(e) => setCantInscriptos(e.target.value === "" ? "" : Number(e.target.value))}
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
                          onChange={(e) => setCantTeoricas(e.target.value === "" ? "" : Number(e.target.value))}
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
                          onChange={(e) => setCantPracticas(e.target.value === "" ? "" : Number(e.target.value))}
                          min={1}
                          placeholder="1"
                          required
                          disabled={saving}
                        />
                      </Col>
                    </Form.Group>

                  </Card.Body>
                </Card>

                {/* --- Card de preguntas (CON TEMA) --- */}
                <Card className="border rounded shadow-sm">
                  {/* ¡CAMBIO AQUÍ! Encabezado temático */}
                  <Card.Header as="h5" className="bg-primary text-white">
                    Responda
                  </Card.Header>
                  <Card.Body className="p-4">
                    {/* El h5 que estaba aquí se movió al Card.Header */}

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
                            {pregunta.texto_pregunta ?? "Pregunta"}
                            {esObligatoria && (
                              <span className="text-danger ms-1">*</span>
                            )}
                          </Form.Label>

                          {Number(pregunta.id) === 35 && (
                            <div className="my-3">
                              {resumenVariablesFiltradas.length > 0 ? (
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
                                          {/* Este text-secondary ahora será GRIS */}
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
                      {/* ¡Este botón ahora será AZUL UNPSJB! */}
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
        </Container>
      </LayoutReporte>
    </div>
  );
}