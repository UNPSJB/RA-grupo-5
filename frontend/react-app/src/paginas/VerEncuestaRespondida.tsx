import { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Card, Tabs, Tab, Spinner } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Variable from '../componentes/Variable';
import { obtenerNombreCampo } from '../validaciones/Encuesta';
import type { EncuestaBase, Asignatura, EncuestaAsignatura } from '../types/Encuesta';

// Interfaces auxiliares para las respuestas
interface DetalleRespuesta {
  id: number;
  id_pregunta_opcion: number;
  texto_respuesta_abierta?: string;
  pregunta_opcion: {
    id: number;
    id_pregunta: number;
    id_opcion_respuesta: number | null;
  }
}

interface RespuestaBackend {
  id: number;
  detalles: DetalleRespuesta[];
}

export default function VerEncuesta() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    
    const [encuesta, setEncuesta] = useState<EncuestaBase | null>(null);
    const [asignatura, setAsignatura] = useState<Asignatura | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const [activeTab, setActiveTab] = useState<string | null>(null);

    // ID ALUMNO HARDCODEADO
    const ID_ALUMNO = 1;

    // Hook del formulario (sin validación)
    const { control, formState: { errors }, reset } = useForm();

    useEffect(() => {
        if (!id) return;

        const cargarDatos = async () => {
            setLoading(true);
            try {
                // 1. Cargar estructura de la encuesta
                const resAsig = await fetch(`http://localhost:8000/encuestas-asignaturas/${id}`);
                if (!resAsig.ok) throw new Error("Error al cargar encuesta");
                const dataAsig: EncuestaAsignatura = await resAsig.json();
                
                const resBase = await fetch(`http://localhost:8000/encuestas-base/${dataAsig.id_encuesta_base}`);
                if (!resBase.ok) throw new Error("Error al cargar base");
                const dataBase: EncuestaBase = await resBase.json();

                // 2. Cargar las respuestas
                const resRespuestas = await fetch(
                    `http://localhost:8000/respuestas/?persona_id=${ID_ALUMNO}&encuesta_asignatura_id=${id}`
                );
                if (!resRespuestas.ok) throw new Error("Error al cargar respuestas");
                const dataRespuestas: RespuestaBackend[] = await resRespuestas.json();

                // 3. Procesar respuestas para el formulario
                const valoresIniciales: Record<string, any> = {};
                
                if (dataRespuestas.length > 0) {
                    const miRespuesta = dataRespuestas[0];
                    
                    miRespuesta.detalles.forEach(detalle => {
                        const idPregunta = detalle.pregunta_opcion.id_pregunta;
                        const fieldName = obtenerNombreCampo(idPregunta);
                        
                        if (detalle.texto_respuesta_abierta) {
                            valoresIniciales[fieldName] = detalle.texto_respuesta_abierta;
                        } else if (detalle.pregunta_opcion.id_opcion_respuesta) {
                            valoresIniciales[fieldName] = detalle.pregunta_opcion.id_opcion_respuesta;
                        }
                    });
                }

                setAsignatura(dataAsig.asignatura);
                setEncuesta(dataBase);
                reset(valoresIniciales);

                if (dataBase.variables && dataBase.variables.length > 0) {
                    setActiveTab(dataBase.variables[0].id.toString());
                }

            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        cargarDatos();
    }, [id, reset]);


    if (loading) return <Container className="py-5 text-center"><Spinner animation="border" variant="primary" /></Container>;
    if (error) return <Container className="py-5"><Alert variant="danger">{error}</Alert></Container>;
    if (!encuesta) return null;

    return (
        <Container className="my-4">
          {/* Título fuera de la Card, estilo consistente con Informes */}
          <h2 className="text-primary fw-bold mb-4">Encuesta Respondida</h2>
          
          <Card className="border rounded shadow-sm bg-white"> 
            
            {/* Cabecera Gris (Secondary) para indicar "Solo Lectura" */}
            <Card.Header as="h5" className="bg-secondary text-white">
              Respuesta Registrada: {asignatura?.nombre}
            </Card.Header>
            
            <Card.Body className="p-4">
              
              <Alert variant="info" className="mb-4">
                <i className="bi bi-info-circle-fill me-2"></i>
                Estás viendo las respuestas que enviaste. No se pueden realizar cambios.
              </Alert>

              <Form>
                <Tabs
                  activeKey={activeTab || undefined}
                  onSelect={(k) => setActiveTab(k)}
                  className="mb-3"
                >
                  {encuesta.variables.map(variable => (
                    <Tab
                      key={variable.id}
                      eventKey={variable.id.toString()} 
                      title={variable.codigo}
                    >
                      <div className="py-3">
                        <Variable
                            variable={variable}
                            control={control}
                            errors={errors}
                            disabled={true} // Bloquea todos los inputs
                        />
                      </div>
                    </Tab>
                  ))}
                </Tabs>

                <div className="text-center mt-4">
                  {/* Botón Secondary para navegación */}
                  <Button variant="secondary" onClick={() => navigate('/alumno/encuestas-respondidas')}>
                    Volver al listado
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Container>
    );
}