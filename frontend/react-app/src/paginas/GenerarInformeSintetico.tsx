import React, { useState, useEffect, useCallback } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { Container, Form, Col, Card, Tabs, Tab, Alert, Button } from "react-bootstrap";
import type { Respuesta } from "../types/InformeSintetico";

// Los 3 hooks nuevos
import { useInformeSinteticoBase } from "../hook/useInformeSinteticoBase";
import { useResponderInformeSintetico } from "../hook/useResponderInformeSintetico";
import { useInformesParaSintetico } from "../hook/useInformesParaSintetico";
// El hook modificado
import { useInformesSinteticos } from "../hook/useInformesSinteticos";

import "../styles/informe.css"; // Reutilizamos los estilos del alert flotante
import { Cursado } from "../types/models/Cursado";

// Función helper (copiada de InformeSintetico.tsx)
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


export default function GenerarInformeSintetico() {
  const { carreraId } = useParams<{ carreraId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const numCarreraId = carreraId ? parseInt(carreraId, 10) : null;
  const numCiclo = searchParams.get("ciclo") ? parseInt(searchParams.get("ciclo")!, 10) : null;
  const cuatrimestre = searchParams.get("cuatrimestre");

  // --- 1. Hooks de DATOS ---
  const { fetchInformeSinteticoBaseActual } = useInformeSinteticoBase();
  // Este hook nos trae los informes curriculares para las pestañas
  const { informesFiltrados, carrera, loading: loadingInformes } = useInformesParaSintetico(numCarreraId, numCiclo, cuatrimestre);
  
  // --- 2. Hooks de FORMULARIO y GUARDADO ---
  const { crearInformeSinteticoCarrera } = useInformesSinteticos(numCiclo ?? 0, cuatrimestre ?? ""); // (el ciclo no se usa en la función create, pero el hook lo pide)
  const { answersByPreguntaOpcion, setTextoRespuesta, guardarRespuestaSintetico } = useResponderInformeSintetico();
  
  // --- 3. Estado local de la PÁGINA ---
  const [informeBase, setInformeBase] = useState<any>(null); // La plantilla de preguntas
  const [loadingBase, setLoadingBase] = useState(true);
  
  // Estado para el formulario de cabecera
  const [comisionAsesora, setComisionAsesora] = useState("");
  const [integrantes, setIntegrantes] = useState("");

  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState<{ show: boolean; exiting: boolean; variant: "success" | "danger"; message: string; }>({ show: false, exiting: false, variant: "success", message: "" });

  // Cargar la plantilla de preguntas (el informe base sintético)
  useEffect(() => {
    fetchInformeSinteticoBaseActual()
      .then(setInformeBase)
      .catch((err) => console.error(err))
      .finally(() => setLoadingBase(false));
  }, [fetchInformeSinteticoBaseActual]);

  // --- Lógica de Alerta (copiada de InformeCurricular.tsx) ---
  useEffect(() => {
    if (!alert.show || alert.exiting) return;
    const t = setTimeout(() => setAlert((a) => ({ ...a, exiting: true, show: false })), 2500);
    return () => clearTimeout(t);
  }, [alert.show, alert.exiting]);

  useEffect(() => {
    if (!alert.exiting) return;
    const t = setTimeout(() => {
      const go = alert.variant === "success";
      setAlert({ show: false, exiting: false, variant: "success", message: "" });
      if (go) navigate("/departamento/informes-sinteticos"); // Redirigir al listado
    }, 300);
    return () => clearTimeout(t);
  }, [alert.exiting, alert.variant, navigate]);
  // --- Fin Lógica de Alerta ---


  // --- Lógica de GUARDADO (handleSubmit) ---
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!carrera || !informeBase || !numCiclo || !cuatrimestre || !informesFiltrados ) return;

    setSaving(true);

    try {
      // 1. Crear la "Cabecera" (InformeSinteticoCarrera)
      const payloadCabecera = {
        ciclo_lectivo: numCiclo.toString(),
        comision_asesora: comisionAsesora,
        sede: carrera.sede,
        integrantes: integrantes,
        id_carrera: carrera.id,
        id_informe_sintetico_base: informeBase.id,
        estado: "abierto" as const, // Se pone 'abierto'
        informes_asignaturas: informesFiltrados.map(inf => inf.id), // IDs de los informes hijos
        cursado : cuatrimestre
      };

      const informeCreado = await crearInformeSinteticoCarrera(payloadCabecera);

      // 2. Guardar las "Respuestas" (Respuesta)
      const idDepartamento = 1; // TODO: Usar ID real del usuario de depto
      const resultGuardado = await guardarRespuestaSintetico(
        idDepartamento,
        informeCreado.id
      );

      if (!resultGuardado.ok) {
        throw new Error(resultGuardado.detail || "No se pudo guardar la respuesta del informe.");
      }

      // Éxito
      setAlert({ show: true, exiting: false, variant: "success", message: "Informe Sintético guardado ✔" });

    } catch (err: any) {
      console.error(err);
      setAlert({ show: true, exiting: false, variant: "danger", message: err?.message || "Error al guardar el informe." });
    } finally {
      setSaving(false);
    }
  }, [
    carrera, informeBase, numCiclo, cuatrimestre, informesFiltrados, // Datos
    comisionAsesora, integrantes, // Estado del form
    crearInformeSinteticoCarrera, guardarRespuestaSintetico, // Acciones
    navigate
  ]);
  // --- Fin Lógica de GUARDADO ---


 // --- Renderizado ---
  if (loadingInformes || loadingBase) {
    return (
      <Container className="mt-4">
        Cargando datos... 
        (Hook de Informes/Carrera: {loadingInformes ? 'CARGANDO' : 'OK'} | 
         Hook de Plantilla Base: {loadingBase ? 'CARGANDO' : 'OK'})
      </Container>
    );
  }

  // --- Bloque de depuración ---
  if (!carrera) {
    return <Container className="mt-4 alert alert-danger">
      <b>Error de Carga:</b> No se pudo cargar la <b>Carrera</b> (ID: {numCarreraId}).
      <br/>
      Verifica que la carrera con ID={numCarreraId} existe en tu base de datos y que el endpoint `/carreras/{numCarreraId}` funciona.
      </Container>;
  }
  if (!informeBase) {
    return <Container className="mt-4 alert alert-danger">
      <b>Error de Carga:</b> No se pudo cargar la <b>Plantilla Base</b> (informeBase es null).
      <br/>
      Esto es causado por el error <b>422 Unprocessable Entity</b> que viste en la consola. 
      Aplica la "Solución (Arreglo en Backend)" para simplificar la consulta.
      </Container>;
  }
  // (Este chequeo es por si acaso, pero es improbable que falle)
  if (!informesFiltrados) { 
    return <Container className="mt-4 alert alert-danger">Error: <b>informesFiltrados</b> es nulo.</Container>;
  }
  // --- Fin bloque de depuración ---

  
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

      {/* Usamos un FORM que envuelve TODO */}
      <Form onSubmit={handleSubmit}>
        <Col md={10} lg={8} className="mx-auto mt-4">
          
          {/* 1. Cabecera (similar a InformeSintetico.tsx) */}
          <Card className="mb-4 shadow-sm">
            <Card.Header as="h4">
              Generar Informe Sintético - {carrera.nombre}
            </Card.Header>
            <Card.Body className="">
              <Card.Title as="h5" className="m-2">
                {informeBase.titulo}
              </Card.Title>
              <Card.Text as="div" className="text-start row">
                <Col md={6}>
                  <p><strong>Ciclo Lectivo:</strong> {numCiclo}</p>
                  <p><strong>Cuatrimestre:</strong> {cuatrimestre}</p>
                  <p><strong>Sede:</strong> {carrera.sede}</p>
                </Col>
                <Col md={6}>
                  {/* Campos editables para la cabecera */}
                  <Form.Group className="mb-2">
                    <Form.Label className="fw-semibold form-label-required">Comisión Asesora</Form.Label>
                    <Form.Control
                      type="text"
                      value={comisionAsesora}
                      onChange={(e) => setComisionAsesora(e.target.value)}
                      required
                      disabled={saving}
                      placeholder="Ej: Mg. Juan Perez"
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label className="fw-semibold form-label-required">Integrantes</Form.Label>
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
              </Card.Text>
            </Card.Body>
          </Card>

          {/* 2. Pestañas (Tabs) con los informes curriculares (igual a InformeSintetico.tsx) */}
          <h5 className="mt-4">Informes Curriculares incluídos ({informesFiltrados.length})</h5>
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
                  <Card className="mb-4">
                    <Card.Header as="h6">
                      Docente: {informeAsignatura.docente} | Año:{" "}
                      {informeAsignatura.asignatura?.año} | Alumnos:{" "}
                      {informeAsignatura.cant_alumnos_insc}
                    </Card.Header>

                    {preguntas.length > 0 ? (
                      preguntas.map((pregunta) => (
                        <Card.Body key={pregunta.id} className="border-bottom text-start">
                          <Card.Title as="h6">
                            {pregunta.texto_pregunta}
                          </Card.Title>
                          <Card.Text as="div" className="ps-3" style={{ whiteSpace: 'pre-wrap' }}>
                            {findRespuestaPorPreguntaId(
                              pregunta.id,
                              informeAsignatura.respuesta as any
                            )}
                          </Card.Text>
                        </Card.Body>
                      ))
                    ) : (
                      <Card.Body><p className="text-muted">No hay preguntas definidas.</p></Card.Body>
                    )}
                  </Card>
                </Tab>
              );
            })}
          </Tabs>

          {/* 3. Formulario de Preguntas (similar a InformeCurricular.tsx) */}
          <Card className="shadow-lg border-0 mt-5">
            <Card.Header as="h5">Análisis y Conclusiones del Departamento</Card.Header>
            <Card.Body>
              {informeBase.preguntas?.map((pregunta: any) => {
                const primeraOpcion = pregunta.pregunta_opcion?.[0];
                const idPreguntaOpcion = primeraOpcion?.id;
                const esObligatoria = pregunta.obligatoria === true;

                return (
                  <div className="mb-3 text-start" key={idPreguntaOpcion ?? pregunta.id}>
                    <label
                      htmlFor={`pregunta-${idPreguntaOpcion}`}
                      className={`form-label d-block ${esObligatoria ? 'form-label-required' : ''}`}
                    >
                      {pregunta.texto_pregunta ?? "Pregunta"}
                    </label>
                    <textarea
                      id={`pregunta-${idPreguntaOpcion}`}
                      className="form-control"
                      style={{ minHeight: "100px" }}
                      value={idPreguntaOpcion ? answersByPreguntaOpcion[idPreguntaOpcion] ?? "" : ""}
                      onChange={(e) => {
                        if (idPreguntaOpcion) {
                          setTextoRespuesta(idPreguntaOpcion, e.target.value);
                        }
                      }}
                      required={esObligatoria}
                      disabled={saving}
                    />
                  </div>
                );
              })}

              <div className="d-flex justify-content-center mt-4">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={saving}
                >
                  {saving ? "Guardando..." : "Guardar Informe Sintético"}
                </Button>
              </div>
            </Card.Body>
          </Card>
          
        </Col>
      </Form>
    </Container>
  );
}