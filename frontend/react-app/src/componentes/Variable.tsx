import Table from "react-bootstrap/Table";
import Pregunta from "./Pregunta";
import type { Props } from "../types/Variable";

export default function Variable({
  variable,
  getSeleccion,
  onSeleccionar,
}: Props) {
  return (
    <div className="container mt-4">
      <h3>
        {variable.codigo}: {variable.nombre}
      </h3>

      <Table striped bordered>
        <thead>
          <tr>
            <th style={{ width: "40%" }}>Pregunta</th>
            <th colSpan={3}>Respuesta</th>
          </tr>
        </thead>
        <tbody>
          {variable.preguntas?.map((pregunta: any) => (
            <Pregunta
              key={pregunta.id}
              pregunta={pregunta}
              seleccionActual={getSeleccion(pregunta.id)}
              onSeleccionar={onSeleccionar}
            />
          ))}
        </tbody>
      </Table>
    </div>
  );
}
