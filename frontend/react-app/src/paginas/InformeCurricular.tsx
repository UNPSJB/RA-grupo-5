import {useState, useEffect} from "react";
import {useInformes} from "../hook/useInformes";
import {useParams} from "react-router-dom";
import { Container, Row, Col, Card, Form } from "react-bootstrap";
import "../styles/informe.css"
export default function CompletarInformeCurricular() {
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

const preguntas_informe= {
    preguntas: [
        "¿Se logró desarrollar la totalidad de los contenidos planificados?",
        "¿Cuáles fueron los principales aspectos positivos y los obstáculos que se manifestaron durante el desarrollo del espacio curricular?",
    ],
    respuestas: [
        "Sí, se logró desarrollar la mayoría de los contenidos planificados, aunque algunos temas se abordaron de manera resumida por cuestiones de tiempo.",
        "Entre los aspectos positivos se destaca la participación activa de los estudiantes y el trabajo colaborativo. Como obstáculos, se presentaron dificultades en la adaptación a nuevas metodologías y la falta de recursos tecnológicos en algunos casos.",
    ]};

if (!informe) return <p>Cargando informe curricular...</p>;

return (
    <Container className=" my-5">
        <Col>
            <Card style={{maxWidth: '800px'}} className="mi-card p-5 shadow-lg mx-auto">
                <h2 className="text-center mb-4 text-primary">Informe curricular</h2>
                <Card.Body>
                    <Row className="border mb-2">
                        <Card.Title className="ps-5 m-3 bg-light fw-semibold text-start">A-1</Card.Title>
                        <Col md={8} className="">
                            <Card.Text className="m-4 bg-light fw-semibold">{preguntas_informe.preguntas[0]}</Card.Text>
                            <Card.Text className="m-4 bg-light fw-semibold">{preguntas_informe.respuestas[0]}</Card.Text>
                        </Col>
                        <Col md={4} className="">
                            <Card className="shadow-sm border-0 bg-light">
                            <Card.Body className="text-center">
                                <Card.Title className="text-primary fw-semibold mb-3">
                                Horas dictadas / Horas establecidas
                                </Card.Title>
                                <div style={{ height: "150px" }}>
                                <h3 className="text-success fw-bold">80%</h3>
                                <p className="text-muted small">Cumplimiento total</p>
                                </div>
                            </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    <Row className="border mb-2">
                        <Card.Title className="ps-5 m-3 bg-light fw-semibold text-start">A-2</Card.Title>
                        <Col md={8} className="">
                            <Card.Text className="m-4 bg-light fw-semibold">{preguntas_informe.preguntas[1]}</Card.Text>
                            <Card.Text className="m-4 bg-light fw-semibold">{preguntas_informe.respuestas[1]}</Card.Text>
                        </Col>
                        <Col md={4} className="">
                            <Card className="shadow-sm border-0 bg-light">
                            <Card.Body className="text-center">
                                <Card.Title className="text-primary fw-semibold mb-3">
                                Contenidos alcanzados / Contenidos planificados
                                </Card.Title>
                                <div style={{ height: "150px" }}>
                                <h3 className="text-success fw-bold">90%</h3>
                                <p className="text-muted small">Cumplimiento total</p>
                                </div>
                            </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Card.Body > 
            </Card>
        </Col>
    </Container>
);
}
