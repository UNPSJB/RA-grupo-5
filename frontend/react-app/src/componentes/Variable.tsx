import Table from "react-bootstrap/Table";
import type { VariableProps } from "../types/Variable";

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
            <tr key={pregunta.id}>
            <td>{pregunta.texto_pregunta}</td>
            <td>
                {pregunta.tipo === "single_choise" || pregunta.tipo === "multiple_choise" ? (
                    pregunta.opcionesRespuestas?.map((opcion: any) => (
                    <div key={opcion.id}>
                        <label>
                        <input
                            type={pregunta.tipo === "single_choise" ? "radio" : "checkbox"}
                            name={`pregunta-${pregunta.id}`}
                            value={opcion.texto_opcion}
                        />{" "}
                        {opcion.texto_opcion}
                        </label>
                    </div>
                    ))
                ) : pregunta.tipo === "open" ? (
                    <input
                    type="text"
                    name={`pregunta-${pregunta.id}`}
                    placeholder="Ingrese su respuesta"
                    />
                ) : null}
            </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
