import { useState, useEffect } from "react";
import {
  Container,
  Form,
  Button,
  Alert,
  Card,
  Spinner,
  Row,
  Col,
} from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import LayoutReporte from "../componentes/LayoutReporte";
import Variable from "../componentes/Variable";
import { obtenerNombreCampo } from "../validaciones/Encuesta";
import type { InformeCurricular } from "../types/models/InformeCurricular";
import type { InformeBase } from "../types/models/InformeBase";
import apiFetch from "../api/client";

interface DetalleRespuesta {
  id: number;
  id_pregunta_opcion: number;
  texto_respuesta_abierta?: string;
  pregunta_opcion: {
    id: number;
    id_pregunta: number;
    id_opcion_respuesta: number | null;
  };
}

interface RespuestaBackend {
  id: number;
  detalles: DetalleRespuesta[];
}

export default function VerInformeCurricularRespondido() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [informe, setInforme] = useState<InformeCurricular | null>(null);
  const [informeBase, setInformeBase] = useState<InformeBase | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    if (!id) return;

    const cargarDatos = async () => {
      setLoading(true);
      try {
        // 1) Traer el informe de la asignatura
        const resInforme = await apiFetch(`/informes-asignaturas/${id}`);
        if (!resInforme.ok)
          throw new Error("Error al cargar el informe curricular");

        const dataInforme = (await resInforme.json()) as InformeCurricular & {
          id_informe_curricular_base?: number;
        };

        const idBase =
          dataInforme.id_informe_curricular_base ??
          dataInforme.informe_curricular_base?.id;

        if (!idBase) {
          throw new Error(
            "No se pudo determinar la plantilla base del informe"
          );
        }

        // 2) Traer la plantilla base
        const resBase = await apiFetch(`/informes-curriculares-base/${idBase}`);
        if (!resBase.ok) throw new Error("Error al cargar la plantilla base");
        const dataBase: InformeBase = await resBase.json();

        // 3) Traer las respuestas del DOCENTE LOGUEADO (backend usa token)
        const resRespuestas = await apiFetch(
          `/respuestas/?informe_asignatura_id=${id}`
        );
        if (!resRespuestas.ok)
          throw new Error("Error al cargar las respuestas");
        const dataRespuestas: RespuestaBackend[] = await resRespuestas.json();

        const valoresIniciales: Record<string, any> = {};

        if (dataRespuestas.length > 0) {
          const miRespuesta = dataRespuestas[0];

          miRespuesta.detalles.forEach((detalle) => {
            const idPregunta = detalle.pregunta_opcion.id_pregunta;
            const fieldName = obtenerNombreCampo(idPregunta);

            if (detalle.texto_respuesta_abierta) {
              valoresIniciales[fieldName] = detalle.texto_respuesta_abierta;
            } else if (detalle.pregunta_opcion.id_opcion_respuesta) {
              valoresIniciales[fieldName] =
                detalle.pregunta_opcion.id_opcion_respuesta;
            }
          });
        }

        setInforme(dataInforme);
        setInformeBase(dataBase);
        reset(valoresIniciales);
        setError(null);
      } catch (err: any) {
        console.error(err);
        setError(err.message ?? "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [id, reset]);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!informe || !informeBase) return null;

  // Variables administrativas para mostrar (read-only)
  const { asignatura, ciclo_lectivo, sede, docente, cant_alumnos_insc } =
    informe;

  return (
    <Container className="my-4">
      <h2 className="text-primary fw-bold mb-4">Informe Enviado</h2>

      <LayoutReporte
        asignatura={asignatura.nombre}
        anio={asignatura.año}
        docente={asignatura.nombre_docente}
        carrera={asignatura.carrera}
      >
        <Container className="mt-4 text-start">
          <Form>
            {/* --- Datos Administrativos (Solo lectura) --- */}
            <Card className="border rounded shadow-sm mb-4">
              <Card.Header as="h5" className="bg-secondary text-white">
                Datos Administrativos Registrados
              </Card.Header>
              <Card.Body className="p-4 bg-light">
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
                    <strong>Docente:</strong> {docente}
                  </Col>
                  <Col sm={6}>
                    <strong>Alumnos Inscriptos:</strong> {cant_alumnos_insc}
                  </Col>
                </Row>
                <Row>
                  <Col sm={6}>
                    <strong>Comisiones Teóricas:</strong>{" "}
                    {informe.cant_comisiones_teoricas}
                  </Col>
                  <Col sm={6}>
                    <strong>Comisiones Prácticas:</strong>{" "}
                    {informe.cant_comisiones_practicas}
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* --- Respuestas --- */}
            <Card className="border rounded shadow-sm">
              <Card.Header as="h5" className="bg-secondary text-white">
                Respuestas Enviadas
              </Card.Header>
              <Card.Body className="p-4">
                {informeBase.preguntas.map((pregunta) => (
                  <div key={pregunta.id} className="mb-3">
                    <Variable
                      variable={
                        {
                          id: 0,
                          nombre: "Cuerpo del Informe",
                          codigo: "INF",
                          preguntas: [pregunta],
                        } as any
                      }
                      control={control}
                      errors={errors}
                      disabled={true}
                    />
                  </div>
                ))}

                <div className="text-center mt-4">
                  <Button
                    variant="primary"
                    onClick={() =>
                      navigate("/docente/informes-curriculares-respondidos")
                    }
                  >
                    Volver al listado
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Form>
        </Container>
      </LayoutReporte>
    </Container>
  );
}
