import Table from "react-bootstrap/Table";
import Pregunta from "./Pregunta";
import type { Variable as ApiVariable } from "../types/Encuesta";
import type { Control, FieldErrors } from 'react-hook-form';

interface Props {
  variable: ApiVariable;
  control: Control<any>;
  errors: FieldErrors;
}

export default function Variable({
  variable,
  control,
  errors,
}: Props) { 


  if (!variable) {
    console.error("ERROR: El componente Variable recibió una prop 'variable' nula o undefined.");
    return null; 
  }


  const preguntasLimpias = (variable.preguntas || []).filter(p => p && p.id != null);

  if (variable.preguntas && variable.preguntas.length !== preguntasLimpias.length) {
    console.warn("ADVERTENCIA: Se filtraron preguntas 'sucias' (null o sin ID) de la variable:", variable.nombre);
  }

  return (
    <div className="container mt-4">
      <h3>
        {variable.codigo}: {variable.nombre}
      </h3>
      <Table striped bordered>
        <tbody>
          {preguntasLimpias.map((pregunta) => (
            <Pregunta
              key={pregunta.id}
              pregunta={pregunta}
              control={control}
              errors={errors}
            />
          ))}
        </tbody>
      </Table>
    </div>
  );
}