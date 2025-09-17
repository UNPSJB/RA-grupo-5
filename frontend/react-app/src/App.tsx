import { Routes, Route } from "react-router-dom";
import Layout from "./componentes/Layout.tsx";
import EncuestasPendientes from "./paginas/EcuestasPendientes.tsx";

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<EncuestasPendientes />} />        {/* Podés agregar más rutas aca */}
      </Route>
    </Routes>
  );
}

export default App;

