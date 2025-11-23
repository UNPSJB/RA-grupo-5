import { useState, useMemo } from "react";
import { useInformesSinteticos } from "../hook/useInformesSinteticos";
// Importamos el tipo correctamente para evitar el error de TS
import { 
  Card, Form, Col, Row, Container, ListGroup, Badge, Spinner, Alert, Button 
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { isGeneracionInformeSinteticoActivo, getToday } from "../calendarioAcademico"; 

export default function InformesSinteticosDisponibles() {
  // 1. HOOK
  const { resumenes, loading, error } = useInformesSinteticos();
  const today = getToday();

  // 2. ESTADOS DE FILTROS
  const [selectedCarreraId, setSelectedCarreraId] = useState<string>("all");
  const [filterAnio, setFilterAnio] = useState<string>("all");
  const [filterCuatri, setFilterCuatri] = useState<string>("all");
  const [filterEstado, setFilterEstado] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  // 3. DATOS DERIVADOS PARA LOS SELECTS 
  const aniosDisponibles = useMemo(() => {
    const years = new Set(resumenes.map(r => r.ciclo));
    return Array.from(years).sort((a, b) => b - a);
  }, [resumenes]);

  const carrerasDisponibles = useMemo(() => {
    const map = new Map();
    resumenes.forEach(r => {
      if (r.carrera && r.carrera.id) {
        map.set(r.carrera.id, r.carrera.nombre);
      }
    });
    return Array.from(map.entries()).map(([id, nombre]) => ({ id, nombre }));
  }, [resumenes]);

  // 4. LÓGICA DE FILTRADO Y ORDENAMIENTO (sin cambios)
  const itemsProcesados = useMemo(() => {
    let result = [...resumenes];

    if (selectedCarreraId !== "all") {
      result = result.filter(r => Number(r.carrera.id) === Number(selectedCarreraId));
    }
    if (filterAnio !== "all") {
      result = result.filter(r => r.ciclo === Number(filterAnio));
    }
    if (filterCuatri !== "all") {
      result = result.filter(r => r.cuatrimestre === filterCuatri);
    }
    if (filterEstado !== "all") {
      result = result.filter(r => r.estadoGeneral === filterEstado);
    }

    result.sort((a, b) => {
      if (a.ciclo !== b.ciclo) return sortOrder === "desc" ? b.ciclo - a.ciclo : a.ciclo - b.ciclo;
      if (a.cuatrimestre !== b.cuatrimestre) {
        if (sortOrder === "desc") return a.cuatrimestre > b.cuatrimestre ? -1 : 1;
        return a.cuatrimestre > b.cuatrimestre ? 1 : -1;
      }
      return a.carrera.nombre.localeCompare(b.carrera.nombre);
    });

    return result;
  }, [resumenes, selectedCarreraId, filterAnio, filterCuatri, filterEstado, sortOrder]);

  // Helper de fechas 
  const verificarHabilitado = (cuatriStr: string) => {
    const cursadoDB = cuatriStr === "1° cuatrimestre" ? "cuatrimestre 1" : "cuatrimestre 2";
    return isGeneracionInformeSinteticoActivo(cursadoDB, today);
  };


  if (loading) return <Container className="my-4 text-center"><Spinner animation="border" variant="primary" /></Container>;
  if (error) return <Container className="my-4"><Alert variant="danger">{error}</Alert></Container>;

  return (
    <Container className="my-4">
      <Row>
        <Col md={10} lg={8} className="mx-auto">  
          <Card className="border rounded shadow-sm bg-white overflow-hidden">
            {/* HEADER */}
<Card.Header className="bg-primary text-white text-center py-3">
  <h5 className="mb-0 fw-normal">Informes Sintéticos por Carrera</h5>
</Card.Header>

{/* BARRA DE FILTROS */}
<div className="bg-light border-bottom px-3 py-2">
  <div className="d-flex align-items-center flex-wrap gap-2">
    <span className="text-muted fw-bold small text-nowrap me-1">Filtrar:</span>

    {/* Filtros*/}
    <div className="d-flex flex-wrap align-items-center gap-2 flex-grow-1">
      <div style={{ minWidth: '200px', maxWidth: '300px', flexGrow: 1 }}>
        <Form.Select size="sm" value={selectedCarreraId} onChange={(e) => setSelectedCarreraId(e.target.value)} className="border-secondary-subtle">
          <option value="all">Todas las Carreras</option>
          {carrerasDisponibles.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
        </Form.Select>
      </div>

      <div style={{ width: '100px' }}>
        <Form.Select size="sm" value={filterAnio} onChange={(e) => setFilterAnio(e.target.value)}>
          <option value="all">Año (Todos)</option>
          {aniosDisponibles.map(y => <option key={y} value={y}>{y}</option>)}
        </Form.Select>
      </div>

      <div style={{ width: '130px' }}>
        <Form.Select size="sm" value={filterCuatri} onChange={(e) => setFilterCuatri(e.target.value)}>
          <option value="all">Cuatri (Todos)</option>
          <option value="1° cuatrimestre">1° Cuat.</option>
          <option value="2° cuatrimestre">2° Cuat.</option>
        </Form.Select>
      </div>

      <div style={{ width: '140px' }}>
        <Form.Select size="sm" value={filterEstado} onChange={(e) => setFilterEstado(e.target.value)}>
          <option value="all">Estado (Todos)</option>
          <option value="creado">Respondidos</option>
          <option value="pendiente">Pendientes</option>
        </Form.Select>
      </div>
    </div>

        <div className="d-flex align-items-center ms-auto ps-3 border-start">
    <Button
      variant="link"
      size="sm"
      className="text-decoration-none text-secondary p-0 fw-bold small text-nowrap d-flex align-items-center gap-1"
      onClick={() => setSortOrder(prev => prev === "desc" ? "asc" : "desc")}
    >
      {sortOrder === "desc" ? (
        <>
          Más recientes
          <i className="bi bi-arrow-down"></i>
        </>
      ) : (
        <>
          Más antiguos
          <i className="bi bi-arrow-up"></i>
        </>
      )}
    </Button>
        </div>
      </div>
    </div>

            {/* LISTADO DE INFORMES SINTÉTICOS */}
 <Card.Body className="p-0">
  <ListGroup variant="flush" className="mt-4">
    {itemsProcesados.length === 0 ? (
      <ListGroup.Item>
        <p className="text-muted mb-0">No hay informes para este período.</p>
      </ListGroup.Item>
    ) : (
      itemsProcesados.map((r) => {
        const puedeGenerar = verificarHabilitado(r.cuatrimestre);

        return (
          <ListGroup.Item
            key={r.uniqueKey}
            className="d-flex align-items-start"
          >
            <div className="me-3 flex-grow-1 text-start">
              <span className="fw-bold">{r.carrera.nombre}</span>
              <br />
              <small className="text-muted">
                Cantidad de informes:
                <Badge bg="secondary" pill className="ms-1">{r.totalInformes}</Badge>
              </small>
              <br />
              <small className="text-muted">
                Informes publicados:
                <Badge bg="success" pill className="ms-1">{r.publicados}</Badge>
              </small>
            </div>

            {/* --- ACCIONES --- */}
            <div className="d-flex flex-column gap-2" style={{ minWidth: '130px' }}>
              {r.totalInformes === 0 ? (
                <span className="text-muted fst-italic">
                  No disponible
                </span>
              ) : r.sinteticoId ? (
                <Link
                  to={`/departamento/informes-sinteticos-respondidos/${r.sinteticoId}`}
                  className="btn btn-outline-primary btn-sm"
                  title="Ver informe"
                >
                  <i className="bi bi-file-earmark-text-fill"></i>
                  <span className="ms-2 d-none d-md-inline">Ver informe</span>
                </Link>
              ) : puedeGenerar ? (
                <Link
                  to={`/departamento/generar-informe/${r.carrera.id}?ciclo=${r.ciclo}&cuatrimestre=${r.cuatrimestre}`}
                  className="btn btn-primary btn-sm"
                  title="Generar informe"
                >
                  <i className="bi bi-plus-circle-fill"></i>
                  <span className="ms-2 d-none d-md-inline">Generar</span>
                </Link>
              ) : (
                <button
                  className="btn btn-outline-secondary btn-sm"
                  disabled
                  title="El período para generar este informe sintético ha finalizado."
                  style={{ cursor: 'not-allowed' }}
                >
                  <i className="bi bi-x-circle-fill"></i>
                  <span className="ms-2 d-none d-md-inline">Fuera de término</span>
                </button>
              )}
            </div>
          </ListGroup.Item>
        );
      })
    )}
  </ListGroup>
</Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
/*
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
import { isGeneracionInformeSinteticoActivo, getToday, getRangoFechasInformeSintetico } from "../calendarioAcademico"; 


export default function TablaInformeSintetico() {
  const [cicloLectivo, setCicloLectivo] = useState(2025);
  const [cuatrimestre, setCuatrimestre] = useState("1° cuatrimestre"); 
  
  const { resumenes, loading, error } = useInformesSinteticos(cicloLectivo, cuatrimestre);

  const ciclosDisponibles = [2023, 2024, 2025]; 
  const cuatrimestresDisponibles = ["1° cuatrimestre", "2° cuatrimestre"];
  
  const today = getToday();
  const currentYear = today.getFullYear(); // Obtenemos el año actual (ej: 2025)

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


  const cursadoDBValue = cuatrimestre === "1° cuatrimestre" ? "cuatrimestre 1" : "cuatrimestre 2";
  const puedeGenerar = ((cicloLectivo === currentYear) || (cicloLectivo === currentYear + 1)) && isGeneracionInformeSinteticoActivo(cursadoDBValue, today)


  return (
    <Container className="my-4">
      <Row>
        <Col md={10} lg={8} className="mx-auto">
          
          <Card className="border rounded shadow-sm">
            
            <Card.Header as="h5" className="bg-primary text-white">
              Informes Sintéticos por Carrera
            </Card.Header>
            
            <Card.Body className="p-4">
              
              <Row className="mb-3">
               {/* Filtro de Ciclo Lectivo / }
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
                  resumenes.map((r) => {
                    const fechaCierre = getRangoFechasInformeSintetico(cursadoDBValue);

                    return (
                      <ListGroup.Item 
                        key={r.carrera.id}
                        className="d-flex align-items-start"
                      >
                        <div className="me-3 flex-grow-1 text-start">
                          <span className="fw-bold">{r.carrera.nombre}</span>

                          {(!r.sinteticoId) && puedeGenerar && (
                            <span className="text-danger fw-bold ms-3">
                              Cierre: {fechaCierre}
                            </span>
                          )}

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

                        {/* --- ACCIONES --- /}
                        <div className="d-flex flex-column gap-2" style={{ minWidth: '130px' }}>

                          {r.totalInformes === 0 ? (
                            <span className="text-muted fst-italic">
                              No disponible
                            </span>
                          ) : r.sinteticoId ? (
                            <Link
                              to={`/departamento/informes-sinteticos-respondidos/${r.sinteticoId}`}
                              className="btn btn-outline-primary btn-sm"
                              title="Ver informe"
                            >
                              <i className="bi bi-file-earmark-text-fill"></i>
                              <span className="ms-2 d-none d-md-inline">Ver informe</span>
                            </Link>
                          ) : puedeGenerar ? (
                            <Link
                              to={`/departamento/generar-informe/${r.carrera.id}?ciclo=${cicloLectivo}&cuatrimestre=${cuatrimestre}`}
                              className="btn btn-primary btn-sm"
                              title="Generar informe"
                            >
                              <i className="bi bi-plus-circle-fill"></i>
                              <span className="ms-2 d-none d-md-inline">Generar</span>
                            </Link>
                          ) : (
                            <button
                              className="btn btn-outline-secondary btn-sm"
                              disabled
                              title="El período para generar este informe sintético ha finalizado."
                              style={{ cursor: 'not-allowed' }}
                            >
                              <i className="bi bi-x-circle-fill"></i>
                              <span className="ms-2 d-none d-md-inline">Fuera de término</span>
                            </button>
                          )}

                        </div>
                      </ListGroup.Item>
                    );
                  })
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

*/
