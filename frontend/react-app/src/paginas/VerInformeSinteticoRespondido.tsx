import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Form,
  Col,
  Card,
  Tabs,
  Tab,
  Alert,
  Button,
  Row,
  Spinner,
} from "react-bootstrap";
import type { InformeSinteticoCarrera } from "../types/InformeSintetico";
import apiFetch from "../api/client";

// --- HELPER PARA BUSCAR RESPUESTA EN INFORMES CURRICULARES HIJOS ---
const findRespuestaPorPreguntaId = (
  preguntaId: number,
  respuesta: any
): React.ReactNode => {
  if (!respuesta || !respuesta.detalles) {
    return <em className="text-muted">Sin Respuesta</em>;
  }
  const detalle = respuesta.detalles.find(
    (d: any) => d.pregunta_opcion?.id_pregunta === preguntaId
  );
  if (detalle) {
    if (detalle.texto_respuesta_abierta) {
      return detalle.texto_respuesta_abierta;
    }
    return <em className="text-muted">N/A (Sin texto)</em>;
  }
  return <em className="text-muted">Sin Respuesta</em>;
};

export default function VerInformeSinteticoRespondido() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [informe, setInforme] = useState<InformeSinteticoCarrera | null>(null);

  // Estado separado para la base (donde están las preguntas)
  const [informeBase, setInformeBase] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estado para mapear las respuestas del DEPARTAMENTO (ID Pregunta -> Texto)
  const [respuestasVisualizacion, setRespuestasVisualizacion] = useState<
    Record<number, string>
  >({});

  useEffect(() => {
    if (!id) return;

    const cargarDatos = async () => {
      setLoading(true);
      try {
        // 1. Cargar el informe COMPLETO (Datos, Hijos, Respuesta)
        const res = await apiFetch(`/informe-sintetico-carrera/${id}`);
        if (!res.ok) throw new Error("Error al cargar el informe sintético");
        const data: InformeSinteticoCarrera = await res.json();
        setInforme(data);

        // 2. Cargar la BASE DEL INFORME por separado para asegurar las preguntas
        if (data.id_informe_sintetico_base) {
          const resBase = await apiFetch(
            `/informes-sinteticos-base/${data.id_informe_sintetico_base}`
          );
          if (resBase.ok) {
            const dataBase = await resBase.json();
            setInformeBase(dataBase);
          } else {
            console.error("No se pudo cargar la base del informe");
          }
        }

        // 3. Procesar las respuestas del departamento (Conclusiones)
        const respuestasMap: Record<number, string> = {};
        if (data.respuesta && data.respuesta.detalles) {
          data.respuesta.detalles.forEach((detalle: any) => {
            if (
              detalle.pregunta_opcion &&
              detalle.pregunta_opcion.id_pregunta
            ) {
              const idPregunta = detalle.pregunta_opcion.id_pregunta;
              if (detalle.texto_respuesta_abierta) {
                respuestasMap[idPregunta] = detalle.texto_respuesta_abierta;
              }
            }
          });
        }
        setRespuestasVisualizacion(respuestasMap);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [id]);

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }
  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">Error: {error}</Alert>
      </Container>
    );
  }
  if (!informe) return null;

  const informesHijos = informe.informes_asignaturas || [];
  const cursado = informesHijos[0]?.asignatura?.cursado || "";

  return (
    <Container>
      <h2 className="text-primary fw-bold mt-4 mb-4">
        Informe Sintético Finalizado
      </h2>

      <Form>
        <Col md={10} lg={8} className="mx-auto my-4">
          {/* 1. Cabecera de Datos (Read-Only) */}
          <Card className="mb-4 border rounded shadow-sm">
            <Card.Header as="h4" className="bg-secondary text-white">
              {informe.carrera?.nombre}
            </Card.Header>
            <Card.Body className="p-4 bg-light">
              <Card.Title as="h5" className="mb-3">
                {informeBase?.titulo || "Informe Sintético"}
              </Card.Title>
              <Row className="mb-2">
                <Col md={6}>
                  <p>
                    <strong>Ciclo Lectivo:</strong> {informe.ciclo_lectivo}
                  </p>
                  <p>
                    <strong>Sede:</strong> {informe.sede}
                  </p>
                  <p>
                    <strong>Cursado:</strong> {cursado}
                  </p>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">
                      Comisión Asesora
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={informe.comision_asesora}
                      disabled
                      style={{ backgroundColor: "#e9ecef", cursor: "default" }}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Integrantes</Form.Label>
                    <Form.Control
                      type="text"
                      value={informe.integrantes}
                      disabled
                      style={{ backgroundColor: "#e9ecef", cursor: "default" }}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* 2. Pestañas de Informes Curriculares Incluidos (Read-Only) */}
          <Card className="mb-4 border rounded shadow-sm">
            <Card.Header as="h5" className="bg-secondary text-white">
              Informes Curriculares incluídos ({informesHijos.length})
            </Card.Header>
            <Card.Body className="p-4">
              <Tabs
                defaultActiveKey={informesHijos[0]?.id?.toString()}
                id="informes-tabs-read"
                className="mb-3"
                justify
              >
                {informesHijos.map((informeAsignatura: any) => {
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
                        <div className="p-3 bg-white border rounded mb-3">
                          <strong>Docente:</strong> {informeAsignatura.docente}{" "}
                          | <strong> Año:</strong>{" "}
                          {informeAsignatura.asignatura?.año} |{" "}
                          <strong> Alumnos:</strong>{" "}
                          {informeAsignatura.cant_alumnos_insc}
                        </div>
                        {preguntas.length > 0 ? (
                          preguntas.map((pregunta: any) => (
                            <div
                              key={pregunta.id}
                              className="border-top py-3 text-start"
                            >
                              <h6 className="fw-bold">
                                {pregunta.texto_pregunta}
                              </h6>
                              <div
                                className="ps-3 text-muted"
                                style={{ whiteSpace: "pre-wrap" }}
                              >
                                {findRespuestaPorPreguntaId(
                                  pregunta.id,
                                  informeAsignatura.respuesta
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

          {/* 3. Conclusiones del Departamento (Opinión Final) - ReadOnly */}
          <Card className="border rounded shadow-sm mt-5">
            <Card.Header as="h5" className="bg-secondary text-white">
              Análisis y Conclusiones del Departamento
            </Card.Header>
            <Card.Body className="p-4">
              {informeBase?.preguntas?.length > 0 ? (
                informeBase.preguntas.map((pregunta: any) => {
                  const textoRespuesta =
                    respuestasVisualizacion[pregunta.id] ||
                    "(Sin respuesta registrada)";
                  const primeraOpcion = pregunta.pregunta_opcion?.[0];
                  const idHtml = `pregunta-${primeraOpcion?.id || pregunta.id}`;

                  return (
                    <Form.Group
                      className="mb-3 text-start"
                      key={pregunta.id}
                      controlId={idHtml}
                    >
                      <Form.Label className="fw-bold">
                        {pregunta.texto_pregunta}
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        value={textoRespuesta}
                        disabled
                        style={{
                          minHeight: "100px",
                          backgroundColor: "#e9ecef",
                          cursor: "default",
                          resize: "none",
                        }}
                      />
                    </Form.Group>
                  );
                })
              ) : (
                <div className="text-muted text-center py-3">
                  No se encontraron preguntas de conclusión en la plantilla
                  base.
                </div>
              )}

              <div className="d-flex justify-content-center mt-4">
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() =>
                    navigate("/departamento/informes-sinteticos-respondidos")
                  }
                >
                  Volver al Listado
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Form>
    </Container>
  );
}
