import { Link, Outlet, useNavigate } from "react-router-dom";
import { Container, Navbar, Nav, Button } from "react-bootstrap";
import "../styles/Layout.css";
import logoUnpsjb from "../assets/unpsjb.png";
import { useAuth } from "../context/AuthContext";

export default function LayoutDocente() {
  const navigate = useNavigate();
  const { roles, logout, token } = useAuth();

  // Función de permiso: admin siempre entra
  const can = (role: string) => roles.includes("admin") || roles.includes(role);

  // Si no está logueado
  if (!token) {
    return (
      <div className="mt-5 text-center">
        <h4>No autorizado</h4>
        <p>Iniciá sesión para acceder.</p>
      </div>
    );
  }

  // Si no tiene rol docente (ni es admin)
  if (!can("docente")) {
    return (
      <div className="mt-5 text-center">
        <h4>No autorizado</h4>
        <p>Solo usuarios con rol docente o admin pueden ver esta sección.</p>
      </div>
    );
  }

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="layout">
      <Navbar bg="dark" variant="dark" expand="lg">
        <Navbar.Brand className="ms-3" href="/">
          <img
            src={logoUnpsjb}
            width="80"
            height="80"
            className="d-inline-block align-top ms-3"
            alt="Logo UNPSJB"
          />
        </Navbar.Brand>

        <Nav className="me-auto">
          <Nav.Link as={Link} to="/docente">
            Inicio
          </Nav.Link>
          <Nav.Link as={Link} to="/docente/reportes">
            Reportes disponibles
          </Nav.Link>
          <Nav.Link as={Link} to="/docente/informes">
            Mis informes
          </Nav.Link>
        </Nav>

        <Button variant="outline-light" className="me-3" onClick={handleLogout}>
          Cerrar sesión
        </Button>
      </Navbar>

      <main className="content">
        <Container className="mt-4 text-center">
          <Outlet />
        </Container>
      </main>

      <footer className="footer bg-dark text-white text-center p-3 mb-0">
        &copy; 2025 Reportes de Alumnos
      </footer>
    </div>
  );
}
