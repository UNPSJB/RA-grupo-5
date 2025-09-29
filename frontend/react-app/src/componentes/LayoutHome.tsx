import { Link, Outlet } from "react-router-dom";
import { Container, Navbar, Nav } from "react-bootstrap";
import "../styles/Layout.css";

export default function LayoutHome() {
  return (
    <div className="layout">
      <Navbar bg="dark" variant="dark" expand="lg">
        <Navbar.Brand className="p-4 text-white border-end" href="/">
          Encuestas UNPSJB
        </Navbar.Brand>
      </Navbar>

      <main className="content flex-grow-1">
        <Container
          className="mt-4 d-flex flex-column align-items-center justify-content-end"
          style={{ minHeight: "35vh" }}
        >
          <Outlet />
          <div className="d-flex gap-3 mt-5">
            <Link to="/alumno" className="btn btn-dark  ">
              Rol Alumno
            </Link>
            <Link to="/docente" className="btn btn-dark">
              Rol Docente
            </Link>
            <Link to="/departamento" className="btn btn-dark">
              Rol Departamento
            </Link>
          </div>
        </Container>
      </main>

      <footer className="footer bg-dark text-white text-center p-3 mb-0">
        &copy; 2025 Reportes de Alumnos
      </footer>
    </div>
  );
}
