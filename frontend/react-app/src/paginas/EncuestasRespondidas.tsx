import { useEncuestas } from "../hook/useEncuestas";
import { Link } from "react-router-dom";
import { 
  Container, 
  Col, 
  Row, 
  Card, 
  ListGroup, 
  Badge, 
} from "react-bootstrap";
export default function EncuestasRespondidas() {
  const { encuestasRespondidas, loading, error } = useEncuestas();

  if (loading) return <p>Cargando encuestas respondidas por el alumno...</p>;
  if (error) return <p>Error: {error}</p>;

  const Respondidas = encuestasRespondidas
  // const Respondidas = encuestasRespondidas.filter(
  //   (encuesta) => encuesta.estado === "cerrada"
  // );

  return (
     <Container className="my-4">
      <Row>
        <Col md={10} lg={8} className="mx-auto">

          <Card className="border rounded shadow-sm bg-white">
            
            <Card.Header 
              as="h5" 
              className="bg-light d-flex justify-content-between align-items-center"
            >
              Encuestas Respondidas
              <Badge bg="secondary" pill>
                {Respondidas.length}
              </Badge>
            </Card.Header>
            
            <ListGroup variant="flush">
              {Respondidas.length === 0 ? (
                <ListGroup.Item>No hay encuestas respondidas.</ListGroup.Item>
              ) : (
                Respondidas.map(encuesta => (
                  <ListGroup.Item 
                    key={encuesta.id} 
                    className="d-flex align-items-start"
                  >
                    <div className="me-3 flex-grow-1 text-start">
                      <span className="fw fs-5">{encuesta.asignatura.nombre}</span>
                      <br/>
                      <small className="text-muted">
                        {`Docente: ${encuesta.asignatura.nombre_docente}` }
                      </small>
                      <br />
                      <small className="text-muted">
                        {`Ciclo: ${encuesta.asignatura.año} | Cursado: ${encuesta.asignatura.cursado}` }
                      </small>
                      <br />
                      <small className="text-muted">
                        {`Carrera: ${encuesta.asignatura?.carrera?.nombre} ` }
                      </small>
                    
                      
                    </div>
                    <Link 
                      to={`/alumno/encuestas-respondidas/${encuesta.id}`} 
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
