import React from 'react';
import type { Carrera } from '../types/models/Carrera';
import {Card, Row, Col, Form } from 'react-bootstrap';

interface Props {
  asignatura?: string;
  anio?: number;
  docente?: string;
  carrera: Carrera;
  ciclo_lectivo?: number;
  anio_inicio?: number | null;
  anio_fin?: number | null;
  sede?: string;
  cant_alumnos_insc?: number;
  cant_comisiones_practicas?: number;
  cant_comisiones_teoricas?: number;
  comision_asesora?: string;
  cursado?: string;
  integrantes?: string;
  periodosEncuesta?: string[];
  children?: React.ReactNode;
}


const EncabezadoCurricular: React.FC<Props> = ({ asignatura, anio, docente, carrera, ciclo_lectivo, anio_inicio, anio_fin, sede, cant_alumnos_insc, cant_comisiones_practicas, cant_comisiones_teoricas, children }) => {
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
                {anio_inicio != null && anio_fin != null && (
                  <div className="small text-muted mt-1">
                    <strong>Periodo:</strong> {anio_inicio} - {anio_fin}
                  </div>
                )}
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


const EncabezadoReporte: React.FC<Props> = ({
  asignatura,
  anio,
  docente,
  carrera,
  ciclo_lectivo,
  anio_inicio,
  anio_fin,
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
            <Col sm={6}>
              {anio_inicio != null && anio_fin != null && (
                <>
                  <strong>Periodo:</strong> {anio_inicio} - {anio_fin}
                </>
              )}
            </Col>
          </Row>

        </Card.Body>
      </Card>

      {children}
    </div>
  );
};

const EncabezadoSintetico: React.FC<Props> = ({
  carrera,
  ciclo_lectivo,
  sede,
  cursado,
  comision_asesora,
  integrantes,
  periodosEncuesta,
  children
}) => {
  return (
    <Card className="mb-4 border rounded shadow-sm">
      <Card.Header as="h5" className="bg-secondary text-white" style={{ textAlign: "left" }}>
        
        Datos Administrativos Registrados
      </Card.Header>

      <Card.Body className="p-4 bg-light">

        <Row className="mb-2" style={{ textAlign: "left" }}>
          <Col md={6}>
            <p><strong>Carrera:</strong> {carrera.nombre}</p>
            <p><strong>Ciclo Lectivo:</strong> {ciclo_lectivo}</p>
            {periodosEncuesta && periodosEncuesta.length > 0 && (
              <p><strong>Periodo de encuestas:</strong> {periodosEncuesta.join(" | ")}</p>
            )}
            <p><strong>Cursado:</strong> {cursado}</p>
            <p><strong>Sede:</strong> {sede}</p>

          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Comisión Asesora</Form.Label>
              <Form.Control
                type="text"
                value={comision_asesora}
                disabled
                style={{ backgroundColor: "#e9ecef", cursor: "default" }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Integrantes</Form.Label>
              <Form.Control
                type="text"
                value={integrantes}
                disabled
                style={{ backgroundColor: "#e9ecef", cursor: "default" }}
              />
            </Form.Group>
          </Col>
        </Row>

      </Card.Body>
    </Card>
  );
};

export { EncabezadoReporte, EncabezadoCurricular, EncabezadoSintetico};

