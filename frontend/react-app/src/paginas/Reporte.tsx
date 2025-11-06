import {
  Container,
  Row,
  Col,
  Card,
  ListGroup,
  ProgressBar,
  Tabs,
  Tab,
} from "react-bootstrap";
import { useReportes } from "../hook/useReportes";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import LayoutReporte from "../componentes/LayoutReporte.tsx";
import ResumenVariable from "../componentes/ResumenVariable";
import "../styles/Resumen-reporte.css";

export default function ResumenReporte() {
  const { id } = useParams();
  const idReporte = Number(id);
  const { fetchResumenByReporteId, fetchReporteById, loading, error } =
    useReportes();
  const [reporte, setReporte] = useState<any>(null);
  const [reporteCompleto, setReporteCompleto] = useState<any>(null);
  const [activeVariableKey, setActiveVariableKey] = useState<string | null>(
    null
  );

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
      // Este es el JSX que irá dentro de cada Tab
      content: (
        <Card className="mb-4 border-0">
          <Card.Title className="mb-4 text-center">
            <h3>
              {variableData.codigo}: {nombreVariable}
            </h3>
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
      <Container className="my-4">
        <Row className="g-4">
          {/* IZQUIERDA: TABS / CONTENIDO */}
          <Col xs={12} md={8} lg={8}>
            <Card className="flat-card">
              <Card.Body className="p-3 p-lg-4">
                <Tabs
                  id="variable-tabs"
                  activeKey={activeVariableKey}
                  onSelect={(k) => setActiveVariableKey(k || null)}
                  className="mb-3"
                  mountOnEnter
                  unmountOnExit
                >
                  {tabsData.map((tab) => (
                    <Tab key={tab.key} eventKey={tab.key} title={tab.cod}>
                      <div className="mb-3 text-center">
                        <h5 className="mb-0">
                          {tab.cod}: {tab.title}
                        </h5>
                      </div>

                      {/* contenido de cada variable */}
                      {tab.content}
                    </Tab>
                  ))}
                </Tabs>
              </Card.Body>
            </Card>
          </Col>

          {/* DERECHA: RESUMEN + BOTÓN */}
          <Col xs={12} md={4} lg={4}>
            <aside className="right-rail">
              {/* Resumen arriba (plano, sin sombra) */}
              <div className="flat-card p-0 mb-3">
                <ResumenVariable resumen={activeVariableSummary} />
              </div>

              {/* Botón en el borde derecho (sticky en desktop, abajo en mobile) */}
              <div className="right-cta">
                {/* Misma lógica que en ReportesDisponibles.tsx */}
                {reporteCompleto.has_respuesta ? (
                  // Si ya fue respondido → Ver Informe
                  <Link
                    to={
                      reporteCompleto.informe_id
                        ? `/docente/informes/${reporteCompleto.informe_id}`
                        : `/docente/informes/por-reporte/${reporteCompleto.id}` // fallback
                    }
                    className="btn btn-outline-primary btn-lg w-100"
                  >
                    Ver Informe
                  </Link>
                ) : (
                  // Si no fue respondido → Crear nuevo informe
                  <Link
                    to={`/docente/nuevo-informe/${reporteCompleto.id}`}
                    className="btn btn-primary btn-lg w-100"
                  >
                    Nuevo Informe de Act.Curricular
                  </Link>
                )}
              </div>
              {/* Métricas secundarias (opcional) */}
              <Card className="lite-card mt-3" style={{ fontSize: "0.9rem" }}>
                <Card.Body className="p-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span
                      className="text-muted fw-semibold"
                      style={{ fontSize: "0.8rem" }}
                    >
                      Total inscriptos
                    </span>
                    <span
                      className="text-dark fw-bold"
                      style={{ fontSize: "0.9rem" }}
                    >
                      25
                    </span>
                  </div>

                  <div className="d-flex justify-content-between align-items-center">
                    <span
                      className="text-muted fw-semibold"
                      style={{ fontSize: "0.8rem" }}
                    >
                      Encuestas procesadas
                    </span>
                    <span
                      className="text-primary fw-bold"
                      style={{ fontSize: "0.9rem" }}
                    >
                      {reporteCompleto.encuesta_asignatura.respuestas.length}
                    </span>
                  </div>
                </Card.Body>
              </Card>
            </aside>
          </Col>
        </Row>
      </Container>
    </LayoutReporte>
  );
}
