import { Link, Outlet, useNavigate } from "react-router-dom";
import { Container, Col, Navbar, Row } from "react-bootstrap";
import "../styles/Layout.css";
import logoUnpsjb from "../assets/escudo_tranparente_sinletras.png";
import malvinasIcon from "../assets/icon.jpg";
import { useAuth } from "../context/AuthContext";

export default function LayoutHome() {
  const navigate = useNavigate();
  const { roles, logout, token } = useAuth();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="layout">
      {/* NAVBAR SUPERIOR */}
      <Navbar bg="dark" variant="dark" expand="lg">
        <Navbar.Brand className="ms-3" href="/">
          <img
            src={logoUnpsjb}
            width="50"
            height="60"
            className="d-inline-block align-top ms-3"
            alt="Logo UNPSJB"
          />
        </Navbar.Brand>

        <div className="ms-auto me-4">
          {!token ? (
            <Link to="/login" className="btn btn-outline-light">
              Iniciar sesión
            </Link>
          ) : (
            <button className="btn btn-outline-danger" onClick={handleLogout}>
              Cerrar sesión
            </button>
          )}
        </div>
      </Navbar>

      {/* CONTENIDO PRINCIPAL */}
      <main className="content flex-grow-1">
        <Container
          className="mt-4 d-flex flex-column align-items-center justify-content-end"
          style={{ minHeight: "35vh" }}
        >
          <img src={malvinasIcon} alt="" />
          <Outlet />

          {/* BOTONES SEGÚN ROL */}
          {token && (
            <Row className="text-center mt-5 g-5">
              {roles.includes("alumno") && (
                <Col md={4} className="d-flex flex-column align-items-center">
                  <i className="bi bi-mortarboard-fill home-icon text-primary"></i>
                  <Link to="/alumno" className="btn btn-secondary btn-lg">
                    Alumno
                  </Link>
                </Col>
              )}

              {roles.includes("docente") && (
                <Col md={4} className="d-flex flex-column align-items-center">
                  <i className="bi bi-briefcase-fill home-icon text-primary"></i>
                  <Link to="/docente" className="btn btn-secondary btn-lg">
                    Docente
                  </Link>
                </Col>
              )}

              {roles.includes("departamento") && (
                <Col md={4} className="d-flex flex-column align-items-center">
                  <i className="bi bi-building home-icon text-primary"></i>
                  <Link to="/departamento" className="btn btn-secondary btn-lg">
                    Departamento
                  </Link>
                </Col>
              )}
            </Row>
          )}

          {!token && (
            <p className="mt-4 text-muted">
              Inicia sesión para acceder a tu panel.
            </p>
          )}
        </Container>
      </main>

      {/* FOOTER */}
      <footer className="footer bg-dark text-white text-center p-3 mb-0">
        &copy; 2025 Reportes de Alumnos
      </footer>
    </div>
  );
}
