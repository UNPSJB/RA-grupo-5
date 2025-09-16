import { Link, Outlet } from "react-router-dom";
import { Container, Navbar, Nav } from "react-bootstrap";

export default function Layout() {
  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="/">Mi App de Encuestas</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Encuestas Pendientes</Nav.Link>
            <Nav.Link as={Link} to="/otra-pagina">Otra Página</Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <Container className="mt-4">
        <Outlet /> {/* Aquí se renderizan las páginas hijas, como EncuestasPendientes */}
      </Container>

      <footer className="footer bg-dark text-white text-center p-3 mb-0">
        &copy; 2025 Mi Sitio
      </footer>
    </>
  );
}
