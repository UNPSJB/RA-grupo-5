import { Link } from "react-router-dom";

const API_URL = "http://localhost:8000";
export type Props = {
  id: number;
  asignatura: string;
  sede: string;
  fechaFin: string;
  docente: string;
  estado: "abierto" | "cerrado";
};

export function InformeItem({ id, asignatura, sede, fechaFin, docente }: Props) {
  return (
    <tr>
      <td>{asignatura}</td>
      <td>{sede}</td>
      <td>{docente}</td>
      <td>{fechaFin}</td>
      <td>
        <Link
          to={`/departamento/informes/${id}`}
          className="btn btn-primary btn-sm"
        >
          Ver informe
        </Link>
      </td>
    </tr>
  );
}
export default InformeItem;

