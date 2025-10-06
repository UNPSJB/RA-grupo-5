import type { OpcionRespuesta } from "../types/OpcionRespuesta";

export default function OpcionRespuesta({ opcionRespuesta }: OpcionRespuesta) {
  return (
    <>
      <td>{opcionRespuesta.texto_opcion}</td>
    </>
  );
}
