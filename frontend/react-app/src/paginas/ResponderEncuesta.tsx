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
    Tab
} from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useResponderEncuesta } from '../hook/useResponderEncuesta';
import Variable from '../componentes/Variable';
import {
    construirEsquemaEncuesta,
    construirValoresPorDefecto,
    obtenerNombreCampo // <-- Importado para la validación
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
        reset,
        trigger // <-- 1. Obtenemos 'trigger' de useForm
    } = useForm<SurveyFormData>({
        defaultValues: defaultValues,
        resolver: schema ? zodResolver(schema) : undefined, 
    });

    const [activeTab, setActiveTab] = useState<string | null>(null);

    // --- 4. useEffects (CORREGIDOS) ---
    
    // Efecto 1: Resetea el formulario SÓLO cuando los datos (defaultValues) cambian.
    useEffect(() => {
        reset(defaultValues); 
    }, [defaultValues, reset]);

    // Efecto 2: Establece la pestaña inicial SÓLO una vez, cuando la data carga.
    useEffect(() => {
        if (encuesta && encuesta.variables && encuesta.variables.length > 0 && activeTab === null) {
            setActiveTab(encuesta.variables[0].id.toString());
        }
    }, [encuesta, activeTab]);

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
        return ( <Container className="py-4 text-center">Cargando...</Container> );
    }
    if (!encuesta || !encuesta.variables) {
        return ( <Container className="py-4 text-center"><Alert variant="danger">Error al cargar.</Alert></Container> );
    }
    if (encuesta.variables.length === 0) {
        return ( <Container className="py-4 text-center"><Alert variant="info">No hay preguntas.</Alert></Container> );
    }
    if (activeTab === null) {
        return ( <Container className="py-4 text-center">Iniciando...</Container> );
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

    // --- 8. LÓGICA DE VALIDACIÓN (¡NUEVO!) ---

    // Función reutilizable para validar la pestaña actual
    const validateCurrentTab = async () => {
        // 2. Encontramos la variable (pestaña) actual
        const currentVariable = encuesta.variables[activeTabIndex];
        
        // 3. Obtenemos los nombres de campo (ej: "pregunta_123") 
        //    SÓLO de las preguntas obligatorias en esta pestaña
        const fieldsToValidate = currentVariable.preguntas
            .filter(p => p.obligatoria && p.tipo === 'single_choice') // Solo validamos single_choice obligatorias
            .map(p => obtenerNombreCampo(p.id));
        
        if (fieldsToValidate.length === 0) {
            return true; // No hay nada que validar en esta pestaña
        }

        // 4. Disparamos la validación SÓLO para esos campos
        const isValid = await trigger(fieldsToValidate);
        return isValid;
    };

    // Actualizamos handleNext para que sea async y valide
    const handleNext = async () => {
        const isValid = await validateCurrentTab();
        
        if (isValid) {
            const nextTabKey = encuesta.variables[activeTabIndex + 1].id.toString();
            setActiveTab(nextTabKey);
        }
        // Si no es válido, trigger() ya mostró los errores
    };

    // Actualizamos onSelect para que valide si vamos hacia adelante
    const handleTabSelect = async (key: string | null) => {
        if (key === null || key === activeTab) return;

        const newTabIndex = encuesta.variables.findIndex(v => v.id.toString() === key);
        
        // Si vamos hacia atrás (o a la misma pestaña), no validamos
        if (newTabIndex < activeTabIndex) {
            setActiveTab(key);
            return;
        }

        // Si vamos hacia adelante (clic en una pestaña futura), validamos
        const isValid = await validateCurrentTab();
        if (isValid) {
            setActiveTab(key);
        }
        // Si no es válido, nos quedamos en la pestaña actual
    };
    // --- FIN DE LA LÓGICA DE VALIDACIÓN ---


    // --- 9. RENDER (CON EL NUEVO 'onSelect') ---
    return (
        <Container className="py-4">
          <Row>
            <Col md={8} className="mx-auto">
              <Card className="border rounded shadow-sm bg-white"> 
                <Card.Header as="h4" className="bg-primary text-white text-center">
                  {asignatura?.nombre}
                </Card.Header>
                <Card.Body className="p-4">
                  <Form onSubmit={handleSubmit(onSubmit)}> 
                    
                    {error && <Alert variant="danger">Error: {error}</Alert>}
                    
                    <Tabs
                      activeKey={activeTab}
                      onSelect={handleTabSelect} // <-- USAMOS EL NUEVO HANDLER
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
                            onClick={handleNext} // <-- Usa el nuevo handler
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