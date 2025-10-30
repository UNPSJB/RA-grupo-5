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

    return <div className="container mt-4">Cargando encuesta... ⏳</div>;
  }
  

  return (
    <div className="container mt-4"> 
      <form onSubmit={handleSubmit(onSubmit)}>
        {error && <div className="alert alert-danger">Error: {error}</div>}
        

        <h1>{encuesta.nombre}</h1> 
        <h2>{asignatura?.nombre}</h2>


        {encuesta.variables.map(variable => (
          <Variable
            key={variable.id}
            variable={variable}
            control={control}
            errors={errors}
          />
        ))}
        {Object.keys(errors).length > 0 && (
        <div className="alert alert-warning mt-4">
           Debes completar **{Object.keys(errors).length}** preguntas obligatorias.
        </div>
)}
        <button 
          type="submit"
          className="btn btn-primary mt-3" 
          disabled={isSubmitting || loading} 
        >
          {isSubmitting || loading ? 'Guardando...' : 'Guardar Respuestas'}
        </button>
        

      </form>
    </div>
  );
}

export default ResponderEncuesta;