import LayoutPrincipal from "../componentes/LayoutPrincipal";

const docenteLinks = [
  { to: "/docente/reportes", label: "Listado de reportes disponibles" }
];

export default function LayoutDocente() {
  return <LayoutPrincipal links={docenteLinks} />;
}