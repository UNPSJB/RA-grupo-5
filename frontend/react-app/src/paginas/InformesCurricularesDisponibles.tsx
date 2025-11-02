import { useInformesCurriculares } from "../hook/useInformesCurriculares";
import Accordion from "react-bootstrap/Accordion";
import { InformeGrupo } from "../componentes/InformeGrupo";


export default function InformesCurricularesDisponibles() {
  const { informesCurriculares, loading, error } = useInformesCurriculares();

  if (loading) return <p>Cargando informes...</p>;
  if (error) return <p>Error: {error}</p>;

  const cerrados = informesCurriculares.filter((informe) => informe.estado === "cerrado");
  const abiertos = informesCurriculares.filter((informe) => informe.estado === "abierto");

const mapInforme = (i: any) => {
  console.log("Informe recibido:", i); // 👈 Esto te muestra el objeto completo en consola

  return {
    id: i.id,
    asignatura: i.asignatura.nombre, // si es un objeto
    sede: i.sede,
    fechaFin: i.fecha_fin,
    docente: i.docente,       // si es un objeto
    estado: i.estado,
  };
};


  return (
    
    <div className="container mt-4">
      <h2 className="mb-4">Gestión de Informes</h2>
      <Accordion defaultActiveKey={null} flush>
        <InformeGrupo titulo="INFORMES ABIERTOS" eventKey="0" informes={abiertos.map(mapInforme)} />
        <InformeGrupo titulo="INFORMES CERRADOS" eventKey="1" informes={cerrados.map(mapInforme)} />
      </Accordion>
    </div>
  );
}
