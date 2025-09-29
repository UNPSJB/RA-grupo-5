import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useEncuestas } from "../hook/useEncuestas";
import Table from "react-bootstrap/Table";
//import Variable from "../componentes/Variable";

export default function Encuesta() {
  const { id } = useParams<{ id: string }>();
  const { fetchEncuestaById } = useEncuestas();
  const [encuesta, setEncuesta] = useState<any>(null);

  useEffect(() => {
    if (id) {
      fetchEncuestaById(Number(id)).then((data) => setEncuesta(data));
    }
  }, [id]);

  if (!encuesta) return <p>Cargando encuesta...</p>;

  return (
    <div>
      <h1>{encuesta.asignatura}</h1>
      <p>Estado: {encuesta.estado}</p>
      <p>
        <strong>Carrera:</strong> {encuesta.carrera}
      </p>
      <p>
        <strong>Sede:</strong> {encuesta.sede}
      </p>

      <h2>Variables asociadas</h2>
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>A:</th>
            <th>Información general</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>A1</td>
            <td>
              ¿Cuántas veces te has inscripto para cursar esta asignatura?
            </td>
            <td>Una</td>
            <td>Más de una</td>
          </tr>
          <tr>
            <td>A2</td>
            <td>
              ¿Cuál ha sido aproximadamente tu porcentaje de asistencia a clases
              teóricas?
            </td>
            <td>Entre 0 y 50%</td>
            <td>Más de 50%</td>
          </tr>
          <tr>
            <td>A3</td>
            <td>
              ¿Cuál ha sido aproximadamente tu porcentaje de asistencia a clases
              prácticas?
            </td>
            <td>Entre 0 y 50%</td>
            <td>Más de 50%</td>
          </tr>
          <tr>
            <td>A4</td>
            <td>
              Los conocimientos previos para comprender los contenidos de la
              asignatura fueron
            </td>
            <td>Escasos</td>
            <td>Suficientes</td>
          </tr>
          <p>
            (*) Si eligión opción I (entre 0 y 50% de asistencia a
            clases):¿Cuáles fueron los motivos por los cuales no asististe
            regularmente a clases? Selecciona una de las siguientes opciones.
            Indica con un cruz.
          </p>
        </tbody>
      </Table>
      <Table striped bordered hover>
        <tbody>
          <tr>
            <td>a</td>
            <td>Superposición de horarios con materias de otros años</td>
            <td> </td>
          </tr>
          <tr>
            <td>b</td>
            <td>Incompatibilidad de horarios con tu trabajo.</td>
            <td> </td>
          </tr>
          <tr>
            <td>c</td>
            <td>
              Preferís formarte por t u cuenta con bibliografía y/o material de
              trabajo
            </td>
            <td> </td>
          </tr>
          <tr>
            <td>d</td>
            <td>Enfermedad de larga duración</td>
            <td> </td>
          </tr>
          <tr>
            <td>e</td>
            <td>Problemas personales</td>
            <td> </td>
          </tr>
          <tr>
            <td>f</td>
            <td>Otros</td>
            <td> </td>
          </tr>
        </tbody>
      </Table>
      <p>
        A partir de aquí las personas responden teniendo en cuenta los
        siguientes valores de referencia:
      </p>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th></th>
            <th> Valores de Referencia</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1.</td>
            <td>Sí.</td>
          </tr>
          <tr>
            <td>2.</td>
            <td>No.</td>
          </tr>
          <tr>
            <td>3.</td>
            <td>NPO</td>
            <td>No puedo opinar</td>
          </tr>
        </tbody>
      </Table>
      {/* {encuesta.variables && encuesta.variables.length > 0 ? (
        <ul>
          {encuesta.variables.map((v: any) => (
            <li key={v.id}>{v.nombre}</li>
          ))}
        </ul>
      ) : (
        <p>No hay variables asociadas.</p>
      )} */}
    </div>
  );
}
