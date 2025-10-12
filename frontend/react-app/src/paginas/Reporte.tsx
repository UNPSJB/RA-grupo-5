import { Container, Row, Col, Card, ListGroup, ProgressBar } from "react-bootstrap";


    export default function ReporteGeneral() {

    const reporteSimulado = {
    variable: "Comunicación y desarrollo",
    preguntas: [
        {
        texto: "¿El procfesor brindo al inicio del curso, informacion referida al desarrollo de la asignatura?",
        respuestas: [
            { opcion: "Muy bueno, muy satifactorio", cantidad: 15 },
            { opcion: "Bueno, satifactorio", cantidad: 10 },
            { opcion: "Regular, Poco satifactorio", cantidad: 3 },
            { opcion: "Malo, No satifactorio", cantidad: 2 },
        ],
        },
        {
        texto: "¿Se respeto la planificacion de las actividades programadas al inicio del cursado y el catalogo academico?",
        respuestas: [
            { opcion: "Muy bueno, muy satifactorio", cantidad: 18 },
            { opcion: "Bueno, satifactorio", cantidad: 7 },
            { opcion: "Regular, Poco satifactorio", cantidad: 4 },
            { opcion: "Malo, No satifactorio", cantidad: 1 },
        ],
        }
    ],
    };

    return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-lg border-0">
            <Card.Body>
              <Card.Title className="mb-4 text-center ">
                <h3>{reporteSimulado.variable}</h3>
              </Card.Title>

              {reporteSimulado.preguntas.map((pregunta, i) => (
                <Card key={i} className="mb-4 border-0">
                  <Card.Subtitle className="mb-4 mt-2 fw-bold">
                    {pregunta.texto}
                  </Card.Subtitle>

                  <ListGroup variant="flush">
                    {pregunta.respuestas.map((resp, j) => {
                      const total = pregunta.respuestas.reduce(
                        (sum, r) => sum + r.cantidad,
                        0
                      );
                      const porcentaje = Math.round(
                        (resp.cantidad / total) * 100
                      );

                      return (
                        <ListGroup.Item key={j}>
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <span>{resp.opcion}</span>
                            <span>{porcentaje}%</span>
                          </div>
                          <ProgressBar
                            now={porcentaje}
                            label={`${resp.cantidad}`}
                            variant="info"
                            style={{ height: "15px" }}
                          />
                        </ListGroup.Item>
                      );
                    })}
                  </ListGroup>
                </Card>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}