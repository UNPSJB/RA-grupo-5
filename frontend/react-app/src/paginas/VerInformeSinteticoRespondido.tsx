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
  Spinner
} from "react-bootstrap";
import { useForm } from 'react-hook-form';
import Variable from '../componentes/Variable'; // Usamos Variable para las preguntas abiertas
import { obtenerNombreCampo } from '../validaciones/Encuesta';
import type { InformeSinteticoCarrera } from "../types/InformeSintetico";

// Helper reutilizado para mostrar respuestas en los Tabs (texto plano)
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Hook del formulario (solo para visualización controlada)
  const { control, formState: { errors }, reset } = useForm();

  useEffect(() => {
    if (!id) return;

    const cargarInforme = async () => {
      setLoading(true);
      try {
        // 1. Cargar el informe COMPLETO (incluye respuestas y asignaturas linkeadas gracias a los joins del backend)
        const res = await fetch(`http://localhost:8000/informe-sintetico-carrera/${id}`);
        if (!res.ok) throw new Error("Error al cargar el informe sintético");
        const data: InformeSinteticoCarrera = await res.json();
        setInforme(data);

        // 2. Mapear las respuestas del DEPARTAMENTO (Conclusiones) al formulario
        const valoresIniciales: Record<string, any> = {};
        
        // La respuesta viene dentro del objeto informe (relación 1 a 1)
        if (data.respuesta && data.respuesta.detalles) {
            data.respuesta.detalles.forEach((detalle: any) => {
                if (detalle.pregunta_opcion) {
                    const idPregunta = detalle.pregunta_opcion.id_pregunta;
                    const fieldName = obtenerNombreCampo(idPregunta);
                    // Asignamos el texto de la respuesta
                    if (detalle.texto_respuesta_abierta) {
                        valoresIniciales[fieldName] = detalle.texto_respuesta_abierta;
                    }
                }
            });
        }
        reset(valoresIniciales);

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    cargarInforme();
  }, [id, reset]);

  if (loading) {
    return <Container className="mt-4 text-center"><Spinner animation="border" variant="primary" /></Container>;
  }
  if (error) {
    return <Container className="mt-4"><Alert variant="danger">Error: {error}</Alert></Container>;
  }
  if (!informe) return null;

  return (
    <Container>
      {/* Título fuera de la tarjeta */}
      <h2 className="text-primary fw-bold mt-4 mb-4">Informe Sintético Finalizado</h2>

      <Form>
        <Col md={10} lg={8} className="mx-auto mb-5">
          
          {/* 1. Cabecera de Datos (Read-Only) */}
          <Card className="mb-4 border rounded shadow-sm">
            {/* Color Secondary para indicar lectura */}
            <Card.Header as="h4" className="bg-secondary text-white">
               {informe.carrera?.nombre}
            </Card.Header>
            <Card.Body className="p-4 bg-light">
              <Card.Title as="h5" className="mb-3">
                {informe.informe_sintetico_base?.titulo}
              </Card.Title>
              <Row className="mb-2">
                <Col md={6}>
                  <p><strong>Ciclo Lectivo:</strong> {informe.ciclo_lectivo}</p>
                  <p><strong>Sede:</strong> {informe.sede}</p>
                </Col>
                <Col md={6}>
                  <p><strong>Comisión Asesora:</strong> <br/> {informe.comision_asesora}</p>
                  <p><strong>Integrantes:</strong> <br/> {informe.integrantes}</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* 2. Pestañas de Informes Curriculares Incluidos (Read-Only) */}
          <Card className="mb-4 border rounded shadow-sm">
            <Card.Header as="h5" className="bg-secondary text-white">
              Informes Curriculares incluídos
            </Card.Header>
            <Card.Body className="p-4">
              <Tabs
                defaultActiveKey={informe.informes_asignaturas?.[0]?.id?.toString()}
                id="informes-tabs-read"
                className="mb-3"
                justify
              >
                {informe.informes_asignaturas?.map((informeAsignatura: any) => {
                  const preguntas = informeAsignatura.informe_curricular_base?.preguntas || [];
                  return (
                    <Tab
                      key={informeAsignatura.id}
                      eventKey={informeAsignatura.id.toString()}
                      title={informeAsignatura.asignatura?.nombre || "Asignatura"}
                    >
                      <div className="py-3">
                        <div className="p-3 bg-white border rounded mb-3">
                          <strong>Docente:</strong> {informeAsignatura.docente} | 
                          <strong> Año:</strong> {informeAsignatura.asignatura?.año} | 
                          <strong> Alumnos:</strong> {informeAsignatura.cant_alumnos_insc}
                        </div>
                        {preguntas.length > 0 ? (
                          preguntas.map((pregunta: any) => (
                            <div key={pregunta.id} className="border-top py-3 text-start">
                              <h6 className="fw-bold">
                                {pregunta.texto_pregunta}
                              </h6>
                              <div className="ps-3 text-muted" style={{ whiteSpace: 'pre-wrap' }}>
                                {findRespuestaPorPreguntaId(
                                  pregunta.id,
                                  informeAsignatura.respuesta
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="py-3"><p className="text-muted">No hay preguntas definidas.</p></div>
                        )}
                      </div>
                    </Tab>
                  );
                })}
              </Tabs>
            </Card.Body>
          </Card>

          {/* 3. Conclusiones del Departamento (Read-Only) */}
          <Card className="border rounded shadow-sm">
            <Card.Header as="h5" className="bg-secondary text-white">
              Análisis y Conclusiones del Departamento
            </Card.Header>
            <Card.Body className="p-4">
                {/* Renderizamos las preguntas usando el componente Variable (truco para reusar UI y lógica de Pregunta) */}
                {informe.informe_sintetico_base?.preguntas?.map((pregunta: any) => (
                    <div key={pregunta.id} className="mb-3">
                         <Variable 
                            variable={{
                                id: 0, 
                                nombre: "", // Sin título extra
                                codigo: "CON", 
                                preguntas: [pregunta]
                            } as any}
                            control={control}
                            errors={errors}
                            disabled={true} // <--- CLAVE: Todo deshabilitado para lectura
                        />
                    </div>
                ))}

              <div className="d-flex justify-content-center mt-4">
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => navigate("/departamento/informes-sinteticos-respondidos")}
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