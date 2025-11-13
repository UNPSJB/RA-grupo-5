import { useState } from "react";
import { useInformesSinteticos } from "../hook/useInformesSinteticos";
import { Table, Card, Form, Col, Row, Container } from "react-bootstrap"; // <-- Imports añadidos
import { Link } from "react-router-dom";

export default function TablaInformeSintetico() {
  const [cicloLectivo, setCicloLectivo] = useState(2025); // ciclo por defecto
  const { resumenes, loading, error } = useInformesSinteticos(cicloLectivo);

  const ciclosDisponibles = [2023, 2024, 2025]; 

  return (
    // Usamos un Container fluido
    <Container fluid="lg" className="mt-4">
      {/* 1. Usamos nuestra Card estándar como contenedor principal */}
      <Card className="border rounded shadow-sm">
        <Card.Header as="h5">Informes Sintéticos por Carrera</Card.Header>
        <Card.Body className="p-4">
          
          {/* 2. Usamos Form.Group para el filtro */}
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

          {/* 3. Lógica de carga y tabla */}
          {loading ? (
            <p>Cargando...</p> // Podríamos usar un <Spinner> aquí
          ) : error ? (
            <p>Error: {error}</p> // Podríamos usar un <Alert> aquí
          ) : (
            <Table striped bordered hover responsive> {/* 4. Props de Tabla */}
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
                        <Link
                          to={`/departamento/informe-sintetico/${r.sinteticoId}`}
                          className="btn btn-outline-primary"
                        >
                          Ver informe sintético
                        </Link>
                      ) : (
                        // --- 5. ¡AQUÍ ESTÁ LA CORRECCIÓN DEL ERROR! ---
                        <Link
                          to={`/departamento/informe-sintetico/${r.carrera.id}?ciclo=${cicloLectivo}`}
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