import React from 'react';
import { useParams } from 'react-router-dom'; 
import { useResponderEncuesta } from '../hook/useResponderEncuesta';
import Variable from '../componentes/Variable'; 

function PaginaResponderEncuesta() {
  const { id } = useParams<{ id: string }>();
  const idEncuesta = id ? Number(id) : null;
 const { 
    encuesta, 
    asignatura, 
    loading, 
    error,
    respuestas,
    handleRespuestaChange,
    guardarRespuestas 
  } = useResponderEncuesta(idEncuesta);

  const getSeleccion = (preguntaId: number) => {
    return respuestas.get(preguntaId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    const idPersona = 1; 

    const resultado = await guardarRespuestas(idPersona);

    if (resultado) {
      alert("¡Encuesta guardada con éxito!");
    }
  };

  if (loading && !encuesta) return <div className="container mt-4">Cargando encuesta... ⏳</div>;

  return (
    <div className="container mt-4"> \
      <form onSubmit={handleSubmit}>
  
        {error && <div className="alert alert-danger">Error: {error}</div>}

        <h1>{encuesta?.nombre}</h1>
        <h2>{asignatura?.nombre}</h2>
        <p>Docente: {asignatura?.nombre_docente}</p>
        <hr />

        {encuesta?.variables.map(variable => (
          <Variable
            key={variable.id}
            variable={variable}
            getSeleccion={getSeleccion}
            onSeleccionar={handleRespuestaChange} 
          />
        ))}

        <button 
          type="submit"
          className="btn btn-primary mt-3" 
          disabled={loading} 
        >
          {loading ? 'Guardando...' : 'Guardar Respuestas'}
        </button>

        <pre className="mt-4" style={{backgroundColor: '#f0f0f0', padding: '10px'}}>
          <strong>Estado de las respuestas:</strong>
          {JSON.stringify(Array.from(respuestas.entries()), null, 2)}
        </pre>
      </form>
    </div>
  );
}

export default PaginaResponderEncuesta;