import Accordion from "react-bootstrap/Accordion";
import Table from "react-bootstrap/Table";
import { InformeItem } from "./InformeItem";

type Props = {
  titulo: string;
  eventKey: string;
  informes: {
    id: number;
    asignatura: string;
    sede: string;
    fechaFin: string;
    docente: string;
    estado: "abierto" | "cerrado";
  }[];
};

export function InformeGrupo({ titulo, eventKey, informes }: Props) {
  return (
    <Accordion.Item eventKey={eventKey}>
      <Accordion.Header>{titulo} ({informes.length})</Accordion.Header>
      <Accordion.Body>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Asignatura</th>
              <th>Sede</th>
              <th>Docente</th>
              <th>Fecha Fin</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {informes.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-muted text-center">
                  No hay informes en esta categoría.
                </td>
              </tr>
            ) : (
              informes.map((informe) => (
                <InformeItem key={informe.id} {...informe} />
              ))
            )}
          </tbody>
        </Table>
      </Accordion.Body>
    </Accordion.Item>
  );
}
