import { useState } from "react";
import { useInformesSinteticos } from "../hook/useInformesSinteticos";
import { 
  Card, 
  Form, 
  Col, 
  Row, 
  Container, 
  ListGroup,
  Badge,
  Spinner, 
  Alert 
} from "react-bootstrap";
import { Link } from "react-router-dom";
// Usamos la ruta de importación que me confirmaste
import { isGeneracionInformeSinteticoActivo, getToday } from "../calendarioAcademico"; 


export default function TablaInformeSintetico() {
  const [cicloLectivo, setCicloLectivo] = useState(2025);
  const [cuatrimestre, setCuatrimestre] = useState("1° cuatrimestre"); 
  
  const { resumenes, loading, error } = useInformesSinteticos(cicloLectivo, cuatrimestre);

  const ciclosDisponibles = [2023, 2024, 2025]; 
  const cuatrimestresDisponibles = ["1° cuatrimestre", "2° cuatrimestre"];
  
  // Obtenemos la fecha actual (o la fecha de prueba) desde el helper
  const today = getToday();

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

  // --- INICIO DE LA LÓGICA DE VALIDACIÓN ---
  // 1. Mapeamos el valor del filtro seleccionado (ej: "1° cuatrimestre")
  //    al valor que la función de validación espera (ej: "cuatrimestre 1")
  const cursadoDBValue = 
    cuatrimestre === "1° cuatrimestre" ? "cuatrimestre 1" : "cuatrimestre 2";
  
  // 2. Verificamos si la generación está activa para el cuatrimestre seleccionado
  //    Esta variable (true/false) se usará para TODOS los botones en la lista.
  const puedeGenerar = isGeneracionInformeSinteticoActivo(cursadoDBValue, today);
  // --- FIN DE LA LÓGICA DE VALIDACIÓN ---

  return (
    <Container className="my-4">
      <Row>
        <Col md={10} lg={8} className="mx-auto">
          
          <Card className="border rounded shadow-sm bg-white">
            
            <Card.Header as="h5" className="bg-primary text-white">
              Informes Sintéticos por Carrera
            </Card.Header>
            
            <Card.Body className="p-4">
              
              <Row className="mb-3">
                {/* Filtro de Ciclo Lectivo */}
                <Form.Group as={Col} md={4} controlId="cicloSelect">
                  <Form.Label className="fw-bold">Ciclo lectivo:</Form.Label>
                  <Form.Select
                    value={cicloLectivo}
                    onChange={(e) => setCicloLectivo(Number(e.target.value))}
                  >
                    {ciclosDisponibles.map((ciclo) => (
                      <option key={ciclo} value={ciclo}>
                        {ciclo}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                
                <Form.Group as={Col} md={5} controlId="cuatrimestreSelect">
                  <Form.Label className="fw-bold">Cuatrimestre:</Form.Label>
                  <Form.Select
                    value={cuatrimestre}
                    onChange={(e) => setCuatrimestre(e.target.value)}
                  >
                    {cuatrimestresDisponibles.map((cuatri) => (
                      <option key={cuatri} value={cuatri}>
                        {cuatri}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Row>

              <ListGroup variant="flush" className="mt-4">
                {resumenes.length === 0 ? (
                  <ListGroup.Item>
                    <p className="text-muted mb-0">No hay informes para este período.</p>
                  </ListGroup.Item>
                ) : (
                  resumenes.map((r) => (
                    <ListGroup.Item 
                      key={r.carrera.id}
                      className="d-flex align-items-start" 
                    >
                      <div className="me-3 flex-grow-1 text-start">
                        <span className="fw-bold">{r.carrera.nombre}</span>
                        <br/>
                        <small className="text-muted">
                          Cantidad de informes: 
                          <Badge bg="secondary" pill className="ms-1">{r.totalInformes}</Badge>
                        </small>
                        <br/>
                        <small className="text-muted">
                          Informes publicados: 
                          <Badge bg="success" pill className="ms-1">{r.publicados}</Badge>
                        </small>
                      </div>

                      <div className="d-flex flex-column gap-2" style={{ minWidth: '130px' }}>
                        
                        {/* --- LÓGICA DE BOTÓN CORREGIDA --- */}
                        {r.totalInformes === 0 ? (
                          <span className="text-muted fst-italic">
                            No disponible
                          </span>
                        ) : r.sinteticoId ? (
                          // 1. Si ya existe un informe sintético, "Ver informe"
                          <Link
                            to={`/departamento/informe-sintetico/${r.sinteticoId}`}
                            className="btn btn-outline-primary btn-sm"
                            title="Ver informe"
                          >
                            <i className="bi bi-file-earmark-text-fill"></i>
                            <span className="ms-2 d-none d-md-inline">Ver informe</span>
                          </Link>
                        ) : puedeGenerar ? (
                          // 2. Si no existe Y 'puedeGenerar' es true, "Generar"
                          <Link
                            to={`/departamento/generar-informe/${r.carrera.id}?ciclo=${cicloLectivo}&cuatrimestre=${cuatrimestre}`}
                            className="btn btn-primary btn-sm"
                            title="Generar informe"
                            
                          >
                            <i className="bi bi-plus-circle-fill"></i>
                            <span className="ms-2 d-none d-md-inline">Generar</span>
                          </Link>
                           
                        ) : (
                          // 3. Si no existe Y 'puedeGenerar' es false, "Fuera de término"
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            disabled
                            title="El período para generar este informe sintético ha finalizado."
                            style={{cursor: 'not-allowed'}}
                          >
                            <i className="bi bi-x-circle-fill"></i>
                            <span className="ms-2 d-none d-md-inline">Fuera de término</span>
                          </button>
                        )}
                        {/* --- FIN DE LA LÓGICA --- */}

                      </div>
                    </ListGroup.Item>
                  ))
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
