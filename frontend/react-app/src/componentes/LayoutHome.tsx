import { Link, Outlet } from "react-router-dom";
import { Container, Col, Navbar, Row, Card, Nav } from "react-bootstrap"; 
import "../styles/Layout.css"; 
import logoUnpsjb from "../assets/escudo_tranparente_sinletras.png";

export default function LayoutHome() {
  return (
    <div className="layout">
      
      <Navbar 
        bg="primary" 
        variant="dark" 
        expand="lg"
        sticky="top" 
        className="shadow-sm" 
      >
        
        <Navbar.Brand className="ms-3" href="/">
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
          
          <Nav className="ms-auto me-3"> 
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <main className="content flex-grow-1 pb-5">
        <Container className="py-4"> 
          
          <Row>
            <Col lg={9} md={10} className="mx-auto">
              <Card className="border rounded shadow-sm bg-white text-center">
                
                <Card.Header as="h4" className="bg-primary text-white">
                  Plataforma de Gestión Académica
                </Card.Header>

                <Card.Body className="p-4 p-md-5">
                  <h2>Bienvenido al Sistema</h2>
                  <p className="lead text-muted">
                    Por favor, seleccione su rol para ingresar.
                  </p>
                  
                  <hr className="my-4" />

                  <Row className="text-center g-4">
                    
                    <Col md={4}>
                      <Card 
                        as={Link} 
                        to="/alumno" 
                        className="border rounded shadow-sm bg-white text-center h-100 text-decoration-none text-dark" 
                      >
                        <Card.Body className="p-4 d-flex flex-column justify-content-center align-items-center">
                          <i className="bi bi-mortarboard-fill home-icon text-primary"></i>
                          <h5 className="mt-3 mb-0">Alumno</h5> 
                        </Card.Body>
                      </Card>
                    </Col>

                    <Col md={4}>
                      <Card 
                        as={Link} 
                        to="/docente" 
                        className="border rounded shadow-sm bg-white text-center h-100 text-decoration-none text-dark" 
                      >
                        <Card.Body className="p-4 d-flex flex-column justify-content-center align-items-center">
                          <i className="bi bi-briefcase-fill home-icon text-primary"></i>
                          <h5 className="mt-3 mb-0">Docente</h5> 
                        </Card.Body>
                      </Card>
                    </Col>

                    <Col md={4}>
                      <Card 
                        as={Link} 
                        to="/departamento" 
                        className="border rounded shadow-sm bg-white text-center h-100 text-decoration-none text-dark" 
                      >
                        <Card.Body className="p-4 d-flex flex-column justify-content-center align-items-center">
                          <i className="bi bi-building home-icon text-primary"></i>
                          <h5 className="mt-3 mb-0">Departamento</h5> 
                        </Card.Body>
                      </Card>
                    </Col>
                    
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Outlet />
        </Container>
      </main>

      <footer className="footer bg-primary text-white text-center p-3 mb-0 fixed-bottom">
        &copy; 2025 Reportes de Alumnos
      </footer>
    </div>
  );
}