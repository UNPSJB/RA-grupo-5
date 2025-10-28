import { Button } from "react-bootstrap";
import type { OpcionRespuesta as ORType } from "../types/models/OpcionRespuesta";

type Props = {
  opcionRespuesta: ORType | any;
  seleccionada?: boolean;
  onSeleccionar?: (id: number | string) => void;
};

export default function OpcionRespuesta({
  opcionRespuesta,
  seleccionada = false,
  onSeleccionar = () => {},
}: Props) {
  const data = (opcionRespuesta as any)?.opcionRespuesta ?? opcionRespuesta;

  const id =
    data?.id ?? data?.id_opcion ?? data?.valor ?? data?.codigo ?? String(data);

  const texto =
    data?.texto_opcion ??
    data?.texto ??
    data?.descripcion ??
    data?.label ??
    String(data);

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
