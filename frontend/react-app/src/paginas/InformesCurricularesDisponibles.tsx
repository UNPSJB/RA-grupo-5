import { useInformesCurriculares } from "../hook/useInformesCurriculares";
import { Link } from "react-router-dom";
import { IC_C1_START, IC_C1_END, IC_C2_START, IC_C2_END}from "../calendarioAcademico";
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  ListGroup, 
  Badge, 
  Spinner, 
  Alert 
} from "react-bootstrap";

export default function InformesCurricularesDisponibles() {
  const { informesCurriculares, loading, error } = useInformesCurriculares();

  // ... (Estados de carga y error consistentes)
  if (loading) {
    return (
      <Container className="my-4 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Cargando informes...</p>
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

  const cerrados = informesCurriculares.filter((informe) => informe.estado === "cerrado");

  return (
    <Container className="my-4">
      <Row>
        <Col md={10} lg={8} className="mx-auto">

          <Card className="border rounded shadow-sm bg-white">
            
            <Card.Header 
              as="h5" 
              className="bg-light d-flex justify-content-between align-items-center"
            >
              Informes Cerrados
              <Badge bg="secondary" pill>
                {cerrados.length}
              </Badge>
            </Card.Header>
            
            <ListGroup variant="flush">
              {cerrados.length === 0 ? (
                <ListGroup.Item>No hay informes cerrados.</ListGroup.Item>
              ) : (
                cerrados.map(informe => (
                 
                  <ListGroup.Item 
                    key={informe.id} 
                    className="d-flex align-items-start"
                  >
                    <div className="me-3 flex-grow-1 text-start">
                      <span className="fw-bold">{informe.asignatura.nombre}</span>
                      <br/>
                      <small className="text-muted">
                          <strong>Docente:</strong> {informe.asignatura.nombre_docente}
                      </small>
                      <br />
                      <small className="text-muted"> 
                          <strong>Carrera:</strong> {`${informe.asignatura.carrera.nombre} | Año: ${informe.asignatura.año} | Cursado: ${informe.asignatura.cursado}`}
                      </small>
                    </div>
                    <Link 
                      to={`/departamento/informes/${informe.id}`} 
                      className="btn btn-outline-primary btn-sm align-self-center"
                      title="Ver Informe"
                    >
                      <i className="bi bi-file-earmark-text-fill"></i>
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