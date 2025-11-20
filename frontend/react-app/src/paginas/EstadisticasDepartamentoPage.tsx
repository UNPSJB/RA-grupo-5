import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Badge,
  ProgressBar,
  Spinner,
  Alert,
  Form
} from "react-bootstrap";
import { useEstadisticasDepartamento } from "../hook/useEstadisticasDepartamento";

const getColorByLabel = (label: string) => {
  const map: Record<string, string> = {
    "Excelente": "var(--bs-success)",  
    "Muy Bueno": "var(--bs-primary)",      
    "Bueno": "var(--bs-info)",             
    "Regular": "var(--bs-warning)",        
    "Malo": "var(--bs-danger)",            
    "Insuficiente": "var(--bs-danger)",    
    "Si": "var(--bs-success)",             
    "No": "var(--bs-danger)",              
  };
  return map[label] || "var(--bs-secondary)"; 
};

const DonutValoraciones = ({ data }: { data: { label: string; valor: number }[] }) => {
  const total = data.reduce((acc, v) => acc + v.valor, 0);
  
  if (total === 0) return <div className="text-center py-5 text-muted">Sin datos suficientes</div>;

  let acc = 0;
  const stops = data.map((v) => {
    const color = getColorByLabel(v.label); 
    const desde = (acc / total) * 360;
    acc += v.valor;
    const hasta = (acc / total) * 360;
    return `${color} ${desde}deg ${hasta}deg`;
  });

  const donutStyle: React.CSSProperties = {
    width: 180,
    height: 180,
    borderRadius: "50%",
    background: `conic-gradient(${stops.join(",")})`,
    position: "relative",
    margin: "0 auto",
  };

  const holeStyle: React.CSSProperties = {
    position: "absolute",
    inset: 30,
    borderRadius: "50%",
    background: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    color: "#333",
  };

  return (
    <div>
      <div style={donutStyle}>
        <div style={holeStyle}>
          <span className="h3 mb-0 fw-bold">{total}</span>
          <small className="text-muted">Respuestas</small>
        </div>
      </div>

      <div className="d-flex flex-wrap justify-content-center gap-3 mt-4">
        {data.map((v) => (
          <div key={v.label} className="d-flex align-items-center gap-1 small">
            <span
              style={{
                width: 10,
                height: 10,
                background: getColorByLabel(v.label),
                borderRadius: "50%",
                display: "inline-block",
              }}
            />
            <span className="fw-bold">{v.label}</span>
            <span className="text-muted">({Math.round((v.valor / total) * 100)}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function EstadisticasDepartamentoPage() {
  const [ciclo, setCiclo] = useState(2025);
  
  const { data, loading, error } = useEstadisticasDepartamento(ciclo);

  const getBadgeVariant = (severidad: string) => {
    switch (severidad) {
      case "Alta": return "danger";
      case "Media": return "warning";
      default: return "success";
    }
  };

  const getTextColor = (bg: string) => {
    switch (bg) {
      case "primary": return "text-primary";
      case "success": return "text-success";
      case "info": return "text-info";
      case "warning": return "text-warning";
      default: return "text-dark";
    }
  };

  if (loading) return <Container className="mt-5 text-center"><Spinner animation="border" variant="primary"/></Container>;
  if (error) return <Container className="mt-5"><Alert variant="danger">{error}</Alert></Container>;
  if (!data) return <Container className="mt-5"><Alert variant="info">No hay datos disponibles.</Alert></Container>;

  return (
    <Container className="my-4">
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary fw-bold mb-0">Dashboard de Estadísticas</h2>
        <Form.Select 
            style={{ width: '120px' }} 
            value={ciclo} 
            onChange={(e) => setCiclo(Number(e.target.value))}
        >
            <option value={2025}>2025</option>
            <option value={2024}>2024</option>
        </Form.Select>
      </div>

      <Row className="g-4 mb-4">
        {data.indicadores.map((item, idx) => (
          <Col key={idx} xs={12} md={6} lg={3}>
            <Card className="border rounded shadow-sm bg-white h-100 text-center">
              <Card.Body className="d-flex flex-column justify-content-center">
                <Card.Title className="text-muted small text-uppercase fw-bold mb-2">
                  {item.titulo}
                </Card.Title>
                <div className={`display-6 fw-bold ${getTextColor(item.bg)}`}>
                  {item.valor}
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="mb-4 g-4">
        <Col lg={8}>
          <Card className="border rounded shadow-sm bg-white h-100">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">Participación por Variable</h5>
            </Card.Header>
            <Card.Body className="p-4">
              {data.dimensiones.length === 0 ? <p className="text-muted">Sin datos de dimensiones.</p> :
               data.dimensiones.map((d) => (
                <div key={d.nombre} className="mb-4">
                  <div className="d-flex justify-content-between mb-1">
                    <span className="fw-semibold">{d.nombre}</span>
                    <span className="fw-bold text-primary">{d.valor}%</span>
                  </div>
                  <ProgressBar 
                    now={d.valor} 
                    variant="primary" 
                    style={{ height: "10px" }} 
                  />
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="border rounded shadow-sm bg-white h-100">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">Valoraciones Globales</h5>
            </Card.Header>
            <Card.Body className="p-4 d-flex flex-column justify-content-center">
              <DonutValoraciones data={data.valoraciones} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <Card className="border rounded shadow-sm bg-white">
            <Card.Header className="bg-white border-bottom">
              <h5 className="mb-0 text-primary fw-bold">Asignaturas con Mayor Participación</h5>
            </Card.Header>
            <Card.Body>
              <Row className="g-3">
                {data.top_asignaturas.length === 0 ? <p className="text-muted">Sin datos suficientes.</p> :
                 data.top_asignaturas.map((a) => (
                  <Col key={a.nombre} xs={12} md={6} lg={3}>
                    <Card className="border h-100 bg-light">
                      <Card.Body>
                        <div className="fw-bold text-truncate" title={a.nombre}>
                          {a.nombre}
                        </div>
                        <div className="text-muted small mb-2">
                          Inscriptos (Est.): {a.alumnos}
                        </div>
                        <div className="d-flex justify-content-between small mb-1">
                          <span>Participación</span>
                          <span className="fw-bold text-success">{a.avance}%</span>
                        </div>
                        <ProgressBar now={a.avance} variant="success" style={{ height: "6px" }} />
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4">
        <Col lg={8}>
          <Card className="border rounded shadow-sm bg-white h-100">
            <Card.Header className="bg-white border-bottom d-flex justify-content-between align-items-center">
              <h5 className="mb-0 text-primary fw-bold">Alertas y Observaciones</h5>
              {data.alertas.length > 0 && <Badge bg="danger" pill>{data.alertas.length}</Badge>}
            </Card.Header>
            
            <Table hover responsive className="mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th>Tipo</th>
                  <th>Asignatura</th>
                  <th>Detalle</th>
                  <th>Severidad</th>
                </tr>
              </thead>
              <tbody>
                {data.alertas.length === 0 ? <tr><td colSpan={4} className="text-center text-muted py-3">Sin alertas activas.</td></tr> :
                 data.alertas.map((a, i) => (
                  <tr key={i}>
                    <td className="fw-semibold small">{a.tipo}</td>
                    <td>{a.asignatura}</td>
                    <td className="text-muted small">{a.detalle}</td>
                    <td>
                      <Badge bg={getBadgeVariant(a.severidad)}>
                        {a.severidad}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="border rounded shadow-sm bg-white h-100">
            <Card.Header className="bg-white border-bottom">
              <h5 className="mb-0 text-primary fw-bold">Términos Recurrentes</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex flex-wrap gap-2">
                {data.keywords.length === 0 ? <span className="text-muted">Sin comentarios aún.</span> :
                 data.keywords.map((kw, i) => (
                  <Badge key={i} bg="secondary" className="p-2 fw-normal">
                    {kw}
                  </Badge>
                ))}
              </div>
              <div className="mt-3 text-muted small fst-italic">
                * Palabras frecuentes en comentarios abiertos.
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
    </Container>
  );
}