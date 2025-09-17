import { Routes, Route } from "react-router-dom";
import Layout from "./componentes/Layout.tsx";
import EncuestasPendientes from "./paginas/EcuestasPendientes.tsx";
import Encuesta from "./paginas/Encuesta.tsx";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        
      </Route>

      <Route path="/encuestas" element={<Layout />}>
        <Route index element={<EncuestasPendientes />} />
        <Route path=":id" element={<Encuesta />} /> {/*  ruta dinámica */}
      </Route>

    </Routes>
  );
}

export default App;

