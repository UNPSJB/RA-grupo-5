import { Link, Outlet } from "react-router-dom";
import { Container, Col, Navbar, Row } from "react-bootstrap";
import "../styles/Layout.css";
import logoUnpsjb from "../assets/escudo_tranparente_sinletras.png";
import malvinasIcon from "../assets/icon.jpg";

export default function LayoutHome() {
  return (
    <div className="layout">
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
      </Navbar>

      <main className="content flex-grow-1">
        <Container
          className="mt-4 d-flex flex-column align-items-center justify-content-end"
          style={{ minHeight: "35vh" }}
        >
          <img src={malvinasIcon} alt="" />
          <Outlet />

          <Row className="text-center mt-5 g-5">
            
            <Col md={4} className="d-flex flex-column align-items-center">
              {/* ¡CAMBIO AQUÍ! 
                  Quitamos 'fs-1' y 'mb-3', añadimos 'home-icon' */}
              <i className="bi bi-mortarboard-fill home-icon text-primary"></i>
              <Link to="/alumno" className="btn btn-secondary btn-lg">
                Alumno
              </Link>
            </Col>

            <Col md={4} className="d-flex flex-column align-items-center">
              {/* ¡CAMBIO AQUÍ! */}
              <i className="bi bi-briefcase-fill home-icon text-primary"></i>
              <Link to="/docente" className="btn btn-secondary btn-lg">
                Docente
              </Link>
            </Col>

            <Col md={4} className="d-flex flex-column align-items-center">
              {/* ¡CAMBIO AQUÍ! */}
              <i className="bi bi-building home-icon text-primary"></i>
              <Link to="/departamento" className="btn btn-secondary btn-lg">
                Departamento
              </Link>
            </Col>

          </Row>
        </Container>
      </main>

      <footer className="footer bg-dark text-white text-center p-3 mb-0">
        &copy; 2025 Reportes de Alumnos
      </footer>
    </div>
  );
}
