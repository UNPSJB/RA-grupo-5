import { Container, Row, Col, Card, ListGroup, ProgressBar } from "react-bootstrap";
import { useReportes } from "../hook/useReportes";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LayoutReporte from "../componentes/LayoutReporte";

export default function ResumenReporte() {
  const { id } = useParams();
  const idReporte = Number(id);
  const { fetchResumenByReporteId,fetchReporteById, loading, error } = useReportes();
  const [reporte, setReporte] = useState<any>(null);
  

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
    fetchReporteById(idReporte);
  }, []);
  if (loading) return <p>Cargando resumen...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!reporte) return <p>No hay datos disponibles</p>;

  return (
  <LayoutReporte
  
    asignatura={"desarrollo de"}
    anio={reporte.anio}
    docente={reporte.docente}
    carrera={reporte.carrera}
  >
    <Container className="mt-5">
    <Row className="justify-content-center">  
        <Col md={8}>
          <Card className="shadow-lg border-0">
            <Card.Body>
              {/* Recorre cada variable del resumen */}
              {Object.entries(reporte.resumen).map(
                ([nombreVariable, variableData]: any, i: number) => (
                  <Card key={i} className="mb-4 border-0">
                    <Card.Title className="mb-4 text-center">
                      <h4>{nombreVariable}</h4>
                    </Card.Title>

                    {/* Recorre las preguntas asociadas a esa variable */}
                    {variableData.preguntas.map((pregunta: any, j: number) => (
                      <Card key={j} className="mb-3 border-0">
                        <Card.Subtitle className="mb-3 mt-2 fw-bold">
                          {pregunta.pregunta_texto}
                        </Card.Subtitle>

                        {/* Lista de opciones de respuesta con sus porcentajes */}
                        <ListGroup variant="flush">
                          {pregunta.opciones.map((opcion: any, k: number) => (
                            <ListGroup.Item key={k}>
                              <div className="d-flex justify-content-between align-items-center mb-1">
                                <span>{opcion.opcion_texto}</span>
                                <span>{opcion.porcentaje}%</span>
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
                )
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
    </LayoutReporte>
  );
}
