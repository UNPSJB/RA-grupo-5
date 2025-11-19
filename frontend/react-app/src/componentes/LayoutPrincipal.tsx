// 1. Importamos NavLink de React Router
import { Link, Outlet, NavLink } from "react-router-dom";
import { Container, Navbar, Nav } from "react-bootstrap";
import "../styles/Layout.css";
import logoUnpsjb from "../assets/escudo_tranparente_sinletras.png"; 

type NavLinkItem = {
    to: string;
    label: string;
};

type Props = {
    links: NavLinkItem[]; 
};

export default function LayoutPrincipal({ links }: Props) {
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
                
            </Navbar.Collapse>
        </Navbar>

        <main className="content">
            <Container className="mt-4 text-center" >
            <Outlet /> 
            </Container>
        </main>

        <footer className="footer bg-primary text-white text-center p-3 mb-0">
            &copy; 2025 Reportes de Alumnos
        </footer>
    </div>
);
}