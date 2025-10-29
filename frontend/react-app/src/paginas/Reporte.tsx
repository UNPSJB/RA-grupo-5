import {
  Container,
  Row,
  Col,
  Card,
  ListGroup,
  ProgressBar,
} from "react-bootstrap";
import { useReportes } from "../hook/useReportes";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import LayoutReporte from "../componentes/LayoutReporte.tsx";
import TabComponent from "../componentes/TabsVariables.tsx";

export default function ResumenReporte() {
  const { id } = useParams();
  const idReporte = Number(id);
  const { fetchResumenByReporteId, fetchReporteById, loading, error } =
    useReportes();
  const [reporte, setReporte] = useState<any>(null);
  const [reporteCompleto, setReporteCompleto] = useState<any>(null);

  //trae el resumen del reporte desde el back segun el id
  useEffect(() => {
    if (!isNaN(idReporte)) {
      const cargarResumen = async () => {
        const data = await fetchResumenByReporteId(idReporte);
        setReporte(data);
      };
      cargarResumen();
    }
  }, [idReporte]);
  useEffect(() => {
    const cargarReporte = async () => {
      const data = await fetchReporteById(idReporte);
      if (data) setReporteCompleto(data);
    };
    cargarReporte();
  }, [idReporte]);
  if (loading) return <p>Cargando resumen...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!reporte || !reporteCompleto) return <p>No hay datos disponibles</p>;

  const tabs = Object.entries(reporte.resumen).map(
    ([nombreVariable, variableData]: [string, any]) => ({
      key: nombreVariable,
      title: nombreVariable,
      content: (
        <Card className="mb-4 border-0">
          <Card.Title className="mb-4 text-center">
            <h4>{nombreVariable}</h4>
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
                      <span>
                        {opcion.cantidad} ({opcion.porcentaje}%)
                      </span>
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

                <div className="d-flex justify-content-between align-items-center mb-3">
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

          {/* Columna derecha: Tabs */}
          <Col md={8}>
            <Card className="shadow-lg border-0">
              <Card.Body>
                <TabComponent
                  tabs={tabs}
                  defaultKey={tabs[0]?.key}
                  className="mb-4"
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </LayoutReporte>
  );
}
