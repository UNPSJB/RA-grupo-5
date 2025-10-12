import {useState, useEffect} from "react";
import {useInformes} from "../hook/useInformes";
import {useParams} from "react-router-dom";
import { Container, Row, Col, Card, Form, CardBody, InputGroup } from "react-bootstrap";
import "../styles/informe.css"
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
    "¿Se logro desarrollar la totalidad de los contenidos planificados?",
    "¿Cuales fueron los principales aspectos positivos y los obstaculos que se manifiestaron durante el desarrollo del espacio curricular?",
];

if (!informe) return <p>Cargando informe...</p>;

return (
    <Container className=" my-5">
        <Col>
            <Card style={{maxWidth: '800px'}} className="mi-card p-5 shadow-lg mx-auto">
                <h2 className="text-center mb-4 text-primary">Informe currilcular</h2>

                <Form>
                    <Row className="align-items-strat">
                        <Col md={8} className="">
                            <Form.Group className="">
                                    <Form.Label className="m-3 bg-light fw-semibold">{preguntas_informe[0]}</Form.Label>
                                    <Form.Control as="textarea" rows={4} placeholder="Escriba su respuesta"/>
                            </Form.Group>
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
                    <Row>
                        <Col>
                            <Form.Group className="">       
                                    <Form.Label className="m-3 bg-light fw-semibold">{preguntas_informe[1]}</Form.Label>
                                    <Form.Control as="textarea" rows={4} placeholder="Escriba su respuesta"/>
                            </Form.Group>
                        </Col>
                    </Row>
                </Form> 

                <div className="p-3 bg-light rounded-3 border mt-4">
                    <p className="text-center mb-3 fw-semibold">
                    Centrandoce específicamente en los procesos de enseñanza y aprendizaje
                    </p>

                    <Row>
                        <h4 className="m-3">Aspectos positivos</h4>
                        <Col md={6}>
                            <Form.Group className="m-2">   
                                <Form.Label>Proceso de Enseñansa</Form.Label>
                                <Form.Control as="textarea" rows={4} placeholder="Describa los aspectos positivos..." />
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="m-2">
                                <Form.Label>Proceso de aprendizaje</Form.Label>
                                <Form.Control as="textarea" rows={4} placeholder="Describa los aspectos a mejorar..." />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <h4 className="m-3">Obstaculos</h4>

                        <Col md={6}>
                            <Form.Group>   
                            <Form.Label>Proceso de Enseñansa</Form.Label>
                            <Form.Control as="textarea" rows={4} placeholder="Describa los aspectos positivos..." />
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="m-2">
                                <Form.Label>Proceso de aprendizaje</Form.Label>
                                <Form.Control as="textarea" rows={4} placeholder="Describa los aspectos a mejorar..." />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <h4 className="m-3">Estrategias a implementar</h4>
                            <Form.Group className="m-2">
                                <Form.Control as="textarea" rows={4} placeholder="Describa las estrategias a implementar..." />
                            </Form.Group>
                    </Row>
                </div>
            </Card>
        </Col>
    </Container>
);
}
