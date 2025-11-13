import { useState } from "react";
import { useInformesSinteticos } from "../hook/useInformesSinteticos";
import { Table, Card, Form, Col, Row, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function TablaInformeSintetico() {
  const [cicloLectivo, setCicloLectivo] = useState(2025);
  const { resumenes, loading, error } = useInformesSinteticos(cicloLectivo);

  const ciclosDisponibles = [2023, 2024, 2025]; 

  return (
    <Container fluid="lg" className="mt-4">
      <Card className="border rounded shadow-sm">
        <Card.Header as="h5">Informes Sintéticos por Carrera</Card.Header>
        <Card.Body className="p-4">
          
          <Form.Group as={Row} className="mb-3" controlId="cicloSelect">
            <Form.Label column sm="auto" className="fw-bold">
              Ciclo lectivo:
            </Form.Label>
            <Col sm="auto" md={2}>
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
            </Col>
          </Form.Group>

          {loading ? (
            <p>Cargando...</p>
          ) : error ? (
            <p>Error: {error}</p>
          ) : (
            <Table striped bordered hover responsive>
              <thead className="table-light">
                <tr>
                  <th>Carrera</th>
                  <th>Cantidad de informes</th>
                  <th>Informes publicados</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {resumenes.map((r) => (
                  <tr key={r.carrera.id}>
                    <td>{r.carrera.nombre}</td>
                    <td>{r.totalInformes}</td>
                    <td>{r.publicados}</td>
                    <td>
                      {r.totalInformes === 0 ? (
                        <span className="text-muted fst-italic">
                          No hay informes disponibles
                        </span>
                      ) : r.sinteticoId ? (
                        // Este enlace para "Ver" está CORRECTO
                        <Link
                          to={`/departamento/informe-sintetico/${r.sinteticoId}`}
                          className="btn btn-outline-primary"
                        >
                          Ver informe sintético
                        </Link>
                      ) : (
                        // --- ¡AQUÍ ESTÁ LA CORRECCIÓN! ---
                        // Cambiamos 'informe-sintetico' por 'generar-informe'
                        <Link
                          to={`/departamento/generar-informe/${r.carrera.id}?ciclo=${cicloLectivo}`}
                          className="btn btn-primary"
                        >
                          Generar informe sintético
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}