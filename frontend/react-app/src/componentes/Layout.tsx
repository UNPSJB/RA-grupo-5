import { Link, Outlet } from "react-router-dom";
import { Container, Navbar, Nav } from "react-bootstrap";
import "../styles/Layout.css";

export default function Layout() {
  return (
    <div className="layout">
      <Navbar bg="dark" variant="dark" expand="lg">
        <Navbar.Brand className="p-4 text-white border-end" href="/">Encuestas</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/encuestas">Encuestas Pendientes</Nav.Link>
            <Nav.Link as={Link} to="/otra-pagina">Otra Página</Nav.Link>
          </Nav>
      </Navbar>

      
      <main className="content">
        {/* Contenido principal */}
        <Container className="mt-4">
          <Outlet />
        </Container>
      </main>

      <footer className="footer bg-dark text-white text-center p-3 mb-0">
        &copy; 2025 Mi Sitio
      </footer>
    </div>
  );
}
