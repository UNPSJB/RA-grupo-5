// EstadisticasDepartamentoPage.tsx — Demo sin charts externos
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Badge,
  ProgressBar,
  ListGroup,
} from "react-bootstrap";

// ====== Datos hardcodeados (simulados) ======
const indicadores = [
  { titulo: "Alumnos Inscriptos", valor: 14, bg: "primary" as const },
  { titulo: "Alumnos participantes", valor: 26, bg: "info" as const },
  { titulo: "Participacion (prom.)", valor: "92%", bg: "success" as const },
  { titulo: "Satisfacción general", valor: "84%", bg: "warning" as const },
];

const dimensiones = [
  { nombre: "Comunicación", valor: 80 },
  { nombre: "Metodología", valor: 75 },
  { nombre: "Evaluación", valor: 90 },
  { nombre: "Actuación", valor: 85 },
];

const valoraciones = [
  { label: "E", valor: 12, color: "#198754" }, // Excelente
  { label: "MB", valor: 31, color: "#0d6efd" }, // Muy bueno
  { label: "B", valor: 22, color: "#6c757d" }, // Bueno
  { label: "R", valor: 5, color: "#ffc107" }, // Regular
  { label: "I", valor: 1, color: "#dc3545" }, // Insuficiente
];

const alertas = [
  {
    tipo: "Equipamiento",
    asignatura: "Arquitectura de Computadoras",
    detalle: "Proyector en mal estado",
    severidad: "Alta",
  },
  {
    tipo: "Contenidos",
    asignatura: "Análisis y Diseño de Sistemas",
    detalle: "80% contenidos desarrollados",
    severidad: "Media",
  },
];

const keywords = ["motivación", "proyectores", "conectividad", "asistencia"];

const topAsignaturas = [
  { nombre: "Programación I", alumnos: 120, avance: 95 },
  { nombre: "Arquitectura de Computadoras", alumnos: 88, avance: 82 },
  { nombre: "Análisis y Diseño de Sistemas", alumnos: 73, avance: 80 },
  { nombre: "Base de Datos", alumnos: 65, avance: 90 },
];

// ====== Utilidades visuales ======
function DonutValoraciones() {
  // construimos el conic-gradient según los porcentajes
  const total = valoraciones.reduce((acc, v) => acc + v.valor, 0);
  let acc = 0;
  const stops = valoraciones.map((v) => {
    const desde = (acc / total) * 360;
    acc += v.valor;
    const hasta = (acc / total) * 360;
    return `${v.color} ${desde}deg ${hasta}deg`;
  });

  const donutStyle: React.CSSProperties = {
    width: 180,
    height: 180,
    borderRadius: "50%",
    background: `conic-gradient(${stops.join(",")})`,
    position: "relative",
    margin: "0 auto",
    boxShadow: "0 0 0 6px #fff, 0 0 0 8px rgba(0,0,0,0.06)",
  };

  const holeStyle: React.CSSProperties = {
    position: "absolute",
    inset: 20,
    borderRadius: "50%",
    background: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    color: "#333",
  };

  return (
    <div>
      <div style={donutStyle}>
        <div style={holeStyle}>Valoraciones</div>
      </div>
      <ListGroup className="mt-3">
        {valoraciones.map((v) => (
          <ListGroup.Item
            key={v.label}
            className="d-flex justify-content-between align-items-center"
          >
            <span className="d-flex align-items-center gap-2">
              <span
                style={{
                  width: 12,
                  height: 12,
                  background: v.color,
                  borderRadius: 2,
                  display: "inline-block",
                }}
              />
              {v.label}
            </span>
            <span className="fw-semibold">{v.valor}</span>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}

export default function EstadisticasDepartamentoPage() {
  return (
    <Container className="my-4">
      <h2 className="mb-4 text-center">Dashboard de Estadísticas</h2>

      {/* KPIs */}
      <Row className="g-4 mb-4">
        {indicadores.map((item, idx) => (
          <Col key={idx} xs={12} md={6} lg={3}>
            <Card bg={item.bg} text="white" className="shadow-sm">
              <Card.Body className="text-center">
                <Card.Title className="fs-6">{item.titulo}</Card.Title>
                <div className="display-6 fw-bold">{item.valor}</div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Dimensiones (progress bars) + Donut CSS */}
      <Row className="mb-4">
        <Col lg={8}>
          <Card className="shadow-sm h-100">
            <Card.Body>
              <Card.Title>Promedio por dimensión de encuesta</Card.Title>
              <div className="mt-3">
                {dimensiones.map((d) => (
                  <div key={d.nombre} className="mb-3">
                    <div className="d-flex justify-content-between">
                      <strong>{d.nombre}</strong>
                      <span className="text-muted">{d.valor}%</span>
                    </div>
                    <ProgressBar now={d.valor} label={`${d.valor}%`} />
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4} className="mt-4 mt-lg-0">
          <Card className="shadow-sm h-100">
            <Card.Body>
              <Card.Title>Valoraciones de auxiliares</Card.Title>
              <DonutValoraciones />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Top asignaturas (mini “cards” con barra de avance) */}
      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Asignaturas destacadas</Card.Title>
              <Row className="g-3 mt-1">
                {topAsignaturas.map((a) => (
                  <Col key={a.nombre} xs={12} md={6} lg={3}>
                    <Card className="border-0 shadow-sm h-100">
                      <Card.Body>
                        <div
                          className="fw-semibold text-truncate"
                          title={a.nombre}
                        >
                          {a.nombre}
                        </div>
                        <div className="text-muted small">
                          Alumnos: {a.alumnos}
                        </div>
                        <div className="mt-2">
                          <div className="d-flex justify-content-between small">
                            <span>Avance</span>
                            <span>{a.avance}%</span>
                          </div>
                          <ProgressBar now={a.avance} />
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Alertas + Términos */}
      <Row>
        <Col lg={8}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Alertas y observaciones</Card.Title>
              <Table striped bordered hover responsive className="mb-0">
                <thead>
                  <tr>
                    <th>Tipo</th>
                    <th>Asignatura</th>
                    <th>Detalle</th>
                    <th>Severidad</th>
                  </tr>
                </thead>
                <tbody>
                  {alertas.map((a, i) => (
                    <tr key={i}>
                      <td>{a.tipo}</td>
                      <td>{a.asignatura}</td>
                      <td>{a.detalle}</td>
                      <td>
                        <Badge
                          bg={
                            a.severidad === "Alta"
                              ? "danger"
                              : a.severidad === "Media"
                              ? "warning"
                              : "success"
                          }
                        >
                          {a.severidad}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4} className="mt-4 mt-lg-0">
          <Card className="shadow-sm h-100">
            <Card.Body>
              <Card.Title>Términos recurrentes</Card.Title>
              <div className="d-flex flex-wrap gap-2 mt-2">
                {keywords.map((kw, i) => (
                  <Badge key={i} bg="secondary" pill>
                    {kw}
                  </Badge>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
