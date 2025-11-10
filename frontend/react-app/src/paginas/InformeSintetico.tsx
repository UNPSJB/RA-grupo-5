import React from "react";
import { useParams, Link } from "react-router-dom";
import { useInformeSinteticoCarrera } from "../hook/useInformeSinteticoCarrera";
import type { Respuesta } from "../types/InformeSintetico";
import { Container, Form, Col, Card, Tabs, Tab } from "react-bootstrap";

const findRespuestaPorPreguntaId = (
  preguntaId: number,
  respuesta: Respuesta | null
): React.ReactNode => {
  if (!respuesta || !respuesta.detalles) {
    return <em className="text-muted">Sin Respuesta</em>;
  }

  const detalle = respuesta.detalles.find(
    (d) => {
      return d.pregunta_opcion?.id_pregunta === preguntaId;
    }
  );

  if (detalle) {
    if (detalle.texto_respuesta_abierta) {
      return detalle.texto_respuesta_abierta;
    }
    return <em className="text-muted">N/A (Sin texto)</em>;
  }

  return <em className="text-muted">Sin Respuesta</em>;
};

export default function InformeSintetico() {
  const { id } = useParams<{ id: string }>();
  const informeId = id ? parseInt(id, 10) : null;

  const { informe, loading, error } = useInformeSinteticoCarrera(informeId);

  if (loading || !informe) {
    return <Container className="mt-4">Cargando informe...</Container>;
  }
  if (error) {
    return (
      <Container className="mt-4 alert alert-danger">
        Error: {error.message}
      </Container>
    );
  }

  return (
    <Container>
      <Col md={8} className="mx-auto mt-4 shadow">
        <Card className="mb-4 ">
          <Card.Header as="h4">
            Informe Sintético - {informe.carrera.nombre}
          </Card.Header>
          <Card.Body className="">
            <Card.Title as="h4" className="m-2">
              {informe.informe_sintetico_base.titulo}
            </Card.Title>
            <Card.Text as="div" className="text-start">
              <p>
                <strong>Ciclo Lectivo:</strong> {informe.ciclo_lectivo}
              </p>
              <p>
                <strong>Comisión Asesora:</strong> {informe.comision_asesora}
              </p>
              <p>
                <strong>Sede:</strong> {informe.sede}
              </p>
              <p>
                <strong>Integrantes:</strong> {informe.integrantes}
              </p>
            </Card.Text>
          </Card.Body>
        </Card>

        <Tabs
          defaultActiveKey={informe.informes_asignaturas[0]?.id?.toString()}
          id="informes-tabs"
          className="mb-3"
          justify
        >
          {informe.informes_asignaturas.map((informeAsignatura) => {
            const preguntas =
              informeAsignatura.informe_curricular_base?.preguntas || [];

            return (
              <Tab
                key={informeAsignatura.id}
                eventKey={informeAsignatura.id.toString()}
                title={informeAsignatura.asignatura?.nombre || "Asignatura"}
              >
                <Card className="mb-4">
                  <Card.Header as="h5">
                    Docente: {informeAsignatura.docente} | Año:{" "}
                    {informeAsignatura.asignatura?.año} | Alumnos Inscritos:{" "}
                    {informeAsignatura.cant_alumnos_insc}
                  </Card.Header>

                  {preguntas.length > 0 ? (
                    preguntas.map((pregunta) => (
                      <Card.Body key={pregunta.id} className="border-bottom">
                        <Card.Title as="h6">
                          {pregunta.texto_pregunta}
                        </Card.Title>
                        <Card.Text as="div" className="ps-3">
                          {findRespuestaPorPreguntaId(
                            pregunta.id,
                            informeAsignatura.respuesta
                          )}
                        </Card.Text>
                      </Card.Body>
                    ))
                  ) : (
                    <Card.Body>
                      <p className="text-muted">
                        No hay preguntas definidas para este informe.
                      </p>
                    </Card.Body>
                  )}
                </Card>
              </Tab>
            );
          })}
        </Tabs>

        <Form className="mb-4 p-4">
          <Form.Label>
            <strong>Aca va la pregunta:</strong>
          </Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Comentarios generales sobre el informe..."
          ></Form.Control>

          <Link
            to={`/departamento/generar-informe/${informe.id}`}
            className="btn btn-primary mt-4"
          >
            Guarda informe sintetico
          </Link>
        </Form>
      </Col>
    </Container>
  );
}
