import type { Pregunta as ApiPregunta } from "../types/Encuesta";
import type { Control, FieldErrors } from 'react-hook-form';
import { Controller } from 'react-hook-form'; 
import { obtenerNombreCampo } from '../validaciones/Encuesta';

// Importamos Row, Col, y Form (ya no necesitamos Card)
import { Row, Col, Form } from 'react-bootstrap';

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

  // --- Lógica (La que ya tenías) ---
  const fieldName = obtenerNombreCampo(pregunta.id); 
  const error = errors[fieldName];

  // ¡Aquí está la variable! 
  const opcionesDeChoice = (pregunta.pregunta_opcion || []).filter(
    (po) => po && po.id_opcion_respuesta != null && po.opcion_respuesta != null
  );
  // --- Fin de la Lógica ---


  // --- Return (Con las mejoras de estilo) ---
  return (
    // Eliminamos <Card> y usamos un 'div' con borde y padding
    <div className="border-top py-3">
      <Row>
        <Col xs={12} className="text-start">
          
          {/* Usamos la utilidad 'fw-bold' en lugar de style */}
          <Form.Label as="div" className="mb-0 fw-bold">
            {pregunta.texto_pregunta}
            {pregunta.obligatoria && <span className="text-danger ms-1">*</span>}
          </Form.Label>
          
          {error && (
            <Form.Text className="text-danger d-block mt-1">
              {error.message as string}
            </Form.Text>
          )}
        </Col>

        {/* Reemplazamos 'm-4' por 'mt-3' para mejor alineación */}
        <Col xs={12} className="text-start mt-3">
          <Controller
            name={fieldName}
            control={control}
            render={({ field }) => {
              
              switch (pregunta.tipo) {

                case 'open':
                  return (
                    <Form.Control
                      {...field}
                      as="textarea"
                      rows={3}
                      placeholder="Escriba su respuesta aquí"
                      isInvalid={!!error}
                    />
                  );

                case 'single_choice':
                  return (
                    // 'opcion' se usa aquí
                    <div className="d-flex flex-wrap gap-3">
                      {opcionesDeChoice.map((opcion) => (
                        <Form.Check
                          {...field}
                          key={opcion.id}
                          type="radio"
                          id={`opcion-${opcion.id}`}
                          label={opcion.opcion_respuesta!.texto_opcion}
                          value={opcion.id_opcion_respuesta!}
                          checked={field.value == opcion.id_opcion_respuesta!}
                          onChange={() => field.onChange(opcion.id_opcion_respuesta!)}
                          isInvalid={!!error}
                        />
                      ))}
                    </div>
                  );

                case 'multiple_choice':
                  return (
                    <div className="d-flex flex-wrap gap-3">
                      {/* 'opcion' se usa aquí */}
                      {opcionesDeChoice.map((opcion) => {
                        const idOpcion = opcion.id_opcion_respuesta!;
                        const currentValues = (field.value as number[]) || [];
                        const isChecked = currentValues.includes(idOpcion);

                        return (
                          <Form.Check
                            {...field}
                            key={opcion.id}
                            type="checkbox"
                            id={`opcion-${opcion.id}`}
                            label={opcion.opcion_respuesta!.texto_opcion}
                            value={idOpcion}
                            checked={isChecked}
                            isInvalid={!!error}
                            onChange={() => {
                              const newValues = isChecked
                                ? currentValues.filter(v => v !== idOpcion)
                                : [...currentValues, idOpcion];
                              field.onChange(newValues);
                            }}
                          />
                        );
                      })}
                    </div>
                  );

                default:
                  console.warn(`Tipo de pregunta no reconocido: ${pregunta.tipo}`);
                  return <></>; 
              }
            }}
          />
        </Col>
      </Row>
    </div>
  );
}