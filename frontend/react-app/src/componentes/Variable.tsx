import Table from "react-bootstrap/Table";
import { useEncuestas } from "../hook/useEcuestas";

function Variable () {
    const {encuestas, loading, error} = useEncuestas();
    
    if (loading) return <p>Cargando encuesta...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="container mt-4">
            <Table className="table table-striped"></Table>
                <tbody>
                    
                </tbody>
        </div>
        );
}

export default Variable;