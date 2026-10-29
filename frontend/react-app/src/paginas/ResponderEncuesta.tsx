import { useState, useEffect, useMemo } from 'react';
import {
    Container,
    Form,      
    Button,    
    Alert,     
    Spinner,
    Col,
    Row,
    Card,
    Tabs,
    Tab,
    ProgressBar
} from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useResponderEncuesta } from '../hook/useResponderEncuesta';
import Variable from '../componentes/Variable';
import {
    construirEsquemaEncuesta,
    construirValoresPorDefecto,
    obtenerNombreCampo
} from '../validaciones/Encuesta';

import { useAlertaFlotante } from '../hook/useAlertaFlotante';
import AlertaFlotante from '../componentes/AlertaFlotante';

type SurveyFormData = Record<string, any>;

function ResponderEncuesta() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const idEncuesta = id ? Number(id) : null;

    const {
        encuesta,
        asignatura,
        loading,
        error,
        guardarRespuestas
    } = useResponderEncuesta(idEncuesta);

    const encuestaOrdenada = useMemo(() => {
        if (!encuesta || !encuesta.variables) return encuesta;
        const variables = [...encuesta.variables].sort((a: any, b: any) => {
            const codigoA = (a.codigo || "").toString().toUpperCase();
            const codigoB = (b.codigo || "").toString().toUpperCase();
            if (codigoA === "H") return 1;
            if (codigoB === "H") return -1;
            if (codigoA < codigoB) return -1;
            if (codigoA > codigoB) return 1;
            return 0;
        });
        return { ...encuesta, variables };
    }, [encuesta]);

    const { alerta, mostrarAlerta, cerrarAlerta } = useAlertaFlotante();

    const handleAlertExited = () => {
        if (alerta.variant === 'success') {
            navigate('/alumno');
        }
    };

    const { defaultValues, schema } = useMemo(() => {
        if (!encuestaOrdenada || !encuestaOrdenada.variables) {
            return { defaultValues: {}, schema: undefined };
        }
        return {
            defaultValues: construirValoresPorDefecto(encuestaOrdenada),
            schema: construirEsquemaEncuesta(encuestaOrdenada)
        };
    }, [encuestaOrdenada]);

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        trigger,
        watch
    } = useForm<SurveyFormData>({
        defaultValues: defaultValues,
        resolver: schema ? zodResolver(schema) : undefined,
        mode: 'onChange' 
    });

    // Cálculo visual del avance: solo lee los valores actuales del formulario.
    const valoresActuales = watch();
    const progreso = useMemo(() => {
        const variables = encuestaOrdenada?.variables ?? [];
        const preguntas = variables.flatMap((variable: any) => variable?.preguntas ?? []);
        if (preguntas.length === 0) return 0;

        const respondidas = preguntas.filter((pregunta: any) => {
            if (!pregunta?.id) return false;
            const valor = valoresActuales?.[obtenerNombreCampo(pregunta.id)];
            if (Array.isArray(valor)) return valor.length > 0;
            return valor !== undefined && valor !== null && String(valor).trim() !== "";
        }).length;

        return Math.round((respondidas / preguntas.length) * 100);
    }, [encuestaOrdenada, valoresActuales]);

    const [activeTab, setActiveTab] = useState<string | null>(null);

    useEffect(() => {
        reset(defaultValues); 
    }, [defaultValues, reset]);

    const autocompletarDemo = () => {
        if (!encuestaRender || !encuestaRender.variables) return;
        const valores: Record<string, any> = {};
        const esPeriodoIA = encuestaRender.anio_inicio === 2029 && encuestaRender.anio_fin === 2032;
        const totalVars = encuestaRender.variables.length;

        encuestaRender.variables.forEach((variable: any, varIndex: number) => {
            const esUltimaVariable = varIndex === totalVars - 1;
            const esVariableIA = (variable.codigo || "").toString().toUpperCase() === "H";

            variable.preguntas?.forEach((pregunta: any) => {
                const fieldName = obtenerNombreCampo(pregunta.id);
                const textoPregunta = (pregunta.texto_pregunta || "").toLowerCase();

                // No responder preguntas de IA en encuestas 2025-2028
                if (esVariableIA && !esPeriodoIA) {
                    return;
                }

                if (pregunta.tipo === "open") {
                    if (esVariableIA && esPeriodoIA) {
                        valores[fieldName] =
                            "Las herramientas de IA generativa fueron útiles para organizar ideas y resolver dudas. Siempre las contrasté con los apuntes de cátedra y considero fundamental recibir pautas claras sobre su uso ético.";
                    } else if (esUltimaVariable || textoPregunta.includes("opinion") || textoPregunta.includes("sugerencia") || textoPregunta.includes("global")) {
                        valores[fieldName] =
                            "La asignatura fue muy clara, los contenidos prácticos ayudaron mucho y la evaluación fue acorde a lo trabajado en clase.";
                    } else {
                        valores[fieldName] =
                            "Los contenidos fueron claros, bien organizados y resultaron útiles para el aprendizaje.";
                    }
                } else if (pregunta.tipo === "single_choice") {
                    const opciones = pregunta.pregunta_opcion || [];
                    if (opciones.length === 0) return;
                    let opcionPreferida: any = null;
                    if (esVariableIA && esPeriodoIA) {
                        opcionPreferida =
                            opciones.find((po: any) => po.opcion_respuesta?.valor >= 3) ||
                            opciones[2] ||
                            opciones[opciones.length - 1];
                    } else {
                        opcionPreferida =
                            opciones.find((po: any) => po.opcion_respuesta?.valor >= 4) ||
                            opciones[opciones.length - 2] ||
                            opciones[opciones.length - 1];
                    }
                    if (opcionPreferida?.opcion_respuesta?.id) {
                        valores[fieldName] = opcionPreferida.opcion_respuesta.id;
                    } else if (opcionPreferida?.id_opcion_respuesta) {
                        valores[fieldName] = opcionPreferida.id_opcion_respuesta;
                    }
                } else if (pregunta.tipo === "multiple_choice") {
                    const opciones = pregunta.pregunta_opcion || [];
                    if (opciones.length === 0) return;
                    const opcion = opciones[0];
                    if (opcion?.opcion_respuesta?.id) {
                        valores[fieldName] = [opcion.opcion_respuesta.id];
                    } else if (opcion?.id_opcion_respuesta) {
                        valores[fieldName] = [opcion.id_opcion_respuesta];
                    }
                }
            });
        });
        reset(valores);
    };

    useEffect(() => {
        if (encuestaOrdenada && encuestaOrdenada.variables && encuestaOrdenada.variables.length > 0 && activeTab === null) {
            setActiveTab(encuestaOrdenada.variables[0].id.toString());
        }
    }, [encuestaOrdenada, activeTab]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
            e.preventDefault();
        }
    };

    const onSubmit = async (data: SurveyFormData) => {
        try {
            const idPersona = 1; 
            const resultado = await guardarRespuestas(idPersona, data);
            
            const ok = typeof resultado === "object" ? resultado?.ok !== false : !!resultado;

            if (ok) {
                mostrarAlerta("success", "¡Encuesta guardada con éxito! ✔");
            } else {
                mostrarAlerta("danger", "No se pudieron guardar las respuestas.");
            }
        } catch (err: any) {
            console.error(err);
            mostrarAlerta("danger", err?.message || "Ocurrió un error inesperado.");
        }
    };

    if (loading) return <Container className="py-4 text-center"><Spinner animation="border" /></Container>;
    if (!encuestaOrdenada || !encuestaOrdenada.variables) {
        return (
            <Container className="py-4 text-center">
                <Alert variant="danger">
                    {error ? `Error: ${error}` : "Error al cargar."}
                </Alert>
            </Container>
        );
    }
    if (encuestaOrdenada.variables.length === 0) return <Container className="py-4 text-center"><Alert variant="info">No hay preguntas.</Alert></Container>;
    if (activeTab === null) return <Container className="py-4 text-center">Iniciando...</Container>;

    const encuestaRender = encuestaOrdenada;
    const activeTabIndex = encuestaRender.variables.findIndex(v => v.id.toString() === activeTab);
    const isLastTab = activeTabIndex === encuestaRender.variables.length - 1;
    
    if (activeTabIndex === -1) {
        setActiveTab(encuestaRender.variables[0].id.toString());
        return null;
    }

    const handlePrevious = (e: React.MouseEvent) => {
        e.preventDefault(); 
        const previousTabKey = encuestaRender.variables[activeTabIndex - 1].id.toString();
        setActiveTab(previousTabKey);
    };

    const validateCurrentTab = async () => {
        const currentVariable = encuestaRender.variables[activeTabIndex];
        const fieldsToValidate = currentVariable.preguntas
            .filter(p => p.obligatoria && p.tipo === 'single_choice')
            .map(p => obtenerNombreCampo(p.id));
        
        if (fieldsToValidate.length === 0) return true;
        return await trigger(fieldsToValidate);
    };

    const handleNext = async (e: React.MouseEvent) => {
        e.preventDefault(); 
        e.stopPropagation();
        
        const isValid = await validateCurrentTab();
        if (isValid) {
            const nextTabKey = encuestaRender.variables[activeTabIndex + 1].id.toString();
            setActiveTab(nextTabKey);
        }
    };

    const handleTabSelect = async (key: string | null) => {
        if (key === null || key === activeTab) return;
        const newTabIndex = encuestaRender.variables.findIndex(v => v.id.toString() === key);
        
        if (newTabIndex < activeTabIndex) {
            setActiveTab(key);
            return;
        }
        const isValid = await validateCurrentTab();
        if (isValid) {
            setActiveTab(key);
        }
    };

    return (
        <Container className="py-4">
          
          <AlertaFlotante 
            show={alerta.show}
            variant={alerta.variant}
            message={alerta.message}
            onClose={cerrarAlerta}
            onExited={handleAlertExited}
          />

          <Row>
            <Col md={8} className="mx-auto">
              <Card className="border rounded shadow-sm bg-white">
                <Card.Header className="bg-primary text-white">
                  <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <div className="text-center flex-grow-1">
                      <h4 className="mb-0">{asignatura?.nombre}</h4>
                      {encuestaRender.anio_inicio != null && encuestaRender.anio_fin != null && (
                        <div className="small fw-normal mt-1">
                          Periodo: {encuestaRender.anio_inicio} - {encuestaRender.anio_fin}
                        </div>
                      )}
                    </div>
                    <Button
                      variant="outline-light"
                      size="sm"
                      onClick={autocompletarDemo}
                      type="button"
                      className="text-nowrap"
                    >
                       Autocompletar Demo
                    </Button>
                  </div>
                </Card.Header>
                <Card.Body className="p-4">
                  <Form onSubmit={handleSubmit(onSubmit)} onKeyDown={handleKeyDown}> 
                    
                    <div className="mb-4">
                      <div className="d-flex justify-content-between align-items-center small fw-semibold mb-1">
                        <span>
                          <i className="bi bi-list-check me-1 text-primary" />
                          Progreso de la encuesta
                        </span>
                        <span className={progreso === 100 ? "text-success" : "text-muted"}>
                          {progreso}%
                        </span>
                      </div>
                      <ProgressBar
                        now={progreso}
                        animated
                        striped
                        variant={progreso === 100 ? "success" : "primary"}
                        className="progress-animated"
                        style={{ height: "10px" }}
                      />
                    </div>

                    {error && <Alert variant="danger" className="mb-3">Error: {error}</Alert>}
                    
                    <Tabs
                      activeKey={activeTab}
                      onSelect={handleTabSelect} 
                      id="variable-tabs"
                      className="mb-3"
                    >
                      {encuestaRender.variables.map(variable => (
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
                            />
                          </div>
                        </Tab>
                      ))}
                    </Tabs>

                    {Object.keys(errors).length > 0 && (
                        <Alert variant="warning" className="mt-4">
                            Debes completar <strong>{Object.keys(errors).length}</strong> preguntas obligatorias marcadas en rojo.
                        </Alert>
                    )}

                    <div className="d-flex justify-content-between mt-4">
                      <Button 
                          variant="secondary" 
                          onClick={handlePrevious}
                          disabled={activeTabIndex === 0}
                          type="button"
                      >
                          Anterior
                      </Button>

                      <Button
                        variant="primary"
                        type={isLastTab ? "submit" : "button"}
                        onClick={isLastTab ? undefined : handleNext}
                        disabled={isSubmitting}
                      >
                        {isLastTab ? (
                            isSubmitting ? (
                                <>
                                    <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                        className="me-2"
                                    />
                                    Guardando...
                                </>
                            ) : (
                                'Guardar Respuestas'
                            )
                        ) : (
                            "Siguiente"
                        )}
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>  
          </Row>
        </Container>
    );
}

export default ResponderEncuesta;