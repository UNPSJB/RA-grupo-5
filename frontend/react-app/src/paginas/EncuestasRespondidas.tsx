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
                        {`Ciclo lectivo: ${encuesta.ciclo_lectivo} | Cursado: ${encuesta.asignatura.cursado}` }
                      </small>
                      <br />
                      <small className="text-muted">
                        {`Docente: ${encuesta.asignatura?.carrera?.nombre}` }
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

// import { useEncuestas } from '../hook/useEncuestas';
// import { Link } from "react-router-dom";
// import { 
//   Container, 
//   Col, 
//   Row, 
//   Card, 
//   ListGroup, 
//   Badge, 
//   Spinner, 
//   Alert 
// } from "react-bootstrap";

// export default function EncuestasRespondidas() {
//   const { encuestasRespondidas, loading, error } = useEncuestas();

//   if (loading) {
//     return (
//       <Container className="my-4 text-center">
//         <Spinner animation="border" variant="primary" />
//         <p className="mt-2">Cargando historial...</p>
//       </Container>
//     );
//   }

//   if (error) {
//     return (
//       <Container className="my-4">
//         <Row>
//           <Col md={10} lg={8} className="mx-auto">
//             <Alert variant="danger">Error: {error}</Alert>
//           </Col>
//         </Row>
//       </Container>
//     );
//   }

//   const Historial = encuestasRespondidas.filter(
//     (encuesta) => encuesta.respondida === true || encuesta.estado === "cerrada"
//   );

//   return (
//     <Container className="my-4">
//       <Row>
//         <Col md={10} lg={8} className="mx-auto">
          
//           <Card className="border rounded shadow-sm bg-white">
            
//             <Card.Header as="h5" className="bg-primary text-white d-flex justify-content-between align-items-center">
//               Historial de Encuestas
//               <Badge bg="light" text="dark" pill>
//                 {Historial.length}
//               </Badge>
//             </Card.Header>
            
//             <ListGroup variant="flush">
//               {Historial.length === 0 ? (
//                 <ListGroup.Item>
//                   <p className="text-muted mb-0">No hay historial disponible.</p>
//                 </ListGroup.Item>
//               ) : (
//                 Historial.map((encuesta) => (
//                   <ListGroup.Item 
//                     key={encuesta.id}
//                     className="d-flex align-items-start"
//                   >
//                     <div className="me-3 flex-grow-1 text-start">
//                       <span className="fw-bold fs-5">{encuesta.asignatura?.nombre}</span>
                      
//                       {/* --- CAMBIO 2: BADGE DINÁMICO --- */}
//                       {encuesta.respondida ? (
//                         <Badge bg="success" className="ms-2">Completada</Badge>
//                       ) : (
//                         <Badge bg="danger" className="ms-2">No Respondida</Badge>
//                       )}

//                       <div className="text-muted small mt-1">
//                         <div><strong>Docente:</strong> {encuesta.asignatura.nombre_docente}</div>
//                         <div><strong>Ciclo:</strong> {encuesta.ciclo_lectivo || 2025} | <strong>Cursado:</strong> {encuesta.asignatura.cursado}</div>
                        
//                         {/* Mostrar fecha de finalización */}
//                         <div>
//                             <strong>Cierre: </strong> {encuesta.fecha_fin}
//                         </div>
//                       </div>
//                     </div>

//                     {encuesta.respondida ? (
//                       <Link
//                         to={`/alumno/encuestas-respondidas/${encuesta.id}`}
//                         className="btn btn-outline-primary btn-sm align-self-center"
//                         title="Ver mis respuestas"
//                       >
//                         <i className="bi bi-eye-fill"></i>
//                         <span className="ms-2 d-none d-md-inline">Ver</span>
//                       </Link>
//                     ) : (
//                       <span className="text-muted small align-self-center fst-italic">
//                         Cerrada
//                       </span>
//                     )}

//                   </ListGroup.Item>
//                 ))
//               )}
//             </ListGroup>
//           </Card>
//         </Col>
//       </Row>
//     </Container>
//   );
// }