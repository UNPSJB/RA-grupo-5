import { Link, Outlet } from "react-router-dom";
import { Container, Navbar, Nav } from "react-bootstrap";
import "../styles/Layout.css";
import logoUnpsjb from "../assets/unpsjb.png";

export default function LayoutDepartamento() {
  return (
    <div className="layout">
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container >
          <Navbar.Brand as={Link} to="/">
            <img
              src={logoUnpsjb}
              width="80"
              height="80"
              className="d-inline-block align-top"
              alt="Logo UNPSJB"
            />
          </Navbar.Brand>

          <Nav className="me-auto">
            <Nav.Link as={Link} to="/departamento/informes">
              Informes curriculares
            </Nav.Link>

            <Nav.Link as={Link} to="/departamento/informes-sinteticos">
              Informes sintéticos
            </Nav.Link>

            <Nav.Link as={Link} to="/departamento/estadisticas">
              Estadísticas
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <main className="center">
        <Container className="mt-4 text-center" >
          <Outlet /> {/* aquí se renderizan las subrutas */}
        </Container>
      </main>

      <footer className="footer bg-dark text-white text-center p-3 mb-0">
        &copy; 2025 Reportes de Alumnos
      </footer>
    </div>
  );
}
