import { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import { Container, Card, Spinner, Alert, Badge } from "react-bootstrap";
import type { InformeCurricular } from "../types/models/InformeCurricular";

export default function InformesCurricularesRespondidos() {
  const [informes, setInformes] = useState<InformeCurricular[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // ID DOCENTE HARDCODEADO (Mismo que usaste en InformeCurricular.tsx)
  const ID_DOCENTE = 1; 

  useEffect(() => {
    const fetchRespondidos = async () => {
      try {
        setLoading(true);
        // Llamamos al nuevo endpoint del backend
        const res = await fetch(`http://localhost:8000/informes-asignaturas/docente/${ID_DOCENTE}`);
        if (!res.ok) throw new Error("Error al cargar informes respondidos");
        const data = await res.json();
        setInformes(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRespondidos();
  }, []);

  if (loading) return (
    <Container className="my-4 text-center">
      <Spinner animation="border" variant="primary" />
      <p className="mt-2">Cargando informes...</p>
    </Container>
  );

  if (error) return (
    <Container className="my-4">
      <Alert variant="danger">Error: {error}</Alert>
    </Container>
  );

  return (
    <Container className="my-4">
      <Card className="border rounded shadow-sm bg-white">
        <Card.Header as="h5" className="bg-success text-white">
          Historial de Informes Curriculares Enviados
        </Card.Header>
        <Card.Body className="p-0"> {/* p-0 para que la tabla ocupe todo el ancho */}
          <Table striped hover responsive className="mb-0 table-borderless">
            <thead className="bg-light">
              <tr>
                <th className="ps-4">Asignatura</th>
                <th>Ciclo Lectivo</th>
                <th>Fecha Envío</th>
                <th>Estado</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {informes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center text-muted py-4">
                    No has enviado ningún informe curricular todavía.
                  </td>
                </tr>
              ) : (
                informes.map((inf) => (
                  <tr key={inf.id} className="align-middle">
                    <td className="ps-4">
                      <div className="fw-bold">{inf.asignatura?.nombre}</div>
                      <small className="text-muted">
                         {inf.asignatura?.carrera?.nombre}
                      </small>
                    </td>
                    <td>{inf.ciclo_lectivo}</td>
                    {/* Usamos fecha_fin como fecha de envio/cierre aproximada */}
                    {/* <td>{inf.fecha_fin}</td>  */}
                    <td>
                      <Badge bg={inf.estado === 'cerrado' ? 'secondary' : 'success'}>
                        {inf.estado === 'cerrado' ? 'Finalizado' : 'En Proceso'}
                      </Badge>
                    </td>
                    <td className="text-center">
                      <Link
                        to={`/docente/informes-curriculares-respondidos/${inf.id}`}
                        className="btn btn-outline-success btn-sm"
                        title="Ver detalle"
                      >
                        <i className="bi bi-eye-fill me-1"></i>
                        Ver
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
}