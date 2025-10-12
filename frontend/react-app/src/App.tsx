import { Routes, Route } from "react-router-dom";
import LayoutHome from "./componentes/LayoutHome.tsx";
import LayoutAlumno from "./componentes/LayoutAlumno.tsx";
import LayoutDocente from "./componentes/LayoutDocente.tsx";
import LayoutDepartamento from "./componentes/LayoutDepartamento.tsx";
import EncuestasPendientes from "./paginas/EncuestasPendientes.tsx";
import Encuesta from "./paginas/Encuesta.tsx";
import "bootstrap/dist/css/bootstrap.min.css";
import InformesDisponibles from "./paginas/InformesDisponibles.tsx";
import InformeCurricular from "./paginas/InformeCurricular.tsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LayoutHome />}></Route>

      <Route path="/login" element={<h1>Login</h1>}></Route>

      <Route path="/alumno" element={<LayoutAlumno />}>
        <Route path="encuestas">
          <Route index element={<EncuestasPendientes />} />
          <Route path=":id" element={<Encuesta />} /> {/*  ruta dinámica */}
        </Route>
      </Route>

      <Route path="/informe" element={<h1>Informe</h1>}></Route>

      <Route path="/docente" element={<LayoutDocente />}>

      </Route>

      <Route path="/departamento" element={<LayoutDepartamento />}>
          <Route index element={<InformesDisponibles />} />
          <Route path="informes">
            <Route path=":id" element={<InformeCurricular />} />
          </Route>
      </Route>

    </Routes>
  );
}

export default App;
