import { useInformesCurriculares } from "../hook/useInformesCurriculares";
import { Link } from "react-router-dom";
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
  const abiertos = informesCurriculares.filter((informe) => informe.estado === "abierto");

  return (
    <Container className="my-4">
      <Row>
        <Col md={10} lg={8} className="mx-auto">
          
          <h2 className="mb-4 text-primary fw-bold">
            Gestión de Informes Curriculares
          </h2>

          {/* --- TARJETA #1: INFORMES ABIERTOS --- */}
          <Card className="border rounded shadow-sm bg-white mb-4">
            
            <Card.Header 
              as="h5" 
              className="bg-primary text-white d-flex justify-content-between align-items-center"
            >
              Informes Abiertos
              <Badge bg="light" text="dark" pill>
                {abiertos.length}
              </Badge>
            </Card.Header>
            
            <ListGroup variant="flush">
              {abiertos.length === 0 ? (
                <ListGroup.Item>No hay informes abiertos.</ListGroup.Item>
              ) : (
                abiertos.map(informe => (
                  <ListGroup.Item 
                    key={informe.id} 
                    // 1. Quitamos 'justify-content-between'
                    className="d-flex align-items-start"
                  >
                    {/* 2. Añadimos 'flex-grow-1' y 'text-start' */}
                    <div className="me-3 flex-grow-1 text-start">
                      <span className="fw-bold">{informe.asignatura.nombre}</span>
                      <br/>
                      <small className="text-muted">
                        {`Docente: ${informe.docente} | Sede: ${informe.sede}`}
                      </small>
                    </div>
                    <Link 
                      to={`/docente/informes/${informe.id}`} 
                      className="btn btn-secondary btn-sm align-self-center"
                      title="Ver Informe"
                    >
                      <i className="bi bi-eye-fill"></i>
                      <span className="ms-2 d-none d-md-inline">Ver</span>
                    </Link>
                  </ListGroup.Item>
                ))
              )}
            </ListGroup>
          </Card>

          {/* --- TARJETA #2: INFORMES CERRADOS --- */}
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
                    // 1. Quitamos 'justify-content-between'
                    className="d-flex align-items-start"
                  >
                    {/* 2. Añadimos 'flex-grow-1' y 'text-start' */}
                    <div className="me-3 flex-grow-1 text-start">
                      <span className="fw-bold">{informe.asignatura.nombre}</span>
                      <br/>
                      <small className="text-muted">
                        {`Docente: ${informe.docente} | Fecha Fin: ${informe.fecha_fin}`}
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