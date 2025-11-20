import { useEncuestas } from '../hook/useEncuestas';
import { Link } from "react-router-dom";
import { 
  Container, 
  Col, 
  Row, 
  Card, 
  ListGroup, 
  Spinner, 
  Alert 
} from "react-bootstrap";
import {getRangoFechasEncuesta } from "../calendarioAcademico";

export default function EncuestasPendientes() {
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

  const Pendientes = encuestas.filter(
    (encuesta) => encuesta.estado === "abierta"
  );

  return (
    <Container className="my-4">
      <Row>
        <Col md={10} lg={8} className="mx-auto">
          
          <Card className="border rounded shadow-sm ">
            
            <Card.Header as="h5" className="bg-primary text-white">
              Encuestas Pendientes
            </Card.Header>
            
            <ListGroup variant="flush">
              {Pendientes.length === 0 ? (
                <ListGroup.Item>
                  <p className="text-muted mb-0">No hay encuestas pendientes.</p>
                </ListGroup.Item>
              ) : (
                Pendientes.map(encuesta => {
                  const fechaCierre = getRangoFechasEncuesta(encuesta.asignatura.cursado);
                  return (
                    <ListGroup.Item
                      key={encuesta.id}
                      className="d-flex align-items-start"
                    > 
                      <div className="me-3 flex-grow-1 text-start">
                        <span className="fw-bold fs-5">{encuesta.asignatura?.nombre}</span>
                        {/* implementar logica como en Reportes disponibles de que no tenga ya una respuesta: */}
                        <span className="text-danger fw-bold ms-3">
                          Cierre: {fechaCierre} 
                        </span>

                        <br />
                        <small className="d-block m-1">
                          <strong>Docente: </strong> {encuesta.asignatura.nombre_docente}
                        </small>
                        <small className="d-block m-1">
                          <strong>Ciclo lectivo: </strong>{`${encuesta.ciclo_lectivo} | Cursado: ${encuesta.asignatura.cursado}`}
                        </small>
                        <small className="d-block m-1">
                          <strong>Carrera: </strong>{`${encuesta.asignatura?.carrera?.nombre} `}
                        </small>
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