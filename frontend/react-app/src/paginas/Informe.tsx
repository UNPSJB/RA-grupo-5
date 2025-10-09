import {useState, useEffect} from "react";
import {useInformes} from "../hook/useInformes";
import {useParams} from "react-router-dom";
import { Container, Row, Col, Card, Form } from "react-bootstrap";

export default function Informe() {
    const {id} = useParams<{id: string}>();
    const {fetchInformeById} = useInformes();
    const [informe, setInforme] = useState<any>(null);


useEffect(() => {
        if (id) {
        fetchInformeById(Number(id)).then((data) => {
            console.log("Datos recibidos:", data); // <-- Y este log
            setInforme(data);
        });
    }
}, [id]);

const preguntas_informe = [
    "¿El contenido del curso fue relevante para la materia?",
    "¿El docente explicó los conceptos de manera clara?",
    "¿El material de estudio fue adecuado?",
    "¿El ritmo del curso fue apropiado?",
    "¿Recomendarías este curso a otros estudiantes?"
];

if (!informe) return <p>Cargando informe...</p>;

return (
    <Container className=" justify-content-center mt-4">
        <Row>
            <Col>
                <Card>
                    <Card.Header as="h5">Informe: {informe.cod_act_curricular}</Card.Header>
                    <Card.Body className="d-flex justify-content-between">
                        <Card.Text >
                            <strong>Estado:</strong> {informe.estado}
                        </Card.Text >
                        <Card.Text >
                            <strong>Sede:</strong> {informe.sede}
                        </Card.Text>
                        <Card.Text >
                            <strong>Ciclo Lectivo:</strong> {informe.ciclo_lectivo}
                        </Card.Text>
                        
                    </Card.Body>
                </Card>
          </Col>
                    {preguntas_informe.map((pregunta, i) => (
            <Row key={i} className="mt-3">
                <Card>
                    <Form>
                        <Form.Group as={Row} className="mb-3" controlId={`pregunta-${i}`}>
                            <Form.Label column sm="8">{pregunta}</Form.Label>
                            <Col sm="4">
                                <Form.Control type="text" placeholder="Ingrese su respuesta"/>
                            </Col>
                        </Form.Group>

                    </Form>
                </Card>
            </Row>
          ))    
        }
        </Row>
    </Container>
);
}
