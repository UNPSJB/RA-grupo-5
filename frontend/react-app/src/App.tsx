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
import InformesSinteticosDisponibles from "./paginas/InformesSinteticosDisponibles.tsx";
<<<<<<< HEAD
import EstadisticasDepartamentoPage from "./paginas/EstadisticasDepartamentoPage.tsx";
import InformeSintetico from "./paginas/InformeSintetico.tsx";
=======
import InformeSintetico from "./paginas/InformeSintetico.tsx";
import VerInformeCurricular from "./paginas/VerInformeCurricular.tsx";
import EstadisticasDepartamentoPage from "./paginas/EstadisticasDepartamentoPage.tsx";

>>>>>>> 5e0fd4795752d8e6c249f416b02365d91023389c

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
        <Route path="informes">
          {/* <Route path=":id" element={<VerInformeCurricular />} /> */}
        </Route>
      </Route>

<<<<<<< HEAD
=======

>>>>>>> 5e0fd4795752d8e6c249f416b02365d91023389c
      <Route path="/departamento" element={<LayoutDepartamento />}>
        <Route index element={<InformesSinteticosDisponibles />} />

        <Route path="informe-sintetico">
<<<<<<< HEAD
          <Route path=":id" element={<InformeSintetico />} />
=======
          <Route path=":id" element={<InformeSintetico/>} />
>>>>>>> 5e0fd4795752d8e6c249f416b02365d91023389c
        </Route>

        <Route path="informes" element={<InformesCurricularesDisponibles />} />

        <Route
          path="informes-sinteticos"
          element={<InformesSinteticosDisponibles />}
        />
        <Route path="estadisticas" element={<EstadisticasDepartamentoPage />} />
<<<<<<< HEAD
=======

>>>>>>> 5e0fd4795752d8e6c249f416b02365d91023389c
      </Route>
    </Routes>
  );
}

export default App;
