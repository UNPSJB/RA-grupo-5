import Table from "react-bootstrap/Table";
import type { VariableProps } from "../types/Variable";

export default function Variable({ variable }: VariableProps) {
  return (
    <div className="container mt-4">
      <h3>{variable.nombre}</h3>

      <Table striped bordered>
        <thead>
          <tr>
            <th>Pregunta</th>
            <th>Respuesta</th>
          </tr>
        </thead>
        <tbody>
          {variable.preguntas?.map((pregunta: any) => (
            <tr key={pregunta.id}>
              <td>{pregunta.texto}</td>
              <td>
                {/* Franco: acá iría el input correspondiente para la rta (checkbox con opciones, etc) */}
                <input type="text" name={`pregunta-${pregunta.id}`} />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
