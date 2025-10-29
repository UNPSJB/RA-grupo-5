import OpcionRespuesta from "./OpcionRespuesta";
import type { Pregunta as ApiPregunta } from "../types/Encuesta";
import type { Control, FieldErrors } from 'react-hook-form';
import { Controller } from 'react-hook-form'; 
import { obtenerNombreCampo } from '../validaciones/Encuesta';

interface Props {
  pregunta: ApiPregunta;
  control: Control<any>;
  errors: FieldErrors;
}

export default function Pregunta({
  pregunta,
  control,
  errors,
}: Props) { 


  if (!pregunta || !pregunta.id) {
    console.error(
      "ERROR: El componente <Pregunta> recibió un prop 'pregunta' inválido.", 
      pregunta 
    );
    return null; 
  }

  

  const fieldName = obtenerNombreCampo(pregunta.id); 
  const error = errors[fieldName];

  const opcionesDeChoice = (pregunta.pregunta_opcion || []).filter(
    (po) => po && po.id_opcion_respuesta != null && po.opcion_respuesta != null
  );

  return (
    <tr>
      <td style={{ width: "40%", fontWeight: "bold" }}>
        {pregunta.texto_pregunta}
        {pregunta.obligatoria && <span className="text-danger ms-1">*</span>}
        {error && (
          <div className="d-block mt-2 text-danger" style={{fontSize: '0.85rem'}}>
            {error.message as string}
          </div>
        )}
      </td>
      
      
      {pregunta.tipo === "open" ? (
        <td style={{ textAlign: "center", minWidth: 400 }} colSpan={3}>
          <Controller
            name={fieldName}
            control={control}
            render={({ field }) => ( 
              <textarea
                {...field} 
                placeholder="Escriba su respuesta aquí"
                rows={3}
                className={`form-control ${error ? 'is-invalid' : ''}`}
                style={{ width: "100%", resize: "vertical", padding: "6px", fontSize: "0.95rem" }}
              />
            )}
          />
        </td>
      ) : (
        opcionesDeChoice.map((opcion) => {
          const idOpcionAGuardar = opcion.id_opcion_respuesta!;
          const opcionData = opcion.opcion_respuesta!;

          return (
            <td key={opcion.id} style={{ textAlign: "center", minWidth: 90 }}>
              <Controller
                name={fieldName}
                control={control}
                render={({ field }) => { 
                  const handleSelect = (idDelBoton: number) => {
                    if (pregunta.tipo === 'single_choice') {
                      field.onChange(idDelBoton); 
                    } 
                    else if (pregunta.tipo === 'multiple_choice') {
                      const currentValues = (field.value as number[]) || [];
                      const newValues = currentValues.includes(idDelBoton)
                        ? currentValues.filter(v => v !== idDelBoton)
                        : [...currentValues, idDelBoton];
                      field.onChange(newValues); 
                    }
                  };
                  const seleccionada = 
                    pregunta.tipo === 'single_choice'
                      ? field.value === idOpcionAGuardar
                      : (field.value as number[])?.includes(idOpcionAGuardar);

                  return (
                    <OpcionRespuesta
                      opcionRespuesta={opcionData}
                      seleccionada={seleccionada}
                      onSeleccionar={handleSelect} 
                    />
                  );
                }}
              />
            </td>
          );
        })
      )}
    </tr>
  );
}