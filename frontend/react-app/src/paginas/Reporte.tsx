import { Container, Row, Col, Card, ListGroup, ProgressBar, Tabs, Tab } from "react-bootstrap"; // <-- CAMBIO 1
import { useReportes } from "../hook/useReportes";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import LayoutReporte from "../componentes/LayoutReporte.tsx";

export default function ResumenReporte() {
  const { id } = useParams();
  const idReporte = Number(id);
  const { fetchResumenByReporteId, fetchReporteById, loading, error } = useReportes();
  const [reporte, setReporte] = useState<any>(null);
  const [reporteCompleto, setReporteCompleto] = useState<any>(null);
  const [activeVariableKey, setActiveVariableKey] = useState<string | null>(null);


  // Trae el resumen del reporte desde el back segun el id
  useEffect(() => {
    if (!isNaN(idReporte)) {
      const cargarResumen = async () => {
        const data = await fetchResumenByReporteId(idReporte);
        setReporte(data);

        // Establecer la primera variable como activa por defecto
        if (data && data.resultados_por_pregunta && !activeVariableKey) { 
          const firstKey = Object.keys(data.resultados_por_pregunta)[0];
          if (firstKey) {
            setActiveVariableKey(firstKey);
          }
        }
      };
      cargarResumen();
    }
  }, [idReporte, fetchResumenByReporteId, activeVariableKey]);

  useEffect(() => {
    const cargarReporte = async () => {
      const data = await fetchReporteById(idReporte);
      if (data) setReporteCompleto(data);
    };
    cargarReporte();
  }, [idReporte, fetchReporteById]);

  if (loading) return <p>Cargando resumen...</p>;
  if (error) return <p>Error: {error}</p>;
  
  if (
    !reporte ||
    !reporteCompleto ||
    !reporte.resultados_por_pregunta ||
    !reporte.resumen_por_variable ||
    !activeVariableKey // <-- Nos aseguramos de que la key activa exista
  ) {
    return <p>No hay datos disponibles</p>;
  }

  // Los tabs ahora son solo los datos, no el componente
  const tabsData = Object.entries(reporte.resultados_por_pregunta).map(
    ([nombreVariable, variableData]: [string, any]) => ({
      key: nombreVariable, 
      title: nombreVariable,
      cod: variableData.codigo,
      content: ( // Este es el JSX que irá dentro de cada Tab
        <Card className="mb-4 border-0">
          <Card.Title className="mb-4 text-center">
            <h3>{variableData.codigo}: {nombreVariable}</h3>
          </Card.Title>
          {variableData.preguntas.map((pregunta: any, j: number) => (
            <Card key={j} className="mb-3 border-0">
              <Card.Subtitle className="mb-3 mt-2 fw-bold">
                {pregunta.pregunta_texto}
              </Card.Subtitle>
              <ListGroup variant="flush">
                {pregunta.opciones.map((opcion: any, k: number) => (
                  <ListGroup.Item key={k}>
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span>{opcion.opcion_texto}</span>
                      <span className="fw-bold">{opcion.porcentaje}%</span>
                    </div>
                    <ProgressBar
                      now={opcion.porcentaje}
                      label={`${opcion.porcentaje}%`}
                      variant="info"
                      style={{ height: "15px" }}
                    />
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card>
          ))}
        </Card>
      ),
    })
  );

  const activeVariableSummary = reporte.resumen_por_variable[activeVariableKey];

  const Datosasignatura = reporteCompleto.encuesta_asignatura.asignatura;

  return (
    <LayoutReporte
      asignatura={Datosasignatura.nombre}
      anio={Datosasignatura.año}
      docente={Datosasignatura.nombre_docente}
      carrera={Datosasignatura.carrera}
    >
      <Container className="mt-5">
        <Row>
          {/* Columna izquierda: Card lateral */}
          <Col md={3}>
            <Card className="shadow-sm mb-4" style={{ fontSize: "0.9rem" }}>
              <Card.Body className="p-2">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-muted fw-semibold" style={{ fontSize: "0.8rem" }}>
                    Total inscriptos
                  </span>
                  <span className="text-dark fw-bold" style={{ fontSize: "0.9rem" }}>25</span>
                </div>

                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="text-muted fw-semibold" style={{ fontSize: "0.8rem" }}>
                    Encuestas procesadas
                  </span>
                  <span className="text-primary fw-bold" style={{ fontSize: "0.9rem" }}>
                    {reporteCompleto.encuesta_asignatura.respuestas.length}
                  </span>
                </div>

                <div className="d-grid">
                  <Link
                    to={`/docente/nuevo-informe/${reporteCompleto.id}`}
                    className="btn btn-primary m-2"
                  >
                    Crear informe curricular
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Columna derecha*/}
          <Col md={9}>
            <Row>
              {/* Columna A: Resultados por Pregunta (Tabs) */}
              <Col md={7}>
                <Card className="shadow-lg border-0 mb-4">
                  <Card.Body>
                    <Tabs
                      id="variable-tabs"
                      activeKey={activeVariableKey}
                      onSelect={(k) => setActiveVariableKey(k || null)}
                      className="mb-4"
                    >
                      {tabsData.map((tab) => (
                        <Tab key={tab.key} eventKey={tab.key} title={tab.cod}>
                          {tab.content}
                        </Tab>
                      ))}
                    </Tabs>
                  </Card.Body>
                </Card>
              </Col>
              
              {/* Columna B: Resumen General (Filtrado) */}
              <Col md={5}>
                {activeVariableSummary && (
                  <Card className="shadow-lg border-0">
                    <Card.Body>
                      <Card.Title className="mb-4">
                        <h3>Resumen de la Variable:</h3>
                      </Card.Title>
                      
                      <ListGroup variant="flush">
                        {activeVariableSummary.opciones.map((opcion: any, k: number) => (
                          <ListGroup.Item 
                            key={k} 
                            className="d-flex justify-content-between align-items-center px-2 py-3"
                          >
                            <span>{opcion.opcion_texto}</span>
                            <span className="fw-bold text-primary" style={{ fontSize: '1.1rem' }}>
                              {opcion.porcentaje}%
                            </span>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    </Card.Body>
                  </Card>
                )}
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </LayoutReporte>
  );
}