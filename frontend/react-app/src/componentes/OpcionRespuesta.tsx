import { Button } from "react-bootstrap";
import type { OpcionRespuesta as ApiOpcionRespuesta } from "../types/Encuesta";

type Props = {
  opcionRespuesta: ApiOpcionRespuesta;
  seleccionada: boolean;
  onSeleccionar: (id: number) => void; 
};

export default function OpcionRespuesta({
  opcionRespuesta,
  seleccionada = false,
  onSeleccionar,
}: Props) {
  
  const id = opcionRespuesta.id;
  const texto = opcionRespuesta.texto_opcion;

  return (
    <Button
      variant={seleccionada ? "primary" : "outline-secondary"}
      active={seleccionada}
      onClick={() => onSeleccionar(id)}
      className="w-100"
      size="sm"
    >
      {texto}
    </Button>
  );
}