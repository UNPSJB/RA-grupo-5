import { Link, Outlet } from "react-router-dom";
import { Container, Col, Navbar } from "react-bootstrap";
import "../styles/Layout.css";
import logoUnpsjb from "../assets/unpsjb.png";
import malvinasIcon from "../assets/icon.jpg";
import logoAlumno from "../assets/al.jpg";
import logoDocente from "../assets/doc.jpg";
import logoDepartamento from "../assets/dep.jpg";

export default function LayoutHome() {
  return (
    <div className="layout">
      <Navbar bg="dark" variant="dark" expand="lg">
        <Navbar.Brand className="ms-3" href="/">
          <img
            src={logoUnpsjb}
            width="100"
            height="100"
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
          <div className="d-flex gap-3 mt-5">
            <div>
              <Col className="d-flex flex-column align-items-center">
                <img src={logoAlumno} alt="logoAlumno" />
                <Link to="/alumno" className="btn btn-secondary">
                  Alumno
                </Link>
              </Col>
            </div>

            <div>
              <Col className="d-flex flex-column align-items-center">
                <img src={logoDocente} alt="logoDocente" />
                <Link to="/docente" className="btn btn-secondary">
                  Docente
                </Link>
              </Col>
            </div>

            <div>
              <Col className="d-flex flex-column align-items-center">
                <img src={logoDepartamento} alt="logoDepartamento" />
                <Link to="/departamento" className="btn btn-secondary">
                  Departamento
                </Link>
              </Col>
            </div>
            <div>
            <Col className="d-flex flex-column align-items-center">
                <img src={logoDepartamento} alt="logoDepartamento" />
                <Link to="/secretaria" className="btn btn-secondary">
                  Secretaria
                </Link>
              </Col>
          </div>
          </div>
          
        </Container>
      </main>

      <footer className="footer bg-dark text-white text-center p-3 mb-0">
        &copy; 2025 Reportes de Alumnos
      </footer>
    </div>
  );
}
