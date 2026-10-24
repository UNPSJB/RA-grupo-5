import { Container } from "react-bootstrap";

export default function AdminHome() {
  return (
    <Container className="mt-4 text-center">
      <h2 className="mb-3">Panel de Administración</h2>
      <p className="text-muted">Acceso exclusivo para el rol administrador.</p>
    </Container>
  );
}
