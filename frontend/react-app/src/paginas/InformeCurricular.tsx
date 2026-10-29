import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useCallback, useMemo } from "react"; 
import { useReportes } from "../hook/useReportes";
import { useInformesCurriculares } from "../hook/useInformesCurriculares";
import { useInformeCurricularBase } from "../hook/useInformeCurricularBase";
import { useResponderInforme } from "../hook/useResponderInforme";
import {EncabezadoReporte } from "../componentes/LayoutEncabezados";
import {
  Container,
  Card,
  Form,
  Row,
  Col,
  Button,
  Spinner,
} from "react-bootstrap";
import ResumenVariable from "../componentes/ResumenVariable";
import EmptyState from "../componentes/EmptyState";
import "../styles/informe.css"; 

import { useAlertaFlotante } from "../hook/useAlertaFlotante";
import AlertaFlotante from "../componentes/AlertaFlotante";

const RESPUESTAS_DEMO_INFORME: Record<number, string> = {
  32: "Se requiere actualizar el laboratorio de informática y ampliar la bibliografía específica de ingeniería de software.",
  33: "Se dictó el 95% de las horas teóricas y el 100% de las prácticas previstas, cumpliendo el cronograma acordado.",
  34: "Se desarrolló el 100% de los contenidos planificados, incorporando casos prácticos y actividades de seguimiento.",
  35: "Los resultados de las encuestas muestran una valoración general positiva y sostenida, con oportunidades de mejora en la articulación teoría-práctica.",
  36: "El dictado se desarrolló con normalidad, con buena participación del alumnado y cumplimiento de los objetivos propuestos.",
  37: "El equipo participó en jornadas de capacitación docente y en proyectos de extensión vinculados con la carrera.",
  38: "La valoración del desempeño de los auxiliares es muy buena, por su compromiso y acompañamiento a los estudiantes.",
};

function obtenerRespuestaDemo(pregunta: any): string {
  const respuestaPorId = RESPUESTAS_DEMO_INFORME[Number(pregunta?.id)];
  if (respuestaPorId) return respuestaPorId;

  const enunciado = String(pregunta?.texto_pregunta ?? "").toLowerCase();
  if (enunciado.includes("hora")) {
    return "Se cumplió con las horas previstas, manteniendo el cronograma y recuperando las clases necesarias.";
  }
  if (enunciado.includes("contenido")) {
    return "Se desarrollaron los contenidos planificados con actividades prácticas y ejemplos aplicados.";
  }
  if (enunciado.includes("equipo") || enunciado.includes("auxiliar")) {
    return "El equipo docente mostró compromiso, buena predisposición y acompañamiento permanente a los estudiantes.";
  }
  if (enunciado.includes("resultado") || enunciado.includes("encuesta")) {
    return "Los resultados reflejan una valoración positiva general, con aspectos puntuales para seguir mejorando.";
  }

  return "La actividad se desarrolló según lo planificado, con participación del alumnado y cumplimiento de los objetivos propuestos.";
}

export default function InformeCurricular() {
  const { reporteId } = useParams();
  const navigate = useNavigate();

  const { fetchReporteById, fetchResumenByReporteId } = useReportes();
  const { crearInformeCurricular } = useInformesCurriculares();
  const { fetchInformeBaseActual } = useInformeCurricularBase();
  const {
    answersByPreguntaOpcion,
    setTextoRespuesta,
    guardarRespuestasInforme,
  } = useResponderInforme();


  const { alerta, mostrarAlerta, cerrarAlerta } = useAlertaFlotante();

  const handleAlertExited = () => {
    if (alerta.variant === 'success') {
      navigate("/docente/reportes");
    }
  };


  const [reporte, setReporte] = useState<any>(null);
  const [loadingReporte, setLoadingReporte] = useState(true);
  const [errorReporte, setErrorReporte] = useState<string | null>(null);

  const [resumenData, setResumenData] = useState<any>(null);
  const [loadingResumen, setLoadingResumen] = useState(true);
  const [errorResumen, setErrorResumen] = useState<string | null>(null);

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

  const handleAutocompletarDemo = useCallback(() => {
    if (!informeBase) return;

    setCantInscriptos(35);
    setCantTeoricas(2);
    setCantPracticas(2);

    informeBase.preguntas?.forEach((pregunta: any) => {
      const idPreguntaOpcion = pregunta.pregunta_opcion?.[0]?.id;
      if (!idPreguntaOpcion) return;
      setTextoRespuesta(idPreguntaOpcion, obtenerRespuestaDemo(pregunta));
    });

    mostrarAlerta(
      "info",
      "Datos de demo cargados. Revisá las respuestas y guardá el informe."
    );
  }, [informeBase, setTextoRespuesta, mostrarAlerta]);

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

  // --- Lógica de Submit ---
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

        const informeCreado = await crearInformeCurricular(payloadCabecera);
        const idDocente = 1; 
        const result = await guardarRespuestasInforme(
          idDocente,
          informeCreado.id
        );

        if (!result.ok && result.conflict) {
          mostrarAlerta("danger", result.detail || "El informe ya tiene una respuesta registrada.");
          return;
        }

        if (!result.ok) {
          throw new Error(
            result.detail || "No se pudo guardar la respuesta del informe."
          );
        }

        mostrarAlerta("success", "Informe guardado correctamente ✔");

      } catch (err: any) {
        console.error(err);
        mostrarAlerta("danger", err?.message || "No se pudo guardar el informe curricular.");
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
      mostrarAlerta,
    ]
  );

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

  if (loadingReporte || loadingBase || loadingResumen) return <div className="container mt-4">Cargando...</div>;
  if (errorReporte) return <div className="container mt-4 text-danger">{errorReporte}</div>;
  if (errorBase) return <div className="container mt-4 text-danger">{errorBase}</div>;
  if (errorResumen) return <div className="container mt-4 text-danger">{errorResumen}</div>;
  if (!reporte) {
    return (
      <Container className="container mt-4">
        <EmptyState
          icon="bi-file-earmark-x"
          title="Sin datos del reporte"
          message="No se pudo cargar la información del reporte solicitado."
        />
      </Container>
    );
  }
  if (!informeBase) return <div className="container mt-4">Plantilla no disponible.</div>;
  if (!resumenData) return <div className="container mt-4">Datos de resumen no disponibles.</div>;

  return (
    <div className="container mt-4">
      
      <AlertaFlotante 
        show={alerta.show}
        variant={alerta.variant}
        message={alerta.message}
        onClose={cerrarAlerta}
        onExited={handleAlertExited}
      />

      <div className="d-flex justify-content-between align-items-center gap-3 mb-3">
        <h2 className="text-primary fw-bold mb-0">
          Informe de Actividad Curricular
        </h2>
        <Button
          type="button"
          variant="outline-secondary"
          size="sm"
          onClick={handleAutocompletarDemo}
          disabled={saving}
        >
          Autocompletar Demo
        </Button>
      </div>

      <EncabezadoReporte
        asignatura={asignatura.nombre}
        anio={asignatura.año}
        docente={asignatura.nombre_docente}
        carrera={asignatura.carrera}
        ciclo_lectivo={cicloLectivo as number}
        anio_inicio={reporte.encuesta_asignatura?.encuesta_base?.anio_inicio}
        anio_fin={reporte.encuesta_asignatura?.encuesta_base?.anio_fin}
        sede={sede}
      >
        <Container className="mt-5 text-start">
          <Row>
            <Col lg={12} md={12} className="mx-auto">
              <Form onSubmit={handleSubmit}>
                
                <Card className="border rounded shadow-sm mb-4 bg-white">
                  <Card.Header as="h5" className="bg-primary text-white">
                    Datos Administrativos
                  </Card.Header>
                  <Card.Body className="p-4">
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
                        <Form.Control type="text" value={cicloLectivo} readOnly plaintext />
                      </Col>
                    </Form.Group>

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
                          placeholder="Ingrese el numero en digitos"
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
                          placeholder="Ingrese el numero en digitos"
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
                          placeholder="Ingrese el numero en digitos"
                          required
                          disabled={saving}
                        />
                      </Col>
                    </Form.Group>
                  </Card.Body>
                </Card>

                <Card className="border rounded shadow-sm bg-white">
                  <Card.Header as="h5" className="bg-primary text-white">
                    Responda
                  </Card.Header>
                  <Card.Body className="p-4">

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
                                <Row className="g-4">
                                  {resumenVariablesFiltradas.map(
                                    ({ codigo, resumen, nombreVar }) => (
                                      <Col md={6} key={nombreVar}>
                                        <Card
                                          className="border rounded shadow-sm bg-white h-100"
                                          style={{ fontSize: "0.9rem" }}
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
                                      </Col>
                                    )
                                  )}
                                </Row>
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
        </Container>
      </EncabezadoReporte>
    </div>
  );
}