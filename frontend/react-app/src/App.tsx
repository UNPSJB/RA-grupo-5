import { useState } from 'react'
import AgregarPersona from './componentes/AgregarPersona'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>

      <h1>Personas</h1>
      <p>Gestión de personas</p>
      <AgregarPersona />
    </>
  )
}

export default App
