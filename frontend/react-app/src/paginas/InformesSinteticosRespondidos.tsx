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
import type { InformeSinteticoCarrera } from "../types/InformeSintetico"; 

export default function InformesSinteticosRespondidos() {
  const [informes, setInformes] = useState<InformeSinteticoCarrera[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ID DEPARTAMENTO HARDCODEADO
  const ID_DEPARTAMENTO = 1; 

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:8000/informe-sintetico-carrera/departamento/${ID_DEPARTAMENTO}`);
        
        if (!res.ok) throw new Error("Error al cargar informes sintéticos respondidos");
        const data = await res.json();
        setInformes(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <Container className="my-4 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Cargando historial...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-4">
        <Alert variant="danger">Error: {error}</Alert>
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
              Historial de Informes Sintéticos Enviados
              <Badge bg="secondary" pill>
                {informes.length}
              </Badge>
            </Card.Header>
            
            <ListGroup variant="flush">
              {informes.length === 0 ? (
                <ListGroup.Item className="text-muted text-center py-3">
                  No has enviado ningún informe sintético todavía.
                </ListGroup.Item>
              ) : (
                informes.map(informe => {
                  // Extraemos el cuatrimestre del primer informe curricular hijo
                  const primerHijo = informe.informes_asignaturas?.[0];
                  const cuatrimestre = primerHijo?.asignatura?.cursado || "";

                  return (
                    <ListGroup.Item 
                      key={informe.id} 
                      className="d-flex align-items-start"
                    >
                      <div className="me-3 flex-grow-1 text-start">
                        <span className="fw-bold fs-5">{informe.carrera?.nombre}</span>
                        <br/>
                        <small className="text-muted d-block mt-1">
                          <strong>Sede:</strong> {informe.sede} | <strong>Ciclo:</strong> {informe.ciclo_lectivo}
                          {/* AQUI MOSTRAMOS EL CUATRIMESTRE */}
                          {cuatrimestre && (
                            <> | <strong>{cuatrimestre}</strong></>
                          )}
                        </small>
                        <small className="text-muted d-block">
                          <strong>Comisión:</strong> {informe.comision_asesora}
                        </small>
                      </div>
                      
                      <Link 
                        to={`/departamento/informes-sinteticos-respondidos/${informe.id}`} 
                        className="btn btn-outline-primary btn-sm align-self-center"
                        title="Ver Informe Completo"
                      >
                        <i className="bi bi-file-earmark-text-fill me-2"></i>
                        <span className="d-none d-md-inline">Ver</span>
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