import React from 'react';
import type { Carrera } from '../types/models/Carrera';
import {Card, Row, Col } from 'react-bootstrap';

interface Props {
  asignatura: string;
  anio: number;
  docente: string;
  carrera: Carrera;
  ciclo_lectivo: number;
  sede: string;
  // OPCIONALES
  cant_alumnos_insc?: number;
  cant_comisiones_practicas?: number;
  cant_comisiones_teoricas?: number;
  children: React.ReactNode;
}


const LayoutReporte: React.FC<Props> = ({ asignatura, anio, docente, carrera, ciclo_lectivo, sede, cant_alumnos_insc, cant_comisiones_practicas, cant_comisiones_teoricas, children }) => {
  return (
    <div style={{ padding: '2rem', textAlign: "left" }}>
        <Card className="border rounded shadow-sm mb-4">
        <Card.Header as="h5" className="bg-secondary text-white">
            Datos Administrativos Registrados
        </Card.Header>
        

        <Card.Body className="p-4 bg-light">
            <Row className="mb-2">
                <Col sm={6}>
                    <strong>Asignatura:</strong> {asignatura}
                </Col>
                <Col sm={6}>
                    <strong>Carrera:</strong> {carrera.nombre}
                </Col>
            </Row>

            <Row className="mb-2">
                <Col sm={6}>
                    <strong>Ciclo Lectivo:</strong> {ciclo_lectivo}
                </Col>
                <Col sm={6}>
                    <strong>Sede:</strong> {sede}
                </Col>
            </Row>

            <Row className="mb-2">
                <Col sm={6}>
                    <strong>Docente Responsable:</strong> {docente}
                </Col>
                <Col sm={6}>
                    <strong>Alumnos Inscriptos:</strong> {cant_alumnos_insc}
                </Col>
            </Row>

            <Row>
                <Col sm={6}>
                    <strong>Comisiones Teóricas:</strong> {cant_comisiones_teoricas}
                </Col>
                <Col sm={6}>
                    <strong>Comisiones Prácticas:</strong> {cant_comisiones_practicas}
                </Col>
            </Row>
        </Card.Body>
    </Card>

      {children}
    </div>
  );
};


const LayoutReporte2: React.FC<Props> = ({
  asignatura,
  anio,
  docente,
  carrera,
  ciclo_lectivo,
  sede,
  children
}) => {
  return (
    <div style={{ padding: "2rem", textAlign: "left" }}>
      <Card className="border rounded-3 shadow-sm mb-4">
        
        <Card.Header
          as="h5"
          className="bg-primary text-white rounded-top-3"
          style={{ textAlign: "left" }}
        >
          Datos Administrativos Registrados
        </Card.Header>

        <Card.Body className="p-4 bg-white rounded-bottom-3">

          <Row className="mb-2">
            <Col sm={6}>
              <strong>Asignatura:</strong> {asignatura}
            </Col>
            <Col sm={6}>
              <strong>Carrera:</strong> {carrera.nombre}
            </Col>
          </Row>

          <Row className="mb-2">
            <Col sm={6}>
              <strong>Ciclo Lectivo:</strong> {ciclo_lectivo}
            </Col>
            <Col sm={6}>
              <strong>Sede:</strong> {sede}
            </Col>
          </Row>

          <Row className="mb-2">
            <Col sm={6}>
              <strong>Docente Responsable:</strong> {docente}
            </Col>
          </Row>

        </Card.Body>
      </Card>

      {children}
    </div>
  );
};


export { LayoutReporte, LayoutReporte2 };

