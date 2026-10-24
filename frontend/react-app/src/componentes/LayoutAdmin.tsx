import LayoutPrincipal from "./LayoutPrincipal";

export default function LayoutAdmin() {
  return (
    <LayoutPrincipal
      links={[{ to: "/admin", label: "Inicio" }]}
      requiredRole="admin"
    />
  );
}
