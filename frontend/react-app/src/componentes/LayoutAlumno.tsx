import { Link, Outlet } from "react-router-dom";
import { Container, Navbar, Nav } from "react-bootstrap";
import "../styles/Layout.css";

export default function LayoutAlumno() {
  return (
    <div className="layout">
      <Navbar bg="dark" variant="dark" expand="lg">
        <Navbar.Brand className="p-4 text-white border-end" href="/">Encuestas UNPSJB</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/alumno/encuestas">Encuestas Pendientes</Nav.Link>
            <Nav.Link as={Link} to="/alumno/mis-encuestas">Mis encuestas</Nav.Link>
          </Nav>
      </Navbar>

      
      <main className="content">
        {/* Contenido principal */}
        <Container className="mt-4 text-center">
          <Outlet />  {/* Outlet solo renderiza páginas hijas, si las hubiera */}
        </Container>
      </main>

      <footer className="footer bg-dark text-white text-center p-3 mb-0">
        &copy; 2025 Mi Sitio
      </footer>
    </div>
  );
}
