import {
    Container,
    Form,       
    Button,     
    Alert,     
    Spinner,
    Col,    
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

    const defaultValues = encuesta ? construirValoresPorDefecto(encuesta) : {};
    const schema = encuesta ? construirEsquemaEncuesta(encuesta) : undefined;

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<SurveyFormData>({
        defaultValues: defaultValues,
        resolver: schema ? zodResolver(schema) : undefined,
    });

    const onSubmit = async (data: SurveyFormData) => {
        const idPersona = 1;
        const resultado = await guardarRespuestas(idPersona, data);
        if (resultado) {
            alert("¡Encuesta guardada con éxito!");
        }
    };

    if (loading || !encuesta) {
        return (
            <Container className="mt-4 text-center">
                <Spinner animation="border" role="status" className="me-2">
                    <span className="visually-hidden">Cargando...</span>
                </Spinner>
                Cargando encuesta... ⏳
            </Container>
        );
    }

    return (
        <Container className="m-4">
          <Col md={8} className="border rounded mx-auto shadow">
            <Form onSubmit={handleSubmit(onSubmit)}>
                
                {error && <Alert variant="danger">Error: {error}</Alert>}

                <h1 className='h2 m-4' >{asignatura?.nombre}</h1>

                {encuesta.variables.map(variable => (
                    <Variable
                        key={variable.id}
                        variable={variable}
                        control={control}
                        errors={errors}
                    />
                ))}

                {Object.keys(errors).length > 0 && (
                    <Alert variant="warning" className="mt-4">
                        Debes completar <strong>{Object.keys(errors).length}</strong> preguntas obligatorias.
                    </Alert>
                )}

                <Button
                    variant="primary"
                    type="submit"
                    className="mb-5"
                    disabled={isSubmitting || loading}
                >
                    {isSubmitting || loading ? (
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
            </Form>
          </Col>  
        </Container>
    );
}

export default ResponderEncuesta;