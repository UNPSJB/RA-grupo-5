import type { PreguntaProps } from "../types/Preguntas";

export default function Pregunta({ pregunta }: PreguntaProps) {
  return (
    <tr key={pregunta.id}>
      <td>{pregunta.texto_pregunta}</td>
      <td>
        {pregunta.tipo === "single_choice" ||
        pregunta.tipo === "multiple_choice" ? (
          pregunta.opcionesRespuestas?.map((opcion: any) => (
            <div key={opcion.id}>
              <label>
                <input
                  type={
                    pregunta.tipo === "single_choice" ? "radio" : "checkbox"
                  }
                  name={`pregunta-${pregunta.id}`}
                  value={opcion.texto_opcion}
                />{" "}
                {opcion.texto_opcion}
              </label>
            </div>
          ))
        ) : pregunta.tipo === "open" ? (
          <input type="text" name={`pregunta-${pregunta.id}`} />
        ) : null}
      </td>
    </tr>
  );
}
