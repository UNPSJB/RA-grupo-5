import { useState, useEffect } from "react";
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
import type { InformeCurricular } from "../types/models/InformeCurricular";

export default function InformesRespondidos() {
  const [informes, setInformes] = useState<InformeCurricular[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // ID DOCENTE HARDCODEADO
  const ID_DOCENTE = 1; 

  useEffect(() => {
    const fetchRespondidos = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:8000/informes-asignaturas/docente/${ID_DOCENTE}`);
        if (!res.ok) throw new Error("Error al cargar informes respondidos");
        const data = await res.json();
        setInformes(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRespondidos();
  }, []);

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

  return (
     <Container className="my-4">
      <Row>
        <Col md={10} lg={8} className="mx-auto">

          <Card className="border rounded shadow-sm bg-white">
            
            <Card.Header 
              as="h5" 
              className="bg-light d-flex justify-content-between align-items-center"
            >
              Informes Curriculares Respondidos
              <Badge bg="secondary" pill>
                {informes.length}
              </Badge>
            </Card.Header>
            
            <ListGroup variant="flush">
              {informes.length === 0 ? (
                <ListGroup.Item className="text-muted text-center py-3">
                  No hay informes respondidos.
                </ListGroup.Item>
              ) : (
                informes.map(informe => (
                  <ListGroup.Item 
                    key={informe.id} 
                    className="d-flex align-items-start"
                  >
                    <div className="me-3 flex-grow-1 text-start">
                      <span className="fw fs-5">{informe.asignatura?.nombre}</span>
                      <br/>
                      <small className="text-muted d-block mt-1">
                        Docente: {informe.docente}
                      </small>
                      <small className="text-muted">
                        {`Ciclo lectivo: ${informe.ciclo_lectivo} | Cursado: ${informe.asignatura.cursado}` }
                      </small>
                      <br />
                      <small className="text-muted">
                        {`Carrera: ${informe.asignatura?.carrera?.nombre} ` }
                      </small>
                    </div>
                    
                    <Link 
                      to={`/docente/informes-curriculares-respondidos/${informe.id}`} 
                      className="btn btn-outline-primary btn-sm align-self-center"
                      title="Ver Informe Completo"
                    >
                      <i className="bi bi-file-earmark-text-fill me-2"></i>
                      <span className="d-none d-md-inline">Ver</span>
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