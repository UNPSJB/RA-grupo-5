import React from 'react';
import { useParams } from 'react-router-dom';
import { useInformeSinteticoCarrera } from '../hook/useInformeSinteticoCarrera';

import type { Respuesta } from '../types/InformeSintetico';

// Importamos los componentes de layout de React Bootstrap
import { Container, Row, Col, Card, Tabs, Tab } from 'react-bootstrap';

/**
 * Función Helper (Sin cambios)
 * Busca la respuesta correcta para una pregunta específica.
 */
const findRespuestaPorPreguntaId = (
  preguntaId: number,
  respuestas: Respuesta[]
): React.ReactNode => {
  for (const respuesta of respuestas) {
    for (const detalle of respuesta.detalles) {
      if (detalle.pregunta_opcion?.pregunta?.id === preguntaId) {
        if (detalle.texto_respuesta_abierta) {
          return detalle.texto_respuesta_abierta;
        }
        return <em className="text-muted">N/A (Sin texto)</em>;
      }
    }
  }
  return <em className="text-muted">Sin Respuesta</em>;
};

export const DetalleInformeCarrera: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const informeId = id ? parseInt(id, 10) : null;

  const { informe, loading, error } = useInformeSinteticoCarrera(informeId);

  if (loading || !informe) {
    return <Container className="mt-4">Cargando informe...</Container>;
  }
  if (error) {
    return <Container className="mt-4 alert alert-danger">Error: {error.message}</Container>;
  }

  return (
    <Container className="mt-4">
      {/* =========================================== */}
      {/* 1. Fila de Resumen (Arriba) */}
      {/* =========================================== */}
      <Card className="shadow-sm mb-4">
        <Card.Header as="h1" className="h4 bg-light">
          {informe.carrera.nombre}
        </Card.Header>
        <Card.Body>
          <Row>
            {/* Columna de Detalles */}
            <Col md={9}>
              <Card.Title as="h5" className="h6 text-muted">
                {informe.informe_sintetico.titulo}
              </Card.Title>
              <Card.Text as="div" className="mt-3">
                <p className="mb-1">
                  <strong>Ciclo Lectivo:</strong> {informe.ciclo_lectivo}
                </p>
                <p className="mb-1">
                  <strong>Comisión Asesora:</strong> {informe.comision_asesora}
                </p>
                <p className="mb-0">
                  <strong>Integrantes:</strong> {informe.integrantes}
                </p>
              </Card.Text>
            </Col>
            
            {/* Columna de Stats */}
            <Col md={3} className="d-flex align-items-center justify-content-center mt-3 mt-md-0">
              <div className="text-center p-3 bg-light rounded w-100">
                <span className="text-muted fw-semibold" style={{ fontSize: "0.9rem" }}>
                  Informes de Asignatura
                </span>
                <span className="text-primary fw-bold d-block" style={{ fontSize: "2.5rem" }}>
                  {informe.informes_asignaturas.length}
                </span>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* =========================================== */}
      {/* 2. Card de Contenido Principal (Tabs) */}
      {/* =========================================== */}
      <Card className="shadow-sm">
        <Card.Body>
          <h2 className="h4">Informes Curriculares (Anexo I)</h2>
          <p className="text-muted">
            Respuestas de los docentes para cada asignatura vinculada.
          </p>
          
          {informe.informes_asignaturas.length > 0 ? (
            <Tabs
              defaultActiveKey={informe.informes_asignaturas[0].id.toString()}
              id="informes-tabs"
              className="mb-3"
              justify
            >
              {/* Iteramos sobre los "Hijos" para crear Pestañas */}
              {informe.informes_asignaturas.map((informeAsig) => {
                const preguntas = informeAsig.informe_base?.preguntas || [];
                
                return (
                  <Tab
                    key={informeAsig.id}
                    eventKey={informeAsig.id.toString()}
                    title={informeAsig.asignatura?.nombre || "Asignatura"}
                  >
                    {/* Contenido de la pestaña */}
                    <div className="p-2">
                      <h5 className="text-muted">Docente: {informeAsig.docente}</h5>
                      <hr />
                      
                      {preguntas.length > 0 ? (
                        preguntas.map((pregunta) => (
                          <div className="mb-3 pt-2 border-bottom" key={pregunta.id}>
                            <p className="fw-bold">{pregunta.texto_pregunta}</p>
                            
                            {/* --- 3. Borde Azul Eliminado --- */}
                            <div className="ps-3 mb-2">
                              {findRespuestaPorPreguntaId(pregunta.id, informeAsig.respuestas)}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted">Este informe no tiene preguntas definidas.</p>
                      )}
                    </div>
                  </Tab>
                );
              })}
            </Tabs>
          ) : (
            <div className="alert alert-info">
              No hay informes de asignatura vinculados a este informe sintético.
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};