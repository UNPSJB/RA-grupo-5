import { Link, Outlet, NavLink, useNavigate } from "react-router-dom";
import { Container, Navbar, Nav, Button } from "react-bootstrap";
import "../styles/Layout.css";
import logoUnpsjb from "../assets/escudo_tranparente_sinletras.png";
import { useAuth } from "../context/AuthContext";

type NavLinkItem = {
  to: string;
  label: string;
};

type Props = {
  links: NavLinkItem[];
  // Rol necesario para acceder a esta sección (alumno, docente, departamento, etc.)
  requiredRole?: string;
};

export default function LayoutPrincipal({ links, requiredRole }: Props) {
  const navigate = useNavigate();
  const { roles = [], logout, token } = useAuth();

  // Permisos: admin siempre tiene acceso
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

  // Si hay un rol requerido y el usuario no lo tiene (ni es admin)
  if (requiredRole && !can(requiredRole)) {
    return (
      <div className="mt-5 text-center">
        <h4>No autorizado</h4>
        <p>
          Solo usuarios con rol de <strong>{requiredRole}</strong> o{" "}
          <strong>admin</strong> pueden ver esta sección.
        </p>
      </div>
    );
  }

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="layout">
      <Navbar
        bg="primary"
        variant="dark"
        expand="lg"
        sticky="top"
        className="shadow-sm"
      >
        <Navbar.Brand className="ms-3" as={Link} to="/">
          <img
            src={logoUnpsjb}
            width="50"
            height="60"
            className="d-inline-block align-top ms-3"
            alt="Logo UNPSJB"
          />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {links.map((link) => (
              <Nav.Link
                as={NavLink}
                to={link.to}
                key={link.to}
                end={link.to === "/"}
              >
                {link.label}
              </Nav.Link>
            ))}
          </Nav>

          <Button
            variant="outline-light"
            className="me-3"
            onClick={handleLogout}
          >
            Cerrar sesión
          </Button>
        </Navbar.Collapse>
      </Navbar>

      <main className="content">
        <Container className="mt-4 text-center">
          <Outlet />
        </Container>
      </main>

      <footer className="footer bg-primary text-white text-center p-3 mb-0">
        &copy; 2025 Reportes de Alumnos
      </footer>
    </div>
  );
}
