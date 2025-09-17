import { useState } from "react";
import { Button } from "react-bootstrap";


export default function BotonConfimarEncuetas({encuestaId}: {encuestaId: number}) {
    const[loading, setLoading] = useState(false);
    const[error, setError] = useState("");
    const[success, setSuccess] = useState(false);

    const confirmarEncuestas = async () => {
        setLoading(true);
        setError(""); // este hook linea limpia los errores anteriores
        setSuccess(false); //este hook resetea el estado de exito
        try {

                const respuesta = await fetch(`http://localhost:8000/encuestas/${encuestaId}/confirmar`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ respuestas: [] }) // por ahora no devuelve nada
        });

        
        if (!respuesta.ok) throw new Error("Error al confirmar las encuestas");

        setSuccess(true); // confirma el estado de exito
        } catch (err: any) {
            setError(err.message);                    
        } finally {
            setLoading(false);
        }
    }
    return(
        <div>
            <Button onClick={confirmarEncuestas} disabled={loading}>
            {/* Se muestra un texto diferente dependiendo si se está cargando o no */}
                {loading ? "confirmando" : "Confirmar Encuestas"}
            </Button>
        </div>
    );
}