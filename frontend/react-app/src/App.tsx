import { Routes, Route } from "react-router-dom";
import LayoutHome from "./componentes/LayoutHome.tsx";
import LayoutAlumno from "./componentes/LayoutAlumno.tsx";
import LayoutDocente from "./componentes/LayoutDocente.tsx";
import LayoutDepartamento from "./componentes/LayoutDepartamento.tsx";
import EncuestasPendientes from "./paginas/EncuestasPendientes.tsx";
import Encuesta from "./paginas/ResponderEncuesta.tsx";
import Reporte from "./paginas/Reporte.tsx";
import InformesCurricularesDisponibles from "./paginas/InformesCurricularesDisponibles.tsx";
import InformeCurricular from "./paginas/InformeCurricular.tsx";
import "bootstrap/dist/css/bootstrap.min.css";
import ReportesDisponibles from "./paginas/ReportesDisponibles.tsx";
import EncuestasRespondidas from "./componentes/EncuestasRespondidas.tsx";
import InformeCurricularPage from "./paginas/InformeCurricularPage.tsx";
import InformesSinteticosDisponibles from "./paginas/InformesSinteticosDisponibles.tsx";
import InformeSintetico from "./paginas/InformeSintetico.tsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LayoutHome />}></Route>

      <Route path="/alumno" element={<LayoutAlumno />}>
        <Route index element={<EncuestasPendientes />} />
        <Route path="encuestas-pendientes">
        <Route path=":id" element={<Encuesta />} />  
        <Route index element={<EncuestasPendientes />} />
      </Route>
        <Route path="encuestas-respondidas">
          <Route path=":id" element={<Encuesta />} />
          <Route index element={<EncuestasRespondidas />} />
        </Route>
      </Route>

      <Route path="/docente" element={<LayoutDocente />}>
        <Route index element={<ReportesDisponibles />} />
        <Route path="reportes">
          <Route path=":id" element={<Reporte />} />
          <Route index element={<ReportesDisponibles />} />
        </Route>
        <Route path="nuevo-informe">
          <Route path=":reporteId" element={<InformeCurricular />} />
          <Route index element={<ReportesDisponibles />} />
        </Route>
      </Route>

<Route path="/departamento" element={<LayoutDepartamento />}>
        
        <Route index element={<InformesCurricularesDisponibles />} />
        
        <Route path="informes">
          <Route path=":id" element={<InformeSintetico />} />
          <Route index element={<InformesCurricularesDisponibles />} />
        </Route>
        <Route path="informes-sinteticos" element={<InformesSinteticosDisponibles />} />
      </Route>
    </Routes>
  );
}

export default App;
