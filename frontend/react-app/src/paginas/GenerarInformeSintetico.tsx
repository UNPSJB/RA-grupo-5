import React, { useState, useEffect, useCallback } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
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
import type { Respuesta } from "../types/InformeSintetico";


import { useInformeSinteticoBase } from "../hook/useInformeSinteticoBase";
import { useResponderInformeSintetico } from "../hook/useResponderInformeSintetico";
import { useInformesParaSintetico } from "../hook/useInformesParaSintetico";
import { useInformesSinteticos } from "../hook/useInformesSinteticos";

import "../styles/informe.css"; 
import { Cursado } from "../types/models/Cursado";


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


type AlertState = {
  show: boolean;
  exiting: boolean;
  variant: "success" | "danger";
  message: string;
};


export default function GenerarInformeSintetico() {
  const { carreraId } = useParams<{ carreraId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const numCarreraId = carreraId ? parseInt(carreraId, 10) : null;
  const numCiclo = searchParams.get("ciclo") ? parseInt(searchParams.get("ciclo")!, 10) : null;
  const cuatrimestre = searchParams.get("cuatrimestre");

  const { fetchInformeSinteticoBaseActual } = useInformeSinteticoBase();
  const { informesFiltrados, carrera, loading: loadingInformes } = useInformesParaSintetico(numCarreraId, numCiclo, cuatrimestre);
  

  const { crearInformeSinteticoCarrera } = useInformesSinteticos(numCiclo ?? 0, cuatrimestre ?? ""); // (el ciclo no se usa en la función create, pero el hook lo pide)
  const { answersByPreguntaOpcion, setTextoRespuesta, guardarRespuestaSintetico } = useResponderInformeSintetico();
  
  const [informeBase, setInformeBase] = useState<any>(null);
  const [loadingBase, setLoadingBase] = useState(true);
  const [comisionAsesora, setComisionAsesora] = useState("");
  const [integrantes, setIntegrantes] = useState("");
  const [saving, setSaving] = useState(false);
  

  const [alert, setAlert] = useState<AlertState>({ 
    show: false, 
    exiting: false, 
    variant: "success", 
    message: "" 
  });


  useEffect(() => {
    fetchInformeSinteticoBaseActual()
      .then(setInformeBase)
      .catch((err) => console.error(err))
      .finally(() => setLoadingBase(false));
  }, [fetchInformeSinteticoBaseActual]);


  useEffect(() => {
    if (!alert.show || alert.exiting) return;
    const t = setTimeout(() => setAlert((a: AlertState) => ({ ...a, exiting: true, show: false })), 2500);
    return () => clearTimeout(t);
  }, [alert.show, alert.exiting]);

  useEffect(() => {
    if (!alert.exiting) return;
    const t = setTimeout(() => {
      const go = alert.variant === "success";
      setAlert({ show: false, exiting: false, variant: "success", message: "" });
      if (go) navigate("/departamento/informes-sinteticos");
    }, 300);
    return () => clearTimeout(t);
  }, [alert.exiting, alert.variant, navigate]);
  

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!carrera || !informeBase || !numCiclo || !cuatrimestre || !informesFiltrados ) return;

    setSaving(true);
    try {
      const payloadCabecera = {
        ciclo_lectivo: numCiclo.toString(),
        comision_asesora: comisionAsesora,
        sede: carrera.sede,
        integrantes: integrantes,
        id_carrera: carrera.id,
        id_informe_sintetico_base: informeBase.id,
        estado: "abierto" as const, 
        informes_asignaturas: informesFiltrados.map(inf => inf.id), 
        cursado : cuatrimestre
      };
      const informeCreado = await crearInformeSinteticoCarrera(payloadCabecera);
      const idDepartamento = 1; 
      const resultGuardado = await guardarRespuestaSintetico(
        idDepartamento,
        informeCreado.id
      );
      if (!resultGuardado.ok) {
        throw new Error(resultGuardado.detail || "No se pudo guardar la respuesta del informe.");
      }
      setAlert({ show: true, exiting: false, variant: "success", message: "Informe Sintético guardado ✔" });
    } catch (err: any) {
      console.error(err);
      setAlert({ show: true, exiting: false, variant: "danger", message: err?.message || "Error al guardar el informe." });
    } finally {
      setSaving(false);
    }
  }, [
    carrera, informeBase, numCiclo, cuatrimestre, informesFiltrados, 
    comisionAsesora, integrantes,
    crearInformeSinteticoCarrera, guardarRespuestaSintetico,
    navigate
  ]);


  if (loadingInformes || loadingBase) {
    return (
      <Container className="mt-4">
        Cargando datos... 
      </Container>
    );
  }
  if (!carrera) {
    return <Container className="mt-4 alert alert-danger">Error: No se pudo cargar la <b>Carrera</b>...</Container>;
  }
  if (!informeBase) {
    return <Container className="mt-4 alert alert-danger">Error: No se pudo cargar la <b>Plantilla Base</b>...</Container>;
  }
  if (!informesFiltrados) { 
    return <Container className="mt-4 alert alert-danger">Error: <b>informesFiltrados</b> es nulo.</Container>;
  }
  

  return (
    <Container>
      {/* ALERT FLOTANTE */}
      {(alert.show || alert.exiting) && (
        <div className={`alert-float ${alert.exiting ? "alert-float-hide" : "alert-float-show"}`}>
          <Alert show={alert.show} variant={alert.variant} dismissible={false} transition={false} className="shadow-lg">
            {alert.message}
          </Alert>
        </div>
      )}


      <Form onSubmit={handleSubmit}>
        <Col md={10} lg={8} className="mx-auto my-4">
          

          <Card className="mb-4 border rounded shadow-sm">
            <Card.Header as="h4" className="bg-primary text-white">
              Generar Informe Sintético - {carrera.nombre}
            </Card.Header>
            <Card.Body className="p-4">
              <Card.Title as="h5" className="mb-3">
                {informeBase.titulo}
              </Card.Title>
              <Row>
                <Col md={6}>
                  <p><strong>Ciclo Lectivo:</strong> {numCiclo}</p>
                  <p><strong>Cuatrimestre:</strong> {cuatrimestre}</p>
                  <p><strong>Sede:</strong> {carrera.sede}</p>
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
            </Card.Body>
          </Card>

          <Card className="mb-4 border rounded shadow-sm">
            <Card.Header as="h5" className="bg-primary text-white">
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
                  const preguntas = informeAsignatura.informe_curricular_base?.preguntas || [];
                  return (
                    <Tab
                      key={informeAsignatura.id}
                      eventKey={informeAsignatura.id.toString()}
                      title={informeAsignatura.asignatura?.nombre || "Asignatura"}
                    >
                      <div className="py-3">
                        <div className="p-3 bg-light rounded mb-3">
                          <strong>Docente:</strong> {informeAsignatura.docente} | 
                          <strong> Año:</strong> {informeAsignatura.asignatura?.año} | 
                          <strong> Alumnos:</strong> {informeAsignatura.cant_alumnos_insc}
                        </div>
                        {preguntas.length > 0 ? (
                          preguntas.map((pregunta) => (
                            <div key={pregunta.id} className="border-top py-3 text-start">
                              <h6 className="fw-bold">
                                {pregunta.texto_pregunta}
                              </h6>
                              <div className="ps-3" style={{ whiteSpace: 'pre-wrap' }}>
                                {findRespuestaPorPreguntaId(
                                  pregunta.id,
                                  informeAsignatura.respuesta as any
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


          <Card className="border rounded shadow-sm mt-5">
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
                      {esObligatoria && <span className="text-danger ms-1">*</span>}
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={idPreguntaOpcion ? answersByPreguntaOpcion[idPreguntaOpcion] ?? "" : ""}
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