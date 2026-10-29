import LayoutPrincipal from "../componentes/LayoutPrincipal";

const alumnoLinks = [
  {
    to: "/alumno/encuestas-pendientes",
    label: "Encuestas pendientes",
    defaultFor: ["/alumno"],
  },
  { to: "/alumno/encuestas-respondidas", label: "Encuestas respondidas" },
];

export default function LayoutAlumno() {
  return <LayoutPrincipal links={alumnoLinks} requiredRole="alumno" />;
}
