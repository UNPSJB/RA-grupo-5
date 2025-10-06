import Table from "react-bootstrap/Table";
import type { PreguntaProps } from "../types/Preguntas";
import OpcionRespuesta from "./OpcionRespuesta";

export default function Pregunta({ pregunta }: PreguntaProps) {
  return (
    <Table striped bordered>
      <thead></thead>
      <tbody>
        <td>{pregunta.texto_pregunta}</td>
        {pregunta.opcionesRespuestas?.map((opciones: any) => (
          <OpcionRespuesta key={opciones.id} opcionRespuesta={opciones} />
        ))}
      </tbody>
    </Table>
  );
}
