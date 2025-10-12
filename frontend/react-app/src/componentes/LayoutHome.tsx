import { Link, Outlet } from "react-router-dom";
import { Container, Card, Navbar,  } from "react-bootstrap";
import "../styles/Layout.css";
import logoUnpsjb from "../assets/unpsjb.png"

export default function LayoutHome() {
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
      </Navbar>

      <main className="content flex-grow-1">
        <Container
          className="mt-4 d-flex flex-column align-items-center justify-content-end"
          style={{ minHeight: "35vh" }}
        >
          <Outlet />
          <div className="d-flex gap-3 mt-5">

            <Link to="/alumno" className="btn btn-dark  ">
            Rol Alumno</Link>
        
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
