import { useEncuestas } from '../hook/useEncuestas';
import { Link } from "react-router-dom";
import { 
  Container, 
  Col, 
  Row, 
  Card, 
  ListGroup, 
  Badge, 
  Spinner, 
  Alert 
} from "react-bootstrap";

export default function EncuestasRespondidas() {
  const { encuestas, loading, error } = useEncuestas();

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

  const Respondidas = encuestas.filter(
    (encuesta) => encuesta.estado === "cerrada"
  );

  return (
    <Container className="my-4">
      <Row>
        <Col md={10} lg={8} className="mx-auto">
          
          <Card className="border rounded shadow-sm bg-white">
            
            <Card.Header as="h5" className="bg-primary text-white">
              Encuestas Respondidas
            </Card.Header>
            
            <ListGroup variant="flush">
              {Respondidas.length === 0 ? (
                <ListGroup.Item>
                  <p className="text-muted mb-0">No hay encuestas respondidas.</p>
                </ListGroup.Item>
              ) : (
                Respondidas.map((encuesta) => (
                  <ListGroup.Item 
                    key={encuesta.id}
                    className="d-flex align-items-start"
                  >
                    <div className="me-3 flex-grow-1 text-start">
                      <span className="fw-bold">{encuesta.asignatura?.nombre}</span>
                      <Badge bg="success" pill className="ms-2">Respondida</Badge>
                      <br /> 
                      <small className="text-muted">
                        {`Año: ${encuesta.asignatura?.año} | Cursado: ${encuesta.asignatura?.cursado} | Finalizada: ${encuesta.fecha_fin}`}
                      </small>
                    </div>
                    
                    <Link
                      to={`/alumno/encuestas-respondidas/${encuesta.id}`}
                      className="btn btn-outline-primary btn-sm align-self-center"
                      title="Ver encuesta respondida"
                    >
                      <i className="bi bi-eye-fill"></i>
                      <span className="ms-2 d-none d-md-inline">Ver</span>
                    </Link>
                  </ListGroup.Item>
                ))
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}