import { useEncuestas } from '../hook/useEncuestas';
import { Link } from "react-router-dom";
import { 
  Container, 
  Col, 
  Row, 
  Card, 
  ListGroup, 
  Spinner, 
  Alert,
  Badge
} from "react-bootstrap";
import { getRangoFechasEncuesta } from "../calendarioAcademico";

export default function EncuestasPendientes() {
  // 1. Desestructuramos la nueva propiedad 'encuestasPendientes'
  const { encuestasPendientes, loading, error } = useEncuestas();

  if (loading) {
    return (
      <Container className="my-4 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Cargando encuestas...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-4">
        <Row>
          <Col md={10} lg={8} className="mx-auto">
            <Alert variant="danger">Error: {error}</Alert>
          </Col>
        </Row>
      </Container>
    );
  }

  const Pendientes = encuestasPendientes.filter(
    (encuesta) => encuesta.estado === "abierta" && !encuesta.respondida
  );

  return (
    <Container className="my-4">
      <Row>
        <Col md={10} lg={8} className="mx-auto">
          
          <Card className="border rounded shadow-sm bg-white">
            
            <Card.Header as="h5" className="bg-primary text-white d-flex justify-content-between align-items-center">
              Encuestas Pendientes
              <Badge bg="light" text="dark" pill>{Pendientes.length}</Badge>
            </Card.Header>
            
            <ListGroup variant="flush">
              {Pendientes.length === 0 ? (
                <ListGroup.Item>
                  <p className="text-muted mb-0">No tienes encuestas pendientes.</p>
                </ListGroup.Item>
              ) : (
                Pendientes.map(encuesta => {
                  const fechaCierre = encuesta.asignatura.cursado 
                    ? getRangoFechasEncuesta(encuesta.asignatura.cursado) 
                    : "Consultar fecha";
                  
                  return (
                    <ListGroup.Item
                      key={encuesta.id}
                      className="d-flex align-items-start"
                    > 
                      <div className="me-3 flex-grow-1 text-start">
                        <span className="fw-bold fs-5">{encuesta.asignatura?.nombre}</span>
                        
                        <span className="text-danger fw-bold ms-3" style={{ fontSize: '0.9rem' }}>
                          <i className="bi bi-clock-history me-1"></i>
                          Cierre: {fechaCierre}
                        </span>

                        <div className="text-muted small mt-1">
                          <div><strong>Docente:</strong> {encuesta.asignatura.nombre_docente}</div>
                          <div><strong>Ciclo:</strong> {encuesta.ciclo_lectivo || 2025} | <strong>Cursado:</strong> {encuesta.asignatura.cursado}</div>
                          <div><strong>Carrera:</strong> {encuesta.asignatura.carrera?.nombre || encuesta.asignatura.carrera?.nombre}</div>
                        </div>
                      </div>

                      <Link
                        to={`/alumno/encuestas-pendientes/${encuesta.id}`}
                        className="btn btn-primary btn-sm align-self-center"
                        title="Responder la encuesta"
                      >
                        <i className="bi bi-pencil-square"></i>
                        <span className="ms-2 d-none d-md-inline">Responder</span>
                      </Link>
                    </ListGroup.Item>
                  );
                })
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}