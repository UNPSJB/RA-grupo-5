import React, { useState, useEffect, useMemo } from 'react'; // <-- Importamos useMemo
import {
    Container,
    Form,      
    Button,    
    Alert,     
    Spinner,
    Col,
    Tabs,
    Tab
} from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useResponderEncuesta } from '../hook/useResponderEncuesta';
import Variable from '../componentes/Variable';
import {
    construirEsquemaEncuesta,
    construirValoresPorDefecto
} from '../validaciones/Encuesta';

type SurveyFormData = Record<string, any>;

function ResponderEncuesta() {
    
    const { id } = useParams<{ id: string }>();
    const idEncuesta = id ? Number(id) : null;

    const {
        encuesta,
        asignatura,
        loading,
        error,
        guardarRespuestas
    } = useResponderEncuesta(idEncuesta);

    const { defaultValues, schema } = useMemo(() => {
        if (!encuesta || !encuesta.variables) {
            return { defaultValues: {}, schema: undefined };
        }
        return {
            defaultValues: construirValoresPorDefecto(encuesta),
            schema: construirEsquemaEncuesta(encuesta)
        };
    }, [encuesta]); 

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset 
    } = useForm<SurveyFormData>({
        defaultValues: defaultValues,
        resolver: schema ? zodResolver(schema) : undefined, 
    });

    const [activeTab, setActiveTab] = useState<string | null>(null);

    useEffect(() => {
        reset(defaultValues); 

        if (encuesta && encuesta.variables && encuesta.variables.length > 0 && activeTab === null) {
            setActiveTab(encuesta.variables[0].id.toString());
        }
      }, [encuesta, defaultValues, reset, activeTab]);


    const onSubmit = async (data: SurveyFormData) => {
        const idPersona = 1;
        const resultado = await guardarRespuestas(idPersona, data);
        if (resultado) {
            alert("¡Encuesta guardada con éxito!");
        }
    };

    if (loading) {
        return (
            <Container className="py-4 text-center">
                <Spinner animation="border" role="status" className="me-2" />
                Cargando encuesta... ⏳
            </Container>
        );
    }

    if (!encuesta || !encuesta.variables) {
        return (
            <Container className="py-4 text-center">
                <Alert variant="danger">
                    {error || "Error: No se pudo cargar la encuesta o la encuesta no tiene variables."}
                </Alert>
            </Container>
        );
    }
    
    if (encuesta.variables.length === 0) {
        return (
            <Container className="py-4">
                <Col md={8} className="border rounded mx-auto shadow p-4 text-center">
                    <h1 className='h2 mb-4 text-center'>{asignatura?.nombre}</h1>
                    <Alert variant="info">
                        Esta encuesta no tiene preguntas para responder.
                    </Alert>
                </Col>
            </Container>
        );
    }
    if (activeTab === null) {
        return (
            <Container className="py-4 text-center">
                <Spinner animation="border" role="status" className="me-2" />
                Iniciando formulario...
            </Container>
        );
    }

    const activeTabIndex = encuesta.variables.findIndex(v => v.id.toString() === activeTab);
    
    if (activeTabIndex === -1) {
        setActiveTab(encuesta.variables[0].id.toString());
        return null; // El componente se re-renderizará
    }

    const handlePrevious = () => {
        const previousTabKey = encuesta.variables[activeTabIndex - 1].id.toString();
        setActiveTab(previousTabKey);
    };

    const handleNext = () => {
        const nextTabKey = encuesta.variables[activeTabIndex + 1].id.toString();
        setActiveTab(nextTabKey);
    };

    // --- 8. RETURN DEL JSX ---
    return (
        <Container className="py-4">
            <Col md={8} className="border rounded mx-auto shadow p-4">
                <Form onSubmit={handleSubmit(onSubmit)}> 
                    
                    {error && <Alert variant="danger">Error: {error}</Alert>}
                    <h1 className='h2 mb-4 text-center' >{asignatura?.nombre}</h1>

                    <Tabs
                      activeKey={activeTab} // Controlado por nuestro estado
                      onSelect={(k) => setActiveTab(k!)}
                      id="variable-tabs"
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
                            />
                          </div>
                        </Tab>
                      ))}
                    </Tabs>

                    {Object.keys(errors).length > 0 && (
                        <Alert variant="warning" className="mt-4">
                            Debes completar <strong>{Object.keys(errors).length}</strong> preguntas obligatorias.
                        </Alert>
                    )}

                    {/* Lógica de Botones de Navegación */}
                    <div className="d-flex justify-content-between mt-4">
                        <Button 
                            variant="secondary" 
                            onClick={handlePrevious}
                            disabled={activeTabIndex === 0}
                            type="button"
                        >
                            Anterior
                        </Button>

                        {activeTabIndex === encuesta.variables.length - 1 ? (
                            <Button
                                variant="primary"
                                type="submit"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
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
                                )}
                            </Button>
                        ) : (
                            <Button 
                                variant="primary" 
                                onClick={handleNext}
                                type="button" 
                            >
                                Siguiente
                            </Button>
                        )}
                    </div>
                </Form>
            </Col>  
        </Container>
    );
}

export default ResponderEncuesta;