import  { useState, useEffect, useMemo } from 'react';
import {
    Container,
    Form,      
    Button,    
    Alert,     
    Spinner,
    Col,
    Row,  // <-- Añadido para el layout
    Card, // <-- Añadido para la "cáscara"
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
  
    // --- 1. HOOKS (PARTE 1) ---
    const { id } = useParams<{ id: string }>();
    const idEncuesta = id ? Number(id) : null;

    const {
        encuesta,
        asignatura,
        loading,
        error,
        guardarRespuestas
    } = useResponderEncuesta(idEncuesta);

    // --- 2. DATOS MEMORIZADOS ---
    const { defaultValues, schema } = useMemo(() => {
        if (!encuesta || !encuesta.variables) {
            return { defaultValues: {}, schema: undefined };
        }
        return {
            defaultValues: construirValoresPorDefecto(encuesta),
            schema: construirEsquemaEncuesta(encuesta)
        };
    }, [encuesta]);

    // --- 3. HOOKS (PARTE 2) ---
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

    // --- 4. useEffect (PARA SINCRONIZAR) ---
    useEffect(() => {
        reset(defaultValues); 

        if (encuesta && encuesta.variables && encuesta.variables.length > 0 && activeTab === null) {
            setActiveTab(encuesta.variables[0].id.toString());
        }
        
    }, [encuesta, defaultValues, reset, activeTab]);

    // --- 5. LÓGICA DE MANEJADORES ---
    const onSubmit = async (data: SurveyFormData) => {
        const idPersona = 1;
        const resultado = await guardarRespuestas(idPersona, data);
        if (resultado) {
            alert("¡Encuesta guardada con éxito!");
        }
    };

    // --- 6. ESTADOS DE CARGA / ERRORES (EARLY RETURNS) ---
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

    // --- 7. LÓGICA DE RENDER (SEGURA) ---
    const activeTabIndex = encuesta.variables.findIndex(v => v.id.toString() === activeTab);
    
    if (activeTabIndex === -1) {
        setActiveTab(encuesta.variables[0].id.toString());
        return null;
    }

    const handlePrevious = () => {
        const previousTabKey = encuesta.variables[activeTabIndex - 1].id.toString();
        setActiveTab(previousTabKey);
    };

    const handleNext = () => {
        const nextTabKey = encuesta.variables[activeTabIndex + 1].id.toString();
        setActiveTab(nextTabKey);
    };

    // --- 8. RENDER REFACTORIZADO CON TEMA ---
    return (
        <Container className="py-4">
          
          {/* 1. Usamos <Row> y <Col> solo para el layout (centrar) */}
          <Row>
            <Col md={8} className="mx-auto">
              
              {/* 2. Usamos <Card> para el contenido (nuestra "cáscara" estándar) */}
              <Card className="border rounded shadow-sm">
                
                {/* 3. ¡TU IDEA! El encabezado con el color $primary (Azul UNPSJB) */}
                <Card.Header as="h4" className="bg-primary text-white text-center">
                  {asignatura?.nombre}
                </Card.Header>
                
                {/* 4. Usamos <Card.Body> para el padding */}
                <Card.Body className="p-4">
                  <Form onSubmit={handleSubmit(onSubmit)}> 
                    
                    {error && <Alert variant="danger">Error: {error}</Alert>}
                    
                    <Tabs
                      activeKey={activeTab}
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

                    {/* Botones de Navegación */}
                    <div className="d-flex justify-content-between mt-4">
                      
                      {/* Este botón (secondary) será GRIS */}
                      <Button 
                          variant="secondary" 
                          onClick={handlePrevious}
                          disabled={activeTabIndex === 0}
                          type="button" 
                      >
                          Anterior
                      </Button>

                      {/* Estos botones (primary) serán AZUL UNPSJB */}
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
                </Card.Body>
              </Card>
              
            </Col>  
          </Row>
        </Container>
    );
}

export default ResponderEncuesta;