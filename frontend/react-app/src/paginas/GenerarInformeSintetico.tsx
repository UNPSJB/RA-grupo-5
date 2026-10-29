import React, { useState, useEffect, useCallback } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import {
  Container,
  Form,
  Col,
  Card,
  Tabs,
  Tab,
  Button,
  Row,
  Spinner,
  Badge,
} from "react-bootstrap";
import type { Respuesta } from "../types/InformeSintetico";

import { useInformeSinteticoBase } from "../hook/useInformeSinteticoBase";
import { useResponderInformeSintetico } from "../hook/useResponderInformeSintetico";
import { useInformesParaSintetico } from "../hook/useInformesParaSintetico";
import { useInformesSinteticos } from "../hook/useInformesSinteticos";

import { useAlertaFlotante } from "../hook/useAlertaFlotante";
import AlertaFlotante from "../componentes/AlertaFlotante";

import "../styles/informe.css";

const findRespuestaPorPreguntaId = (
  preguntaId: number,
  respuesta: Respuesta | null
): React.ReactNode => {
  if (!respuesta || !respuesta.detalles) {
    return <em className="text-muted">Sin Respuesta</em>;
  }
  const detalle = respuesta.detalles.find(
    (d) => d.pregunta_opcion?.id_pregunta === preguntaId
  );
  if (detalle) {
    if (detalle.texto_respuesta_abierta) {
      return detalle.texto_respuesta_abierta;
    }
    return <em className="text-muted">N/A (Sin texto)</em>;
  }
  return <em className="text-muted">Sin Respuesta</em>;
};

const COMISION_ASESORA_DEMO =
  "Mg. Laura Fernández (Presidenta), Ing. Martín Álvarez (Vocal), Lic. Carolina Ríos (Vocal)";
const INTEGRANTES_DEMO =
  "Mg. Laura Fernández, Ing. Martín Álvarez, Lic. Carolina Ríos, Ing. Pablo Méndez";

interface ContextoDemoSintetico {
  carrera?: string;
  sede?: string;
  ciclo?: number | null;
  cuatrimestre?: string;
  totalInformes: number;
}

function obtenerTextoSinteticoDemo(
  pregunta: any,
  indice: number,
  contexto: ContextoDemoSintetico
): string {
  const enunciado = String(pregunta?.texto_pregunta ?? "").toLowerCase();
  const carrera = contexto.carrera || "la carrera";
  const sede = contexto.sede || "la sede correspondiente";
  const ciclo = contexto.ciclo || "el período evaluado";
  const cuatrimestre = contexto.cuatrimestre || "el cuatrimestre";
  const totalInformes = contexto.totalInformes;

  if (enunciado.includes("información general") || indice === 0) {
    return `El presente informe sintético corresponde a ${carrera}, sede ${sede}, ciclo lectivo ${ciclo}, ${cuatrimestre}. Se integran y analizan ${totalInformes} informes curriculares de las asignaturas involucradas, elaborados por los equipos de cátedra. Durante el período se desarrollaron las actividades académicas previstas con normalidad, se sostuvo la articulación entre las asignaturas de la carrera y la Comisión Asesora acompañó el seguimiento de los procesos de enseñanza y aprendizaje. La participación de docentes y estudiantes fue adecuada y permitió relevar información consistente para la toma de decisiones académicas.`;
  }

  if (enunciado.includes("equipamiento") || enunciado.includes("bibliografía")) {
    return `Se identifican como necesidades prioritarias la actualización de la bibliografía específica de las asignaturas del período, incorporando al menos dos títulos actualizados por espacio curricular y material complementario en formato digital. También se requiere ampliar la disponibilidad de insumos para actividades prácticas, renovar parte del equipamiento informático de las aulas y laboratorios, y garantizar conectividad estable para el desarrollo de clases y trabajos prácticos. Estas mejoras permitirían sostener la calidad de las propuestas formativas y favorecer la participación de todo el estudiantado.`;
  }

  if (enunciado.includes("porcentaje de horas") || enunciado.includes("horas de clases")) {
    return `Se dictó en promedio el 94% de las horas teóricas y el 96% de las horas prácticas previstas en el plan de estudios. Las diferencias registradas se explican por feriados, jornadas institucionales y contingencias puntuales, y fueron recuperadas mediante clases de consulta, actividades asincrónicas y ajustes en el cronograma. No se registran incumplimientos significativos que afecten el desarrollo de los contenidos mínimos de las asignaturas.`;
  }

  if (enunciado.includes("contenidos planificados") || enunciado.startsWith("2.a")) {
    return `Se alcanzó aproximadamente el 96% de los contenidos planificados en el conjunto de los espacios curriculares. En las asignaturas con mayor carga práctica se priorizaron los núcleos conceptuales y las competencias esenciales, complementando el dictado con actividades de refuerzo y seguimiento. Para el próximo dictado se propone ajustar la distribución temporal de los trabajos prácticos, incorporar instancias de evaluación formativa y fortalecer la articulación entre teoría y práctica para completar el cronograma sin sobrecargar a los estudiantes.`;
  }

  if (
    enunciado.includes("aspectos positivos") ||
    enunciado.includes("obstáculos") ||
    enunciado.startsWith("2.c")
  ) {
    return `Aspectos positivos: se destaca el compromiso de los equipos de cátedra, la planificación de las actividades, la incorporación de recursos didácticos variados y la buena predisposición para acompañar a los estudiantes. Obstáculos: se registraron dificultades vinculadas con la disponibilidad de recursos tecnológicos, la heterogeneidad de saberes previos y algunas superposiciones de fechas de evaluación. Estrategias para el próximo dictado: profundizar las instancias de nivelación, coordinar el calendario de evaluaciones entre asignaturas, ampliar el uso de aulas virtuales y promover actividades prácticas colaborativas.`;
  }

  if (
    enunciado.includes("capacitación") ||
    enunciado.includes("investigación") ||
    enunciado.includes("extensión")
  ) {
    return `Los integrantes de los equipos de cátedra participaron en jornadas de capacitación docente, talleres de actualización disciplinar y actividades de perfeccionamiento vinculadas con sus áreas de desempeño. Asimismo, se registró participación en proyectos de investigación, acciones de extensión universitaria y tareas de gestión académica. Estas actividades fortalecieron la formación del plantel docente y permitieron transferir experiencias y resultados al trabajo áulico. Se considera pertinente continuar promoviendo estas instancias y favorecer su socialización entre las distintas cátedras.`;
  }

  if (enunciado.includes("auxiliares")) {
    return `La valoración del desempeño de los auxiliares de cátedra es muy buena. Se destaca su compromiso, puntualidad, predisposición para el acompañamiento de los estudiantes y participación activa en las actividades prácticas y de consulta. La justificación informada por los equipos de cátedra refiere a la responsabilidad asumida en el seguimiento de los trabajos, la colaboración en la preparación de materiales y la comunicación permanente con los estudiantes. Se recomienda sostener las instancias de formación y acompañamiento para los auxiliares.`;
  }

  if (
    enunciado.includes("observaciones") ||
    enunciado.includes("comisión asesora")
  ) {
    return `La Comisión Asesora observa un desarrollo adecuado de las actividades académicas del período y valora el trabajo de los equipos de cátedra. Se recomienda continuar fortaleciendo la articulación entre asignaturas, sostener las acciones de nivelación y acompañamiento estudiantil, y avanzar en la actualización de recursos bibliográficos y tecnológicos. Asimismo, se sugiere sistematizar las estrategias de recuperación de clases y socializar las buenas prácticas identificadas para contribuir a la mejora continua de la carrera.`;
  }

  const textosGenericos = [
    `La actividad se desarrolló de acuerdo con lo planificado para ${carrera} durante ${ciclo}, con participación de los equipos de cátedra y cumplimiento de los objetivos académicos propuestos.`,
    `Se registró un desarrollo normal de las actividades previstas en ${cuatrimestre}, con acompañamiento docente y seguimiento de los procesos de aprendizaje.`,
    `La Comisión Asesora considera que la información relevada resulta suficiente para realizar el seguimiento académico del período y propone continuar con las acciones de mejora acordadas.`,
  ];

  return textosGenericos[indice % textosGenericos.length];
}

export default function GenerarInformeSintetico() {
  const { carreraId } = useParams<{ carreraId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const numCarreraId = carreraId ? parseInt(carreraId, 10) : null;
  const numCiclo = searchParams.get("ciclo")
    ? parseInt(searchParams.get("ciclo")!, 10)
    : null;
  const cuatrimestre = searchParams.get("cuatrimestre") || "";

  const { fetchInformeSinteticoBaseActual } = useInformeSinteticoBase();
  const {
    informesFiltrados,
    periodosEncuesta,
    carrera,
    loading: loadingInformes,
  } = useInformesParaSintetico(numCarreraId, numCiclo, cuatrimestre);
  const { crearInformeSinteticoCarrera } = useInformesSinteticos();
  const {
    answersByPreguntaOpcion,
    setTextoRespuesta,
    guardarRespuestaSintetico,
  } = useResponderInformeSintetico();

  const { alerta, mostrarAlerta, cerrarAlerta } = useAlertaFlotante();

  const handleAlertExited = () => {
    if (alerta.variant === "success") {
      navigate("/departamento/informes-sinteticos");
    }
  };

  const [informeBase, setInformeBase] = useState<any>(null);
  const [loadingBase, setLoadingBase] = useState(true);
  const [comisionAsesora, setComisionAsesora] = useState("");
  const [integrantes, setIntegrantes] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchInformeSinteticoBaseActual()
      .then(setInformeBase)
      .catch((err) => console.error(err))
      .finally(() => setLoadingBase(false));
  }, [fetchInformeSinteticoBaseActual]);

  const handleAutocompletarDemo = useCallback(() => {
    if (!informeBase?.preguntas?.length) return;

    const contexto: ContextoDemoSintetico = {
      carrera: carrera?.nombre,
      sede: carrera?.sede,
      ciclo: numCiclo,
      cuatrimestre,
      totalInformes: informesFiltrados.length,
    };

    informeBase.preguntas.forEach((pregunta: any, indice: number) => {
      const idPreguntaOpcion = pregunta.pregunta_opcion?.[0]?.id;
      if (!idPreguntaOpcion) return;
      setTextoRespuesta(
        idPreguntaOpcion,
        obtenerTextoSinteticoDemo(pregunta, indice, contexto)
      );
    });

    setComisionAsesora(COMISION_ASESORA_DEMO);
    setIntegrantes(INTEGRANTES_DEMO);

    mostrarAlerta(
      "info",
      "Textos de demo cargados. Podés editarlos antes de guardar el informe."
    );
  }, [
    informeBase,
    carrera,
    numCiclo,
    cuatrimestre,
    informesFiltrados,
    setTextoRespuesta,
    mostrarAlerta,
  ]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (
        !carrera ||
        !informeBase ||
        !numCiclo ||
        !informesFiltrados ||
        !cuatrimestre
      )
        return;

      setSaving(true);

      try {
        const payloadCabecera = {
          ciclo_lectivo: numCiclo.toString(),
          cursado: cuatrimestre,
          comision_asesora: comisionAsesora,
          sede: carrera.sede,
          integrantes: integrantes,
          id_carrera: carrera.id,
          id_informe_sintetico_base: informeBase.id,
          estado: "abierto" as const,
          informes_asignaturas: informesFiltrados.map((inf) => inf.id),
        };

        const informeCreado = await crearInformeSinteticoCarrera(
          payloadCabecera
        );

        const resultGuardado = await guardarRespuestaSintetico(
          informeCreado.id
        );

        if (!resultGuardado.ok) {
          throw new Error(
            resultGuardado.detail ||
              "No se pudo guardar la respuesta del informe."
          );
        }

        mostrarAlerta("success", "Informe Sintético guardado ✔");
      } catch (err: any) {
        console.error(err);
        mostrarAlerta("danger", err?.message || "Error al guardar el informe.");
      } finally {
        setSaving(false);
      }
    },
    [
      carrera,
      informeBase,
      numCiclo,
      cuatrimestre,
      informesFiltrados,
      comisionAsesora,
      integrantes,
      crearInformeSinteticoCarrera,
      guardarRespuestaSintetico,
      mostrarAlerta,
    ]
  );

  if (loadingInformes || loadingBase) {
    return <Container className="mt-4">Cargando datos...</Container>;
  }
  if (!carrera)
    return (
      <Container className="mt-4 alert alert-danger">
        Error: No se pudo cargar la Carrera.
      </Container>
    );
  if (!informeBase)
    return (
      <Container className="mt-4 alert alert-danger">
        Error: No se pudo cargar la Plantilla Base.
      </Container>
    );
  if (!informesFiltrados)
    return (
      <Container className="mt-4 alert alert-danger">
        Error: informesFiltrados es nulo.
      </Container>
    );

  return (
    <Container>
      <AlertaFlotante
        show={alerta.show}
        variant={alerta.variant}
        message={alerta.message}
        onClose={cerrarAlerta}
        onExited={handleAlertExited}
      />

      <Form onSubmit={handleSubmit}>
        <Col md={10} lg={8} className="mx-auto my-4">
          <Card className="mb-4 border rounded shadow-sm bg-white">
            <Card.Header as="h4" className="bg-primary text-white">
              Generar Informe Sintético - {carrera.nombre}
            </Card.Header>
            <Card.Body className="p-4">
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                <Card.Title as="h5" className="mb-0">
                  {informeBase.titulo}
                </Card.Title>
                <Button
                  type="button"
                  variant="outline-secondary"
                  size="sm"
                  onClick={handleAutocompletarDemo}
                  disabled={saving}
                  title="Completar los textos con datos académicos de ejemplo"
                >
                  <i className="bi bi-magic me-2" />
                  Autocompletar Demo
                </Button>
              </div>
              <Row>
                <Col md={6}>
                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={5} className="fw-semibold">
                      Ciclo Lectivo:
                    </Form.Label>
                    <Col sm={7}>
                      <Form.Control
                        type="text"
                        value={numCiclo || ""}
                        readOnly
                        plaintext
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={5} className="fw-semibold">
                      Sede:
                    </Form.Label>
                    <Col sm={7}>
                      <Form.Control
                        type="text"
                        value={carrera.sede || ""}
                        readOnly
                        plaintext
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={5} className="fw-semibold">
                      Cursado:
                    </Form.Label>
                    <Col sm={7}>
                      <Form.Control
                        type="text"
                        value={cuatrimestre}
                        readOnly
                        plaintext
                      />
                    </Col>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3" controlId="formComision">
                    <Form.Label className="fw-semibold">
                      Comisión Asesora
                      <span className="text-danger ms-1">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={comisionAsesora}
                      onChange={(e) => setComisionAsesora(e.target.value)}
                      required
                      disabled={saving}
                      placeholder="Ej: Mg. Juan Perez"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formIntegrantes">
                    <Form.Label className="fw-semibold">
                      Integrantes
                      <span className="text-danger ms-1">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={integrantes}
                      onChange={(e) => setIntegrantes(e.target.value)}
                      required
                      disabled={saving}
                      placeholder="Ej: Dr. Ana Gomez, Ing. Luis Tapia"
                    />
                  </Form.Group>
                </Col>
              </Row>
              {periodosEncuesta.length > 0 && (
                <div className="border-top pt-3 mt-1">
                  <span className="text-muted fw-semibold me-2">
                    Periodo de encuestas:
                  </span>
                  {periodosEncuesta.map((periodo) => (
                    <Badge
                      key={periodo}
                      bg="light"
                      text="dark"
                      className="border fw-semibold me-2"
                    >
                      {periodo}
                    </Badge>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>

          <Card className="mb-4 border rounded shadow-sm bg-white">
            <Card.Header as="h5" className="bg-light">
              Informes Curriculares incluídos ({informesFiltrados.length})
            </Card.Header>
            <Card.Body className="p-4">
              <Tabs
                defaultActiveKey={informesFiltrados[0]?.id?.toString()}
                id="informes-tabs"
                className="mb-3"
                justify
              >
                {informesFiltrados.map((informeAsignatura) => {
                  const preguntas =
                    informeAsignatura.informe_curricular_base?.preguntas || [];
                  return (
                    <Tab
                      key={informeAsignatura.id}
                      eventKey={informeAsignatura.id.toString()}
                      title={
                        informeAsignatura.asignatura?.nombre || "Asignatura"
                      }
                    >
                      <div className="py-3">
                        <div className="p-3 bg-light rounded mb-3">
                          <strong>Docente:</strong> {informeAsignatura.docente}{" "}
                          |<strong> Año:</strong>{" "}
                          {informeAsignatura.asignatura?.año} |
                          <strong> Alumnos:</strong>{" "}
                          {informeAsignatura.cant_alumnos_insc}
                        </div>

                        {preguntas.length > 0 ? (
                          preguntas.map((pregunta) => (
                            <div
                              key={pregunta.id}
                              className="border-top py-3 text-start"
                            >
                              <h6 className="fw-bold">
                                {pregunta.texto_pregunta}
                              </h6>
                              <div
                                className="ps-3"
                                style={{ whiteSpace: "pre-wrap" }}
                              >
                                {findRespuestaPorPreguntaId(
                                  pregunta.id,
                                  informeAsignatura.respuesta as any
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="py-3">
                            <p className="text-muted">
                              No hay preguntas definidas.
                            </p>
                          </div>
                        )}
                      </div>
                    </Tab>
                  );
                })}
              </Tabs>
            </Card.Body>
          </Card>

          <Card className="border rounded shadow-sm bg-white mt-5">
            <Card.Header as="h5" className="bg-primary text-white">
              Análisis y Conclusiones del Departamento
            </Card.Header>
            <Card.Body className="p-4">
              {informeBase.preguntas?.map((pregunta: any) => {
                const primeraOpcion = pregunta.pregunta_opcion?.[0];
                const idPreguntaOpcion = primeraOpcion?.id;
                const esObligatoria = pregunta.obligatoria === true;
                const idHtml = `pregunta-${idPreguntaOpcion}`;

                return (
                  <Form.Group
                    className="mb-3 text-start"
                    key={idPreguntaOpcion ?? pregunta.id}
                    controlId={idHtml}
                  >
                    <Form.Label className="fw-bold">
                      {pregunta.texto_pregunta ?? "Pregunta"}
                      {esObligatoria && (
                        <span className="text-danger ms-1">*</span>
                      )}
                    </Form.Label>
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
                          setTextoRespuesta(idPreguntaOpcion, e.target.value);
                        }
                      }}
                      required={esObligatoria}
                      disabled={saving}
                      style={{ minHeight: "100px" }}
                    />
                  </Form.Group>
                );
              })}

              <div className="d-flex justify-content-center mt-4">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={saving}
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
                    "Guardar Informe Sintético"
                  )}
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Form>
    </Container>
  );
}
