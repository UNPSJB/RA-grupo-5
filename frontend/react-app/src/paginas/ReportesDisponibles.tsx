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
  const { reportes, loading, error } = useReportes();
  const today = getToday()
  const currentYear = today.getFullYear(); // Obtenemos el año actual (ej: 2025)

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
              {reportes.length === 0 ? (
                <ListGroup.Item>
                  <p className="text-muted mb-0">No hay reportes disponibles.</p>
                </ListGroup.Item>
              ) : (
                reportes.map((reporte) => {
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
                          //  Si NO hay respuesta y ESTÁ EN FECHA, mostramos "Nuevo Informe"
                          <Link
                            to={`/docente/nuevo-informe/${reporte.id}`}
                            className="btn btn-primary btn-sm"
                            title="Nuevo Informe"
                          >
                            <i className="bi bi-plus-circle-fill"></i>
                            <span className="ms-2 d-none d-md-inline">Nuevo Informe</span>
                          </Link>
                        ) : (
                          // Si NO hay respuesta y ESTÁ FUERA DE FECHA, mostramos el botón deshabilitado
                          <button
                            className="btn btn-outline-secondary btn-sm" // Cambié a 'outline-secondary'
                            disabled
                            title="El período para generar este informe ha finalizado."
                            style={{cursor: 'not-allowed'}} // Estilo extra para claridad
                          >
                            <i className="bi bi-x-circle-fill"></i>
                            <span className="ms-2 d-none d-md-inline">Fuera de termino</span>
                          </button>
                        )}
                         {}
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