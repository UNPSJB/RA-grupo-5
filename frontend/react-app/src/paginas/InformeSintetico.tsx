import React from 'react';
import { useParams } from 'react-router-dom';
import { useInformeSinteticoCarrera } from '../hook/useInformeSinteticoCarrera';

import type { Respuesta } from '../types/InformeSintetico';

// Importamos los componentes de layout de React Bootstrap
import { Container, Col, Card, Tabs, Tab } from 'react-bootstrap';

// Esta función auxiliar se queda igual, ya que solo se usa en este archivo
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

// --- CAMBIO 1 ---
// Quitamos "export const" y la anotación de tipo ": React.FC"
// y lo reemplazamos por "export default function"
export default function InformeSintetico() {
  
  const { id } = useParams<{ id: string }>();
  const informeId = id ? parseInt(id, 10) : null;

  const { informe, loading, error } = useInformeSinteticoCarrera(informeId);

  // (Manejo de estados - Sin cambios)
  if (loading || !informe) {
    return <Container className="mt-4">Cargando informe...</Container>;
  }
  if (error) {
    return <Container className="mt-4 alert alert-danger">Error: {error.message}</Container>;
  }


  return (
    <Container>
      <Col md={8} className="mx-auto mt-4 shadow">
        {/* --- Card del "Padre" (Sin cambios) --- */}
        <Card className="mb-4 ">
          <Card.Header as="h4">
            Informe Sintético - {informe.carrera.nombre}
          </Card.Header>
          <Card.Body className=''>
            <Card.Title as="h4" className='m-2'>
              {informe.informe_sintetico.titulo}
            </Card.Title>
            <Card.Text as="div" className='text-start'>
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
          defaultActiveKey={informe.informes_asignaturas[0]?.id.toString()}
          id="informes-tabs"
          className="mb-3"
          justify
        >
          {informe.informes_asignaturas.map((informeAsignatura) => {
            const preguntas = informeAsignatura.informe_base?.preguntas || [];
            
            return (
              <Tab
                key={informeAsignatura.id}
                eventKey={informeAsignatura.id.toString()}
                title={informeAsignatura.asignatura?.nombre || "Asignatura"}
              >
                <Card className='mb-4'>
                  <Card.Header as="h5">
                    Docente: {informeAsignatura.docente} | Año: {informeAsignatura.asignatura?.año} | Alumnos Inscritos: {informeAsignatura.cant_alumnos_insc}
                  </Card.Header>

                  {preguntas.length > 0 ? (
                    preguntas.map((pregunta) => (
                      <Card.Body key={pregunta.id} className="border-bottom">
                        <Card.Title as="h6">{pregunta.texto_pregunta}</Card.Title>
                        <Card.Text as="div" className="ps-3">
                          {findRespuestaPorPreguntaId(pregunta.id, informeAsignatura.respuestas)}
                        </Card.Text>
                      </Card.Body>
                    ))
                  ) : (
                    <Card.Body>
                      <p className="text-muted">No hay preguntas definidas para este informe.</p>
                    </Card.Body>
                  )}
                    
                </Card>
              </Tab>
            );
          })}
        </Tabs>
      </Col>
    </Container>
  );
};
