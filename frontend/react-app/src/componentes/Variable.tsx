import Table from "react-bootstrap/Table";
import type { VariableProps } from "../types/Variable";
import Pregunta from "./Pregunta";

export default function Variable({ variable }: VariableProps) {
  return (
    <div className="container mt-4">
      <h3>
        {variable.codigo}: {variable.nombre}
      </h3>

      <Table striped bordered>
        <thead>
          <tr>
            <th>Pregunta</th>
            <th>Respuesta</th>
          </tr>
        </thead>
        <tbody>
          {variable.preguntas?.map((pregunta: any) => (
            <Pregunta key={pregunta.id} pregunta={pregunta} />
          ))}
        </tbody>
      </Table>
    </div>
  );
}
