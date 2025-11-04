import Table from "react-bootstrap/Table";
import { InformeItem } from "./InformeItem";
import type { Props as InformeProps } from "./InformeItem";

type Props = {
  informes: InformeProps[];
};

export function ListadoDeInformes({ informes }: Props) {
  return (
    <Table className="table table-striped border mt-4">
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
              No hay informes disponibles.
            </td>
          </tr>
        ) : (
          informes.map((informe) => (
            <InformeItem key={informe.id} {...informe} />
          ))
        )}
      </tbody>
    </Table>
  );
}
