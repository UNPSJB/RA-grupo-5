import Table from "react-bootstrap/Table";
import { InformeItem } from "./InformeItem";
import type { Props as InformeProps } from "./InformeItem";
import EmptyState from "./EmptyState";

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
            <td colSpan={5} className="p-0">
              <EmptyState
                icon="bi-inbox"
                title="No hay informes disponibles"
                message="Cuando se generen informes, aparecerán listados en esta tabla."
              />
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
