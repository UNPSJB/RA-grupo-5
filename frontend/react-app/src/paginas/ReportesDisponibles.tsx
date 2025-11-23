import { useReportes } from "../hook/useReportes";
import { Link } from "react-router-dom";
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  ListGroup, 
  Spinner, 
  Alert 
} from "react-bootstrap";
import { isGeneracionInformeCurricularActiva, getToday, getRangoFechasInformeCurricular } from "../calendarioAcademico";

export default function ReportesDisponibles() {
  // 1. Desestructuramos 'reportesDisponibles'
  const { reportesDisponibles, loading, error } = useReportes();
  
  const today = getToday();
  const currentYear = today.getFullYear();

  if (loading) {
    return (
      <Container className="my-4 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Cargando reportes...</p>
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
          <Card className="border rounded shadow-sm ">
            
            <Card.Header as="h5" className="bg-primary text-white">
              Reportes Generados
            </Card.Header>
            
            <ListGroup variant="flush">
              {reportesDisponibles.length === 0 ? (
                <ListGroup.Item>
                  <p className="text-muted mb-0">No hay reportes disponibles para tus materias.</p>
                </ListGroup.Item>
              ) : (
                reportesDisponibles.map((reporte) => {
                  const asignatura = reporte.encuesta_asignatura.asignatura;
                  const cicloLectivo = reporte.encuesta_asignatura.ciclo_lectivo;
                  
                  const puedeGenerar = ((cicloLectivo === currentYear) || (cicloLectivo === currentYear + 1)) && isGeneracionInformeCurricularActiva(asignatura.cursado, today);
                  const fechaCierre = getRangoFechasInformeCurricular(asignatura.cursado);
                  
                  return (
                    <ListGroup.Item 
                      key={reporte.id}
                      className="d-flex align-items-start"
                    >
                      <div className="me-3 flex-grow-1 text-start"> 
                        <span className="fw-bold fs-5">{asignatura.nombre}</span>
                        
                        {!reporte.has_respuesta && puedeGenerar && (
                          <span className="text-danger fw-bold ms-3">
                            Cierre: {fechaCierre}
                          </span>
                        )}
                        
                        <br/>
                        <small className="d-block m-1">
                          <strong>Docente: </strong> {asignatura.nombre_docente}
                        </small>
                        <small className="d-block m-1">
                          <strong>Ciclo lectivo: </strong>{`${reporte.encuesta_asignatura.ciclo_lectivo} | Cursado: ${asignatura.cursado}` }
                        </small>
                        <small className="d-block m-1">
                          <strong>Carrera: </strong>{`${asignatura?.carrera?.nombre} ` }
                        </small>
                      </div>

                      <div className="d-flex flex-column gap-3" style={{ minWidth: '130px' }}>                        
                        <Link
                          to={`/docente/reportes/${reporte.id}`}
                          className="btn btn-secondary btn-sm"
                          title="Ver Reporte"
                        >
                          <i className="bi bi-bar-chart-line-fill"></i>
                          <span className="ms-2 d-none d-md-inline">Ver Reporte</span>
                        </Link>

                        {reporte.has_respuesta ? (
                          <Link
                            to={`/docente/informes-curriculares-respondidos/${reporte.informe_id}`}
                            className="btn btn-outline-primary btn-sm"
                            title="Ver Informe"
                          >
                            <i className="bi bi-file-earmark-text-fill"></i>
                            <span className="ms-2 d-none d-md-inline">Ver Informe</span>
                          </Link>
                        ) : puedeGenerar ? (
                          <Link
                            to={`/docente/nuevo-informe/${reporte.id}`}
                            className="btn btn-primary btn-sm"
                            title="Nuevo Informe"
                          >
                            <i className="bi bi-plus-circle-fill"></i>
                            <span className="ms-2 d-none d-md-inline">Nuevo Informe</span>
                          </Link>
                        ) : (
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            disabled
                            title="El período para generar este informe ha finalizado."
                            style={{cursor: 'not-allowed'}}
                          >
                            <i className="bi bi-x-circle-fill"></i>
                            <span className="ms-2 d-none d-md-inline">Fuera de termino</span>
                          </button>
                        )}
                        
                        <Link
                          to={`/docente/estadisticas/${reporte.id}`}
                          className="btn btn-outline-success btn-sm"
                          title="Ver Estadísticas"
                        >
                          <i className="bi bi-graph-up-arrow"></i>
                          <span className="ms-2 d-none d-md-inline">Ver Estadísticas</span>
                        </Link>

                      </div>
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