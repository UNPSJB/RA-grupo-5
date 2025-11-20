import { useEffect } from "react";
import { useReportes } from "../hook/useReportes";

export default function EstadisticasDocentePage() {
  const { fetchResumenByReporteId } = useReportes();

  useEffect(() => {
    const cargarResumen = async () => {
      const resumen = await fetchResumenByReporteId(1); // acá ponés el id del reporte que quieras probar
      console.log("Resumen del backend:", resumen);
    };
    cargarResumen();
  }, [fetchResumenByReporteId]);

  return (
    <div>
      <h2>Dashboard de Estadísticas</h2>
      {/* acá después vamos a renderizar los KPIs con esos datos */}
    </div>
  );
}
